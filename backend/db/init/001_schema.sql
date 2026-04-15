CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS bronze_fragebogen (
-- raw layer
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload               JSONB NOT NULL,
  system_source         TEXT NOT NULL DEFAULT 'tauri_fe',
  system_created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS submissions_created_at_idx
  ON bronze_fragebogen (system_created_at DESC);


CREATE TABLE IF NOT EXISTS silver_fragebogen (
-- stage layer
  submission_id         UUID PRIMARY KEY,
  submission_timestamp  TIMESTAMPTZ NOT NULL,
  besucherkennung       TEXT NOT NULL,
  plz3                  TEXT,

  --  anforderungen labortest
  test_beratung         BOOLEAN NOT NULL,
  test_hiv_lab          BOOLEAN NOT NULL,
  test_hiv_poc          BOOLEAN NOT NULL,
  test_tp_lab           BOOLEAN NOT NULL,
  test_gon_chl_rac      BOOLEAN NOT NULL,
  test_gon_chl_uri      BOOLEAN NOT NULL,
  test_gon_chl_vag      BOOLEAN NOT NULL,
  test_gon_chl_rek      BOOLEAN NOT NULL,
  test_hav              BOOLEAN NOT NULL,
  test_hbv              BOOLEAN NOT NULL,
  test_hcv              BOOLEAN NOT NULL,
  --n_tests               INTEGER NOT NULL,

  beraterkennung        TEXT NOT NULL,
  beraterkommentar      TEXT,

  --  tab general
  gender                TEXT,
  gender_other          TEXT,
  orientation           TEXT,
  orientation_other     TEXT,
  birth_country         TEXT,
  insurance             TEXT,
  doctor                TEXT,
  hiv_test              TEXT,

  --  tab hiv-risiko
  risk_type             jsonb,
  risk_type_other       TEXT,
  prep_use              TEXT,
  hiv_risk_selfest      TEXT,
  hiv_test_prev         TEXT,
  hiv_test_prev_count   TEXT,
  hiv_test_prev_year    TEXT,
  hiv_test_prev_confirm TEXT,
  sexual_risk_time      TEXT,
  risk_situation        jsonb,
  risk_situation_other  TEXT,
  risk_country          TEXT,

  --  tab sex & schutz
  risk_gv               TEXT,
  risk_condom           TEXT,
  risk_oral             TEXT,
  risk_reasons          jsonb,
  risk_reasons_other    TEXT,
  risk_drugs            TEXT,

  -- tab gesundheit & vorsorge
  sti_history_yesno     TEXT,
  sti_history_which    jsonb,
  sti_history_which_other  TEXT,
  sti_history_years     JSONB,
  hep_a_history         TEXT,
  hep_b_history         TEXT,

  --  provenienz
  system_source         TEXT NOT NULL,
  system_created_at     TIMESTAMPTZ NOT NULL,
  system_fe_version     TEXT, -- frontend version
  system_schema_version  TEXT  -- questionnaire version
);



CREATE TABLE IF NOT EXISTS gold_fragebogen (
-- business layer

  day date NOT NULL  PRIMARY KEY,
  n_visitors            INTEGER,

  --  description visitor cohort
  n_male         INTEGER,
  n_female      INTEGER,
  n_gender_other        INTEGER,

  age_avg               NUMERIC,
  n_age_le13        NUMERIC,
  n_age_le17      NUMERIC,
  n_age_le24      NUMERIC,
  n_age_le34      NUMERIC,
  n_age_le49      NUMERIC,
  n_age_ge50      NUMERIC,

  n_dui      NUMERIC,
  n_wesel      NUMERIC,

  n_imig      NUMERIC,
  --  provenienz
  system_source         TEXT NOT NULL DEFAULT 'silver_fragebogen',
  system_created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);