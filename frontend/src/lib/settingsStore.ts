// parameter persistency
import { load } from "@tauri-apps/plugin-store";


export type SettingsDefaults = {
  apiBase: string;
  apiToken: string;
  backend: "json" | "datenbank";
  dataFolder: string | null;
  lang: string;
  workspace: "collector" | "lab";
};

const DEFAULTS: SettingsDefaults = {
  apiBase: "http://127.0.0.1:8000",
  apiToken: "", 
  backend: "datenbank",
  dataFolder: null,
  lang: "de",
  workspace: "collector",
};


const storePromise = load("settings.json", {
  defaults: DEFAULTS,
  autoSave: true,
});

export async function getSetting<K extends keyof SettingsDefaults>(
  key: K,
): Promise<SettingsDefaults[K]> {
  const store = await storePromise;
  const v = await store.get<SettingsDefaults[K]>(key);
  // because defaults exist, v should never be null, but keep it safe:
  return (v ?? DEFAULTS[key]) as SettingsDefaults[K];
}

// export async function setSetting<K extends keyof SettingsDefaults>(
//   key: K,
//   value: SettingsDefaults[K],
// ): Promise<void> {
//   const store = await storePromise;
//   await store.set(key, value);
//   // autoSave: true -> no explicit save() needed
// }

export async function setSetting<K extends keyof SettingsDefaults>(
  key: K,
  value: SettingsDefaults[K],
): Promise<void> {
  const store = await storePromise;
  await store.set(key, value);
  await store.save();
}