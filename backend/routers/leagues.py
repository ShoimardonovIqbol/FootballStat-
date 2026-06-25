import os
import httpx
from fastapi import APIRouter, HTTPException, Query
from typing import Optional

router = APIRouter(tags=["leagues"])
BASE_URL = "https://v3.football.api-sports.io"

def get_api_key():
    key = os.getenv("FOOTBALL_API_KEY")
    if not key:
        with open(".env") as f:
            for line in f:
                line = line.strip()
                if line and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip()
        key = os.getenv("FOOTBALL_API_KEY")
    return key

async def fetch_football_data(endpoint: str, params: Optional[dict] = None):
    api_key = get_api_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="FOOTBALL_API_KEY is not set")

    headers = {"x-apisports-key": api_key}
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{BASE_URL}/{endpoint}", headers=headers, params=params or {})

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Football API request failed")

    return response.json()