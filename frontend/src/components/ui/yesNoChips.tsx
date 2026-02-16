import React from "react";
import clsx from "clsx";

type Lang = "de" | "en" | "tr" | "uk";
const T = {
  de: { yes: "Ja",   no: "Nein" },
  en: { yes: "Yes",  no: "No" },
  tr: { yes: "Evet", no: "Hayır" },
  uk: { yes: "Так",  no: "Ні" },
} as const;

export function YesNoChips({
  lang,
  value,                 // "yes" | "no" | ""
  onChange,
  className,
}: {
  lang: Lang;
  value: string;
  onChange: (v: "yes" | "no") => void;
  className?: string;
}) {
  const t = T[lang] ?? T.de;

  const Btn = ({ v, label }: { v: "yes" | "no"; label: string }) => {
    const selected = value === v;
    return (
      <button
        type="button"
        className={clsx(
          "px-3 py-1 text-sm",
          selected ? "bg-black text-white" : "bg-white hover:bg-gray-50"
        )}
        aria-pressed={selected}
        onClick={() => onChange(v)}
      >
        {label}
      </button>
    );
  };

  return (
    <div role="group" aria-label="Ja / Nein"
         className={clsx("inline-flex overflow-hidden rounded-lg border", className)}>
      {/* Place Nein first to reduce accidental positive taps */}
      <div className="border-r"><Btn v="no" label={t.no} /></div>
      <Btn v="yes" label={t.yes} />
    </div>
  );
}
