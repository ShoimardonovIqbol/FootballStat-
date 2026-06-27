from typing import Optional

from fastapi import APIRouter, HTTPException, Path, Query

from config import DEFAULT_SEASON
from http_client import football_api

router = APIRouter(tags=["Players"])


@router.get("", summary="List players with optional filters")
async def get_players(
    league: Optional[int] = Query(None, description="League ID"),
    season: Optional[int] = Query(None, description="Season year"),
    team: Optional[int] = Query(None, description="Team ID"),
    search: Optional[str] = Query(None, description="Search by player name (min 3 chars)"),
    page: int = Query(1, ge=1, description="Page number (20 players per page)"),
):
    params: dict = {"page": page}
    if search:
        params["search"] = search
    else:
        params["league"] = league or 39
        params["season"] = season or DEFAULT_SEASON
        if team:
            params["team"] = team
    return await football_api("players", params=params, ttl=3600)


@router.get("/top-scorers", summary="Top goal scorers in a league")
async def get_top_scorers(
    league: int = Query(39, description="League ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
):
    return await football_api(
        "players/topscorers",
        params={"league": league, "season": season},
        ttl=43200,
    )


@router.get("/top-assists", summary="Top assist providers in a league")
async def get_top_assists(
    league: int = Query(39, description="League ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
):
    return await football_api(
        "players/topassists",
        params={"league": league, "season": season},
        ttl=43200,
    )


@router.get("/top-yellow-cards", summary="Players with most yellow cards")
async def get_top_yellow_cards(
    league: int = Query(39, description="League ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
):
    return await football_api(
        "players/topyellowcards",
        params={"league": league, "season": season},
        ttl=43200,
    )


@router.get("/top-red-cards", summary="Players with most red cards")
async def get_top_red_cards(
    league: int = Query(39, description="League ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
):
    return await football_api(
        "players/topredcards",
        params={"league": league, "season": season},
        ttl=43200,
    )


@router.get("/sidelined", summary="Players sidelined by injury or suspension")
async def get_sidelined(
    player: Optional[int] = Query(None, description="Player ID"),
    coach: Optional[int] = Query(None, description="Coach ID"),
):
    params: dict = {}
    if player:
        params["player"] = player
    elif coach:
        params["coach"] = coach
    return await football_api("sidelined", params=params, ttl=43200)


@router.get("/{player_id}", summary="Full player profile with season statistics")
async def get_player(
    player_id: int = Path(description="Player ID"),
    season: int = Query(DEFAULT_SEASON, description="Season year"),
):
    data = await football_api(
        "players",
        params={"id": player_id, "season": season},
        ttl=3600,
    )
    if not data.get("response"):
        raise HTTPException(status_code=404, detail="Player not found")
    return data["response"][0]


@router.get("/{player_id}/transfers", summary="Transfer history of a player")
async def get_player_transfers(player_id: int = Path(description="Player ID")):
    return await football_api("transfers", params={"player": player_id}, ttl=86400)


@router.get("/{player_id}/trophies", summary="Trophies won by a player")
async def get_player_trophies(player_id: int = Path(description="Player ID")):
    return await football_api("trophies", params={"player": player_id}, ttl=86400)
