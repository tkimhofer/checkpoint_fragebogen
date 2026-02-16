import * as React from "react";

// NEW: translations live in /src/i18n
import type { Lang } from "@/i18n/translations";

// NEW: question bank + types live in /domain/fragebogen
import { QUESTION_BANK } from "@/components/domain/fragebogen/bank";
import type {Responses } from "@/components/domain/fragebogen/types";
import { isApplicable, isEmptyAnswer } from "@/components/domain/fragebogen/derive";
import { titleFor } from "@/components/domain/fragebogen/i18n";

// type Responses = Record<string, ResponseValue>;

export function questionTitle(qid: string, lang: Lang) {
  return titleFor(qid, lang) ?? qid;
}

export type QuestionGroup = {
  no: number;
  qid: string;
  questionText: string;
  answers: { var: string; value: unknown }[];
};

function isMissingValue(v: unknown): boolean {
  // Treat skipped as “missing” for display grouping if you want;
  // If you want skipped to still count as answered, remove this.
  if (v === "pnr") return true;
  if (Array.isArray(v) && v.length === 1 && v[0] === "pnr") return true;

  // align with derive.ts semantics
  return isEmptyAnswer(v);
}


export type AnswerRow = {
  no: number;
  qid: string;
  questionText: string;
  var: string;
  value: unknown;
};

export function buildAnswerRows(responses: Responses, lang: Lang): AnswerRow[] {
  const rows: AnswerRow[] = [];

  for (const q of QUESTION_BANK) {
    if (!isApplicable(q, responses)) continue;

    for (const v of q.vars ?? []) {
      rows.push({
        no: q.no,
        qid: q.qid,
        questionText: questionTitle(q.qid, lang),
        var: v,
        value: responses[v],
      });
    }
  }

  // dedup
  const key = (r: AnswerRow) => `${r.no}::${r.qid}::${r.var}`;
  const dedup = new Map<string, AnswerRow>();
  for (const r of rows) dedup.set(key(r), r);

  return [...dedup.values()].sort(
    (a, b) => a.no - b.no || a.var.localeCompare(b.var)
  );
}




function ValueInline({ value }: { value: unknown }) {
  if (value === null) return <span className="text-muted-foreground">null</span>;
  if (value === undefined) return <span className="text-muted-foreground">—</span>;
  if (typeof value === "boolean") return <span>{value ? "true" : "false"}</span>;
  if (typeof value === "number") return <span>{value}</span>;
  if (typeof value === "string")
    return <span className="break-words">{value.length ? value : "—"}</span>;

  // nested object/array -> compact JSON (still dense)
  return (
    <code className="block max-h-32 overflow-auto rounded bg-muted px-2 py-1 text-xs">
      {JSON.stringify(value)}
    </code>
  );
}


export function KeyValueDenseList({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);
  if (!entries.length) return null;

  return (
    <dl className="rounded-md border bg-card text-xs">
      {entries.map(([k, v]) => (
        <div
          key={k}
          className="grid grid-cols-[160px_1fr] gap-2 px-2 py-1.5 even:bg-muted/30"
        >
          <dt className="truncate font-medium text-muted-foreground" title={k}>
            {k}
          </dt>
          <dd className="min-w-0">
            <ValueInline value={v} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

type Jsonish =
  | null
  | boolean
  | number
  | string
  | Jsonish[]
  | { [key: string]: Jsonish };

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function ValueView({ value }: { value: unknown }) {
  if (value === null) return <span className="text-muted-foreground">null</span>;
  if (value === undefined) return <span className="text-muted-foreground">—</span>;
  if (typeof value === "string") return <span className="break-words">{value}</span>;
  if (typeof value === "number" || typeof value === "boolean") return <span>{String(value)}</span>;

  // Arrays / objects: pretty JSON
  return (
    <pre className="max-h-64 overflow-auto rounded border bg-muted p-3 text-xs">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function KeyValueTable({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return <div className="text-sm text-muted-foreground">Keine Daten in „pl“.</div>;
  }

  return (
    <dl className="rounded border bg-card">
      {entries.map(([k, v]) => (
        <div
          key={k}
          className="grid grid-cols-1 gap-2 border-b p-3 last:border-b-0 sm:grid-cols-[220px_1fr]"
        >
          <dt className="text-xs font-medium text-muted-foreground">{k}</dt>
          <dd className="text-sm">
            <ValueView value={v} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
