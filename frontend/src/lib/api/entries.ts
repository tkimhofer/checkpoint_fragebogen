import { readDir, readTextFile } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { fetch } from "@tauri-apps/plugin-http";


export type EntryListItem = {
  id: string;
  created_at: string;
  source?: string;
  label?: string;
};

export async function fetchEntries(apiBase: string, apiToken: string): Promise<EntryListItem[]> {

  const url = new URL("entries?limit=50", apiBase).toString();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = apiToken.trim();
  if (token) headers["X-API-Token"] = token;


  const res = await fetch(url, { method: "GET", headers });
  
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  console.log('data_entries', data)

  if (!data.ok) {
    throw new Error("API returned ok=false");
  }

  return data.items ?? [];
}


type FilePayload = {
  meta?: {
    system_created_at?: unknown;
    system_source?: unknown;
    [k: string]: unknown;
  };
  data?: {
    beraterkennung?: unknown;
    [k: string]: unknown;
  };
  [k: string]: unknown;
};

function asString(x: unknown): string | undefined {
  return typeof x === "string" ? x : undefined;
}

export async function fetchEntriesFromFiles(STORE_PATH: string): Promise<EntryListItem[]> {
  const dirEntries = await readDir(STORE_PATH,);

  const candidateFiles = dirEntries
    .filter((e) => !!e.name && e.name.endsWith(".json"))
    .filter((e) => e.name!.startsWith("chp_fragebogen_"));

  const items: EntryListItem[] = [];

  for (const f of candidateFiles) {
    if (!f.name) continue;

    try {
      const fullPath = await join(STORE_PATH, f.name);
      const raw = await readTextFile(fullPath);
      const payload = JSON.parse(raw) as FilePayload;

      const createdAt = asString(payload?.meta?.system_created_at);
      const beraterkennung = asString(payload?.data?.beraterkennung);

      // If required fields are missing, skip (or you can still include with fallbacks)
      if (!createdAt || !beraterkennung) {
        console.warn("Skipping file (missing meta.system_created_at or data.beraterkennung):", f.name);
        continue;
      }

      items.push({
        id: `${beraterkennung}_${createdAt}`,
        created_at: createdAt,
        source: "json",
        label: "",
      });
    } catch (err) {
      console.warn("Skipping unreadable/invalid JSON file:", f.name, err);
    }
  }

  // Sort newest first. ISO timestamps sort correctly as strings.
  items.sort((a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0));

  // mirror API limit=50
  return items.slice(0, 50);
}
