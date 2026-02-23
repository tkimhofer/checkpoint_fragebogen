# Checkpoint Fragebogen App

Desktop-Anwendung zur anonymen STI-Testaufnahme\
(Checkpoint Aids Hilfe Duisburg / Kreis Wesel).

Dieses Repo enthält das **Frontend der Tauri Desktop-App**, mit
dem die nativen Builds erzeugt werden.

------------------------------------------------------------------------

## Schnellstart

1.  .exe oder .dmg herunterladen (s. **Releases**) & installieren
2.  Backend in App konfigurieren (Burger Menü re oben):

Zum Testen kann derzeit der folgende Server verwendet werden:

-   API Base URL → https://checkpoint.tkimhofer.dev
-   API-Token  → frag mich nach Token: torben@tkimhofer.dev

Die App interagiert dann mit einem Docker-basiertes Backend
(FastAPI + PostgreSQL, siehe `backend/`).

------------------------------------------------------------------------

## Technologie

-   React + TypeScript
-   Tailwind CSS
-   Tauri (Rust)
-   Vite

------------------------------------------------------------------------

## Entwicklung

### **Develoment**

```bash
cargo tauri dev
```

Hot-reloading in a Tauri window.

### **Production Build**
```bash
cargo tauri build # dmg
cargo tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc # exe
```
Generiert `.exe` (Windows) and `.dmg` (macOS) Installers.

---
Projekt befindet sich in aktiver Entwicklung -- Feedback willkommen.
