"use client";

import { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Bell, Search, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useSandboxMode } from "@/lib/sandbox-mode";

export function Topbar() {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();
  const { toggle, isSandbox } = useSandboxMode();
  const [showWarning, setShowWarning] = useState(false);

  const handleToggle = () => {
    if (isSandbox) {
      // Switching to production — show confirmation
      setShowWarning(true);
    } else {
      toggle();
    }
  };

  const confirmProduction = () => {
    toggle();
    setShowWarning(false);
  };

  return (
    <>
      {/* Production warning modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 max-w-md mx-4 shadow-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Switch to Production?
              </h3>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              You are about to switch to <strong>live production mode</strong>.
              All API requests will hit your real payment processors and charge
              real money. Make sure your Hyperswitch instance is configured for
              production credentials.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmProduction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Switch to Production
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="h-16 bg-black border-b border-border flex items-center justify-between px-8">
        {/* Search */}          <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg px-4 py-2 w-96 border border-border">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search payments, customers..."
            className="bg-transparent text-sm text-white placeholder:text-text-muted outline-none w-full"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Sandbox / Production Toggle */}
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
              isSandbox
                ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                : "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSandbox ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            {isSandbox ? "Sandbox" : "Production"}
          </button>

          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
          </button>

          <div className="flex items-center gap-3">
            {user?.picture ? (
              <Image
                src={user.picture}
                alt={user.given_name || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-semibold">
                {user?.given_name?.[0] || "U"}
              </div>
            )}
            <div className="text-sm">
              <div className="font-medium text-text-primary">
                {user?.given_name} {user?.family_name}
              </div>
              <div className="text-text-muted text-xs">{user?.email}</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
