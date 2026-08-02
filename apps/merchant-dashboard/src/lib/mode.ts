/**
 * Server-aware mode resolution for the sandbox / production dual-mode alignment.
 *
 * A request's mode is resolved, in priority order:
 *   1. `?mode=` query param
 *   2. `X-OpenPay-Mode` header (set by the browser client from the cookie)
 *   3. `openpay_mode` cookie
 *   4. `NEXT_PUBLIC_OPENPAY_MODE` env
 *   5. `"sandbox"` (the default)
 *
 * This module is safe to import from both client and server code. Reading the
 * browser cookie is guarded by a `typeof document` check so route handlers /
 * server components can reuse it without a window.
 */

export type Mode = "sandbox" | "production";

export const MODE_COOKIE = "openpay_mode";

export const MODES: readonly Mode[] = ["sandbox", "production"] as const;

export function validateMode(value: unknown): Mode | null {
  return value === "sandbox" || value === "production" ? value : null;
}

export function isMode(value: unknown): value is Mode {
  return validateMode(value) !== null;
}

/** Read the mode out of a raw `Cookie` request header. */
export function readModeFromCookieHeader(cookieHeader: string | null): Mode | null {
  if (!cookieHeader) return null;
  const prefix = `${MODE_COOKIE}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return validateMode(trimmed.slice(prefix.length));
    }
  }
  return null;
}

/** Same value written to localStorage by SandboxModeProvider. */
export function modeToEnvironment(mode: Mode): "test" | "live" {
  return mode === "sandbox" ? "test" : "live";
}

interface ModeSource {
  url: string;
  headers: Headers;
}

export function getMode(request?: ModeSource): Mode {
  if (request) {
    const url = new URL(request.url);

    const query = validateMode(url.searchParams.get("mode"));
    if (query) return query;

    const header = validateMode(request.headers.get("X-OpenPay-Mode"));
    if (header) return header;

    const cookie = readModeFromCookieHeader(request.headers.get("cookie"));
    if (cookie) return cookie;
  }

  if (typeof document !== "undefined") {
    const browser = readModeFromCookieHeader(document.cookie);
    if (browser) return browser;
  }

  const env = validateMode(process.env.NEXT_PUBLIC_OPENPAY_MODE);
  if (env) return env;

  return "sandbox";
}
