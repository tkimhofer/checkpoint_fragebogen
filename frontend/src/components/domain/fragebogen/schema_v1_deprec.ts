// Fragebogenschema
// QUESTIONS: listet Fragen und konditionale Fragelogik
// Mapping von qid -> Frage durch Datei `translations.ts`
// information wird genutzt um die Übersicht für den Berater zu erstellen (welche Fragen wurden nicht beantwortet)...und
// ...um all variablen zusammenzustellen die dann exportiert werdeb (payload)

export type Qid = string;
export type VarKey = string;

export type ResponseValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | undefined;

export type WhenFn = (responses: Record<string, ResponseValue>) => boolean;

export type QuestionDef = {
  no: number,
  qid: Qid;
  tab: "general" | "history" | "risk" | string;

  /** Which response keys belong to this question (including extra vars) */
  vars: VarKey[];

  /** Whether this question (and its vars) are applicable */
  when?: WhenFn;

  /** Optional: how to label values for payload (when not using R.Q options) */
//   labelOf?: Partial<Record<VarKey, (val: any, lang: string) => any>>;
};


export const QUESTIONS: QuestionDef[] = [
    /// no: question number in questionnaire
    /// qid: variable defining question in file `translations.ts`
    /// tab: ui tab for resp. question
    /// vars?: variable(s) to include in payload for writing/exporting
    /// when?: if function is provided and returns true, then varabiels in `vars` are included (conditional logic implementation)
  {
    no: 1,
    qid: "gender",
    tab: "general",
    vars: ["gender"],
  },
  {
    no: 2,
    qid: "orientation",
    tab: "general",
    vars: ["orientation"],
  },
  {
    no: 3,
    qid: "birth_country",
    tab: "general",
    vars: ["birth_country"], // only one var
  },
  {
    no: 4,
    qid: "insurance",
    tab: "general",
    vars: ["insurance"],
  },
  {
    no: 5,
    qid: "doctor",
    tab: "general",
    vars: ["doctor"],
  },
   {
    no: 6,
    qid: "hiv_test",
    tab: "general",
    vars: ["hiv_test"],
  },
  {
    no: 7,
    qid: "risk_type",
    tab: "hiv",
    vars: ["risk_type"],
    when: (r) => r["hiv_test"] === "yes",
  },
  {
    no: 8,
    qid: "prep_use",
    tab: "hiv",
    vars: ["prep_use"],
    when: (r) => r["hiv_test"] === "yes",
  },
  {
    no: 9,
    qid: "hiv_risk_selfest",
    tab: "hiv",
    vars: ["hiv_risk_selfest"],
    when: (r) => r["hiv_test"] === "yes",
  },
  {
    no: 10,
    qid: "hiv_test_prev",
    tab: "hiv",
    vars: ["hiv_test_prev"],
    when: (r) => r["hiv_test"] === "yes",
  },
  {
    no: 10,
    qid: "hiv_test_prev",
    tab: "hiv",
    vars: ["hiv_test_prev_count", "hiv_test_prev_year", "hiv_test_prev_confirm"],
    when: (r) => r["hiv_test"] === "yes" && r["hiv_test_prev"] === "yes",
  },
  {
    no: 11,
    qid: "sexual_risk_time",
    tab: "hiv",
    vars: ["sexual_risk_time"],
  },

  {
    no: 12,
    qid: "risk_country",
    tab: "hiv",
    vars: ["risk_country"],
    when: (r) => r["hiv_test"] === "yes",
  },
  {
    no: 13,
    qid: "risk_situation",
    tab: "hiv",
    vars: ["risk_situation"],
    when: (r) => r["hiv_test"] === "yes",
  },
    {
    no: 14,
    qid: "risk_gv",
    tab: "sexpractices",
    vars: ["risk_gv"],
  },
  {
    no: 15,
    qid: "risk_condom",
    tab: "sexpractices",
    vars: ["risk_condom"],
  },
    {
    no: 16,
    qid: "risk_oral",
    tab: "sexpractices",
    vars: ["risk_oral"],
  },
  {
    no: 17,
    qid: "risk_reasons",
    tab: "sexpractices",
    vars: ["risk_reasons"],
  },
  {
    no: 18,
    qid: "risk_drugs",
    tab: "sexpractices",
    vars: ["risk_drugs"],
  },
  {
    no: 19,
    qid: "sti_history_yesno",
    tab: "other",
    vars: ["sti_history_yesno"],
  },
  {
    no: 19,
    qid: "sti_history_yesno",
    tab: "other",
    vars: ["sti_history_which", "sti_history_treat_year", "sti_history_treat_country"],
    when: (r) => r["sti_history_yesno"] === "yes",
  },
  {
    no: 20,
    qid: "hep_a_history",
    tab: "other",
    vars: ["hep_a_history"],
  },
  {
    no: 20,
    qid: "hep_a_history",
    tab: "other",
    vars: ["hep_a_infection_year"],
    when: (r) => r["hep_a_history"] === "infection",
  },
  {
    no: 21,
    qid: "hep_b_history",
    tab: "other",
    vars: ["hep_b_history"],
  },
  {
    no: 21,
    qid: "hep_b_history",
    tab: "other",
    vars: ["hep_b_infection_year"],
    when: (r) => r["hep_b_history"] === "infection",
  },
  {
    no: 22,
    qid: "hep_ab_vax",
    tab: "other",
    vars: ["hep_ab_vax"],
    when: (r) => (r["hep_b_history"] === "unknown" || r["hep_a_history"] === "unknown")
  },
  {
    no: 23,
    qid: "hep_c_history",
    tab: "other",
    vars: ["hep_c_history"],
  },
  {
    no: 24,
    qid: "hep_c_history_tm",
    tab: "other",
    vars: ["hep_c_history_tm"],
    when: (r) => r["hep_c_history"] === "yes",
  },
];

// 
export function buildCsvHeaderWithVar(questions: QuestionDef[]): string[] {
  const seenVar = new Set<string>();
  const header: string[] = [];

  for (const q of questions) {
    for (const v of q.vars ?? []) {
      if (seenVar.has(v)) continue;
      seenVar.add(v);
      header.push(`frage_${q.no}__${v}`);
    }
  }
  return header;
}

export function getRelevantVars(responses: Record<string, any>) {
  return QUESTIONS
    .filter(q => (q.when ? q.when(responses) : true))
    .flatMap(q => q.vars);
}

export function getVarsWithQuestionNo(
  responses: Record<string, any>
) {
  return QUESTIONS
    .filter(q => (q.when ? q.when(responses) : true))
    .flatMap(q =>
      q.vars.map(v => ({
        questionNo: q.no,
        var: v,
      }))
    );
}