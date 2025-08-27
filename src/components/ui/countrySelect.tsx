// CountryCombobox.tsx
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

import { COUNTRIES } from "./countries"

type Lang = "de" | "en" | "tr" | "uk"

export function CountryCombobox({
  value,
  onChange,
  lang = "de",
  placeholder = "Land auswählen…",
  searchPlaceholder = "Länder suchen…",
  emptyLabel = "Kein Land gefunden.",
}: {
  /** ISO 3166-1 alpha-2 code like "DE" or null */
  value?: string | null
  onChange?: (code: string | null) => void
  lang?: Lang
  placeholder?: string
  searchPlaceholder?: string
  emptyLabel?: string
}) {
  const [open, setOpen] = React.useState(false)

  const selected = value ? COUNTRIES.find(c => c.code === value) ?? null : null
  const selectedLabel = selected ? selected.labels[lang] ?? selected.labels.en : null

  // ⚡️ Sort countries by current language
  const sortedCountries = React.useMemo(() => {
    const collator = new Intl.Collator(lang)
    return [...COUNTRIES].sort((a, b) =>
      collator.compare(a.labels[lang] ?? a.labels.en, b.labels[lang] ?? b.labels.en)
    )
  }, [lang])

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-72 justify-between"
          >
            {selectedLabel ?? placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyLabel}</CommandEmpty>
              <CommandGroup>
                {/* Optional clear item */}
                <CommandItem
                  key="__clear__"
                  value="__clear__"
                  onSelect={() => {
                    onChange?.(null)
                    setOpen(false)
                  }}
                >
                  <Check className={"mr-2 h-4 w-4 " + (!value ? "opacity-100" : "opacity-0")} />
                  {placeholder}
                </CommandItem>

                {sortedCountries.map(c => {
                  const label = c.labels[lang] ?? c.labels.en
                  return (
                    <CommandItem
                      key={c.code}
                      value={`${label} ${c.code}`} // searchable by name + code
                      onSelect={() => {
                        const next = c.code === value ? null : c.code
                        onChange?.(next)
                        setOpen(false)
                      }}
                    >
                      <Check className={"mr-2 h-4 w-4 " + (c.code === value ? "opacity-100" : "opacity-0")} />
                      {label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
