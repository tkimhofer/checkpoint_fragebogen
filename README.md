# 🩺 Checkpoint Fragebogen App

Desktop-Anwendung zur anonymen STI-Testaufnahme\
(Checkpoint Aids Hilfe Duisburg / Kreis Wesel).

Multilinguale, datensparsame Erfassung für den Einsatz vor Ort.\
Native Builds für **Windows (.exe)** und **macOS (.dmg)** stehen unter
**Releases** bereit (s. rechter Bildrand).

------------------------------------------------------------------------

## Projektstruktur

-   `frontend/` -- Tauri Desktop-App (React + TypeScript)
-   `backend/` -- Docker-Backend (FastAPI + PostgreSQL)

Die App kann entweder:

-   mit lokalem Docker-Backend betrieben werden\
-   oder mit einem externen Server verbunden werden

------------------------------------------------------------------------

## Schnellstart

1.  Passende Version aus **Releases** herunterladen

2.  Anwendung starten

3.  Backend konfigurieren (z. B. Test-Server):

        https://checkpoint.tkimhofer.dev

(API-Token erforderlich -- auf Anfrage erhältlich)

------------------------------------------------------------------------

## Technologie (Kurzüberblick)

Frontend: - React + TypeScript - Tailwind CSS - Tauri (Rust)

Backend: - FastAPI - PostgreSQL - Docker Compose

------------------------------------------------------------------------

## Entwicklung

Frontend:

    cargo tauri dev

Backend:

    docker compose up -d

------------------------------------------------------------------------

Lizenz: MIT
