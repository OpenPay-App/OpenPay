import { cookies } from "next/headers";
import { AlertTriangle } from "lucide-react";
import { MODE_COOKIE, validateMode, type Mode } from "@/lib/mode";
import { hasModeCredential } from "@/lib/hyperswitch";

/**
 * Server-rendered amber banner shown when the active mode has no matching
 * credential configured. Reuses the profile-error-banner pattern: instead of
 * silently degrading (a test key being used for a live request), we point the
 * operator at the env setup.
 */
export async function ModeConfigBanner() {
  const cookieStore = await cookies();
  const mode: Mode = validateMode(cookieStore.get(MODE_COOKIE)?.value) ?? "sandbox";

  if (hasModeCredential(mode)) return null;

  const suffix = mode === "production" ? "LIVE" : "TEST";
  const label = mode === "production" ? "Live" : "Test";

  return (
    <div className="mx-8 mt-4 px-4 py-3 rounded-lg bg-amber-950 border border-amber-500/30 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-300">
          {label} mode has no credentials configured
        </p>
        <p className="text-xs text-amber-400/70 mt-0.5">
          Set <code className="font-mono">HYPERSWITCH_URL_{suffix}</code> and{" "}
          <code className="font-mono">HYPERSWITCH_API_KEY_{suffix}</code> in your
          environment — see the env reference for details. Live requests will
          fail fast until then, never silently reuse {mode === "production" ? "test" : "live"} keys.
        </p>
      </div>
    </div>
  );
}
