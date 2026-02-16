import type { Question, Responses, Section } from "./types";
import * as C from "@/i18n/translations";

export const QUESTION_BANK: Question[] = [
  { no: 1, qid: "gender", section: "general", tab: "general", type: "radio", vars: ["gender", "gender_other"], options: C.GENDER },
  // { no: 2, qid: "gender_identity_alignment", section: "general", tab: "general", type: "radio", vars: ["gender_identity_alignment"], options: C.YES_NO },
  // { no: 200, qid: "gender", section: "general", tab: "general", type: "radio", vars: ["gender"], options: C.YES_NO, when: (r: Responses) => r["gender_identity_alignment"] === "no" },

  { no: 2, qid: "orientation", section: "general", tab: "general", type: "radio", vars: ["orientation", "orientation_other"], options: C.ORIENTATION },
  { no: 3, qid: "birth_country", section: "general", tab: "general", type: "country", vars: ["birth_country"] },

  { no: 4, qid: "insurance", section: "general", tab: "general", type: "radio", vars: ["insurance"], options: C.YES_NO },
  { no: 5, qid: "doctor", section: "general", tab: "general", type: "radio", vars: ["doctor"], options: C.YES_NO },
  { no: 6, qid: "hiv_test", section: "general", tab: "general", type: "radio", vars: ["hiv_test"], options: C.YES_NO },

  { no: 7, qid: "risk_type", section: "hiv", tab: "hiv", type: "checkbox", vars: ["risk_type", "risk_type_other"], options: C.HIV_RISK, when: (r: Responses) => r["hiv_test"] === "yes" },
  { no: 8, qid: "prep_use", section: "hiv", tab: "hiv", type: "radio", vars: ["prep_use"], options: C.YES_NO, when: (r: Responses) => r["hiv_test"] === "yes" },
  { no: 9, qid: "hiv_risk_selfest", section: "hiv", tab: "hiv", type: "radio", vars: ["hiv_risk_selfest"], options: C.PERCEIVED_RISK, when: (r: Responses) => r["hiv_test"] === "yes" },

  // { no: 10, qid: "hiv_test_prev", section: "hiv", tab: "hiv", type: "radio", vars: ["hiv_test_prev"], options: C.YES_NO, when: (r: Responses) => r["hiv_test"] === "yes" },

  // extra vars for Q10 when hiv_test_prev === yes
  {
    no: 10,
    qid: "hiv_test_prev",
    section: "hiv",
    tab: "hiv",
    type: "radio",
    vars: ["hiv_test_prev", "hiv_test_prev_count", "hiv_test_prev_year", "hiv_test_prev_confirm"],
    // when: (r: Responses) => r["hiv_test"] === "yes" && r["hiv_test_prev"] === "yes",
    when: (r: Responses) => r["hiv_test"] === "yes",
  },
  { no: 11, qid: "sexual_risk_time", section: "hiv", tab: "hiv", type: "radio", vars: ["sexual_risk_time"], options: C.LAST_RISK_TIME, when: (r: Responses) => r["hiv_test"] === "yes",},
  { no: 12, qid: "risk_country", section: "hiv", tab: "hiv", type: "country", vars: ["risk_country"], when: (r: Responses) => r["hiv_test"] === "yes" },
  { no: 13, qid: "risk_situation", section: "hiv", tab: "hiv", type: "checkbox", vars: ["risk_situation", "risk_situation_other"], options: C.RISK_SITUATION, when: (r: Responses) => r["hiv_test"] === "yes" },

  // sexpractices
  { no: 14, qid: "risk_gv", section: "sexpractices", tab: "sexpractices", type: "radio", vars: ["risk_gv"], options: C.RISK_GV },
  { no: 15, qid: "risk_condom", section: "sexpractices", tab: "sexpractices", type: "radio", vars: ["risk_condom"], options: C.RISK_CONDOM },
  { no: 16, qid: "risk_oral", section: "sexpractices", tab: "sexpractices", type: "yesno", vars: ["risk_oral"], options: C.YES_NO },
  { no: 17, qid: "risk_reasons", section: "sexpractices", tab: "sexpractices", type: "checkbox", vars: ["risk_reasons", "risk_reasons_other"], options: C.CONDOM_REASON },
  { no: 18, qid: "risk_drugs", section: "sexpractices", tab: "sexpractices", type: "radio", vars: ["risk_drugs"], options: C.DRUG_USE },

  // other
  { no: 19, qid: "sti_history_yesno", section: "other",
    tab: "other", type: "custom", vars: ["sti_history_yesno", "sti_history_which", "sti_history_years", "sti_history_which_other"] },

  // { no: 19, qid: "sti_history_yesno", section: "other", tab: "other", type: "radio", vars: ["sti_history_yesno"], options: C.YES_NO },
  // {
  //   no: 19,
  //   qid: "sti_history_yesno",
  //   section: "other",
  //   tab: "other",
  //   type: "custom",
  //   vars: ["sti_history_which", "sti_history_which_other",],// "sti_history_treat_year", "sti_history_treat_country"],
  //   when: (r: Responses) => r["sti_history_yesno"] === "yes",
  // },

  { no: 20, qid: "hep_a_history", section: "other", tab: "other", type: "vax4", vars: ["hep_a_history"], options: C.YES_NO_UNKNOWN_INF_A },
  // { no: 20, qid: "hep_a_history", section: "other", tab: "other", type: "text", vars: ["hep_a_infection_year"], when: (r: Responses) => r["hep_a_history"] === "infection" },

  { no: 21, qid: "hep_b_history", section: "other", tab: "other", type: "vax4", vars: ["hep_b_history"], options: C.YES_NO_UNKNOWN_INF_B },
  // { no: 21, qid: "hep_b_history", section: "other", tab: "other", type: "text", vars: ["hep_b_infection_year"], when: (r: Responses) => r["hep_b_history"] === "infection" },

  // { no: 22, qid: "hep_ab_vax", section: "other", tab: "other", type: "radio", vars: ["hep_ab_vax"], options: C.YES_NO, when: (r: Responses) => r["hep_b_history"] === "unknown" || r["hep_a_history"] === "unknown" },

  // { no: 23, qid: "hep_c_history", section: "other", tab: "other", type: "radio", vars: ["hep_c_history"], options: C.YES_NO_UNKNOWN },
  // { no: 24, qid: "hep_c_history_tm", section: "other", tab: "other", type: "radio", vars: ["hep_c_history_tm"], options: C.YES_NO_UNKNOWN, when: (r: Responses) => r["hep_c_history"] === "yes" },

  // staff / berater fields (no=0 so they won’t count as “questionnaire questions” unless you choose to)
  { no: 0, qid: "besucher_info", section: "berater", tab: "berater", type: "text", vars: ["besucher_info"] },
  { no: 0, qid: "besucherkennung", section: "berater", tab: "berater", type: "text", vars: ["besucherkennung"] },
  { no: 0, qid: "plz", section: "berater", tab: "berater", type: "text", vars: ["plz"] },

  { no: 0, qid: "testanforderungen", section: "berater", tab: "berater", type: "checkbox", vars: ["testanforderungen"], options: C.TESTANFORDERUNGEN },

  { no: 0, qid: "beraterkennung", section: "berater", tab: "berater", type: "text", vars: ["beraterkennung"] },
  { no: 0, qid: "beraterkommentar", section: "berater", tab: "berater", type: "textarea", vars: ["beraterkommentar"] },
];

export const QUESTION_BY_QID = Object.fromEntries(
  QUESTION_BANK.map((q) => [q.qid, q])
) as Record<string, Question>;

export const qidsBySection = (
  section: Section,
  opts?: { includeNo0?: boolean }
) => {
  // beraterfeld extrawurst
  if (section === "berater") {
    const allowed = new Set([
      "besucherkennung",
      "plz",
      "testanforderungen",
      "beraterkennung",
    ]);

    return QUESTION_BANK
      .filter((q) => q.section === section && allowed.has(q.qid))
      .map((q) => q.qid);
  }

  // default
  return QUESTION_BANK
    .filter(
      (q) =>
        q.section === section &&
        (opts?.includeNo0 ? true : q.no !== 0)
    )
    .map((q) => q.qid);
};

// export const qidsBySection = (section: Section, opts?: { includeNo0?: boolean }) =>
//   QUESTION_BANK
//     .filter((q) => q.section === section && (opts?.includeNo0 ? true : q.no !== 0))
//     .map((q) => q.qid);
