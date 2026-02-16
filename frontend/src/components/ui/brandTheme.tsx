import * as React from "react";
import clsx from "clsx";

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
          "bg-[radial-gradient(ellipse_at_top,rgba(233,228,218,0.35),transparent_60%)]",
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

/** Simple header with logo + accent line; slot for right-side controls (e.g., burger) */
export function BrandHeader({
  logoSrc,
//   title = "DEVEL v0.5",
  right,
  className,
}: {
  logoSrc: string;
  title?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={clsx("mb-4 flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {logoSrc ? (
          <img
            src={logoSrc}
            // alt={title}
            className="h-10 md:h-12 lg:h-14 w-auto"
            draggable={false}
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
