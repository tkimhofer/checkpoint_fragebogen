import os, hmac

from typing import Optional
# from dotenv import load_dotenv

from fastapi import FastAPI, Depends, Query, Header, HTTPException, Request, Response, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, APIKeyHeader

# from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy import select, desc
from typing import Iterable, Dict, List, Tuple
import datetime as dt
import zoneinfo

from .db import get_db
from .models import BronzeFragebogen # Base, SilverFragebogen
from .schemas import SubmissionIn, SubmissionOut #, SilverIn

import logging
from logging.handlers import RotatingFileHandler
from pythonjsonlogger import json

# from starlette.middleware.base import BaseHTTPMiddleware

root = logging.getLogger()
root.setLevel(logging.INFO)

root.handlers.clear() # rm on reload

### file logs in json (easier to import)
file_handler = RotatingFileHandler(
    "/app/logs/access.log",
    maxBytes=20_000_000,   # max file size is 20 MB
    backupCount=5 # max nb of files, app.log is always recent, app.log1 to app.log5 are historical
)

file_handler.setFormatter(
  json.JsonFormatter(
      "%(asctime)s %(name)s %(levelname)s %(message)s"
  )
)


### logger for visible "docker compose logs -f"
console = logging.StreamHandler()
console.setFormatter(
  logging.Formatter(
    "%(asctime)s | %(name)s | %(levelname)s | %(message)s"
  )
)


root.addHandler(file_handler)
root.addHandler(console)


# include handlers to also collect logs from uvicorn/fastapi components
for name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
    logger = logging.getLogger(name)
    logger.handlers.clear()
    logger.propagate = True

# dedicated auth logger
auth_logger = logging.getLogger("auth")

# load_dotenv(".env")
API_TOKEN = os.environ.get("API_TOKEN", "")


# CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]
# print("CORS_ORIGINS =", CORS_ORIGINS)

# CORS_ORIGINS = ["*"]
# print("CORS_ORIGINS =", CORS_ORIGINS)

TESTANFORDERUNGEN: dict[str, str] = {
  "counsel": "Nur Beratung",

  "hiv_lab": "HIV Suchtest (Labor)",
  "hiv_poc": "HIV Suchtest (Schnelltest/POC)",

  "tp": "Syphilis Serologie",

  "go_ct_throat": "Rachen",
  "go_ct_urine": "Urin",
  "go_ct_vag": "Vaginal",
  "go_ct_anal": "Rektal",

  "hav": "HAV",
  "anti-hbc": "HBV (core)",
  "hcv": "HCV",
}

GO_CT_SITE_ORDER = [
    "go_ct_throat",
    "go_ct_urine",
    "go_ct_vag",
    "go_ct_anal",
]
GO_CT_PREFIX = "go_ct_"
EXCLUDE_CODES = {"counsel"}  # add more if needed


def normalize_test_codes(
        selected_codes: Iterable[str],
        labels: Dict[str, str],
) -> Tuple[List[str], List[str]]:
  """
  Returns:
    (non_go_ct_codes, ordered_go_ct_labels)

  - excludes EXCLUDE_CODES
  - go_ct labels are returned in GO_CT_SITE_ORDER order
  """
  codes = set(selected_codes or [])
  codes -= EXCLUDE_CODES

  # Ordered go_ct labels (stable order)
  go_ct_labels: List[str] = []
  for site_code in GO_CT_SITE_ORDER:
    if site_code in codes:
      go_ct_labels.append(labels.get(site_code, site_code))

  # Remaining non-go_ct codes (keep as codes for now)
  non_go_ct_codes = [c for c in codes if not c.startswith(GO_CT_PREFIX)]

  return non_go_ct_codes, go_ct_labels

def merged_test_labels(selected_codes: Iterable[str], labels: Dict[str, str]) -> List[str]:
    non_go_ct_codes, go_ct_labels = normalize_test_codes(selected_codes, labels)

    # stable-ish: sort non-go_ct by their label text
    non_go_ct_labels = sorted((labels.get(c, c) for c in non_go_ct_codes))

    if go_ct_labels:
      non_go_ct_labels.append(f"CT/NG PCR ({', '.join(go_ct_labels)})")

    return non_go_ct_labels


