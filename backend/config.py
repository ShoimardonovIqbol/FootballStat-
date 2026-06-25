import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

BASE_URL = "https://v3.football.api-sports.io"


def get_api_key() -> str:
    return os.getenv("FOOTBALL_API_KEY", "").strip()
