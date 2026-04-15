// App.tsx
import React from "react";
import LabWorkspace from "@/workspaces/LaborWorkspace";
import CollectorWorkspace from "@/workspaces/BeraterWorkspace";
import { AppSettingsProvider, useAppSettings } from "@/AppSettings";
import { invoke } from "@tauri-apps/api/core";

type OpenedEntry = {
  payloadData: any;
  source: "lab";
  entryId?: string;
  createdAt?: string;
};

const CURR_VERSION = "0.9.1";



function AppShell() {
  const { workspace, setWorkspace } = useAppSettings();
  const [openedEntry, setOpenedEntry] = React.useState<OpenedEntry | null>(null);
  const [collectorResetToken, setCollectorResetToken] = React.useState(0);
  const [hostname, setHostname] = React.useState<string>(""); // or null


  React.useEffect(() => {
    let cancelled = false;

    async function loadHostname() {
      try {
        const h = await invoke<string>("get_hostname");
        if (!cancelled) {
          setHostname(h);
        }
      } catch (err) {
        console.error("Failed to get hostname:", err);
      }
    }

    loadHostname();

    return () => {
      cancelled = true;
    };
  }, []); 

  // const hostname = invoke<string>("get_hostname");
  // console.log("Hostname:", hostname);

  const openInCollector = (payloadData: any, meta?: { entryId?: string; createdAt?: string }) => {
    setOpenedEntry({ payloadData, source: "lab", ...meta });
    setWorkspace("collector");
  };

  const closeCollectorView = () => {
    setOpenedEntry(null);
    setWorkspace("lab");
  };

  const workspaceSwitch = (
    <div className="inline-flex items-center bg-[hsl(var(--muted)/0.4)] rounded-md p-1">
      <button
        type="button"
        onClick={() => {
          setOpenedEntry(null);
          setCollectorResetToken((t) => t + 1);
          setWorkspace("collector");
        }}
      className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] ${
      workspace === "collector"
        ? "bg-[hsl(var(--border))] text-[hsl(var(--foreground))] shadow-sm"
        : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/0.6)]"
    }`}
      >
        Erhebung
      </button>

      <button
        type="button"
        onClick={() => setWorkspace("lab")}
        className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] ${
          workspace === "lab"
            ? "bg-[hsl(var(--border))] text-[hsl(var(--foreground))] shadow-sm"
            : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/0.6)]"
        }`}
    >
        Labor
      </button>
    </div>
  );

  return (
    <>
      <div className={workspace === "collector" ? "block" : "hidden"}>
        <CollectorWorkspace
          resetToken={collectorResetToken}
          rehydrateData={openedEntry?.payloadData ?? null}
          readOnly={openedEntry?.source === "lab"}
          openedEntryMeta={openedEntry}
          onCloseReadOnly={closeCollectorView}
          headerRight={workspaceSwitch}
          onRehydrated={() => {}}
        />
      </div>
      <div className={workspace === "lab" ? "block" : "hidden"}>
        <LabWorkspace 
          onOpenEntry={(data, meta) => openInCollector(data, meta)}
          headerRight={workspaceSwitch}
        />
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
      }}
    >
      <AppShell />
    </AppSettingsProvider>
  );
}
