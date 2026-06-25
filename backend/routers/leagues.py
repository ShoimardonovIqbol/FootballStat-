from typing import Optional

from fastapi import APIRouter, HTTPException, Path, Query

from config import IMPORTANT_LEAGUES
from http_client import football_api

router = APIRouter(tags=["Leagues"])


@router.get("", summary="Get all major leagues")
async def get_leagues():
    """Returns the curated list of major world leagues with logo and country info."""
    data = await football_api("leagues", ttl=3600)
    filtered = [
        {
            "id": item["league"]["id"],
            "name": item["league"]["name"],
            "logo": item["league"]["logo"],
            "type": item["league"]["type"],
            "country": item["country"]["name"],
            "flag": item["country"]["flag"],
        }
        for item in data.get("response", [])
        if item["league"]["id"] in IMPORTANT_LEAGUES
    ]
    return {"results": len(filtered), "response": filtered}


@router.get("/all", summary="Browse all leagues with optional filters")
async def get_all_leagues(
    country: Optional[str] = Query(None, description="Filter by country name"),
    type: Optional[str] = Query(None, description="'league' or 'cup'"),
    search: Optional[str] = Query(None, description="Search by league name"),
):
    params: dict = {}
    if country:
        params["country"] = country
    if type:
        params["type"] = type
    if search:
        params["search"] = search
    return await football_api("leagues", params=params, ttl=3600)


@router.get("/{league_id}", summary="Get a single league's full details")
async def get_league(
    league_id: int = Path(description="League ID"),
    season: Optional[int] = Query(None, description="Season year (e.g. 2024)"),
):
    params: dict = {"id": league_id}
    if season:
        params["season"] = season
    data = await football_api("leagues", params=params, ttl=3600)
    if not data.get("response"):
        raise HTTPException(status_code=404, detail="League not found")
    return data["response"][0]


@router.get("/{league_id}/seasons", summary="Get all seasons for a league")
async def get_league_seasons(league_id: int = Path(description="League ID")):
    data = await football_api("leagues", params={"id": league_id}, ttl=3600)
    if not data.get("response"):
        raise HTTPException(status_code=404, detail="League not found")
    league_data = data["response"][0]
    return {
        "league_id": league_id,
        "name": league_data["league"]["name"],
        "seasons": league_data.get("seasons", []),
    }
