from fastapi import APIRouter, Depends, Query

from app.db import get_db
from app.models import BronzeFragebogen

from sqlalchemy import select, func
from sqlalchemy.orm import Session
import datetime as dt
import calendar

router = APIRouter(
    prefix="/intake",
    tags=["intake"]
)


@router.get("/by-day",
            summary="Anzahl der Fragebogen per Tag",
            description=""" Für den Indikator im Kalender (welcher Tag hat Einträge)."""
            )
def intake_by_day(
        year: int = Query(..., ge=2000, le=2100),
        month: int = Query(..., ge=1, le=12),
        db: Session = Depends(get_db),
):

    start = dt.datetime(year, month, 1)
    last_day = calendar.monthrange(year, month)[1]
    end = dt.datetime(year, month, last_day, 23, 59, 59)

    # cutoff = dt.datetime.utcnow() - dt.timedelta(days=90)

    stmt = (
        select(
            func.date(
                BronzeFragebogen.system_created_at
                .op("AT TIME ZONE")("Europe/Berlin")
            ).label("day"),
            func.count().label("count"),
        )
        .where(BronzeFragebogen.system_created_at >= start)
        .where(BronzeFragebogen.system_created_at <= end)
        .group_by("day")
        .order_by("day")
    )

    rows = db.execute(stmt).all()

    return [
        {"date": r.day.isoformat(), "count": r.count}
        for r in rows
    ]