from fastapi import APIRouter

from typing import Optional

from fastapi import Depends, Query

from sqlalchemy.orm import Session
from sqlalchemy import select, desc
import datetime as dt
import zoneinfo

from app.db import get_db
from app.models import BronzeFragebogen

# import logging
# from logging.handlers import RotatingFileHandler
# from pythonjsonlogger import json

from typing import Iterable, Dict, List, Tuple
import datetime as dt
import zoneinfo

router = APIRouter(
    prefix="/inbox",
    tags=["inbox"]
)

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

@router.get(
  "/entries",
  summary="Backend-Einträge abrufen",
  description="""
    Ruft gespeicherte Fragebogeneinträge aus dem Backend ab (optional begrenzt)."""
)
def entries(
        db: Session = Depends(get_db),
        limit: int = Query(50, ge=1, le=500),
        day: Optional[dt.date] = Query(
          default=None,
          description="Kalendertag (YYYY-MM-DD) zur Filterung"
        ),
):
  zone = zoneinfo.ZoneInfo("Europe/Berlin")

  stmt = (
    select(
      BronzeFragebogen.id,
      BronzeFragebogen.payload,
      BronzeFragebogen.system_created_at,
    )
    .order_by(desc(BronzeFragebogen.system_created_at))
    .limit(limit)
  )

  if day:
    start_local = dt.datetime.combine(day, dt.time.min, tzinfo=zone)
    end_local = start_local + dt.timedelta(days=1)

    start_utc = start_local.astimezone(zoneinfo.ZoneInfo("UTC"))
    end_utc = end_local.astimezone(zoneinfo.ZoneInfo("UTC"))

    stmt = (
      stmt
      .where(BronzeFragebogen.system_created_at >= start_utc)
      .where(BronzeFragebogen.system_created_at < end_utc)
    )

  rows = db.execute(stmt).all()

  ts =  lambda r: f'{r.system_created_at.strftime("%d.%m.%Y um %H:%M Uhr")}'
  testanf = lambda r: ", ".join(merged_test_labels(r.payload.get("data", {}).get("testanforderungen"), TESTANFORDERUNGEN))
  besucher_id = lambda r: r.payload.get("data", {}).get("besucherkennung").upper()
  # berater_id = lambda r: r.payload.get("data", {}).get("beraterkennung")
  n_tests = lambda r: len(merged_test_labels(r.payload.get("data", {}).get("testanforderungen"), TESTANFORDERUNGEN))

  def row_to_item(r):
    try:
      return {
        "id": str(r.id),
        "created_at": r.system_created_at.isoformat(),
        "n_tests": str(n_tests(r)),
        "tests": str(testanf(r)),
        "label": f"{besucher_id(r)} am {ts(r)}",
        "pl": r.payload,
      }
    except (AttributeError, TypeError, ValueError) as e:
      # Skip corrupted rows, but keep a breadcrumb for debugging
      # logger.warning("Skipping corrupted row", extra={"row_id": getattr(r, "id", None), "err": str(e)})
      return None

  items = [it for r in rows if (it := row_to_item(r)) is not None]

  return {"ok": True, "items": items}