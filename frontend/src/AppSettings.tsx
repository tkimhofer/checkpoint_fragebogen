// AppSettings.tsx
import React from "react";
import type { BackendTarget } from "@/components/ui/exportSelector";
import type { Lang } from "@/i18n/translations";

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

  return (
    <Ctx.Provider
      value={{
        workspace,
        setWorkspace,
        lang,
        setLang,
        backend,
        setBackend,
        dataFolder,
        setDataFolder,
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
