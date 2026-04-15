from fastapi import APIRouter

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session


from app.db import get_db
from app.models import BronzeFragebogen
from app.schemas import SubmissionIn, SubmissionOut

# import logging
# from logging.handlers import RotatingFileHandler
# from pythonjsonlogger import json


router = APIRouter(
    prefix="/ingest",
    tags=["ingest"]
)

@router.post(
  "/submissions",
  response_model=SubmissionOut,
  summary="Fragebogen-Eintrag übermitteln",
  description=""" Übermittelt einen neuen Fragebogeneintrag an das Backend zur Speicherung."""
)
def create_submission(body: SubmissionIn, db: Session = Depends(get_db)):

  if body.payload.meta.system_source != "tauri_fe":
    raise HTTPException(403, "Writes disabled from this source")

  bronze = BronzeFragebogen(
    payload=body.payload.model_dump(mode="json"),
    system_source=body.payload.meta.system_source,
    system_created_at=body.payload.meta.system_created_at
  )

  db.add(bronze)
  db.commit()
  db.refresh(bronze) # obtain uuid (db assigned)

  # data = {"uuid": bronze.id} | bronze.payload['data'] |  body.payload.meta.model_dump(mode="json")
  # data_answered = {k: d for k,d in data.items() if not isinstance(d, dict) or '_state' not in d}
  #
  # silver_pyd = SilverIn.model_validate(data_answered)
  # # print(silver_pyd.model_dump())
  # data = silver_pyd.model_dump(exclude_none=True, exclude={"testanforderung"})
  # data["submission_id"] = data.pop("uuid")
  #
  # silver_row =  SilverFragebogen(**data)
  # db.add(silver_row)
  # db.commit()

  return {"id": str(bronze.id)}
