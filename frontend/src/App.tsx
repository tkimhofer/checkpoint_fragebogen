// App.tsx
import React from "react";
import LabWorkspace from "@/workspaces/LaborWorkspace";
import CollectorWorkspace from "@/workspaces/BeraterWorkspace";
import { AppSettingsProvider, useAppSettings } from "@/AppSettings";

type OpenedEntry = {
  payloadData: any;
  source: "lab";
  entryId?: string;
  createdAt?: string;
};

const CURR_VERSION = "0.80";

function AppShell() {
  const { workspace, setWorkspace } = useAppSettings();
  const [openedEntry, setOpenedEntry] = React.useState<OpenedEntry | null>(null);

  const openInCollector = (payloadData: any, meta?: { entryId?: string; createdAt?: string }) => {
    setOpenedEntry({ payloadData, source: "lab", ...meta });
    setWorkspace("collector");
  };

  const closeCollectorView = () => {
    setOpenedEntry(null);
    setWorkspace("lab");
  };

  return (
    <>
      {/* Keep both mounted so Lab keeps its loaded entries state */}
      <div className={workspace === "collector" ? "block" : "hidden"}>
        <CollectorWorkspace
          rehydrateData={openedEntry?.payloadData ?? null}
          readOnly={openedEntry?.source === "lab"}
          openedEntryMeta={openedEntry}
          onCloseReadOnly={closeCollectorView}
          onRehydrated={() => {}}
        />
      </div>

      <div className={workspace === "lab" ? "block" : "hidden"}>
        <LabWorkspace onOpenEntry={(data, meta) => openInCollector(data, meta)} />
      </div>

      {/* Temporary dev-only floating switch */}
      <div className="fixed bottom-4 left-4 flex gap-2">
        <button onClick={() => setWorkspace("collector")}>Erhebung</button>
        <button onClick={() => setWorkspace("lab")}>Labor</button>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppSettingsProvider
      meta={{
        version: CURR_VERSION,
        contactEmail: "feedback@tkimhofer.dev",
        // repoUrl: "github.com/…", // optional
      }}
    >
      <AppShell />
    </AppSettingsProvider>
  );
}
