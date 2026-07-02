import asyncio
import json
from fastapi import APIRouter, HTTPException, Path
from google import genai

from cache import cache
from config import get_gemini_key
from http_client import football_api

router = APIRouter(tags=["AI"])


def _format_form(fixtures_data: dict, team_id: int) -> list[str]:
    lines = []
    for f in fixtures_data.get("response", []):
        th = f["teams"]["home"]
        ta = f["teams"]["away"]
        g = f["goals"]
        gh, ga = g.get("home") or 0, g.get("away") or 0
        if th["id"] == team_id:
            outcome = "W" if gh > ga else ("D" if gh == ga else "L")
            lines.append(f"{th['name']} {gh}-{ga} {ta['name']} ({outcome})")
        else:
            outcome = "W" if ga > gh else ("D" if ga == gh else "L")
            lines.append(f"{th['name']} {gh}-{ga} {ta['name']} ({outcome})")
    return lines


@router.get("/predict/{fixture_id}", summary="AI match prediction")
async def predict_match(fixture_id: int = Path(description="Fixture ID")):
    cache_key = f"ai:predict:{fixture_id}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    key = get_gemini_key()
    if not key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured")

    # Fetch match details
    match_data = await football_api("fixtures", params={"id": fixture_id}, ttl=300)
    if not match_data.get("response"):
        raise HTTPException(status_code=404, detail="Match not found")

    match = match_data["response"][0]
    home = match["teams"]["home"]
    away = match["teams"]["away"]
    league = match["league"]
    status = match["fixture"]["status"]["short"]

    # Fetch form & H2H — gracefully skip if API plan doesn't support it
    results = await asyncio.gather(
        football_api("fixtures", params={"team": home["id"], "last": 5}, ttl=3600),
        football_api("fixtures", params={"team": away["id"], "last": 5}, ttl=3600),
        football_api("fixtures/headtohead", params={"h2h": f"{home['id']}-{away['id']}", "last": 5}, ttl=3600),
        return_exceptions=True,
    )

    home_form  = results[0] if isinstance(results[0], dict) else {}
    away_form  = results[1] if isinstance(results[1], dict) else {}
    h2h        = results[2] if isinstance(results[2], dict) else {}

    home_lines = _format_form(home_form, home["id"])
    away_lines = _format_form(away_form, away["id"])
    h2h_lines = [
        f"{f['teams']['home']['name']} {f['goals'].get('home') or 0}-{f['goals'].get('away') or 0} {f['teams']['away']['name']}"
        for f in h2h.get("response", [])
    ]

    prompt = f"""You are a professional football analyst. Analyze the data and predict the match outcome.

Match: {home['name']} vs {away['name']}
Competition: {league['name']} {league.get('season', '')}

{home['name']} last 5 matches:
{chr(10).join(home_lines) if home_lines else 'No data'}

{away['name']} last 5 matches:
{chr(10).join(away_lines) if away_lines else 'No data'}

Head-to-head last 5 meetings:
{chr(10).join(h2h_lines) if h2h_lines else 'No data'}

Reply with ONLY valid JSON, no markdown, no extra text:
{{"home_win": <0-100>, "draw": <0-100>, "away_win": <0-100>, "analysis": "<2-3 sentences in English>"}}

The three values must sum to exactly 100."""

    client = genai.Client(api_key=key)

    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.0-flash-lite",
            contents=prompt,
        )
    except Exception as e:
        err = str(e)
        if "429" in err or "RESOURCE_EXHAUSTED" in err:
            raise HTTPException(status_code=429, detail="Gemini API quota exceeded. Please try again later.")
        raise HTTPException(status_code=500, detail=f"Gemini error: {err[:200]}")

    try:
        text = response.text.strip()
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:].strip()
        result = json.loads(text)

        total = result.get("home_win", 0) + result.get("draw", 0) + result.get("away_win", 0)
        if total != 100:
            for k in ("home_win", "draw", "away_win"):
                result[k] = round(result[k] * 100 / total)

        payload = {
            "fixture_id": fixture_id,
            "home": home["name"],
            "away": away["name"],
            "home_logo": home.get("logo"),
            "away_logo": away.get("logo"),
            "status": status,
            "home_win": result["home_win"],
            "draw": result["draw"],
            "away_win": result["away_win"],
            "analysis": result["analysis"],
        }
        cache.set(cache_key, payload, ttl=1800)
        return payload

    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AI response parse error: {exc}")
