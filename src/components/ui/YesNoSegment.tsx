// YesNoSegment.tsx
import * as React from "react"
import * as ToggleGroup from "@radix-ui/react-toggle-group"

type Lang = "de" | "en" | "tr" | "uk"

const YES_NO_LABEL = {
  de: { yes: "Ja",  no: "Nein" },
  en: { yes: "Yes", no: "No" },
  tr: { yes: "Evet", no: "Hayır" },
  uk: { yes: "Так",  no: "Ні" },
}

export function YesNoSegment({
  value,
  onChange,
  lang = "de",
  className = "",
}: {
  value: "yes" | "no" | ""
  onChange: (v: "yes" | "no") => void
  lang?: Lang
  className?: string
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value || undefined}
      onValueChange={(v) => v && onChange(v as "yes" | "no")}
      className={`inline-flex items-center rounded-lg border p-0.5 ${className}`}
      aria-label="Choose Yes or No"
    >
        <ToggleGroup.Item
            value="yes"
            aria-label="Yes"
            className="px-3 py-1.5 rounded-md text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted focus:outline-none"
        >
            {YES_NO_LABEL[lang].yes}
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="no"
        aria-label="No"
        className="px-3 py-1.5 rounded-md text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted focus:outline-none"
      >
        {YES_NO_LABEL[lang].no}
      </ToggleGroup.Item>
      
    </ToggleGroup.Root>
  )
}
