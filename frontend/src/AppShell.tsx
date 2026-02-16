import React from "react";
import { useAppSettings } from "./AppSettings"; 
import CollectorWorkspace from "./workspaces/BeraterWorkspace";
import LabWorkspace from "./workspaces/LaborWorkspace";

export default function AppShell() {
    const {workspace} = useAppSettings();
    return workspace === "collector" ? <CollectorWorkspace /> : <LabWorkspace />;
}