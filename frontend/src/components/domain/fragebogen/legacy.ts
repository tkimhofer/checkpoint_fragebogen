import type { Lang, Responses } from "./types";
import { QUESTION_BANK } from "./bank";
import { isApplicable, isMissingState, isEmptyAnswer, isSkipped } from "./derive";
import { titleFor } from "./i18n";

export type QuestionGroup = {
  no: number;
  qid: string;
  questionText: string;
  answers: { var: string; value: unknown }[];
};

// old-style QUESTION defs (kept for backwards-compat)
export const QUESTIONS = QUESTION_BANK.map((q) => ({
  no: q.no,
  qid: q.qid,
  tab: q.tab ?? q.section ?? "general",
  vars: q.vars,
  when: q.when,
}));

// if old code needs these types, re-export from types.ts
export * from "./types";

export function buildQuestionGroups(responses: Responses, lang: Lang): QuestionGroup[] {
  const map = new Map<string, QuestionGroup>();

  for (const q of QUESTIONS) {
    if (!isApplicable(q as any, responses)) continue;

    const answers = (q.vars ?? []).map((v) => ({ var: v, value: responses[v] }));

    // exclude question if ALL vars are "missing/empty/skipped"
    const hasAnyRealAnswer = answers.some((a) => {
      const v = a.value;
      if (isMissingState(v)) return false;
      if (isSkipped(v)) return false;
      return !isEmptyAnswer(v);
    });
    if (!hasAnyRealAnswer) continue;

    const key = `${q.no}::${q.qid}`;
    const group =
      map.get(key) ??
      ({
        no: q.no,
        qid: q.qid,
        questionText: titleFor(q.qid, lang),
        answers: [],
      } satisfies QuestionGroup);

    for (const a of answers) {
      if (!group.answers.some((x) => x.var === a.var)) group.answers.push(a);
    }

    map.set(key, group);
  }

  return [...map.values()].sort((a, b) => a.no - b.no);
}
