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
  n_tests               INTEGER NOT NULL,

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
  risk_type             TEXT,
  risk_type_other       TEXT,
  prep_use              TEXT,
  hiv_risk_selfest      TEXT,
  hiv_test_prev         TEXT,
  hiv_test_prev_count   INTEGER,
  hiv_test_prev_year    INTEGER,
  hiv_test_prev_confirm BOOLEAN,
  sexual_risk_time      TEXT,
  risk_country          TEXT,
  risk_situation        TEXT,
  risk_situation_other  TEXT,

  --  tab sex & schutz
  risk_gv               TEXT,
  risk_condom           TEXT,
  risk_oral             TEXT,
  risk_reasons          TEXT,
  risk_reasons_other    TEXT,
  risk_drugs            TEXT,

  -- tab gesundheit & vorsorge
  sti_history_yesno     TEXT,
  sti_history_which     TEXT,
  sti_history_which_other  TEXT,
  sti_history_treat     TEXT,
  sti_history_country   TEXT,
  hep_a_history         TEXT,
  hep_a_history_infection_year         TEXT,
  hep_b_history         TEXT,
  hep_b_history_infection_year         TEXT,
  hep_ab_vax            TEXT,
  hep_c_history         TEXT,
  hep_c_history_tm      TEXT,

  --  provenienz
  system_source         TEXT NOT NULL DEFAULT 'bronze_fragebogen',
  system_created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  system_fe_version     TEXT, -- frontend version
  system_be_Version     TEXT  -- backend version
);



CREATE TABLE IF NOT EXISTS gold_fragebogen (
-- business layer

  submission_day  TIMESTAMP NOT NULL,
  n_visitors            INTEGER,
  n_tests               INTEGER,
  n_tests_avg_person    INTEGER,

  --  performed tests
  n_person_hiv_test     INTEGER,
  n_test_hiv_lab        INTEGER,
  n_test_hiv_poc        INTEGER,

  n_test_tp_lab         INTEGER,

  n_person_gon_chl_test INTEGER,
  n_test_gon_chl_rac    INTEGER,
  n_test_gon_chl_uva    INTEGER,
  n_test_gon_chl_rek    INTEGER,

  n_person_hepatitiden  INTEGER,
  n_test_hav            INTEGER,
  n_test_hbv            INTEGER,
  n_test_hcv            INTEGER,
  n_test_hep_ab_vax     INTEGER,

  --  description visitor cohort
  age_avg               NUMERIC,
  age_min               NUMERIC,
  age_max               NUMERIC,

  gender_male_n         INTEGER,
  gender_female_n       INTEGER,
  gender_other_n        INTEGER,

  insurance_perc        NUMERIC,
  doctor_perc           NUMERIC,
  birth_country_DE_perc NUMERIC,

  prep_users_perc       NUMERIC,
  sti_history_perc      NUMERIC,
  hiv_test_prev_perc    NUMERIC,
  hiv_test_ahd_perc     NUMERIC,

  --  provenienz
  system_source         TEXT NOT NULL DEFAULT 'silver_fragebogen',
  system_created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);