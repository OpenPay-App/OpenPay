"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Mode = "sandbox" | "production";

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

export function SandboxModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("sandbox");

  useEffect(() => {
    const saved = localStorage.getItem("openpay_mode") as Mode | null;
    if (saved === "sandbox" || saved === "production") setModeState(saved);
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem("openpay_mode", m);
  };

  const toggle = () => setMode(mode === "sandbox" ? "production" : "sandbox");

  return (
    <SandboxModeContext.Provider value={{ mode, isSandbox: mode === "sandbox", toggle, setMode }}>
      {children}
    </SandboxModeContext.Provider>
  );
}

export function useSandboxMode() {
  return useContext(SandboxModeContext);
}
