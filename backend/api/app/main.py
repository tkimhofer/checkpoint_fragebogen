import os, hmac

from typing import Optional
# from dotenv import load_dotenv

from fastapi import FastAPI, Depends, Query, Header, HTTPException, Request, Response, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, APIKeyHeader

# # from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.orm import Session
# from sqlalchemy import text
# from sqlalchemy import select, desc
from typing import Dict #Iterable, Dict, List, Tuple
# import datetime as dt
# import zoneinfo

# from .db import get_db
# from .models import BronzeFragebogen # Base, SilverFragebogen
# from .schemas import SubmissionIn, SubmissionOut #, SilverIn

import logging
# from logging.handlers import RotatingFileHandler
# from pythonjsonlogger import json

from fastapi.middleware.cors import CORSMiddleware
# from starlette.middleware.base import BaseHTTPMiddleware
from app.logging import setup_loggers
setup_loggers()

auth_logger = logging.getLogger("auth")

# load_dotenv(".env")
API_TOKEN = os.environ.get("API_TOKEN", "")

app = FastAPI(
  title="CHP Fragebogendaten API",
  version="0.9.1",
  description="""Backend-Service zur Verarbeitung und Bereitstellung von BuT-Daten.""",
    contact={
        "name": "BuT Backend",
        "email": "torben@tkimhofer.dev",
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer = HTTPBearer(auto_error=False)
x_token = APIKeyHeader(name="x-api-token", auto_error=False)

def require_token(
        request: Request,
        bearer_creds: HTTPAuthorizationCredentials = Security(bearer),
        xtoken: str = Security(x_token),
        # creds: HTTPAuthorizationCredentials = Security(bearer),
):
  if request.method == "OPTIONS":
    return True
  meta = info_request(request)
  # auth_logger.info(request.headers, )

  token = (
    bearer_creds.credentials
    if bearer_creds and bearer_creds.scheme.lower() == "bearer"
    else (xtoken.strip() if xtoken else "")
  )

  if not token or not hmac.compare_digest(token, API_TOKEN):
    meta = meta | {'token': token if token else "no token"}
    auth_logger.warning("auth_fail", extra={"meta": meta})
    raise HTTPException(401, "Invalid token")

  auth_logger.info("auth_success", extra={"meta": meta})
  return True


import app.routers.inbox as inbox
import app.routers.ingest as ingest
import app.routers.intake as intake
import app.routers.system as system


app.include_router(inbox.router, prefix='/v1', dependencies=[Depends(require_token)])
app.include_router(ingest.router, prefix='/v1', dependencies=[Depends(require_token)])
app.include_router(intake.router, prefix='/v1', dependencies=[Depends(require_token)])
app.include_router(system.router, prefix='/v1', dependencies=[Depends(require_token)])


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

@app.middleware("http")
async def log_404s(request: Request, call_next):
    response = await call_next(request)

    if response.status_code == 404:

        h = dict(request.headers)
        extra = {
          "method": request.method,
          "path": request.url.path,
        }

        auth = {"authorization": v} if (v := h.pop("authorization", None)) else {}
        xtok = {"x_api_token": v} if (v := h.pop("x-api-token", None)) else {}
        meta = info_request(request)  | auth | xtok | extra
        # h = dict(request.headers)
        # h.pop("authorization", None)
        # h.pop("cookie", None)

        auth_logger.warning(
            "404",
            extra={"meta":meta},
        )
    return response


