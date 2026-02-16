import * as C from "@/i18n/translations";
import { QUESTION_BY_QID } from "./bank";
import type { Lang, Question, ResponseValue } from "./types";

export function titleFor(qid: string, lang: Lang) {
  return C.QTITLE[qid]?.[lang] ?? qid;
}

export function questionNo(qid: string) {
  return QUESTION_BY_QID[qid]?.no ?? 0;
}

export function optionsFor(q: Question | undefined, lang: Lang) {
  if (!q?.options) return [];
  return q.options.map((o) => ({ value: o.code, label: o.labels[lang] ?? o.code }));
}

/** Map stored codes -> human label (if options exist), otherwise string fallback */
export function displayValue(qidOrVar: string, value: ResponseValue, lang: Lang) {
  if (value == null) return "—";
  if (typeof value === "object" && (value as any)._state === "missing") return "—";

  const q = QUESTION_BY_QID[qidOrVar];

  // array values (checkbox)
  if (Array.isArray(value)) {
    const labels = value.map((code) => {
      const opt = q?.options?.find((o) => o.code === code);
      return opt?.labels?.[lang] ?? code;
    });
    return labels.join(", ");
  }

  // scalar code
  if (typeof value === "string" && q?.options) {
    const opt = q.options.find((o) => o.code === value);
    if (opt) return opt.labels[lang] ?? value;
  }

  return String(value);
}
