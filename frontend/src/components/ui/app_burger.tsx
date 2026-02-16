
import React from "react";
import { Menu, Github, Mail, Folder } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ReactCountryFlag from "react-country-flag";
import { open as openExternal } from "@tauri-apps/plugin-shell";

import { BackendSwitch, type BackendTarget } from "@/components/ui/exportSelector";
import type { Lang } from "@/i18n/translations";

import { open as openDialog} from "@tauri-apps/plugin-dialog";

// const handleSelectFolder = async () => {
//   const selected = await open({
//     directory: true,
//     multiple: false,
//   });

//     if (selected && !Array.isArray(selected)) {
//       onFolderSelect?.(selected);
//     }


//   if (!selected || Array.isArray(selected)) return;

//   console.log("Selected folder:", selected);

//   // Here you should store it in state or pass to parent
// };


// type Lang = "de" | "en" | "tr" | "uk";

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

function normalizeRepoUrl(repoUrl: string) {
  // allow passing "github.com/..." without scheme
  if (/^https?:\/\//i.test(repoUrl)) return repoUrl;
  return `https://${repoUrl}`;
}

function mailto(email: string) {
  return `mailto:${email}`;
}

export function AppBurger({
  lang,
  onLangChange,
  version,
  repoUrl,
  contactEmail,
  endpoint,
  onClearDraft,

  backend,
  onBackendChange,

  onFolderSelect
}: {
  lang?: Lang;
  onLangChange: (l: Lang) => void;
  version?: string;
  repoUrl?: string;
  contactEmail?: string;
  endpoint?: string;
  onClearDraft?: () => void;

  backend: BackendTarget;
  onBackendChange: (b: BackendTarget) => void;

  onFolderSelect?: (path: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  
  const showLang = !!lang && typeof onLangChange === "function";
  const langs: Lang[] = ["de", "en", "tr", "uk"];

  const handleOpenRepo = async () => {
    if (!repoUrl) return;
    await openExternal(normalizeRepoUrl(repoUrl));
  };

  const handleOpenMail = async () => {
    if (!contactEmail) return;
    await openExternal(mailto(contactEmail));
  };


  const handleSelectFolder = async () => {
    const selected = await openDialog({
      directory: true,
      multiple: false,
    });

      if (selected && !Array.isArray(selected)) {
        onFolderSelect?.(selected);
      }


    if (!selected || Array.isArray(selected)) return;

    // console.log("Selected folder:", selected);

    // Here you should store it in state or pass to parent
  };


  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
    
    {/* Sprache */}
    {showLang && (
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Sprache</h4>

        <RadioGroup
          value={lang}
          onValueChange={(v) => onLangChange(v as Lang)}
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


    {/* API-Endpunkt (NOT pinned) */}
    {(
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">API-Endpunkt</h4>

        <section className="rounded-lg border p-4 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Legt fest, ob die Daten lokal als JSON Datei gespeichert oder an die interne Datenbank gesendet werden.
          </p>

          <div className="space-y-3">
            {/* Switch */}
            <BackendSwitch value={backend} onChange={onBackendChange} />

            {/* Folder selector row */}
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
                  {endpoint?.trim() || "Speicherort auswählen"}
                </span>
              </div>
                )}
            </div>

          {/* <p className="text-xs text-muted-foreground break-all leading-relaxed">
            {typeof endpoint === "string" && endpoint.trim().length > 0
              ? endpoint
              : "Speicherort auswählen"}
          </p> */}
        </section>
      </div>
    )}

    {/* Reset */}
    {/* <div className="text-[10px] text-muted-foreground">
  debug: onClearDraft = {String(typeof onClearDraft)}
</div> */}
    {onClearDraft && (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          Fragebogen zurücksetzen
        </h4>

        <section className="rounded-lg border p-4 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Setzt den lokal gespeicherten Entwurf zurück und entfernt alle begonnenen Eingaben.
          </p>

          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => {
              onClearDraft();
              setOpen(false);
            }}
          >
            Entwurf leeren
          </Button>
        </section>
      </div>
    )}

    
  </div>

  {/* FOOTER (pinned) */}
  <div className="pt-4">
    <Separator className="my-3" />

    <div className="space-y-2 text-xs text-muted-foreground">
      {version && (
        <div>
          App-Version: <span className="font-medium text-foreground">{version}</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {repoUrl && (
          <button
            type="button"
            onClick={handleOpenRepo}
            className="inline-flex items-center gap-2 text-left hover:text-foreground"
          >
            <Github className="h-3.5 w-3.5" />
            <span>
              Quellcode-Repo: <span className="font-medium">{repoUrl}</span>
            </span>
          </button>
        )}

        {contactEmail && (
          <button
            type="button"
            // onClick={handleOpenMail}
            className="inline-flex items-center gap-2 text-left hover:text-foreground"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="font-medium">{contactEmail}</span>
          </button>
        )}
      </div>
    </div>
  </div>
</div>

      </SheetContent>
    </Sheet>
  );
}