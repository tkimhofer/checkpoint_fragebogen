
import dayjs from "dayjs";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

type AgeGroup = "<13 Jahre" | "14-17 Jahre" | "18-24 Jahre" | "25-34 Jahre" | "35-49 Jahre" | "50+ Jahre" | "Keine Angabe";

export function ageGroup(age: number | null): AgeGroup {
  if (age === null || age < 0) return "Keine Angabe";

  if (age <= 13) return "<13 Jahre";
  if (age <= 17) return "14-17 Jahre";
  if (age <= 24) return "18-24 Jahre";
  if (age <= 34) return "25-34 Jahre";
  if (age <= 49) return "35-49 Jahre";
  return "50+ Jahre";
};


export function computeAge(dob: Date | null) {
  if (!dob) return null;

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();

  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};


export function parseDOBFromId(id: string | undefined) {
  if (!id || typeof id !== "string") return null;

  const match = id.match(/(\d{4})$/); // last 4 digits
  if (!match) return null;

  const mm = parseInt(match[1].slice(0, 2), 10);
  const yy = parseInt(match[1].slice(2, 4), 10);

  if (mm < 1 || mm > 12) return null;

  // assume 1900–1999 for yy > currentYear, else 2000+
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = yy > currentYear ? 1900 + yy : 2000 + yy;

  return new Date(fullYear, mm - 1, 1);
};


///WOHNORT nach PLZ
type RegionGroup = "Duisburg" | "Kreis Wesel" | "Anders" | "Keine Angabe";

export const mapPlz3ToRegion = (plz3: string | null | undefined): RegionGroup => {
  if (!plz3) return "Keine Angabe";

  const n = Number(plz3);
  if (!Number.isInteger(n)) return "Keine Angabe";

  if (n >= 470 && n <= 472) return "Duisburg";
  if ([464, 465, 474, 475, 476].includes(n)) return "Kreis Wesel";
  return "Anders";
};

export const countRegions = (entries: any[]) => {
  const counts: Record<RegionGroup, number> = {
    Duisburg: 0,
    "Kreis Wesel": 0,
    "Anders": 0,
    "Keine Angabe": 0,
  };

  entries.forEach((entry) => {
    const plz3 = entry.pl?.data?.plz3;
    const region = mapPlz3ToRegion(plz3);
    counts[region]++;
  });

  return counts;
};

// export const handleStats = (items: any[], selectedIds: Set<string>) => {
//   const selectedEntries = items.filter((it) => selectedIds.has(it.id));
export const computeStats = (selectedEntries: any[]) => {
  // const selectedEntries = items.filter((it) => selectedIds.has(it.id));
  if (selectedEntries.length === 0) return;

  const genderCounts = {
    männlich: 0,
    weiblich: 0,
    andere: 0,
  };

  selectedEntries.forEach((entry) => {
    const g = entry.pl?.data?.gender;
    if (!g) return;

    const gender = g.toLowerCase();
    if (gender === "male") genderCounts.männlich++;
    else if (gender === "female") genderCounts.weiblich++;
    else genderCounts.andere++;
  });

  const geburtslandNichtDE = selectedEntries.filter((entry) => {
    const country = entry.pl?.data?.birth_country;
    return country && country !== "DE";
  }).length;

  const ageCounts = {
    "<13 Jahre": 0,
    "14-17 Jahre": 0,
    "18-24 Jahre": 0,
    "25-34 Jahre": 0,
    "35-49 Jahre": 0,
    "50+ Jahre": 0,
    "Keine Angabe": 0,
  };

  selectedEntries.forEach((entry) => {
    const id = entry.pl?.data?.besucherkennung;
    const dob = parseDOBFromId(id);
    const age = computeAge(dob);
    const group = ageGroup(age);
    ageCounts[group]++;
  });

  const regionCounts = countRegions(selectedEntries);

  const out = {
    geschlechtsidentität: {...genderCounts}, 
    migrationshintergrund: {geburtslandNichtDE},
    alter: {...ageCounts},
    wohnort: {...regionCounts},
  }

  return out;
};

export const capitaliseFirst = (s: string) =>
  s ? s[0].toLocaleUpperCase("de-DE") + s.slice(1) : s;

export function statsToRows(
  date: string,
  stats: Record<string, Record<string, number>>,
  nSelected: number
) {
  const d = dayjs(date);

  return Object.entries(stats).flatMap(([dimension, counts]) =>
    Object.entries(counts).map(([category, count]) => ({
      Datum:date,
      Jahr: d.year(),
      Monat: d.month() + 1,
      Dimension: capitaliseFirst(dimension),
      Kategorie: capitaliseFirst(category),
      Anzahl: count,
      N: nSelected,
    }))
  );
}

export function rowsToCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  const escapeCsv = (value: unknown) => {
    const s = String(value ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(",")),
  ].join("\n");
}


export async function saveCsvWithDialog(filename: string, csv: string) {
  const filePath = await save({
    defaultPath: filename,
    filters: [
      {
        name: "CSV",
        extensions: ["csv"],
      },
    ],
  });

  if (!filePath) return; 

  await writeTextFile(filePath, csv);
}