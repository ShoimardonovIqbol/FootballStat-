from fastapi import APIRouter, Query

from config import DEFAULT_SEASON
from http_client import football_api

router = APIRouter(tags=["Standings"])


@router.get("", summary="Get league standings / table")
async def get_standings(
    league: int = Query(39, description="League ID (default: Premier League)"),
    season: int = Query(DEFAULT_SEASON, description="Season year (e.g. 2024)"),
):
    """Returns full league table with points, GD, form, and home/away splits."""
    return await football_api(
        "standings",
        params={"league": league, "season": season},
        ttl=600,
    )


@router.get("/top", summary="Get top-N teams from league table")
async def get_top_standings(
    league: int = Query(39, description="League ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
    n: int = Query(5, ge=1, le=20, description="Number of top teams to return"),
):
    data = await football_api(
        "standings",
        params={"league": league, "season": season},
        ttl=600,
    )
    try:
        table = data["response"][0]["league"]["standings"][0]
        return {"league": league, "season": season, "top": table[:n]}
    except (IndexError, KeyError):
        return data
