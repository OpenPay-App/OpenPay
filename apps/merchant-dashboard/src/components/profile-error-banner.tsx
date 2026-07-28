"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useBusinessProfile } from "@/lib/business-profile-context";

export function ProfileErrorBanner() {
  const { error, loading, refresh } = useBusinessProfile();

  if (loading || !error) return null;

  const isConnectionError = error.includes("Cannot reach Hyperswitch");

  return (
    <div className="mx-8 mt-4 px-4 py-3 rounded-lg bg-amber-950 border border-amber-500/30 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-300">
          {isConnectionError
            ? "Cannot connect to Hyperswitch — using cached settings"
            : "Failed to load business profile — using cached settings"}
        </p>
        <p className="text-xs text-amber-400/70 mt-0.5">
          Currency and timezone may not reflect the latest changes. Make sure the backend is running.
        </p>
      </div>
      <button
        onClick={refresh}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950 border border-amber-500/30 rounded-lg hover:bg-amber-900/50 transition-colors shrink-0"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry
      </button>
    </div>
  );
}
