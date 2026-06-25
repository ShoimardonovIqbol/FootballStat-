import os
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(tags=["matches"])
BASE_URL = "https://v3.football.api-sports.io"


async def fetch_football_data(endpoint: str, params: Optional[dict] = None):
    api_key = os.getenv("FOOTBALL_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="FOOTBALL_API_KEY is not set")

    headers = {"x-apisports-key": api_key}
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{BASE_URL}/{endpoint}", headers=headers, params=params or {})

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Football API request failed")

    try:
        return response.json()
    except ValueError as exc:
        raise HTTPException(status_code=500, detail="Invalid JSON response from Football API") from exc


@router.get("")
async def get_matches(
    league: Optional[int] = Query(None, description="League ID"),
    season: Optional[int] = Query(None, description="Season year"),
    team: Optional[int] = Query(None, description="Team ID"),
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
):
    params = {}
    if league is not None:
        params["league"] = league
    if season is not None:
        params["season"] = season
    if team is not None:
        params["team"] = team
    if date:
        params["date"] = date

    return await fetch_football_data("fixtures", params)
