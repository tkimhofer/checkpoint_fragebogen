import React from "react"

import { BrandTheme, BrandPage, BrandHeader } from "@/components/ui/brandTheme";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {isPlainObject, KeyValueDenseList} from "@/components/ui/fragebogen_text_liste";

import { fetchEntries, type EntryListItem } from "@/lib/api/entries";
// import { displayValue } from "@/components/domain/fragebogen/i18n";


// import { buildQuestionGroups } from "@/components/domain/fragebogen/derive";
// import { displayValue, tVar } from "@/components/domain/fragebogen/i18n";


import { displayValue } from "@/components/domain/fragebogen/i18n";
import { buildQuestionGroups } from "@/components/domain/fragebogen/legacy"; // or derive.ts if you move it there
// import type { Lang } from "@/components/domain/fragebogen/types";
import type { Lang } from "@/i18n/translations";
import type { BackendTarget } from "@/components/ui/exportSelector";
// import { AppBurger_lab } from "@/components/ui/app_burger";
import { useAppSettings } from "@/AppSettings";
import { AppBurger } from "@/components/ui/app_burger";
import { AppSettingsSheet } from "@/components/ui/appSettingsSheet";



const lang: Lang = "de";

type StiYears = Record<string, string>;

const STI_LABELS_DE: Record<string, string> = {
  syphilis: "Syphilis",
  mkpox: "Affenpocken",
  chlamydia: "Chlamydien",
  gonorrhea: 'Gonorrhoe ("Tripper")',
  hepa: "Hepatitis A",
  hepb: "Hepatitis B",
  hepc: "Hepatitis C",
  other: "Andere",
};

// stable order for display
const STI_ORDER = [
  "syphilis",
  "mkpox",
  "chlamydia",
  "gonorrhea",
  "hepa",
  "hepb",
  "hepc",
  "other",
] as const;

function getStiHistoryList(data: any) {
  const years: StiYears = (data?.sti_history_years ?? {}) as StiYears;
  const otherText: string = (data?.sti_history_which_other ?? "").trim();

  // nothing to show
  if (!years || Object.keys(years).length === 0) return [];

  const entries = Object.entries(years).map(([code, year]) => {
    const cleanYear = String(year ?? "").trim();
    const label =
      code === "other" && otherText
        ? otherText // ✅ replace "other" label with the free text
        : (STI_LABELS_DE[code] ?? code);

    return { code, label, year: cleanYear };
  });

  // stable ordering (unknown codes go last, alphabetical among themselves)
  const orderIndex = new Map<string, number>(STI_ORDER.map((c, i) => [c, i]));
  entries.sort((a, b) => {
    const ai = orderIndex.has(a.code) ? orderIndex.get(a.code)! : 999;
    const bi = orderIndex.has(b.code) ? orderIndex.get(b.code)! : 999;
    if (ai !== bi) return ai - bi;
    return a.label.localeCompare(b.label, "de");
  });

  // remove empty-year rows if you prefer (optional)
  // return entries.filter(e => e.year.length > 0);

  return entries;
}

function hasHistoricalSyphilis(data: any) {
  const years: StiYears = (data?.sti_history_years ?? {}) as StiYears;
  const which: string[] = Array.isArray(data?.sti_history_which) ? data.sti_history_which : [];

  return Boolean(years?.syphilis) || which.includes("syphilis");
}

function getSyphilisHistoryInfo(data: any) {
  const years: StiYears = (data?.sti_history_years ?? {}) as StiYears;
  const which: string[] = Array.isArray(data?.sti_history_which)
    ? data.sti_history_which
    : [];

  const mentioned = which.includes("syphilis");
  const year = years?.syphilis?.toString().trim();

  if (!mentioned && !year) return null;

  return {
    year: year || null,
  };
}


function getGenderBadge(data: any) {
  const g = data?.gender_assigned;

  if (!g) return null;

  if (g === "male") {
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-900">
        ♂
      </span>
    );
  }

  if (g === "female") {
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-[11px] font-semibold text-pink-900">
        ♀
      </span>
    );
  }

  // optional fallback (divers/intersex/unknown)
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-800">
      ∞
    </span>
  );
}

function formatTimestampDE(ts?: string) {
  if (!ts) return "";

  const d = new Date(ts);

  if (isNaN(d.getTime())) return ts; // fallback if invalid

  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);

  return `${hh}:${mm} Uhr am ${day}.${month}.${year}`;
}