app = FastAPI(
  title="CHP Fragebogendaten API",
  version="0.8.1",
  description="""
Backend-Service zur Verarbeitung und Bereitstellung von CHP-Fragebogendaten.
""",
    contact={
        "name": "Backend Support",
        "email": "torben@tkimhofer.dev",
    }
)

# if CORS_ORIGINS:
#   app.add_middleware(
#     CORSMiddleware,
#     allow_origins=CORS_ORIGINS,
#     allow_credentials=False, # no browser creds / cookies etc
#     allow_methods=["*"],
#     allow_headers=["Content-Type", "Accept", "X-API-Token"],
#   )

bearer = HTTPBearer(auto_error=False)
x_token = APIKeyHeader(name="x-api-token", auto_error=False)

def info_request(request: Request) -> Dict[str, Optional[str]]:
  h = request.headers

  cf_ip = h.get("cf-connecting-ip")
  xff = h.get("x-forwarded-for")
  xff_ip = xff.split(",")[0].strip() if xff else None
  direct_ip = request.client.host if request.client else None

  client_ip = cf_ip or xff_ip or direct_ip

  return {
    "ip": client_ip,
    "host": h.get("host"),
    "referer": h.get("referer"),
    "x_forwarded_for": xff,

    "user_agent": h.get("user-agent"),
    "accept_language": h.get("accept-language"),
    "cf_ipcountry": h.get("cf-ipcountry"),
  }

def require_token(
        request: Request,
        bearer_creds: HTTPAuthorizationCredentials = Security(bearer),
        xtoken: str = Security(x_token),
        # creds: HTTPAuthorizationCredentials = Security(bearer),
):
  meta = info_request(request)
  # auth_logger.info(request.headers, )

  token = (
    bearer_creds.credentials
    if bearer_creds and bearer_creds.scheme.lower() == "bearer"
    else (xtoken.strip() if xtoken else "")
  )

  if not token or not hmac.compare_digest(token, API_TOKEN):
    raise HTTPException(401, "Invalid token")

    meta = meta | {'token': token if token else "no token"}
    auth_logger.warning("auth_fail", extra={"meta": meta})
    raise HTTPException(status_code=401, detail="Invalid bearer token")

  auth_logger.info("auth_success", extra={"meta": meta})
  return True

@app.middleware("http")
async def log_404s(request: Request, call_next):
    response = await call_next(request)

    if response.status_code == 404:

        h = dict(request.headers)
        extra = {
          "method": request.method,
          "path": request.url.path,
        }
        meta = info_request(request) | h.pop("authorization", {}) | h.pop("x-api-token", {}) | extra
        # h = dict(request.headers)
        # h.pop("authorization", None)
        # h.pop("cookie", None)

        auth_logger.warning(
            "404",
            extra={"meta":meta},
        )
    return response



#
# def require_token(request: Request, x_api_token: Optional[str] = Header(default=None)):
#   meta = info_request(request)
#
#   if not API_TOKEN:
#     meta["token"] = "SERVER_MISCONFIG: API_TOKEN not set"
#     auth_logger.warning("auth_fail", extra=meta)
#     raise HTTPException(status_code=404, detail="Not found") # stealth mode
#
#   if not x_api_token:
#     meta["token"] = "NOT PROVIDED"
#     auth_logger.warning("auth_fail", extra=meta)
#     raise HTTPException(status_code=404, detail="Not found") # stealth mode
#
#   if not hmac.compare_digest(x_api_token, API_TOKEN):
#     meta["token"] = f"wrong token: {x_api_token}"
#     auth_logger.warning("auth_fail", extra=meta)
#     raise HTTPException(status_code=404, detail="Not found") # stealth mode
#
#   auth_logger.info(meta)
#   auth_logger.info("auth_success", extra=meta)
#   return
#
#
# @app.get(
#   "/health",
#   dependencies=[Depends(require_token)],
#   summary="Backend-Status prüfen",
#   description="""
#       Interner Backend-Check zur Überprüfung der API-
#       und Datenbankverfügbarkeit.
#       Gibt bei Betriebsbereitschaft eine positive Rückmeldung (HTTP 200) zurück.
# """
# )
# def health(response: Response, db: Session = Depends(get_db)):
#   response.headers["X-Served-By"] = "dev-server"
#   db.execute(text("SELECT 1"))
#   return {"ok": True}

