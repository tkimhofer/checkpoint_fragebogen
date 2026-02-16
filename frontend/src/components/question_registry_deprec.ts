import * as C from "./translations";

type QType = "radio" | "checkbox" | "text" | "textarea" | "country" | "yesno" | "vax4" ;
type QDef = { no: number; type: QType; section: "general"|"hiv"|"sexpractices"|"other"|"summary"|"berater"; options?: C.Opt[]; placeholder?: Record<C.Lang,string>};

export const Q: Record<string, QDef> = {
  /// variable Q registers questions and question types, rendered with function 'renderQuestion' in UI function below

  gender: {no: 1, type: "radio", options: C.GENDER, section: "general"},
  orientation: {no: 2,  type: "radio", options: C.ORIENTATION, section: "general" },
  birth_country: {no: 3,  type: "country", section: "general" },
  // sex_birth: { type: "radio", options: SEX_BIRTH, section: "general" },
  // age: { ... },

  insurance: {no: 4,  type: "radio", options: C.YES_NO, section: "general" },
  doctor: {no: 5,  type: "radio", options: C.YES_NO, section: "general" },
  hiv_test: {no: 6,  type: "radio", options: C.YES_NO, section: "general" },

  risk_type: {no: 7,  type: "checkbox", options: C.HIV_RISK, section: "hiv" },
  prep_use: {no: 8,  type: "radio", options: C.YES_NO, section: "hiv" },
  hiv_risk_selfest: {no: 9,  type: "radio", options: C.PERCEIVED_RISK, section: "hiv"},
  hiv_test_prev: {no: 10,  type: "radio", options: C.YES_NO, section: "hiv" },
  sexual_risk_time: {no: 11,  type: "radio", options: C.LAST_RISK_TIME, section: "hiv" },
  risk_country: {no: 12,  type: "country",  section: "hiv" },
  risk_situation: {no: 13,  type: "checkbox", options: C.RISK_SITUATION, section: "hiv" },
  
  risk_gv: {no: 14,  type: "radio", options: [
    { code: "no", labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
    { code: "yes_both", labels: { de: "Ja, aktiv & passiv", en: "Yes, insertive and receptive", tr: "Evet, aktif ve pasif", uk: "Так, інсертивно і рецептивно" } },
    { code: "yes_insertive", labels: { de: "Ja, aktiv (insertiv)", en: "Yes, insertive", tr: "Evet, aktif", uk: "Так, інсертивно" } },
    { code: "yes_receptive", labels: { de: "Ja, passiv (rezeptiv)", en: "Yes, receptive", tr: "Evet, pasif", uk: "Так, рецептивно" } },
  ], section: "sexpractices" },
  
  risk_condom: {no: 15,  type: "radio", options: [
    { code: "no", labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
    { code: "yes_both", labels: { de: "Ja, aktiv & passiv", en: "Yes, insertive and receptive", tr: "Evet, aktif ve pasif", uk: "Так, інсертивно і рецептивно" } },
    { code: "yes_insertive", labels: { de: "Ja, aktiv (insertiv)", en: "Yes, insertive", tr: "Evet, aktif", uk: "Так, інсертивно" } },
    { code: "yes_receptive", labels: { de: "Ja, passiv (rezeptiv)", en: "Yes, receptive", tr: "Evet, pasif", uk: "Так, рецептивно" } },
  ], section: "sexpractices" },

  risk_oral: {no: 16,  type: "yesno", options: C.YES_NO, section: "sexpractices" },
  risk_reasons: {no: 17,  type: "checkbox", options: C.CONDOM_REASON, section: "sexpractices" },
  risk_drugs: {no: 18,  type: "radio", options: C.DRUG_USE, section: "sexpractices" },

  sti_history_yesno: {no: 19,  type: "radio", options: C.YES_NO, section: "other" },
  sti_history_which: {no: 19.1,  type: "checkbox", options: C.STI_HISTORY, section: "other" },
  // was checkbox → should be exclusive: radio
  // sti_history_treat:  {no: 19.2,  type: "radio", options: C.YES_NO, section: "other" },
  // consider whether multi-country makes sense:
  sti_history_treat_country: {no: 19.3,  type: "country", section: "other" },

  hep_a_history: {no: 20,  type: "vax4", options: C.YES_NO_UNKNOWN_INF_A, section: "other" },
  hep_b_history: {no: 21,  type: "vax4", options: C.YES_NO_UNKNOWN_INF_B, section: "other" },
  hep_ab_vax: {no: 22,  type: "radio", options: C.YES_NO, section: "other" },
  hep_c_history: {no: 23,  type: "radio", options: C.YES_NO_UNKNOWN, section: "other" },
  // hepC_diag: { type: "radio", options: HCV_THERAPY, section: "other" },
  hep_c_history_tm: {no: 24,  type: "radio", options: C.YES_NO_UNKNOWN, section: "other" },

  // beraterfeld
  // besucher: { type: "besucher_info", section: "berater" },
  besucher_info: {no: 0,  type: "text", section: "berater" },
  besucherkennung: {no: 0, type: "text", section: "berater" },
  postleitzahl_3d: {no: 0, type: "text", section: "berater" },

  testanforderungen: { 
    no: 0,
    type: "checkbox", 
    section: "berater",
    options: [
      // Beratung
      { code: "counsel", labels: { de: "Nur Beratung", en: "Counsel only", tr: "Nur Beratung", uk: "Лише консультація" }, group: "Beratung" },

      // HIV
      { code: "hiv_lab", labels: { de: "HIV Labor", en: "HIV lab test", tr: "HIV Labor", uk: "Лабораторний тест на ВІЛ" }, group: "HIV" },
      { code: "hiv_poc", labels: { de: "HIV Schnelltest", en: "HIV rapid test", tr: "HIV Schnelltest", uk: "Швидкий тест на ВІЛ" }, group: "HIV" },
      // { code: "hiv_lab", labels: { de: "HIV Labor", en: "HIV lab test", tr: "HIV Labor", uk: "Лабораторний тест на ВІЛ" }, group: "HIV" },

      // Syphilis
      { code: "tp", labels: { de: "Syphilis Labor", en: "Syphilis lab", tr: "Sifiliz Labor", uk: "Сифіліс лаб." }, group: "Syphilis" },

      // Gonorrhoe/Chlam
      { code: "go_ct_throat", labels: { de: "Rachen", en: "Rachen", tr: "Rachen", uk: "Rachen" }, group: "Gonorrhoe/Chlamydien" },
      { code: "go_ct_urine", labels: { de: "Urin", en: "Urin", tr: "Urin", uk: "Urin" }, group: "Gonorrhoe/Chlamydien" },
      { code: "go_ct_vag", labels: { de: "Vaginal", en: "Vaginal", tr: "Vaginal", uk: "Vaginal" }, group: "Gonorrhoe/Chlamydien" },
      { code: "go_ct_anal", labels: { de: "Rektal", en: "Rektal", tr: "Rektal", uk: "Rektal" }, group: "Gonorrhoe/Chlamydien" },

      // // Chlamydien
      // { code: "chlam_throat", labels: { de: "Rachen-CHL", en: "Rachen-CHL", tr: "Rachen-CHL", uk: "Rachen-CHL" }, group: "Chlamydien" },
      // { code: "chlam_urine", labels: { de: "Urin-CHL", en: "Urin-CHL", tr: "Urin-CHL", uk: "Urin-CHL" }, group: "Chlamydien" },
      // { code: "chlam_anal", labels: { de: "Rektal-CHL", en: "Rektal-CHL", tr: "Rektal-CHL", uk: "Rektal-CHL" }, group: "Chlamydien" },

      // HAV
      { code: "hav", labels: { de: "HAV", en: "HAV", tr: "HAV", uk: "HAV" }, group: "Hepatitis-Screening" },
      { code: "anti-hbc", labels: { de: "HBV", en: "HBV", tr: "HBV", uk: "HBV" }, group: "Hepatitis-Screening" },
      { code: "hcv", labels: { de: "HCV", en: "HCV", tr: "HCV", uk: "HCV" }, group: "Hepatitis-Screening" }

    ]
  },

  beraterkennung: {no: 0, type: "text", section: "berater" },
  beraterkommentar: {no: 0, type: "textarea", section: "berater" },
};