export default function LabWorkspace({
  onOpenEntry,
  // backend,
  // setBackend,
  // dataFolder,
  // setDataFolder,
}: {
  onOpenEntry: (payloadData: any, meta?: { entryId?: string; createdAt?: string }) => void;
  // backend: BackendTarget;
  // setBackend: React.Dispatch<React.SetStateAction<BackendTarget>>;
  // dataFolder: string | null;
  // setDataFolder: React.Dispatch<React.SetStateAction<string | null>>;
}) {

  const { backend, setBackend, dataFolder, setDataFolder } = useAppSettings();
  const [items, setItems] = React.useState<EntryListItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const apiBase = "http://localhost:8000";

  // const handleLoadEntries = async () => {
  //   setLoading(true);
  //   try {
  //     const list = await fetchEntries(apiBase);
  //     setItems(list);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleLoadEntries = async () => {
  //   setLoading(true);
  //   try {
  //     let list: EntryListItem[] = [];

  //     if (backend === "datenbank") {
  //       list = await fetchEntries(apiBase);
  //     } else {
  //       // backend === "json"
  //       if (!dataFolder) {
  //         console.warn("backend=json but dataFolder is not set");
  //         list = [];
  //       } else {
  //         // Lazy import so Tauri fs code is only loaded when actually used
  //         const mod = await import("@/lib/api/entries"); 
  //         // ^ adjust path to wherever your file-loader lives
  //         list = await mod.fetchEntriesFromFiles(dataFolder);
  //       }
  //     }

  //     setItems(list);
  //   } catch (err) {
  //     console.error("Failed to load entries:", err);
  //     setItems([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLoadEntries = async () => {
    setLoading(true);
    try {
      // --- DB backend (unchanged) ---
      if (backend === "datenbank") {
        const list = await fetchEntries(apiBase);
        setItems(list);
        return;
      }

      // --- JSON backend: read files + build DB-shaped list ---
      if (!dataFolder) {
        console.warn("backend=json but dataFolder is not set");
        setItems([]);
        return;
      }

      // Lazy-load Tauri APIs only when needed
      
      const fs = await import("@tauri-apps/plugin-fs");
      const path = await import("@tauri-apps/api/path");

      // === helpers mirroring your Python logic ===
      const TESTANFORDERUNGEN: Record<string, string> = {
        counsel: "Nur Beratung",
        hiv_lab: "HIV Suchtest (Labor)",
        hiv_poc: "HIV Suchtest (Schnelltest/POC)",
        tp: "Syphilis Serologie",
        go_ct_throat: "Rachen",
        go_ct_urine: "Urin",
        go_ct_vag: "Vaginal",
        go_ct_anal: "Rektal",
        hav: "HAV",
        "anti-hbc": "HBV (core)",
        hcv: "HCV",
      };

      const GO_CT_SITE_ORDER = ["go_ct_throat", "go_ct_urine", "go_ct_vag", "go_ct_anal"] as const;
      const GO_CT_PREFIX = "go_ct_";
      const EXCLUDE_CODES = new Set(["counsel"]);

      const asStringArray = (x: any): string[] => (Array.isArray(x) ? x.filter((v) => typeof v === "string") : []);

      const mergedTestLabels = (selectedCodes: Iterable<string> | undefined | null): string[] => {
        const codes = new Set<string>(selectedCodes ?? []);
        for (const ex of EXCLUDE_CODES) codes.delete(ex);

        // ordered go_ct labels
        const goCtLabels: string[] = [];
        for (const site of GO_CT_SITE_ORDER) {
          if (codes.has(site)) goCtLabels.push(TESTANFORDERUNGEN[site] ?? site);
        }

        // non-go_ct labels sorted by label text
        const nonGoCtLabels = [...codes]
          .filter((c) => !c.startsWith(GO_CT_PREFIX))
          .map((c) => TESTANFORDERUNGEN[c] ?? c)
          .sort((a, b) => a.localeCompare(b, "de"));

        if (goCtLabels.length) nonGoCtLabels.push(`CT/NG PCR (${goCtLabels.join(", ")})`);
        return nonGoCtLabels;
      };

      const fmtLabelTs = (iso: string): string => {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;

        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = String(d.getFullYear());
        const hh = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");

        return `${dd}.${mm}.${yyyy} um ${hh}:${min} Uhr`;
      };

      // read files
      const dirEntries = await fs.readDir(dataFolder, { recursive: false });
      const candidates = dirEntries
        .filter((e) => !!e.name && e.name.endsWith(".json"))
        .filter((e) => e.name!.startsWith("chp_fragebogen_"));

      const built: EntryListItem[] = [];

      for (const f of candidates) {
        try {
          const fullPath = await path.join(dataFolder, f.name!);
          const raw = await fs.readTextFile(fullPath);
          const pl = JSON.parse(raw);

          const createdAt: string | undefined = pl?.meta?.system_created_at;
          if (!createdAt || typeof createdAt !== "string") continue;

          const besucher = String(pl?.data?.besucherkennung ?? "").trim().toUpperCase();
          const testCodes =
            asStringArray(pl?.data?.testanforderungen).length > 0
              ? asStringArray(pl?.data?.testanforderungen)
              : asStringArray(pl?.data?.testanforderung);

          const testLabels = mergedTestLabels(testCodes);
          const tests = testLabels.join(", ");
          const n_tests = String(testLabels.length);

          // ID: you said you want something like beraterkennung + meta.system_created_at
          const berater = String(pl?.data?.beraterkennung ?? "unknown").trim() || "unknown";
          const id = `${berater}_${createdAt}`;

          built.push({
            id,
            created_at: createdAt,
            n_tests,               // DB sends as string
            tests,                 // DB sends as string
            label: `${besucher || id.slice(0, 8)} am ${fmtLabelTs(createdAt)}`,
            pl,                    // full payload object (same as DB)
          } as any);
        } catch (e) {
          console.warn("Skipping invalid JSON file:", f.name, e);
        }
      }

      // newest first (ISO string sorts fine)
      built.sort((a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0));

      // mirror API limit=50
      setItems(built.slice(0, 50));
    } finally {
      setLoading(false);
    }
  };

  const { meta } = useAppSettings();



  
  console.log('items', items);
  return (
    <BrandTheme>
      <BrandPage>
        <BrandHeader
          logoSrc="/logo-ah-91db5ab3.png"
          right={
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5
                text-[11px] font-bold uppercase tracking-wide
                bg-red-500/30 text-red-900
                ring-1 ring-red-400/50
                shadow-[0_0_10px_rgba(239,68,68,0.6)]"
              >
                TESTVERSION {meta.version}
              </span>

              <AppSettingsSheet mode="lab" />
            </div>
          }
        />

        <div className="space-y-4">
          <Button onClick={handleLoadEntries}>{loading ? "Lade…" : "Einträge laden"}</Button>

          <div className="text-xs text-muted-foreground">{items.length ? `${items.length} Einträge` : ""}</div>

          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">Noch keine Einträge geladen.</div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {items.map((it) => (
                <AccordionItem key={it.id} value={it.id}>
                  <AccordionTrigger>
                    <div className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-4 pr-2">
                      
                      <div className="flex flex-col"> 
                      {/* Column 1 — Besucherkennung + Gender */}
                      <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
                        <span>{it.pl?.data?.besucherkennung ?? it.label ?? it.id.slice(0, 8)}</span>
                        {getGenderBadge(it.pl.data)}
                      </div>

                      {/* Column 2 — Created at */}
                      <div className="text-[11px] text-muted-foreground/80">
                        {formatTimestampDE(it.created_at)}
                      </div>
                      </div>

                      {/* Column 3 — Anforderungen */}
                      <div className="ml-auto text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md whitespace-nowrap">
                        {it.n_tests} Anforderungen
                      </div>

                    </div>
                  </AccordionTrigger>

                  {/* <AccordionTrigger>
                    <div className="flex w-full items-center justify-between pr-2">
                      <span className="text-sm">{it.label ?? it.id.slice(0, 8)} {getGenderBadge(it.pl.data)}</span>
                      <span className="ml-4 text-xs text-muted-foreground">{it.n_tests} Anforderungen</span>
                    </div>
                  </AccordionTrigger> */}

                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-2">
                          <div className="flex items-end justify-between gap-4">
                            <div className="flex flex-col">
                              <div>
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Anforderungen
                                </div>
                                <div className="text-md font-bold text-primary">
                                  {it.tests?.toUpperCase() ?? "?"}
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                <span>
                                  <span className="font-medium text-foreground">Berater:</span>{" "}
                                  <span className="uppercase tracking-wide">
                                    {it.pl.data.beraterkennung ?? "?"}
                                  </span>
                                </span>
                                {it.pl.data.beraterkommentar?.trim() && (
                                  <>
                                    <span className="text-muted-foreground/60">•</span>
                                    <span className="truncate">
                                      <span className="font-medium text-foreground">Kommentar:</span>{" "}
                                      <span>{it.pl.data.beraterkommentar}</span>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                onOpenEntry(it.pl.data, {
                                  entryId: it.pl.data.besucherkennung,
                                  createdAt: it.pl.meta.created_at,
                                })
                              }
                              className="shrink-0"
                            >
                              Fragebogen öffnen
                            </Button>
                          </div>
                        </div>

                        {(() => {
                      const syphInfo = getSyphilisHistoryInfo(it.pl.data);
                      if (!syphInfo) return null;

                      return (
                        <div className="rounded-md border border-amber-400/60 bg-amber-50 px-3 py-2">
                          <div className="text-sm font-semibold text-amber-900">
                            Hinweis: Syphilis in der Anamnese
                            {syphInfo.year && (
                              <> ({syphInfo.year})</>
                            )}{" "}
                            – Seronarbe möglich
                          </div>
                        </div>
                      );
                    })()}
                      </div>
                    </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </BrandPage>

      <Toaster />
    </BrandTheme>
  );
}