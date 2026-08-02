"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { MODE_COOKIE, type Mode } from "./mode";

export type { Mode } from "./mode";

interface SandboxModeContextValue {
  mode: Mode;
  isSandbox: boolean;
  toggle: () => void;
  setMode: (m: Mode) => void;
}

const SandboxModeContext = createContext<SandboxModeContextValue>({
  mode: "sandbox",
  isSandbox: true,
  toggle: () => {},
  setMode: () => {},
});

/**
 * Persists the active mode in BOTH localStorage (fast client reads) and a
 * `openpay_mode` cookie (so Next.js Server Components / route handlers can
 * resolve the mode server-side). The two must always agree — keep them updated
 * together here and nowhere else.
 */
function writeMode(mode: Mode) {
  localStorage.setItem(MODE_COOKIE, mode);
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=31536000; SameSite=Lax`;
}

export function SandboxModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("sandbox");

  useEffect(() => {
    const saved = localStorage.getItem(MODE_COOKIE) as Mode | null;
    if (saved === "sandbox" || saved === "production") {
      setModeState(saved);
      // Make sure the cookie reflects an existing localStorage value from
      // before this change (e.g. users who set the mode pre-Phase-3).
      if (readModeCookie() !== saved) writeMode(saved);
    }
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    writeMode(m);
  };

  const toggle = () => setMode(mode === "sandbox" ? "production" : "sandbox");

  return (
    <SandboxModeContext.Provider value={{ mode, isSandbox: mode === "sandbox", toggle, setMode }}>
      {children}
    </SandboxModeContext.Provider>
  );
}

function readModeCookie(): string | null {
  const prefix = `${MODE_COOKIE}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
  }
  return null;
}

export function useSandboxMode() {
  return useContext(SandboxModeContext);
}
