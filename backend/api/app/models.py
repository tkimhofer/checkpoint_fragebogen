import uuid
from datetime import datetime

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import text, Text, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB, TIMESTAMP


class Base(DeclarativeBase):
  pass

class BronzeFragebogen(Base):
  __tablename__ = "bronze_fragebogen"

  id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
  payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
  system_created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False)
  system_source: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'tauri_fe'"))


class SilverFragebogen(Base):
  __tablename__ = "silver_fragebogen"

  submission_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
  submission_timestamp: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
  besucherkennung: Mapped[str] = mapped_column(Text, nullable=False)
  plz3: Mapped[str] = mapped_column(Text, nullable=True)

  test_beratung: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_hiv_lab: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_hiv_poc: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_tp_lab: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_gon_chl_rac: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_gon_chl_uri: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_gon_chl_vag: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_gon_chl_rek: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_hav: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_hbv: Mapped[bool] = mapped_column(Boolean, nullable=False)
  test_hcv: Mapped[bool] = mapped_column(Boolean, nullable=False)
  n_tests: Mapped[int] = mapped_column(Integer, nullable=False)

  beraterkennung: Mapped[str] = mapped_column(Text, nullable=False)
  beraterkommentar: Mapped[str] = mapped_column(Text, nullable=True)

  # tab general
  gender: Mapped[str] = mapped_column(Text, nullable=True)
  gender_other: Mapped[str] = mapped_column(Text, nullable=True)
  orientation: Mapped[str] = mapped_column(Text, nullable=True)
  orientation_other: Mapped[str] = mapped_column(Text, nullable=True)
  birth_country: Mapped[str] = mapped_column(Text, nullable=True)
  insurance: Mapped[str] = mapped_column(Text, nullable=True)
  doctor: Mapped[str] = mapped_column(Text, nullable=True)
  hiv_test: Mapped[str] = mapped_column(Text, nullable=True)

  # tab hiv-risiko
  risk_type: Mapped[str] = mapped_column(Text, nullable=True)
  risk_type_other: Mapped[str] = mapped_column(Text, nullable=True)
  prep_use: Mapped[str] = mapped_column(Text, nullable=True)
  hiv_risk_selfest: Mapped[str] = mapped_column(Text, nullable=True)
  hiv_test_prev: Mapped[str] = mapped_column(Text, nullable=True)
  hiv_test_prev_count: Mapped[int] = mapped_column(Integer, nullable=True)
  hiv_test_prev_year: Mapped[int] = mapped_column(Integer, nullable=True)
  hiv_test_prev_confirm: Mapped[bool] = mapped_column(Boolean, nullable=True)
  sexual_risk_time: Mapped[str] = mapped_column(Text, nullable=True)
  risk_country: Mapped[str] = mapped_column(Text, nullable=True)
  risk_situation: Mapped[str] = mapped_column(Text, nullable=True)
  risk_situation_other: Mapped[str] = mapped_column(Text, nullable=True)

  # tab sex & schutz
  risk_gv: Mapped[str] = mapped_column(Text, nullable=True)
  risk_condom: Mapped[str] = mapped_column(Text, nullable=True)
  risk_oral: Mapped[str] = mapped_column(Text, nullable=True)
  risk_reasons: Mapped[str] = mapped_column(Text, nullable=True)
  risk_reasons_other: Mapped[str] = mapped_column(Text, nullable=True)
  risk_drugs: Mapped[str] = mapped_column(Text, nullable=True)

  # tab gesundheit & vorsorge
  sti_history_yesno: Mapped[str] = mapped_column(Text, nullable=True)
  sti_history_which: Mapped[str] = mapped_column(Text, nullable=True)
  sti_history_which_other: Mapped[str] = mapped_column(Text, nullable=True)
  sti_history_treat: Mapped[str] = mapped_column(Text, nullable=True)
  sti_history_country: Mapped[str] = mapped_column(Text, nullable=True)
  hep_a_history: Mapped[str] = mapped_column(Text, nullable=True)
  hep_a_history_infection_year: Mapped[str] = mapped_column(Text, nullable=True)
  hep_b_history: Mapped[str] = mapped_column(Text, nullable=True)
  hep_b_history_infection_year: Mapped[str] = mapped_column(Text, nullable=True)
  hep_ab_vax: Mapped[str] = mapped_column(Text, nullable=True)
  hep_c_history: Mapped[str] = mapped_column(Text, nullable=True)
  hep_c_history_tm: Mapped[str] = mapped_column(Text, nullable=True)

  # provenienz
  system_source: Mapped[str] = mapped_column(Text, nullable=False)
  system_created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
  system_fe_version: Mapped[str] = mapped_column(Text, nullable=True)
  system_be_version: Mapped[str] = mapped_column(Text, nullable=True)