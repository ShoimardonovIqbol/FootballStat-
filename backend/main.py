import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_api_key
from routers.leagues import router as leagues_router
from routers.matches import router as matches_router
from routers.teams import router as teams_router
from routers.players import router as players_router

app = FastAPI(
    title="Football Statistics API",
    description="FastAPI backend for football stats powered by API-Football",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leagues_router, prefix="/api/leagues")
app.include_router(matches_router, prefix="/api/matches")
app.include_router(teams_router, prefix="/api/teams")
app.include_router(players_router, prefix="/api/players")

@app.get("/")
async def root():
    return {
        "message": "Football statistics API is running",
        "docs": "/docs",
        "api_key_configured": bool(get_api_key()),
    }