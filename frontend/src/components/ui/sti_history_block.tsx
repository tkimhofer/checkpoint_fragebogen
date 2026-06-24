import React from "react";
import clsx from "clsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { YesNoChips } from "@/components/ui/yesNoChips";
import { Button } from "@/components/ui/button";

type Lang = "de" | "en" | "tr" | "uk";
export type Opt = { code: string; labels: Record<Lang, string> };

const OTHER_CODE = "other" as const;
const LINK_MUTED = "text-muted-foreground hover:text-foreground";

type Responses = Record<string, any>;

function clampYearText(v: string) {
  const s = v.replace(/[^\d]/g, "").slice(0, 4);
  return s;
}


export function StiHistoryBlock({
  lang,
  qno,
  title,
  stiOptions,
  responses,
  setResponses,
  indentClass = "",
  onSkip,
  skipLabel,
}: {
  lang: Lang;
  qno: number;
  title: string; 
  stiOptions: Opt[];
  responses: Responses;
  setResponses: React.Dispatch<React.SetStateAction<Responses>>;
  indentClass?: string;
  onSkip?: () => void;
  skipLabel?: string;
}) {
  const yesno = (responses["sti_history_yesno"] as "yes" | "no" | "" | undefined) ?? "";
  const which = (responses["sti_history_which"] as string[] | undefined) ?? [];
  const years = (responses["sti_history_years"] as Record<string, string> | undefined) ?? {};
  const otherText = (responses["sti_history_which_other"] as string | undefined) ?? "";

  const setYear = (code: string, year: string) => {
    setResponses(prev => ({
      ...prev,
      sti_history_years: { ...(prev.sti_history_years ?? {}), [code]: clampYearText(year) },
    }));
  };

  const clearAllDependents = (prev: Responses) => {
    const next = { ...prev };
    next["sti_history_which"] = [];
    delete next["sti_history_which_other"];
    delete next["sti_history_years"];
    return next;
  };

  const toggleWhich = (code: string, checked: boolean) => {
    setResponses(prev => {
      const curr = new Set<string>(Array.isArray(prev["sti_history_which"]) ? prev["sti_history_which"] : []);
      const nextYears: Record<string, string> = { ...(prev["sti_history_years"] ?? {}) };
      const next: Responses = { ...prev };

      if (checked) {
        curr.add(code);
        if (!(code in nextYears)) nextYears[code] = "";
      } else {
        curr.delete(code);
        delete nextYears[code];

        if (code === OTHER_CODE) {
          delete next["sti_history_which_other"];
        }
      }

      next["sti_history_which"] = Array.from(curr);
      if (Object.keys(nextYears).length) next["sti_history_years"] = nextYears;
      else delete next["sti_history_years"];

      return next;
    });
  };

  const selectedHasAny = which.length > 0;

  const yearLabel = {
    de: "Jahr der Infektion",
    en: "Year of infection",
    tr: "Enfeksiyon yılı",
    uk: "Рік інфекції",
  } as const;

  const yearPlaceholder = {
    de: "z. B. 2021",
    en: "e.g. 2021",
    tr: "örn. 2021",
    uk: "напр. 2021",
  } as const;

  const otherPlaceholder = {
    de: "Bitte angeben…",
    en: "Please specify…",
    tr: "Lütfen belirt…",
    uk: "Будь ласка, вкажи…",
  } as const;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">
          {qno}. {title}
        </h3>

        {onSkip && (
          <Button variant="link" size="sm" className={LINK_MUTED} onClick={onSkip}>
            {skipLabel ?? (lang === "de" ? "Möchte ich nicht sagen" : "Prefer not to say")}
          </Button>
        )}
      </div>

      <div className={indentClass}>
        <YesNoChips
          lang={lang}
          value={yesno}
          onChange={(next) =>
            setResponses(prev =>
              next === "yes"
                ? { ...prev, sti_history_yesno: "yes" }
                : clearAllDependents({ ...prev, sti_history_yesno: "no" })
            )
          }
        />
      </div>

      {yesno === "yes" && (
        <div className={clsx(indentClass, "mt-4 space-y-4")}>
          <div>
            <h4 className="mb-2 font-medium">
              {lang === "de" ? "Welche STI?" : "Which STI?"}
            </h4>

            <div className="flex flex-col space-y-2">
              {stiOptions.map(opt => {
                const checked = which.includes(opt.code);
                const showYear = checked && opt.code !== OTHER_CODE;
                const yr = years?.[opt.code] ?? "";

                return (
                  <div key={`sti-${opt.code}`} className="rounded-md border border-transparent">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        id={`sti-${opt.code}`}
                        checked={checked}
                        onCheckedChange={(c) => toggleWhich(opt.code, c === true)}
                      />
                      <span>{opt.labels[lang] ?? opt.code}</span>
                    </label>

                    {showYear && (
                      <div className="mt-2 ml-6 max-w-[220px]">
                        <div className="text-xs text-muted-foreground mb-1">{yearLabel[lang]}</div>
                        <Input
                          value={yr}
                          placeholder={yearPlaceholder[lang]}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => setYear(opt.code, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {which.includes(OTHER_CODE) && (
              <div className="mt-3 ml-6 space-y-2 max-w-[420px]">
                <Input
                  value={otherText}
                  placeholder={otherPlaceholder[lang]}
                  onChange={(e) =>
                    setResponses(p => ({
                      ...p,
                      sti_history_which_other: e.target.value
                    }))
                  }
                />
                <div className="max-w-[220px]">
                  <div className="text-xs text-muted-foreground mb-1">
                    {yearLabel[lang]}
                  </div>
                  <Input
                    value={years?.[OTHER_CODE] ?? ""}
                    placeholder={yearPlaceholder[lang]}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => setYear(OTHER_CODE, e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {!selectedHasAny && (
            <p className="text-xs text-muted-foreground">
              {lang === "de"
                ? "Wenn Du „Ja“ auswählst, bitte mindestens eine STI auswählen."
                : "If you select “Yes”, please choose at least one STI."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
