# Checkpoint Fragebogen App

Desktop-Anwendung zur anonymen STI-Testaufnahme\
(Checkpoint Aids Hilfe Duisburg / Kreis Wesel).

Dieses Repo enthält das **Frontend der Tauri Desktop-App**, mit
dem die nativen Builds erzeugt werden.

Fertige Installationsdateien zum Download befinden sich unter **Releases** (siehe rechte
Seitenleiste):

-   Windows (.exe)
-   macOS (.dmg)

------------------------------------------------------------------------

## Schnellstart

1.  .exe oder .dmg herunterladen und installieren
2.  Backend in App konfigurieren:

Zum Testen kann derzeit der folgende Server verwendet werden:

    https://checkpoint.tkimhofer.dev

Im Frontend backend details konfigurieren (Burger Menü re oben):

-   API Base URL → https://checkpoint.tkimhofer.dev
-   gültiges API-Token eintragen

Test-Token auf Anfrage:

    torben@tkimhofer.dev

Die App überträgt Fragebogendaten an ein Docker-basiertes Backend
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
