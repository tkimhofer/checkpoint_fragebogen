import type { Opt } from "@/i18n/translations";

export type Lang = "de" | "en" | "tr" | "uk";

export type Qid = string;
export type VarKey = string;

export type ResponseValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | undefined
  | { _state: "missing" };

export type Responses = Record<string, ResponseValue>;

export type QType =
  | "radio"
  | "checkbox"
  | "text"
  | "textarea"
  | "country"
  | "yesno"
  | "vax4"
  | "custom";

export type Section =
  | "general"
  | "hiv"
  | "sexpractices"
  | "other"
  | "summary"
  | "berater";

export type WhenFn = (responses: Responses) => boolean;

export type Question = {
  no: number;
  qid: Qid;
  section: Section;
  tab: string;

  type: QType;
  vars: VarKey[];
  options?: Opt[];
  placeholder?: Partial<Record<Lang, string>>;
  when?: WhenFn;
};
