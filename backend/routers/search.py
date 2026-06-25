import asyncio
from typing import Optional

from fastapi import APIRouter, Query

from http_client import football_api

router = APIRouter(tags=["Search"])


@router.get("", summary="Search teams and players by name")
async def search(
    q: str = Query(min_length=3, description="Search query — minimum 3 characters"),
    league: Optional[int] = Query(None, description="League ID — required for player search"),
):
    """Searches teams by name always. Player search is included when league is provided
    (API-Football requires league or team alongside the player search field)."""
    if league:
        teams_data, players_data = await asyncio.gather(
            football_api("teams", params={"search": q}, ttl=3600),
            football_api("players", params={"search": q, "league": league}, ttl=3600),
        )
        return {
            "query": q,
            "teams": {
                "results": teams_data.get("results", 0),
                "response": teams_data.get("response", []),
            },
            "players": {
                "results": players_data.get("results", 0),
                "response": players_data.get("response", []),
            },
        }

    teams_data = await football_api("teams", params={"search": q}, ttl=3600)
    return {
        "query": q,
        "teams": {
            "results": teams_data.get("results", 0),
            "response": teams_data.get("response", []),
        },
        "players": {
            "results": 0,
            "note": "Add ?league=<id> to include player results",
            "response": [],
        },
    }


@router.get("/venues", summary="Search stadiums/venues by name or city")
async def search_venues(
    name: str = Query(None, description="Venue name"),
    city: str = Query(None, description="City name"),
    country: str = Query(None, description="Country name"),
):
    params: dict = {}
    if name:
        params["name"] = name
    if city:
        params["city"] = city
    if country:
        params["country"] = country
    return await football_api("venues", params=params, ttl=3600)
