import type {Opt, Lang} from "./translations";
import * as C from "./translations";
import * as R from "./question_registry";

// mapping answering options / labels if not 'prefer not to say' / 'möchte nicht antworten'
export function optionsFor(opts: Opt[], lang: Lang) {
  return opts.filter(o => o.code !== "pnr").map(o => ({ value: o.code, label: o.labels[lang] ?? o.code }));
}

// return title of question in resp. language (if exists)
export const questionNo = (qid: string) => R.Q[qid]?.no ?? 0;

// return title of question in resp. language (if exists)
export const titleFor = (qid: string, lang: Lang) => C.QTITLE[qid]?.[lang] ?? qid;
// map code → localized label; safe when no options (text)
export const labelFor = (qid: string, code: string, lang: Lang) => {
  const opt = R.Q[qid]?.options?.find(o => o.code === code);
  return opt?.labels?.[lang] ?? code;
};

// export function isSkipped(
//     qid: string
// ): boolean {
//     const v = responses[qid];
//     return v === "pnr" || (Array.isArray(v) && v.length === 1 && v[0] === "pnr");
// }

//   function skipQuestion(qid: string) {
//     const def = R.Q[qid];
//     setBackup(prev => ({ ...prev, [qid]: responses[qid] }));
//     setResponses(prev => {
//     const next: Record<string, any> = {
//     ...prev,
//     [qid]: (def.type === "radio" || def.type === "country" || def.type === "yesno" || def.type === "vax4")
//     ? "pnr"
//     : ["pnr"],
//     };
//     if (def.type === "vax4") delete next[`${qid}_infection_year`];
//     return next;
//   });
//     // setResponses(prev => ({ ...prev, [qid]: (def.type === "radio"  || def.type === "country" || def.type === "yesno") ? "pnr" : ["pnr"] }));
//   }

//   function unskipQuestion(qid: string) {
//     setResponses(prev => {
//       const next = { ...prev };
//       if (Object.prototype.hasOwnProperty.call(backup, qid)) next[qid] = backup[qid];
//       else delete next[qid];
//       return next;
//     });
//     setBackup(prev => {
//       const { [qid]: _, ...rest } = prev;
//       return rest;
//     });
//   }