from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from app.db import get_db

from fastapi import Depends, Response
from sqlalchemy import text

router = APIRouter(
    prefix="/system",
    tags=["system"]
)


@router.get(
  "/health",
  summary="Backend-Status prüfen",
  description="""
      Interner Backend-Check zur Überprüfung der API-
      und Datenbankverfügbarkeit.
      Gibt bei Betriebsbereitschaft eine positive Rückmeldung (HTTP 200) zurück.
"""
)
def health(response: Response, db: Session = Depends(get_db)):
    response.headers["X-Served-By"] = "dev-server"
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except:
        db_ok = False

    return {
        "status": "ok",
        "db": db_ok
    }

#
# @router.get("/robots.txt", response_class=PlainTextResponse, summary="Bot antwort",)
# def robots():
#     return Response(
#         content="User-agent: *\nDisallow: /\n",
#         media_type="text/plain",
#         headers={"Cache-Control": "public, max-age=86400"}
#     )
#
# @router.get("/favicon.ico"summary="Bot antwort",)
# def favicon():
#     return Response(status_code=204)