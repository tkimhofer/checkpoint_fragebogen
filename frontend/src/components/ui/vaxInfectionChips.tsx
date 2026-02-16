
import React from "react";
import clsx from "clsx";
import type { Lang } from "@/components/domain/fragebogen/types"; // or "@/i18n/translations" if Lang lives there

export function VaxInfectionChips({
  lang, value, onChange, year, onYearChange, className,
}: {
  lang: Lang;
  value: "yes" | "no" | "unknown" | "infection" | "";
  onChange: (v: "yes" | "no" | "unknown" | "infection") => void;
  year: string;                 // keep it string for controlled input
  onYearChange: (y: string) => void;
  className?: string;
}) {
  const t = {
    yes: { de: "Ja", en: "Yes", tr: "Evet", uk: "Так" },
    no: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" },
    dk: { de: "Weiß nicht", en: "Don't know", tr: "Bilmiyorum", uk: "Не знаю" },
    inf: { de: "Ich hatte eine Infektion", en: "I had an infection", tr: "Enfeksiyon geçirdim", uk: "Я мав/мала інфекцію" },
    yearPh: { de: "Jahr", en: "Year", tr: "Yıl", uk: "Рік" },
  } as const;

  const Btn = ({ v, label }: { v: "yes" | "no" | "unknown" | "infection"; label: string }) => {
    const selected = value === v;
    return (
      <button
        type="button"
        onClick={() => onChange(v)}
        aria-pressed={selected}
        className={clsx(
          "px-3 py-1 text-sm whitespace-nowrap flex-none",
          selected ? "bg-black text-white" : "bg-white hover:bg-gray-50"
        )}
      >
        {label}
      </button>
    );
  };

  const currYear = new Date().getFullYear();

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <div role="group" className="inline-flex w-fit overflow-hidden rounded-lg border divide-x">
        <Btn v="no" label={t.no[lang]} />
        <Btn v="yes" label={t.yes[lang]} />
        <Btn v="unknown" label={t.dk[lang]} />
        <Btn v="infection" label={t.inf[lang]} />
      </div>

      {value === "infection" && (
        <div className="max-w-[220px]">
          <input
            type="text"               // <-- better than number for controlled input + empty string
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={t.yearPh[lang]}
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full rounded-md border px-3 py-1.5 text-sm"
            aria-label={t.yearPh[lang]}
          />
          {/* optionally validate display here */}
          {/* <div className="mt-1 text-xs text-muted-foreground">
            {`1900–${currYear}`}
          </div> */}
        </div>
      )}
    </div>
  );
}



// import React from "react";
// import clsx from "clsx";

// type Lang = "de" | "en" | "tr" | "uk";
// const T = {
//   de: { yes: "Ja", no: "Nein", dk: "Weiß nicht", inf: "Ich hatte eine Infektion", yearPh: "Jahr" },
//   en: { yes: "Yes", no: "No", dk: "Don't know", inf: "I had an infection", yearPh: "Year" },
//   tr: { yes: "Evet", no: "Hayır", dk: "Bilmiyorum", inf: "Enfeksiyon geçirdim", yearPh: "Yıl" },
//   uk: { yes: "Так", no: "Ні", dk: "Не знаю", inf: "Я мав/мала інфекцію", yearPh: "Рік" },
// } as const;

// export function VaxInfectionChips({
//   lang, value, onChange, year, onYearChange, className,
// }: {
//   lang: Lang;
//   value: "yes" | "no" | "unknown" | "infection" | "";
//   onChange: (v: "yes" | "no" | "unknown" | "infection") => void;
//   year: string | number | "";
//   onYearChange: (y: string) => void;
//   className?: string;
// }) {
//   const t = T[lang] ?? T.de;
//   const Btn = ({ v, label }: { v: "yes" | "no" | "unknown" | "infection"; label: string }) => {
//     const selected = value === v;
//     return (
//       <button
//         type="button"
//         onClick={() => onChange(v)}
//         aria-pressed={selected}
//         className={clsx(
//           "px-3 py-1 text-sm whitespace-nowrap flex-none grow-0 shrink-0 basis-auto",
//           selected ? "bg-black text-white" : "bg-white hover:bg-gray-50"
//         )}
//       >
//         {label}
//       </button>
//     );
//   };

//   const currYear = new Date().getFullYear();

//   return (
//     <div className={clsx("flex flex-col gap-2", className)}>
//       <div role="group" className="inline-flex w-fit overflow-hidden rounded-lg border divide-x">
//         <div className="border-r"><Btn v="no" label={t.no} /></div>
//         <div className="border-r"><Btn v="yes" label={t.yes} /></div>
//         <div className="border-r"><Btn v="unknown" label={t.dk} /></div>
//         <Btn v="infection" label={t.inf} />
//       </div>

//       {value === "infection" && (
//         <div className="max-w-[220px]">
//           <input
//             type="number"
//             inputMode="numeric"
//             min={1900}
//             max={currYear}
//             placeholder={t.yearPh}
//             value={year}
//             onChange={(e) => onYearChange(e.target.value)}
//             className="w-full rounded-md border px-3 py-1.5 text-sm"
//           />
//         </div>
//       )}
//     </div>
//   );
// }
