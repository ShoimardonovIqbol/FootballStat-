import httpx
from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from config import BASE_URL, get_api_key

router = APIRouter(tags=["leagues"])


async def fetch_football_data(endpoint: str, params: Optional[dict] = None):
    api_key = get_api_key()
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
async def get_leagues(
    country: Optional[str] = Query(None, description="Country name"),
    name: Optional[str] = Query(None, description="League name"),
    season: Optional[int] = Query(None, description="Season year"),
):
    params = {}
    if country:
        params["country"] = country
    if name:
        params["name"] = name
    if season is not None:
        params["season"] = season

    return await fetch_football_data("leagues", params)