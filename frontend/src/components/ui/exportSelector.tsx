import React from "react";
// import { invoke } from "@tauri-apps/api/core";
// import { useState } from "react";


export type BackendTarget = "json" | "datenbank";

type BackendSwitchProps = {
  value: BackendTarget;
  onChange: (value: BackendTarget) => void;
};

export function BackendSwitch({ value, onChange }: BackendSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">JSON Datei</span>

      <button
        type="button"
        role="switch"
        aria-checked={value === "datenbank"}
        // aria-disabled="true"
        onClick={() =>
          onChange(value === "json" ? "datenbank" : "json")
        }
        className={`
          cursor-pointer
          relative inline-flex h-6 w-11 items-center rounded-full transition
          ${value === "datenbank" ? "bg-blue-600" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition
            ${value === "datenbank" ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>

      <span className="text-sm">Datenbank</span>
    </div>
  );
}
