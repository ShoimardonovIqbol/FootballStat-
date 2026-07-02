from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from cache import cache
from config import get_api_key
from routers.ai import router as ai_router
from routers.leagues import router as leagues_router
from routers.matches import router as matches_router
from routers.news import router as news_router
from routers.players import router as players_router
from routers.search import router as search_router
from routers.standings import router as standings_router
from routers.teams import router as teams_router

app = FastAPI(
    title="FootballStat API",
    description=(
        "Comprehensive football statistics API powered by API-Football.\n\n"
        "Covers live matches, standings, player rankings, team profiles, "
        "match events, lineups, H2H history, transfers, injuries, and more."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router,       prefix="/api/ai")
app.include_router(leagues_router, prefix="/api/leagues")
app.include_router(standings_router, prefix="/api/standings")
app.include_router(matches_router, prefix="/api/matches")
app.include_router(teams_router, prefix="/api/teams")
app.include_router(players_router, prefix="/api/players")
app.include_router(search_router, prefix="/api/search")
app.include_router(news_router, prefix="/api/news")


@app.get("/", tags=["Health"], summary="API root")
async def root():
    return {
        "status": "online",
        "version": "2.0.0",
        "message": "FootballStat API is running",
        "docs": "/docs",
        "redoc": "/redoc",
        "api_key_configured": bool(get_api_key()),
    }


@app.get("/api/health", tags=["Health"], summary="Health check with cache stats")
async def health():
    return {
        "status": "healthy",
        "api_key_configured": bool(get_api_key()),
        "cache": cache.stats(),
    }


@app.delete("/api/cache", tags=["Admin"], summary="Clear the entire response cache")
async def clear_cache():
    cache.clear()
    return {"message": "Cache cleared successfully"}
