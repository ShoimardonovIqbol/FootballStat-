from typing import Optional

import httpx
from fastapi import HTTPException

from cache import cache
from config import BASE_URL, get_api_key


async def football_api(
    endpoint: str,
    params: Optional[dict] = None,
    ttl: int = 300,
) -> dict:
    """Single shared async client for all API-Football calls with TTL caching.

    TTL guide:
        live data      → 60 s
        today matches  → 120 s
        standings      → 600 s
        static info    → 3600 s
    """
    params = params or {}
    cache_key = f"{endpoint}|{sorted((str(k), str(v)) for k, v in params.items())}"

    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    api_key = get_api_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="FOOTBALL_API_KEY is not configured")

    headers = {"x-apisports-key": api_key}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{BASE_URL}/{endpoint}",
                headers=headers,
                params=params,
            )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Football API timed out")
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Network error: {exc}")

    if response.status_code == 429:
        raise HTTPException(status_code=429, detail="Rate limit exceeded — try again later")
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Football API returned {response.status_code}",
        )

    try:
        data = response.json()
    except ValueError:
        raise HTTPException(status_code=500, detail="Invalid JSON from Football API")

    errors = data.get("errors")
    if errors and errors != [] and errors != {}:
        raise HTTPException(status_code=400, detail=f"API error: {errors}")

    cache.set(cache_key, data, ttl=ttl)
    return data