#
# @app.get(
#   "/entries",
#   dependencies=[Depends(require_token)],
#   summary="Backend-Einträge abrufen",
#   description="""
#     Ruft gespeicherte Fragebogeneinträge aus dem Backend ab (optional begrenzt)."""
# )
# def entries(
#         db: Session = Depends(get_db),
#         limit: int = Query(50, ge=1, le=500),
#         day: Optional[dt.date] = Query(
#           default=None,
#           description="Kalendertag (YYYY-MM-DD) zur Filterung"
#         ),
# ):
#   zone = zoneinfo.ZoneInfo("Europe/Berlin")
#
#   stmt = (
#     select(
#       BronzeFragebogen.id,
#       BronzeFragebogen.payload,
#       BronzeFragebogen.system_created_at,
#     )
#     .order_by(desc(BronzeFragebogen.system_created_at))
#     .limit(limit)
#   )
#
#   if day:
#     start_local = dt.datetime.combine(day, dt.time.min, tzinfo=zone)
#     end_local = start_local + dt.timedelta(days=1)
#
#     start_utc = start_local.astimezone(zoneinfo.ZoneInfo("UTC"))
#     end_utc = end_local.astimezone(zoneinfo.ZoneInfo("UTC"))
#
#     stmt = (
#       stmt
#       .where(BronzeFragebogen.system_created_at >= start_utc)
#       .where(BronzeFragebogen.system_created_at < end_utc)
#     )
#
#   rows = db.execute(stmt).all()
#
#   ts =  lambda r: f'{r.system_created_at.strftime("%d.%m.%Y um %H:%M Uhr")}'
#   testanf = lambda r: ", ".join(merged_test_labels(r.payload.get("data", {}).get("testanforderungen"), TESTANFORDERUNGEN))
#   besucher_id = lambda r: r.payload.get("data", {}).get("besucherkennung").upper()
#   # berater_id = lambda r: r.payload.get("data", {}).get("beraterkennung")
#   n_tests = lambda r: len(merged_test_labels(r.payload.get("data", {}).get("testanforderungen"), TESTANFORDERUNGEN))
#
#   def row_to_item(r):
#     try:
#       return {
#         "id": str(r.id),
#         "created_at": r.system_created_at.isoformat(),
#         "n_tests": str(n_tests(r)),
#         "tests": str(testanf(r)),
#         "label": f"{besucher_id(r)} am {ts(r)}",
#         "pl": r.payload,
#       }
#     except (AttributeError, TypeError, ValueError) as e:
#       # Skip corrupted rows, but keep a breadcrumb for debugging
#       logger.warning("Skipping corrupted row", extra={"row_id": getattr(r, "id", None), "err": str(e)})
#       return None
#
#
#   items = [it for r in rows if (it := row_to_item(r)) is not None]
#
#   return {"ok": True, "items": items}
#
#
# @app.post(
#   "/submissions",
#   response_model=SubmissionOut,
#   dependencies=[Depends(require_token)],
#   summary="Fragebogen-Eintrag übermitteln",
#   description=""" Übermittelt einen neuen Fragebogeneintrag an das Backend zur Speicherung."""
# )
# def create_submission(body: SubmissionIn, db: Session = Depends(get_db)):
#
#   if body.payload.meta != "tauri_fe":
#     raise HTTPException(403, "Writes disabled from this source")
#
#   bronze = BronzeFragebogen(
#     payload=body.payload.model_dump(mode="json"),
#     system_source=body.payload.meta.system_source,
#     system_created_at=body.payload.meta.system_created_at
#   )
#
#   db.add(bronze)
#   db.commit()
#   db.refresh(bronze) # obtain uuid (db assigned)
#
#   # data = {"uuid": bronze.id} | bronze.payload['data'] |  body.payload.meta.model_dump(mode="json")
#   # data_answered = {k: d for k,d in data.items() if not isinstance(d, dict) or '_state' not in d}
#   #
#   # silver_pyd = SilverIn.model_validate(data_answered)
#   # # print(silver_pyd.model_dump())
#   # data = silver_pyd.model_dump(exclude_none=True, exclude={"testanforderung"})
#   # data["submission_id"] = data.pop("uuid")
#   #
#   # silver_row =  SilverFragebogen(**data)
#   # db.add(silver_row)
#   # db.commit()
#
#   return {"id": str(bronze.id)}
