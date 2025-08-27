// hivTest_history.tsx
import * as React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { YesNoSegment } from "@/components/ui/YesNoSegment"


type Lang = "de" | "en" | "tr" | "uk"

type ConditionalFieldProps = {
  lang?: Lang
  answer: "yes" | "no" | ""    // controlled
  year?: number | null
  count?: number | null
  checked: boolean
  onChange: (value: {
    answer: "yes" | "no" | ""
    year?: number | null
    count?: number | null
    checked?: boolean
  }) => void
}

const YES_NO_LABEL = {
  de: { yes: "Ja",  no: "Nein" },
  en: { yes: "Yes", no: "No" },
  tr: { yes: "Evet", no: "Hayır" },
  uk: { yes: "Так",  no: "Ні" },
}

const HIV_TEST_YEAR_LABEL = {
  de: "In welchem Jahr zuletzt?",
  en: "In which year was your last test?",
  tr: "Son testiniz hangi yıldaydı?",
  uk: "У якому році був останній тест?",
}

const HIV_TEST_COUNT_LABEL = {
  de: "Wie oft?",
  en: "How many times?",
  tr: "Kaç kez?",
  uk: "Скільки разів?",
}

const CONFIRM_LABEL = {
  de: "Der HIV-Test wurde bei der AIDS-Hilfe Duisburg & Kreis Wesel durchgeführt",
  en: "The HIV test was carried out at AIDS-Hilfe Duisburg & Kreis Wesel",
  tr: "HIV testi AIDS-Hilfe Duisburg & Kreis Wesel’de yapıldı",
  uk: "Тест на ВІЛ було проведено в «AIDS-Hilfe Duisburg & Kreis Wesel»",
}

export function ConditionalField({
  lang = "de",
  answer,
  year,
  count,
  checked,
  onChange,
}: ConditionalFieldProps) {
  // unique ids (prevents collisions if multiple instances)
  const idBase = React.useId()
  const idNo = `${idBase}-no`
  const idYes = `${idBase}-yes`
  const idYear = `${idBase}-year`
  const idCount = `${idBase}-count`
  const idChk = `${idBase}-confirm`

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    if (raw.length <= 4) {
      onChange({ answer, year: raw ? parseInt(raw, 10) : null, count, checked })
    }
  }

  return (
    <div className="space-y-4">
      <YesNoSegment
        value={answer}
        lang={lang}
        onChange={(val) => onChange({ answer: val, year, count, checked })}
      />
   

      {answer === "yes" && (
        <div className="space-y-4 pl-4 border-l border-gray-200">
          <div>
            <Label htmlFor={idYear}>{HIV_TEST_YEAR_LABEL[lang]}</Label>
            <Input
              id={idYear}
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={year ?? ""}
              onChange={handleYearChange}
              placeholder="2005"
            />
          </div>

          <div>
            <Label htmlFor={idCount}>{HIV_TEST_COUNT_LABEL[lang]}</Label>
            <Input
              id={idCount}
              type="number"
              min={0}
              step={1}
              value={count ?? ""}
              onChange={(e) =>
                onChange({
                  answer,
                  year,
                  count: e.target.value ? parseInt(e.target.value, 10) : null,
                  checked,
                })
              }
              placeholder="1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={idChk}
              checked={checked}
              onCheckedChange={(val) =>
                onChange({ answer, year, count, checked: !!val })
              }
            />
            <Label htmlFor={idChk}>{CONFIRM_LABEL[lang]}</Label>
          </div>
        </div>
      )}
    </div>
  )
}
