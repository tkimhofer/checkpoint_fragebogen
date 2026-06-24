import React from "react";
import clsx from "clsx";

type Lang = "de" | "en" | "tr" | "uk";
const T = {
  de: { no: "Nein", yes: "Ja:", insertive: "aktiv", receptive: "passiv", both: "beides" },
  en: { no: "No",   yes: "Yes:", insertive: "insertive", receptive: "receptive", both: "both" },
  tr: { no: "Hayır", yes: "Evet:", insertive: "aktif", receptive: "pasif", both: "ikisi" },
  uk: { no: "Ні",    yes: "Так:", insertive: "інсертивно", receptive: "рецептивно", both: "обидва" },
} as const;

export function YesNoSeparatedChips({
  lang,
  value,
  onChange,
  className,
}: {
  lang: Lang;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const t = T[lang] ?? T.de;

  const Chip = ({ v, label }: { v: string; label: string }) => {
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
  const isYes = value && value !== "no";


  return (
    <div className={clsx("flex items-center", className)}>
      <div className="inline-flex overflow-hidden rounded-lg border">
        <Chip v="no" label={t.no} />
      </div>

      <div style={{ width: 16 }} aria-hidden />
      <span
        className={clsx(
          "inline-flex items-center px-3 py-1 text-sm rounded-md",
          isYes
            ? "font-semibold text-foreground bg-muted"
            : "text-muted-foreground"
        )}
      >
        {t.yes}
      </span>
      <div style={{ width: 8 }} aria-hidden />

      <div className="inline-flex overflow-hidden rounded-lg border" role="group" aria-label="Ja-Optionen">
        <div className="flex">
          <div className="border-r">
            <Chip v="yes_insertive" label={t.insertive} />
          </div>
          <div className="border-r">
            <Chip v="yes_receptive" label={t.receptive} />
          </div>
          <div>
            <Chip v="yes_both" label={t.both} />
          </div>
        </div>
      </div>
    </div>
  );
}
