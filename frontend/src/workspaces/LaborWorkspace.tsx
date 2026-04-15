import React, { useState } from "react"

import { BrandTheme, BrandPage, BrandHeader } from "@/components/ui/brandTheme";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StatsModal } from "@/components/ui/statsModal";
import { IconPlus, IconCheck } from "@tabler/icons-react";

// import { fetchEntries, type EntryListItem } from "@/lib/api/entries";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAppSettings } from "@/AppSettings";
import { AppSettingsSheet } from "@/components/ui/appSettingsSheet";

import { appDataDir } from "@tauri-apps/api/path";
// import CalendarHeatmapView from "@/components/ui/calenderHeatmapView";
import IntakeDatePicker from "@/components/ui/IntakDatePicker";

import { buildApiUrl } from "@/lib/api/config";

// import {computeStats} from "@/components/helpers";
import dayjs from "dayjs";

import { computeStats, statsToRows } from "@/components/helpers";


type StiYears = Record<string, string>;

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
  const g = data?.gender;

  if (!g) return null;

  if (g === "male") {
    return (
      <span className="ml-0 inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-900">
        ♂
      </span>
    );
  }

  if (g === "female") {
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-pink-100 px-1.5 py-0.5 text-xs font-semibold text-pink-900">
        ♀
      </span>
    );
  }

  // optional fallback (divers/intersex/unknown)
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-800">
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
  headerRight,
}: {
  onOpenEntry: (payloadData: any, meta?: { entryId?: string; createdAt?: string }) => void;
  headerRight?: React.ReactNode;
}) {

  React.useEffect(() => {
    (async () => {
      const dir = await appDataDir();
      console.log("App data dir:", dir);
    })();
  }, []);

  // const { backend, setBackend, dataFolder, setDataFolder } = useAppSettings();
  const { backend, dataFolder, apiBase, apiToken} = useAppSettings();
  const [items, setItems] = React.useState<EntryListItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const base = apiBase.trim().replace(/\/+$/, "");
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [statsRows, setStatsRows] = useState<any[]>([]);
  

  const handleLoadJSON = async () => {
    // setLoading(true);

    console.log("Loading entries with backend:", backend);
    try {

      // Lazy-load Tauri APIs only when needed
      const fs = await import("@tauri-apps/plugin-fs");
      const path = await import("@tauri-apps/api/path");

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

  // const { meta } = useAppSettings();
  
  const handleTodayClick = () => {

    if (backend === "datenbank") {
      const todayIso = dayjs().format("YYYY-MM-DD");
      handleDateSelect(todayIso);
      return;
    }
    else if (backend === "json" ) {
      if (!dataFolder) {
        console.warn("backend=json -> dataFolder not set!");
        setItems([]);
        return;
      }


      handleLoadJSON()
      return;
    }
  };

  const handleDateSelect = async (iso: string | null) => {
    if (!iso) {
      setItems([]);
      return;
    }
    setSelectedDate(iso);
    setLoading(true);
    try {
      const url = buildApiUrl(base, `/inbox/entries?day=${encodeURIComponent(iso)}`);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiToken.trim()}`,
        },
      });
      if (!res.ok) {
        console.error("entries by date failed", res.status, res.statusText);
        setItems([]);
        return;
      }
      const payload = await res.json(); // if this fails, switch to: const list = res.data
      setItems(payload.items);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
      setSelectedIds(prev => {
        const next = new Set(prev);     // IMPORTANT: create a new Set
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    React.useEffect(() => {
      if (!items || items.length === 0) {
        setSelectedIds(new Set());
        return;
      }

      const allIds = new Set(items.map(it => it.id));
      setSelectedIds(allIds);

    }, [items]);
  
  const handleStatsClick = () => {
    const selectedEntries = items.filter((it) => selectedIds.has(it.id));
    if (selectedEntries.length === 0) return;
    const stats = computeStats(selectedEntries);
    const dateLabel =
      selectedDate ?? dayjs().format("YYYY-MM-DD");
    const rows = statsToRows(dateLabel, stats, selectedEntries.length);
    setStatsRows(rows);
    setStatsModalOpen(true);
  };

  return (
    <BrandTheme>
      <BrandPage>
      <BrandHeader
        logoSrc="/BuTAH-8c0843ce.jpeg"
        right={
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
               {headerRight}
              <AppSettingsSheet mode="lab" />
            </div>
          </div>
        }
      />
       <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-[240px] shrink-0">
              <IntakeDatePicker
                value1={selectedDate}
                apiOrigin={base}
                apiToken={apiToken}
                onSelectDate={handleDateSelect}
              />
            </div>
            <Button
              variant="quiet"
              onClick={handleTodayClick}
              className="h-6 w-6 flex items-center justify-center text-xs"
            >
              {loading ? "…" : "H"}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {items.length > 0 &&
              `${items.length} ${items.length === 1 ? "Eintrag" : "Einträge"}`}
          </div>
          <div className="flex-1" />
          <Button
            disabled={selectedIds.size === 0}
            onClick={handleStatsClick}
            variant="quiet"
            className="h-6 text-xs"
          >
            S ({selectedIds.size})
          </Button>
        </div>
        <StatsModal
          opened={statsModalOpen}
          onClose={() => setStatsModalOpen(false)}
          rows={statsRows}
        />
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">Keine Einträge.</div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {items.map((it) => (
                <div  key={it.id}  className="grid grid-cols-[1fr_auto] items-center gap-2"> 
                <AccordionItem value={it.id}>
                  <AccordionTrigger>
                    <div className="grid w-full grid-cols-[auto_9rem_1fr_auto] items-center gap-4 pr-2">
                      <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
                        <span>
                          {it.pl?.data?.besucherkennung ?? it.label ?? it.id.slice(0, 8)}
                        </span>
                        {getGenderBadge(it.pl.data)}
                      </div>
                      <div className="text-[11px] text-muted-foreground/80 whitespace-nowrap tabular-nums">
                        {formatTimestampDE(it.created_at)}
                      </div>
                      <div />
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      <div className="shrink-0 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md whitespace-nowrap">
                        {it.n_tests} Anforderungen
                      </div>
                    </div>
                    </div>
                    </AccordionTrigger>
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
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                  onOpenEntry(it.pl.data, {
                                    entryId: it.pl.data.besucherkennung,
                                    createdAt: it.pl.data.beraterkennung,
                                  })
                                }
                              >
                                Fragebogen öffnen
                              </Button>
                              <button
                                    type="button"
                                  
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSelection(it.id);
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                                        className={cn(
                                    buttonVariants({ variant: "quiet", size: "icon" }),
                                    "h-6 w-6",
                                    selectedIds.has(it.id) && "bg-muted text-[hsl(var(--butah-500))]"
                                  )}
                                    aria-pressed={selectedIds.has(it.id)}
                                  >
                                    {selectedIds.has(it.id) ? <IconCheck size={14} /> : <IconPlus size={14} />}
                              </button>
                            </div>
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
                      </div>
              ))}
            </Accordion>
          )}
        </div>
      </BrandPage>
      <Toaster />
    </BrandTheme>
  );
}