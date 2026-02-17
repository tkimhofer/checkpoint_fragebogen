// AppSettings.tsx
import React from "react";
import type { BackendTarget } from "@/components/ui/exportSelector";
import type { Lang } from "@/i18n/translations";
import { getSetting, setSetting } from "@/lib/settingsStore.ts";

export type Workspace = "collector" | "lab";

type AppMeta = {
  version: string;
  contactEmail?: string;
  repoUrl?: string;
};

type AppSettingsCtx = {
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;

  lang: Lang;
  setLang: (l: Lang) => void;

  backend: BackendTarget;
  setBackend: (b: BackendTarget) => void;

  dataFolder: string | null;
  setDataFolder: (p: string | null) => void;

  apiBase: string;
  setApiBase: (v: string) => void;

  apiToken: string;
  setApiToken: (v: string) => void;

  meta: AppMeta;
};

const Ctx = React.createContext<AppSettingsCtx | null>(null);

export function AppSettingsProvider({
  children,
  meta,
}: {
  children: React.ReactNode;
  meta: AppMeta;
}) {
  const [workspace, setWorkspace] = React.useState<Workspace>("collector");
  const [lang, setLang] = React.useState<Lang>("de");
  const [backend, setBackend] = React.useState<BackendTarget>("datenbank");
  const [dataFolder, setDataFolder] = React.useState<string | null>(null);

  const [apiBase, setApiBase] = React.useState("http://127.0.0.1:8000");
  const [apiToken, setApiToken] = React.useState("");

  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setWorkspace(await getSetting("workspace"));
      setLang(await getSetting("lang") as any);
      setBackend(await getSetting("backend"));
      setDataFolder(await getSetting("dataFolder"));
      setApiBase(await getSetting("apiBase"));
      setApiToken((await getSetting("apiToken")) ?? "");
      setHydrated(true);
    })();
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    setSetting("workspace", workspace);
  }, [hydrated, workspace]);

  React.useEffect(() => {
    if (!hydrated) return;
    setSetting("lang", lang as any);
  }, [hydrated, lang]);

  React.useEffect(() => {
    if (!hydrated) return;
    setSetting("backend", backend);
  }, [hydrated, backend]);

  React.useEffect(() => {
    if (!hydrated) return;
    setSetting("dataFolder", dataFolder);
  }, [hydrated, dataFolder]);

  React.useEffect(() => {
    if (!hydrated) return;
    setSetting("apiBase", apiBase);
  }, [hydrated, apiBase]);

  React.useEffect(() => {
    if (!hydrated) return;
    setSetting("apiToken", apiToken);
  }, [hydrated, apiToken]);

  // React.useEffect(() => {
  //   console.log("loaded token:", apiToken);
  // }, [apiToken]);



  return (
    <Ctx.Provider
      value={{
        workspace, setWorkspace,
        lang, setLang,
        backend, setBackend,
        dataFolder, setDataFolder,
        apiBase, setApiBase,
        apiToken, setApiToken,
        meta,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAppSettings() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return v;
}
