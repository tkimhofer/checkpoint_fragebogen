from pydantic import BaseModel, model_validator, Field, computed_field
from typing import Any, Dict, Optional, List
from datetime import datetime
import uuid

SYSTEM_BE_VERSION = "0.9"

class PayloadMeta(BaseModel):
    system_created_at: datetime
    system_source: str = "tauri_fe"
    feVersion: str
    schemaVersion: str
    # lang: str

class PayloadBody(BaseModel):
    meta: PayloadMeta
    data: Dict[str, Any]

class SubmissionIn(BaseModel):
    payload: PayloadBody

class SubmissionOut(BaseModel):
  id: str


TEST_MAP = {
    "test_beratung": {"counsel"},
    "test_hiv_lab": {"hiv_lab"},
    "test_hiv_poc": {"hiv_poc"},

    "test_tp_lab": {"tp"},
    "test_gon_chl_rac": {"go_ct_throat"},
    "test_gon_chl_uri": {"go_ct_urine"},
    "test_gon_chl_vag": {"go_ct_vag"},
    "test_gon_chl_rek": {"go_ct_anal"},

    "test_hav": {"hav"},
    "test_hbv": {"anti-hbc"},
    "test_hcv": {"hcv"},
}

class SilverIn(BaseModel):
  uuid: uuid.UUID
  submission_timestamp: datetime = Field(alias='system_created_at')
  besucherkennung: str
  plz3: Optional[str] = None

  testanforderungen: list[str]
  test_beratung: bool = False
  test_hiv_lab: bool = False
  test_hiv_poc: bool = False
  test_tp_lab: bool = False
  test_gon_chl_rac: bool = False
  test_gon_chl_uri: bool = False
  test_gon_chl_vag: bool = False
  test_gon_chl_rek: bool = False
  test_hav: bool = False
  test_hbv: bool = False
  test_hcv: bool = False
  # n_tests: Optional[int]

  beraterkennung: str
  beraterkommentar: Optional[str] = None

  # tab general
  gender: Optional[str] = None
  gender_other: Optional[str] = None
  orientation: Optional[str] = None
  orientation_other: Optional[str] = None
  birth_country: Optional[str] = None
  insurance: Optional[str] = None
  doctor: Optional[str] = None
  hiv_test: Optional[str] = None

  # tab hiv-risiko
  risk_type: Optional[str] = None
  risk_type_other: Optional[str] = None
  prep_use: Optional[str] = None
  hiv_risk_selfest: Optional[str] = None
  hiv_test_prev: Optional[str] = None
  hiv_test_prev_count: Optional[int] = None
  hiv_test_prev_year: Optional[int] = None
  hiv_test_prev_confirm: Optional[bool] = None
  sexual_risk_time: Optional[str] = None
  risk_country: Optional[str] = None
  risk_situation: Optional[str] = None
  risk_situation_other: Optional[str] = None

  # tab sex & schutz
  risk_gv: Optional[str] = None
  risk_condom: Optional[str] = None
  risk_oral: Optional[str] = None
  risk_reasons: List[str] = []
  risk_reasons_other: Optional[str] = None
  risk_drugs: Optional[str] = None

  # tab gesundheit & vorsorge
  sti_history_yesno: Optional[str] = None
  sti_history_which: Optional[str] = None
  sti_history_which_other: Optional[str] = None
  sti_history_treat: Optional[str] = None
  sti_history_country: Optional[str] = None
  hep_a_history: Optional[str] = None
  hep_a_history_infection_year: Optional[str] = None
  hep_b_history: Optional[str] = None
  hep_b_history_infection_year: Optional[str] = None
  hep_ab_vax: Optional[str] = None
  hep_c_history: Optional[str] = None
  hep_c_history_tm: Optional[str] = None

  # provenienz
  system_source: str = "bronze_fragebogen"
  system_created_at: datetime
  system_fe_version: str = Field(alias='feVersion')
  system_be_version: str = SYSTEM_BE_VERSION

  @computed_field
  @property
  def n_tests(self) -> int:
    return len(set(self.testanforderungen or []))

  @model_validator(mode="after")
  def derive_test_flags(self):
    tests = set(self.testanforderungen or [])
    for field, codes in TEST_MAP.items():
      setattr(self, field, bool(tests & codes))
    return self

  # @model_validator(mode="after")
  # def derive_version(self):
  #   feVersion = set(self.feVersion or None)
  #
  #   if feVersion:
  #     setattr(self, 'system_fe_version', feVersion)
  #
  #   return self

