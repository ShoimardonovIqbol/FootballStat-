# Football Statistics Backend

## Setup

1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Copy `.env.example` to `.env` and add your API-Football key.
3. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

## Endpoints

- `/api/leagues`
- `/api/matches`
- `/api/teams`
- `/api/players`
