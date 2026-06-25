import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

BASE_URL = "https://v3.football.api-sports.io"

DEFAULT_SEASON = 2024

IMPORTANT_LEAGUES: dict[int, str] = {
    1: "World Cup",
    2: "UEFA Champions League",
    3: "UEFA Europa League",
    4: "UEFA Euro",
    9: "Copa America",
    39: "Premier League",
    40: "EFL Championship",
    61: "Ligue 1",
    78: "Bundesliga",
    88: "Eredivisie",
    94: "Primeira Liga",
    135: "Serie A",
    140: "La Liga",
    143: "Copa del Rey",
    253: "MLS",
    262: "Liga MX",
    307: "Saudi Pro League",
}


def get_api_key() -> str:
    return os.getenv("FOOTBALL_API_KEY", "").strip()
