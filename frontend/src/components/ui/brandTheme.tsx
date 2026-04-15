import * as React from "react";
import clsx from "clsx";
import type { ReactNode } from "react";

/** Page wrapper that applies the AHD theme and optional background */
export function BrandTheme({
  children,
  dark = false,
  background = true,
  className,
}: {
  children: React.ReactNode;
  dark?: boolean;
  background?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "ahd-theme min-h-screen text-foreground bg-background",
        dark && "dark",
        background &&
          "bg-[linear-gradient(to_right,rgba(255,255,255,0.99),transparent_80%)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Content container with comfortable max width */
export function BrandPage({
  children,
  className,
  maxWidth = "max-w-[1280px]",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string; // e.g. "max-w-screen-2xl" or "max-w-none"
  padded?: boolean;
}) {
  return (
    <div
      className={clsx(
        "w-full mx-auto",
        maxWidth,
        padded ? "px-6 py-4" : "",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BrandHeader({
  logoSrc,
  logo,
  right,
  className,
}: {
  logoSrc?: string;
  logo?: ReactNode;
  title?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={clsx("mb-4 flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {logo ? (
  logo
) : logoSrc ? (
  <img
    src={logoSrc}
    alt="Logo"
    className="h-14 w-auto object-contain"
  />
) : null}
        <div className="hidden sm:block">

</div>
      </div>
      {right}
    </header>
  );
}

/** Reusable chip class tokens (selected vs. idle) */
export const chipBase =
  "px-3 py-1 text-sm rounded-md border transition-colors";
export const chipOn =
  "bg-primary text-primary-foreground border-primary shadow-sm";
export const chipOff =
  "bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
