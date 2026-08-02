"use client";

import { useSandboxMode } from "@/lib/sandbox-mode";

/**
 * Persistent Test / Live pill for list-page title rows and detail headers.
 * Reads the active mode from SandboxModeProvider.
 */
export function ModeBadge() {
  const { isSandbox } = useSandboxMode();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        isSandbox
          ? "bg-amber-50 border-amber-300 text-amber-700"
          : "bg-emerald-50 border-emerald-300 text-emerald-700"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isSandbox ? "bg-amber-500" : "bg-emerald-500"}`} />
      {isSandbox ? "Test" : "Live"}
    </span>
  );
}
