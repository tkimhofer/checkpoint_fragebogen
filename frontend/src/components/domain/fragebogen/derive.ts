import type { Question, Responses} from "./types";
import { QUESTION_BANK } from "./bank";
import { OTHER_CODE } from "@/workspaces/BeraterWorkspace";

export const isMissingState = (v: unknown): v is { _state: "missing" } =>
  !!v && typeof v === "object" && (v as any)._state === "missing";

export const isSkipped = (v: unknown) =>
  v === "pnr" || (Array.isArray(v) && v.length === 1 && v[0] === "pnr");

export const isEmptyAnswer = (v: unknown) => {
  if (isMissingState(v)) return true;
  if (v == null) return true;
  if (typeof v === "string") return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  return false;
};

export function isApplicable(q: Question, responses: Responses) {
  return q.when ? q.when(responses) : true;
}

function isOtherSelected(baseVar: string, responses: Responses) {
  const v = responses[baseVar];

  // checkbox style: ["foo","other"]
  if (Array.isArray(v)) return v.includes(OTHER_CODE);

  // radio style: "other"
  return v === OTHER_CODE;
}

function isVarRelevant(varName: string, responses: Responses) {
  if (varName === "besucher_info" || varName === "beraterkommentar") return false;

  const stiYes = responses["sti_history_yesno"] === "yes";
  const stiWhich = Array.isArray(responses["sti_history_which"])
    ? (responses["sti_history_which"] as string[])
    : [];

  // STI: "which" only relevant if yesno === yes
  if (varName === "sti_history_which") {
    return stiYes;
  }

  // STI: years only relevant if yesno === yes AND at least one STI selected
  if (varName === "sti_history_years") {
    return stiYes && stiWhich.length > 0;
  }

  // STI: free text only relevant if yesno === yes AND "other" selected
  if (varName === "sti_history_which_other") {
    return stiYes && stiWhich.includes("other");
  }

  // generic "_other" fields
  if (varName.endsWith("_other")) {
    const base = varName.slice(0, -"_other".length);
    return isOtherSelected(base, responses);
  }

  // HIV prev details only if prev === yes
  if (
    varName === "hiv_test_prev_count" ||
    varName === "hiv_test_prev_year" ||
    varName === "hiv_test_prev_confirm"
  ) {
    return responses["hiv_test_prev"] === "yes";
  }

  return true;
}


// function isVarRelevant(varName: string, responses: Responses) {
//   // only relevant if base var selected OTHER
//   if (varName.endsWith("_other")) {
//     const base = varName.slice(0, -"_other".length);
//     return isOtherSelected(base, responses);
//   }

//   const prev = (responses["hiv_test_prev"] ?? "") as string;
//   if (
//       varName === "hiv_test_prev_count" ||
//       varName === "hiv_test_prev_year" ||
//       varName === "hiv_test_prev_confirm"
//   ) {
//       return prev === "yes";
//   }

//   const prev1 = (responses["sti_history_yesno"] ?? "") as string;
//   if (
//       varName === "sti_history_which" ||
//       varName === "sti_history_years" ||
//       varName === "sti_history_which_other"
//   ) {
//       return prev1 === "yes";
//   }

//   if (varName === "besucher_info" || varName === "beraterkommentar") {
//     return false;
//   }

//   return true;
// }


export function getRelevantQuestions(responses: Responses, bank: Question[] = QUESTION_BANK) {
  return bank.filter((q) => isApplicable(q, responses));
}

export function getVarsWithQuestionNo(responses: Responses, bank: Question[] = QUESTION_BANK) {
  return getRelevantQuestions(responses, bank).flatMap((q) =>
    q.vars
      .filter((v) => isVarRelevant(v, responses)) // ✅ <— key change
      .map((v) => ({
        questionNo: q.no,
        qid: q.qid,
        var: v,
      }))
  );
}
// export function getVarsWithQuestionNo(responses: Responses, bank: Question[] = QUESTION_BANK) {
//   return getRelevantQuestions(responses, bank).flatMap((q) =>
//     q.vars.map((v) => ({
//       questionNo: q.no,
//       qid: q.qid,
//       var: v,
//     }))
//   );
// }

/** For payload: drop empty + drop {_state:"missing"} entirely */
export function buildPayloadData(responses: Responses, bank: Question[] = QUESTION_BANK) {
  const vars = getVarsWithQuestionNo(responses, bank);

  return Object.fromEntries(
    vars
      .map(({ var: key }) => {
        const val = responses[key];
        if (isEmptyAnswer(val)) return null;

        // keep arrays as arrays in the payload (recommended),
        // OR stringify if your backend expects strings
        return [key, val];
      })
      .filter(Boolean) as [string, unknown][]
  );
}

// type Responses = Record<string, unknown>;
// type Question = {
//   var: string;
//   type?: "text" | "textarea" | "radio" | "checkbox" | string;
//   // optionally options, etc
// };

export function rehydrateResponsesFromPayloadData(
  payloadData: Record<string, unknown>,
  bank: Question[] = QUESTION_BANK
): Responses {
  // Pass 1: start from payload
  const out: Responses = { ...(payloadData ?? {}) } as Responses;

  // Pass 2: fill defaults + normalize only for relevant questions
  const relevant = getRelevantQuestions(out, bank);

  for (const q of relevant) {
    for (const key of q.vars) {
      const k = key as unknown as string;
      const raw = out[k];

      if (raw === undefined) {
        out[k] = (q.type === "checkbox" ? [] : "") as any;
        continue;
      }

      if (q.type === "checkbox") {
        if (Array.isArray(raw)) out[k] = raw as any;
        else if (raw == null || raw === "") out[k] = [] as any;
        else out[k] = [String(raw)] as any;
        continue;
      }

      out[k] = (raw == null ? "" : raw) as any;
    }
  }

  return out;
}



// const payloadData = entry.payload.data; // from API
// setResponses(rehydrateResponsesFromPayloadData(payloadData));