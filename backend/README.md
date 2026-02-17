# Checkpoint Backend -- Quickstart

FastAPI + PostgreSQL via Docker Compose.\
API: http://localhost:8000\
Endpunkte: /health, /entries, /submissions\
Alle Endpunkte benötigen:

    X-API-Token: <token>

------------------------------------------------------------------------

## Setup

1.  `.env` im selben Ordner wie `docker-compose.yml` anlegen:

        cp .env.example .env

2.  `.env` konfigurieren (Token setzen):

        POSTGRES_USER=appuser
        POSTGRES_PASSWORD=securepassword
        POSTGRES_DB=appdb
        DATABASE_URL=postgresql+psycopg://appuser:securepassword@db:5432/appdb
        API_TOKEN=your-secure-token

3.  Start:

        docker compose up -d

Test:

       curl -H "X-API-Token: your-token" http://localhost:8000/health

Stop:

       docker compose down

Reset (inkl. Daten):

       docker compose down -v

------------------------------------------------------------------------

## Frontend ohne lokales Backend testen

Test-Server:

    https://checkpoint.tkimhofer.dev

Im Frontend setzen:

-   API Base URL → https://checkpoint.tkimhofer.dev
-   gültiges Token eintragen -> Token auf Anfrage:  torben@tkimhofer.dev


### Projekt ist noch in Entwicklung - Feedback willkommen
