from typing import Optional

from fastapi import APIRouter, HTTPException, Path, Query

from config import DEFAULT_SEASON
from http_client import football_api

router = APIRouter(tags=["Teams"])


@router.get("", summary="List teams with optional filters")
async def get_teams(
    league: Optional[int] = Query(None, description="League ID"),
    season: Optional[int] = Query(None, description="Season year"),
    country: Optional[str] = Query(None, description="Country name"),
    search: Optional[str] = Query(None, description="Search by team name (min 3 chars)"),
):
    params: dict = {}
    if search:
        params["search"] = search
    else:
        params["league"] = league or 39
        params["season"] = season or DEFAULT_SEASON
    if country:
        params["country"] = country
    return await football_api("teams", params=params, ttl=3600)


@router.get("/countries", summary="Get all countries that have teams")
async def get_countries():
    return await football_api("countries", ttl=86400)


@router.get("/{team_id}", summary="Get a team's full profile")
async def get_team(team_id: int = Path(description="Team ID")):
    data = await football_api("teams", params={"id": team_id}, ttl=3600)
    if not data.get("response"):
        raise HTTPException(status_code=404, detail="Team not found")
    return data["response"][0]


@router.get("/{team_id}/statistics", summary="Season statistics for a team")
async def get_team_statistics(
    team_id: int = Path(description="Team ID"),
    league: int = Query(39, description="League ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
):
    """Returns form, goals, wins/draws/losses, biggest wins, average goals, lineups used."""
    return await football_api(
        "teams/statistics",
        params={"team": team_id, "league": league, "season": season},
        ttl=600,
    )


@router.get("/{team_id}/fixtures", summary="Team's recent and upcoming fixtures")
async def get_team_fixtures(
    team_id: int = Path(description="Team ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
    league: Optional[int] = Query(None, description="Filter by league"),
    last: Optional[int] = Query(None, ge=1, le=50, description="Last N fixtures"),
    next: Optional[int] = Query(None, ge=1, le=50, description="Next N fixtures"),
):
    params: dict = {"team": team_id, "season": season}
    if league:
        params["league"] = league
    if last:
        params["last"] = last
    if next:
        params["next"] = next
    return await football_api("fixtures", params=params, ttl=300)


@router.get("/{team_id}/squad", summary="Current squad / roster of a team")
async def get_team_squad(team_id: int = Path(description="Team ID")):
    return await football_api("players/squads", params={"team": team_id}, ttl=3600)


@router.get("/{team_id}/transfers", summary="Player transfers for a team")
async def get_team_transfers(team_id: int = Path(description="Team ID")):
    return await football_api("transfers", params={"team": team_id}, ttl=3600)


@router.get("/{team_id}/injuries", summary="Current injury list for a team")
async def get_team_injuries(
    team_id: int = Path(description="Team ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
    league: Optional[int] = Query(None, description="League ID"),
):
    params: dict = {"team": team_id, "season": season}
    if league:
        params["league"] = league
    return await football_api("injuries", params=params, ttl=600)


@router.get("/{team_id}/trophies", summary="Trophies and titles won by a team")
async def get_team_trophies(team_id: int = Path(description="Team ID")):
    return await football_api("trophies", params={"team": team_id}, ttl=86400)
