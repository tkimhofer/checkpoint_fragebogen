import os
from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from .db import get_db, engine
from .models import Base, Submission
from .schemas import SubmissionIn, SubmissionOut

API_TOKEN = os.environ.get("API_TOKEN", "")
CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]

app = FastAPI(title="CHP Fragebogendaten API")

if CORS_ORIGINS:
  app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

def require_token(x_api_token: str | None = Header(default=None)):
  if API_TOKEN and x_api_token != API_TOKEN:
    raise HTTPException(status_code=401, detail="Invalid API token")

@app.get("/health")
def health(db: Session = Depends(get_db)):
  db.execute(text("SELECT 1"))
  return {"ok": True}

@app.post("/submissions", response_model=SubmissionOut, dependencies=[Depends(require_token)])
def create_submission(body: SubmissionIn, db: Session = Depends(get_db)):
  row = Submission(payload=body.payload, source=body.source or "tauri")
  db.add(row)
  db.commit()
  db.refresh(row)
  return {"id": str(row.id)}
