CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS raw_rohdaten (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload    JSONB NOT NULL,
  source     TEXT NOT NULL DEFAULT 'tauri'
);

CREATE INDEX IF NOT EXISTS submissions_created_at_idx
  ON rohdaten (created_at DESC);


CREATE TABLE IF NOT EXISTS stage_fragebogen (
  uuid                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  submission_timestamp  TIMESTAMP NOT NULL,
  visitor_id            TEXT NOT NULL,
  plz3                  TEXT,
  testanforderung       TEXT NOT NULL,
  beraterkennung        TEXT NOT NULL,
  beraterkommentar      TEXT,

--  tab general
  gender                TEXT,
  orientation           TEXT,
  birth_country         TEXT,
  insurance             TEXT,
  doctor                TEXT,
  hiv_test              TEXT,

--  tab hiv-risiko
  risk_type             TEXT,
  prep_use              TEXT,
  hiv_risk_selfest      TEXT,
  hiv_test_prev         TEXT,
  hiv_test_prev_count   INTEGER,
  hiv_test_prev_year    TEXT,
  hiv_test_prev_confirm TEXT,
  sexual_risk_time      TEXT,
  risk_country          TEXT,
  risk_situation        TEXT,

--  tab sex & schutz
  risk_gv               TEXT,
  risk_condom           TEXT,
  risk_oral             TEXT,
  risk_reasons          TEXT,
  risk_drugs            TEXT,

-- tab gesundheit & vorsorge
  sti_history_yesno     TEXT,
  sti_history_which     TEXT,
  sti_history_treat     TEXT,
  sti_history_country   TEXT,
  hep_a_history         TEXT,
  hep_b_history         TEXT,
  hep_ab_vax            TEXT,
  hep_c_history         TEXT,
  hep_c_history_tm      TEXT,

--  provenienz
  row_created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  source                TEXT NOT NULL DEFAULT, --'raw_rohdaten'
  version_frontend      TEXT NOT NULL,
  version_backend       TEXT NOT NULL,
);