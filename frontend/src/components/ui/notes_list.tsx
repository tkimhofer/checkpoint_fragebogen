import * as React from "react"

export function TestNotes() {
  return (
    <div>
    <p className="mt-3 text-xs font-medium text-muted-foreground">
    Hinweise zur Testung
    </p>
    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
      <li>• HIV-Labor: diagnostisches Fenster sicher ab 6 Wochen</li>
      {/* <li>• Syphilis: frühere Infektion dokumentieren (Seronarbe)</li> */}
      <li>• CT/NG: Mindestens 4 Wochen keine Antibiotika</li>
      <li>• Rachen: kein Kaugummi/Zähneputzen ≥ 1h vorher</li>
      <li>• Vaginal: mindestens 3-5 Tage nach Ende der Periode</li>
      <li>• Rektal/Vaginal: keine Spülungen/Präparate am Testtag</li>
    </ul>
    </div>
  );
}