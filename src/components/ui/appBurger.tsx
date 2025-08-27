import React from "react";
import { Menu, Github, Mail, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ReactCountryFlag from "react-country-flag";

type Lang = "de" | "en" | "tr" | "uk";

const COUNTRY_FOR_LANG: Record<Lang, string> = {
  de: "DE",
  en: "GB", // or "US" if that matches your audience
  tr: "TR",
  uk: "UA",
};

const LANG_NAMES: Record<Lang, string> = {
  de: "Deutsch",
  en: "English",
  tr: "Türkçe",
  uk: "Українська",
};
// (optional) tiny code tag on the right:
const CODE_BADGE = (l: Lang) => (
  <span className="ml-auto text-xs uppercase text-muted-foreground">{l}</span>
);

export function AppBurger({
  lang,
  onLangChange,
  version,
//   releaseUrl,          // e.g. "https://github.com/org/repo/releases/latest"
  repoUrl,             // e.g. "https://github.com/org/repo"
  contactEmail,        // e.g. "kontakt@example.org"
  endpoint,            // optional – if you still want to show API info
  onClearDraft,        // optional – clear local draft
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  version?: string;
//   releaseUrl?: string;
  repoUrl?: string;
  contactEmail?: string;
  endpoint?: string;
  onClearDraft?: () => void;
}) {
  const langs: Lang[] = ["de", "en", "tr", "uk"];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Menü öffnen">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[320px] sm:w-[380px]">
        {/* Make the whole panel a vertical flex so we can pin bottom section */}
        <div className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Einstellungen</SheetTitle>
          </SheetHeader>

          {/* TOP: language (and optional quick actions/info) */}
          <div className="mt-4 space-y-6">
            {/* Language */}
            <section>
              <h4 className="mb-2 text-sm font-medium">Sprache</h4>
              <RadioGroup
                value={lang}
                onValueChange={(v) => onLangChange(v as Lang)}
                className="grid grid-cols-2 gap-2"
              >
                {langs.map((l) => (
                    <Label
                        key={l}
                        htmlFor={`lang-${l}`}
                        className="flex items-center gap-2 rounded-md border p-2 cursor-pointer"
                    >
                        <RadioGroupItem id={`lang-${l}`} value={l} />
                        <span>{LANG_NAMES[l]}</span>
                        {/* flag on the right */}
                        <span
                            className="ml-auto text-lg leading-none"
                            role="img"
                            aria-label={`${LANG_NAMES[l]} flag`}
                        >
                            <div className="ml-auto">
                            <ReactCountryFlag
                                countryCode={COUNTRY_FOR_LANG[l]}
                                svg
                                style={{ width: "1.25rem", height: "1rem", borderRadius: "2px" }}
                                title={LANG_NAMES[l]}
                                aria-label={`${LANG_NAMES[l]} flag`}
                            />
                            </div>
                        </span>
                    </Label>
                    ))}
              </RadioGroup>
            </section>

            {/* Optional app info/action in the top block (keep or remove) */}
            {endpoint && (
              <section className="space-y-1">
                <h4 className="text-sm font-medium">API</h4>
                <p className="text-sm text-muted-foreground break-all">{endpoint}</p>
              </section>
            )}

            {onClearDraft && (
              <section>
                <Button variant="outline" className="w-full" onClick={onClearDraft}>
                  Entwurf leeren (lokal)
                </Button>
              </section>
            )}
          </div>

          {/* BOTTOM: Über/Hilfe */}
          {/* // inside <SheetContent> … keep your top sections … then replace the bottom with: */}
            <div className="mt-auto pt-4">
            <Separator className="mb-2" />

            {/* Tiny footer */}
            <div className="space-y-1 text-xs leading-tight text-muted-foreground">
                {version && <div>App-Version: <span className="font-medium text-foreground">{version}</span></div>}

                {/* Links as plain anchors (very small) */}
                <div className="flex flex-col gap-1">
                {repoUrl && (
                    <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-foreground underline underline-offset-2"
                    >
                    {/* <Github className="h-3 w-3" /> */}
                    Probleme & Vorschläge (GitHub)
                    </a>
                )}
                
                {contactEmail && (
                    <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-1 hover:text-foreground underline underline-offset-2"
                    >
                    {/* <Mail className="h-3 w-3" /> */}
                    Kontakt: {contactEmail}
                    </a>
                )}
                
                
                </div>
            </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
