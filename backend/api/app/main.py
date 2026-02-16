import os

from uuid import UUID
from typing import Optional
from datetime import datetime

from dotenv import load_dotenv
load_dotenv("/Users/tk/js/chp_ahd/backend/.env.example")

from fastapi import FastAPI, Depends, Query, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, time
from zoneinfo import ZoneInfo
from sqlalchemy import select, desc
from typing import Iterable, Dict, List, Tuple


from .db import get_db, engine
from .models import Base, BronzeFragebogen, SilverFragebogen
from .schemas import SubmissionIn, SubmissionOut, SilverIn

API_TOKEN = os.environ.get("API_TOKEN", "")
CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]
print("CORS_ORIGINS =", CORS_ORIGINS)


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


app = FastAPI(title="CHP Fragebogendaten API")

if CORS_ORIGINS:
  app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False, # no browser creds / cookies etc
    allow_methods=["*"],
    allow_headers=["Content-Type", "Accept", "X-API-Token"],
  )

def require_token(x_api_token: Optional[str] = Header(default=None)):
  if API_TOKEN and x_api_token != API_TOKEN:
    raise HTTPException(status_code=401, detail="Invalid API token")

@app.get("/health")
def health(db: Session = Depends(get_db)):
  db.execute(text("SELECT 1"))
  return {"ok": True}


@app.get("/entries")
def entries(
        db: Session = Depends(get_db),
        limit: int = Query(50, ge=1, le=500),
        # source = Query(None),
        tz: str = Query("Europe/Berlin"),
):
  ### fetch all entries from today
  # zone = ZoneInfo(tz)
  # now = datetime.now(zone)
  # start = datetime.combine(now.date(), time.min, tzinfo=zone)
  # end = datetime.combine(now.date(), time.max, tzinfo=zone)

  stmt = (
    select(
      BronzeFragebogen.id,
      BronzeFragebogen.payload,
      BronzeFragebogen.system_created_at,
      # BronzeFragebogen.system_source
    )
    # .where(BronzeFragebogen.system_created_at >= start)
    # .where(BronzeFragebogen.system_created_at <= end)
    .order_by(desc(BronzeFragebogen.system_created_at))
    .limit(limit)
  )
  # if source:
  #   stmt = stmt.where(BronzeFragebogen.system_source == source)

  rows = db.execute(stmt).all()

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



  ts =  lambda r: f'{r.system_created_at.strftime("%d.%m.%Y um %H:%M Uhr")}'
  testanf = lambda r: ", ".join(merged_test_labels(r.payload.get("data", {}).get("testanforderungen"), TESTANFORDERUNGEN))
  besucher_id = lambda r: r.payload.get("data", {}).get("besucherkennung").upper()
  # berater_id = lambda r: r.payload.get("data", {}).get("beraterkennung")
  n_tests = lambda r: len(merged_test_labels(r.payload.get("data", {}).get("testanforderungen"), TESTANFORDERUNGEN))


  items = [
    {
      "id": str(r.id),
      "created_at": r.system_created_at.isoformat(),
      "n_tests": f"{n_tests(r)}",
      "tests": f"{testanf(r)}",
      "label": f'{besucher_id(r)} am {ts(r)}',
      "pl": r.payload,
    }
    for r in rows
  ]

  return {"ok": True, "items": items}

# @app.get("/entries/{entry_id}")
# def get_entry(entry_id: UUID, db: Session = Depends(get_db)):
#   stmt = select(BronzeFragebogen).where(BronzeFragebogen.id == entry_id)
#   row = db.execute(stmt).scalar_one_or_none()
#   if not row:
#     raise HTTPException(status_code=404, detail="Entry not found")
#
#   return {
#     "ok": True,
#     "id": str(row.id),
#     "created_at": row.system_created_at.isoformat(),
#     "source": row.system_source,
#     "payload": row.payload,
#   }

@app.post("/submissions", response_model=SubmissionOut, dependencies=[Depends(require_token)])
def create_submission(body: SubmissionIn, db: Session = Depends(get_db)):

  print(body.payload.meta.system_created_at)
  bronze = BronzeFragebogen(
    payload=body.payload.model_dump(mode="json"),
    system_source=body.payload.meta.system_source,
    system_created_at=body.payload.meta.system_created_at
  )

  db.add(bronze)
  db.commit()
  db.refresh(bronze) # obtain uuid (db assigned)

  data = {"uuid": bronze.id} | bronze.payload['data'] |  body.payload.meta.model_dump(mode="json")
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
