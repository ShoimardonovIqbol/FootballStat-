from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Path, Query

from config import DEFAULT_SEASON
from http_client import football_api

router = APIRouter(tags=["Matches"])


@router.get("", summary="Get fixtures with flexible filters")
async def get_matches(
    league: Optional[int] = Query(None, description="League ID"),
    season: Optional[int] = Query(None, description="Season year"),
    team: Optional[int] = Query(None, description="Team ID"),
    date: Optional[str] = Query(None, description="Date YYYY-MM-DD"),
    status: Optional[str] = Query(None, description="NS | 1H | HT | 2H | ET | FT | AET | PEN | PST | CANC"),
    round: Optional[str] = Query(None, description="Round name (e.g. 'Regular Season - 1')"),
    last: Optional[int] = Query(None, ge=1, le=50, description="Last N fixtures for a team"),
    next: Optional[int] = Query(None, ge=1, le=50, description="Next N fixtures for a team"),
):
    params: dict = {
        "league": league or 39,
        "season": season or DEFAULT_SEASON,
    }
    if team is not None:
        params["team"] = team
    if date:
        params["date"] = date
    if status:
        params["status"] = status
    if round:
        params["round"] = round
    if last is not None:
        params["last"] = last
    if next is not None:
        params["next"] = next

    return await football_api("fixtures", params=params, ttl=300)


@router.get("/live", summary="Get all currently live matches")
async def get_live_matches(
    league: Optional[int] = Query(None, description="Filter by league ID"),
):
    params: dict = {"live": "all"}
    if league:
        params["league"] = league
    return await football_api("fixtures", params=params, ttl=60)


@router.get("/today", summary="Today's matches grouped by league")
async def get_today_matches(
    league: Optional[int] = Query(None, description="Filter by league ID"),
):
    today = date.today().isoformat()
    params: dict = {"date": today}
    if league:
        params["league"] = league

    data = await football_api("fixtures", params=params, ttl=120)

    grouped: dict = {}
    for fixture in data.get("response", []):
        lid = fixture["league"]["id"]
        if lid not in grouped:
            grouped[lid] = {
                "league": {
                    "id": lid,
                    "name": fixture["league"]["name"],
                    "logo": fixture["league"]["logo"],
                    "country": fixture["league"]["country"],
                    "flag": fixture["league"]["flag"],
                    "round": fixture["league"]["round"],
                },
                "fixtures": [],
            }
        grouped[lid]["fixtures"].append(fixture)

    return {
        "date": today,
        "total": data.get("results", 0),
        "leagues": list(grouped.values()),
    }


@router.get("/h2h", summary="Head-to-head history between two teams")
async def get_h2h(
    h2h: str = Query(description="Two team IDs separated by dash, e.g. 33-34"),
    last: int = Query(10, ge=1, le=50, description="Number of last matches"),
    league: Optional[int] = Query(None, description="Filter by league"),
    season: Optional[int] = Query(None, description="Filter by season"),
):
    params: dict = {"h2h": h2h, "last": last}
    if league:
        params["league"] = league
    if season:
        params["season"] = season
    return await football_api("fixtures/headtohead", params=params, ttl=3600)


@router.get("/{fixture_id}", summary="Get single match with full detail")
async def get_match(fixture_id: int = Path(description="Fixture ID")):
    data = await football_api("fixtures", params={"id": fixture_id}, ttl=60)
    if not data.get("response"):
        raise HTTPException(status_code=404, detail="Match not found")
    return data["response"][0]


@router.get("/{fixture_id}/events", summary="Match events — goals, cards, substitutions")
async def get_match_events(
    fixture_id: int = Path(description="Fixture ID"),
    team: Optional[int] = Query(None, description="Filter events by team ID"),
    type: Optional[str] = Query(None, description="Filter by event type: Goal, Card, subst"),
):
    params: dict = {"fixture": fixture_id}
    if team:
        params["team"] = team
    if type:
        params["type"] = type
    return await football_api("fixtures/events", params=params, ttl=60)


@router.get("/{fixture_id}/lineups", summary="Match lineups and formations")
async def get_match_lineups(fixture_id: int = Path(description="Fixture ID")):
    return await football_api(
        "fixtures/lineups",
        params={"fixture": fixture_id},
        ttl=300,
    )


@router.get("/{fixture_id}/statistics", summary="Match statistics — shots, possession, passes")
async def get_match_statistics(
    fixture_id: int = Path(description="Fixture ID"),
    team: Optional[int] = Query(None, description="Filter stats by team ID"),
):
    params: dict = {"fixture": fixture_id}
    if team:
        params["team"] = team
    return await football_api("fixtures/statistics", params=params, ttl=60)


@router.get("/{fixture_id}/players", summary="Player ratings and stats for a match")
async def get_match_players(
    fixture_id: int = Path(description="Fixture ID"),
    team: Optional[int] = Query(None, description="Filter by team ID"),
):
    params: dict = {"fixture": fixture_id}
    if team:
        params["team"] = team
    return await football_api("fixtures/players", params=params, ttl=300)
