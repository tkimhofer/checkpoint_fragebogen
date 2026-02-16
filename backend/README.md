# Backend – Lokaler API- & Datenbankdienst

Dieses Backend stellt einen **lokalen API-Dienst (FastAPI)** sowie eine **PostgreSQL-Datenbank** bereit.  
Es wird auf einem **lokalen Windows-Rechner** betrieben und dient als Server während aktiver Datenerhebungs-Zeiträume.  
Die Desktop-App (Tauri) sendet ihre Daten per HTTP an diesen Dienst.

---

## Komponenten

- **PostgreSQL**  
  Persistente Speicherung der erfassten Daten (Docker Volume)
- **FastAPI**  
  REST-API zur Entgegennahme und Validierung der Daten
- **Docker Compose**  
  Startet und verbindet alle Dienste lokal

---

## Voraussetzungen

- **Windows 10/11**
- **Docker Desktop** (inkl. Docker Compose)
- Freier Port **8000** (API)  
- Freier Port **5432** (PostgreSQL, nur lokal relevant)

---

## Verzeichnisstruktur

```
backend/
├─ docker-compose.yml
├─ .env.example
├─ README.md
├─ db/
│  └─ init/
│     └─ 001_schema.sql
└─ services/
   └─ api/
      ├─ Dockerfile
      ├─ requirements.txt
      └─ app/
         └─ main.py
```

---

## Einrichtung

### 1. Backend-Dateien bereitstellen
- Das Verzeichnis `backend/` auf den Server-PC kopieren  
  (z. B. aus einem ZIP-Archiv der GitHub-Releases)

### 2. Konfigurationsdatei erstellen
```bash
cd backend
copy .env.example .env
```

Die Datei `.env` nach Bedarf anpassen (Passwörter ändern!).

---

## Starten des Backends

```bash
docker compose up -d
```

Beim ersten Start:
- PostgreSQL wird initialisiert
- Datenbankschema wird automatisch angelegt
- Ein persistentes Docker-Volume wird erstellt

---

## Status prüfen

### API-Healthcheck
Im Browser oder per curl:

```
http://localhost:8000/health
```

Antwort:
```json
{ "ok": true }
```

---

## Datenpersistenz

Alle Daten werden in einem **Docker Volume** gespeichert.  

- ✅ Container-Neustarts → Daten bleiben erhalten
- ✅ Docker-Updates → Daten bleiben erhalten
- ❌ Löschen des Volumes → Daten gehen verloren

⚠️ **Volumes nur löschen, wenn ein vollständiger Reset gewünscht ist.**

---

## Sicherheitshinweise

- Die API ist für **lokale Nutzung** vorgesehen.
- Zugriff erfolgt über ein **API-Token** (`X-API-Token` Header).
- PostgreSQL sollte **nicht** direkt aus dem Netzwerk erreichbar sein.

---

## Stoppen des Backends

```bash
docker compose down
```

(Daten bleiben erhalten.)

---

## Vollständiger Reset (inkl. Daten)

⚠️ **Achtung: löscht alle gespeicherten Daten!**

```bash
docker compose down -v
```

---

## Typischer Ablauf (Kurzfassung)

1. Backend starten (`docker compose up -d`)
2. Desktop-App starten
3. Datenerhebung durchführen
4. Backend ggf. weiterlaufen lassen oder stoppen

---

## Hinweise für Entwickler

- Schema-Änderungen erfolgen über SQL-Migrationen
- Init-Skripte (`db/init`) laufen **nur beim ersten Start**
- API & Datenbank sind bewusst lokal gehalten
