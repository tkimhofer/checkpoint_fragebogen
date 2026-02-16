import React from "react";
import { Menu, Folder } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { open as openDialog } from "@tauri-apps/plugin-dialog";

import { useAppSettings } from "@/AppSettings";
import { BackendSwitch } from "@/components/ui/exportSelector";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { open as openExternal } from "@tauri-apps/plugin-shell";
import { Mail } from "lucide-react";

import type { Lang } from "@/i18n/translations";

const COUNTRY_FOR_LANG: Record<Lang, string> = {
  de: "DE",
  en: "GB",
  tr: "TR",
  uk: "UA",
};

const LANG_NAMES: Record<Lang, string> = {
  de: "Deutsch",
  en: "English",
  tr: "Türkçe",
  uk: "Українська",
};

export function AppSettingsSheet({
  mode,
  onClearDraft,
}: {
  mode: "collector" | "lab";
  onClearDraft?: () => void;
}) {
  const {
    meta,
    lang,
    setLang,
    backend,
    setBackend,
    dataFolder,
    setDataFolder,
  } = useAppSettings();

  const langs: Lang[] = ["de", "en", "tr", "uk"];

  const handleSelectFolder = async () => {
    const selected = await openDialog({ directory: true, multiple: false });
    if (selected && !Array.isArray(selected)) setDataFolder(selected);
  };

  const showLang = mode === "collector";

  const handleOpenMail = async () => {
    if (!meta.contactEmail) return;
    await openExternal(`mailto:${meta.contactEmail}`);
  };



  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Menü öffnen">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[320px] sm:w-[380px]">
        <div className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Einstellungen</SheetTitle>
          </SheetHeader>

          {/* MAIN (scrollable) */}
          <div className="mt-4 flex-1 space-y-5 overflow-auto pr-1">
            {/* Sprache (collector only) */}
            {showLang && (
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Sprache</h4>

                <RadioGroup
                  value={lang}
                  onValueChange={(v) => setLang(v as Lang)}
                  className="grid grid-cols-2 gap-2"
                >
                  {langs.map((l) => (
                    <Label
                      key={l}
                      htmlFor={`lang-${l}`}
                      className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50"
                    >
                      <RadioGroupItem id={`lang-${l}`} value={l} />
                      <span className="text-sm">{LANG_NAMES[l]}</span>

                      <span className="ml-auto">
                        <ReactCountryFlag
                          countryCode={COUNTRY_FOR_LANG[l]}
                          style={{ width: "1.25rem", height: "1rem", borderRadius: "2px" }}
                          title={LANG_NAMES[l]}
                          aria-label={`${LANG_NAMES[l]} flag`}
                        />
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </section>
            )}

            {/* Backend + Folder */}
            <section className="rounded-lg border p-4 space-y-3">
              <div className="text-sm font-semibold">Backend</div>

              <BackendSwitch value={backend} onChange={setBackend} />

              {backend === "json" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSelectFolder}
                    aria-label="Speicherort auswählen"
                    title="Speicherort auswählen"
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground break-all">
                    {dataFolder?.trim() || "Speicherort auswählen"}
                  </span>
                </div>
              )}
            </section>

            {/* Collector-only actions */}
            {mode === "collector" && onClearDraft && (
              <section className="rounded-lg border p-4 space-y-3">
                <div className="text-sm font-semibold">Fragebogen</div>
                <Button variant="outline" className="w-full" onClick={onClearDraft}>
                  Entwurf leeren
                </Button>
              </section>
            )}
          </div>

          {/* FOOTER (pinned) */}
          {/* <div className="pt-4">
            <Separator className="my-3" />
            <div className="text-xs text-muted-foreground">
              App-Version: <span className="font-medium text-foreground">{meta.version}</span>
            </div>
          </div> */}
          <div className="pt-4">
  <Separator className="my-3" />

  <div className="space-y-2 text-xs text-muted-foreground">
    <div>
      App-Version:{" "}
      <span className="font-medium text-foreground">
        {meta.version}
      </span>
    </div>

    {meta.contactEmail && (
      <button
        type="button"
        onClick={handleOpenMail}
        className="inline-flex items-center gap-2 hover:text-foreground"
      >
        <Mail className="h-3.5 w-3.5" />
        <span className="font-medium">
          {meta.contactEmail}
        </span>
      </button>
    )}
  </div>
</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
