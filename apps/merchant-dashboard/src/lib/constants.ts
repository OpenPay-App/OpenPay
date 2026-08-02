export const KEY_PREFIXES = {
  OPENPAY_TEST: "op_test_",
  OPENPAY_LIVE: "op_live_",
  PAYSTACK_TEST: "sk_test_",
  PAYSTACK_LIVE: "sk_live_",
} as const;

/**
 * Hyperswitch router v1.125.0 key prefixes. Secret API keys are
 * `{env}_{key_id}-{secret}` where env is one of `dev_` (RUN_ENV=development),
 * `snd_` (sandbox) or `prd_`/`prod_` (production). Publishable keys follow
 * `pk_{env}_…`. See docs/HYPERSWITCH_SIGNUP_TROUBLESHOOTING.md.
 */
export const HYPERSWITCH_PREFIXES = {
  DEV: "dev_",
  SANDBOX: "snd_",
  PROD: "prd_",
  PRODUCTION: "prod_",
  PUBLISHABLE: "pk_",
} as const;

export function getKeyPrefix(mode: "sandbox" | "production"): string {
  return mode === "sandbox" ? KEY_PREFIXES.OPENPAY_TEST : KEY_PREFIXES.OPENPAY_LIVE;
}

export function getPaystackPrefix(mode: "sandbox" | "production"): string {
  return mode === "sandbox" ? KEY_PREFIXES.PAYSTACK_TEST : KEY_PREFIXES.PAYSTACK_LIVE;
}

/**
 * Resolve which mode a raw key value belongs to, across all known formats
 * (OpenPay, Paystack, Hyperswitch dev/snd/prd/prod, publishable pk_*).
 * Returns `null` for keys with no recognizable prefix (the "unknown" bucket).
 */
export function keyModeOf(key: string): "sandbox" | "production" | null {
  if (
    key.startsWith(KEY_PREFIXES.OPENPAY_TEST) ||
    key.startsWith(KEY_PREFIXES.PAYSTACK_TEST) ||
    key.startsWith(HYPERSWITCH_PREFIXES.DEV) ||
    key.startsWith(HYPERSWITCH_PREFIXES.SANDBOX) ||
    key.startsWith("pk_test_") ||
    key.startsWith("pk_snd_")
  ) {
    return "sandbox";
  }
  if (
    key.startsWith(KEY_PREFIXES.OPENPAY_LIVE) ||
    key.startsWith(KEY_PREFIXES.PAYSTACK_LIVE) ||
    key.startsWith(HYPERSWITCH_PREFIXES.PROD) ||
    key.startsWith(HYPERSWITCH_PREFIXES.PRODUCTION) ||
    key.startsWith("pk_live_") ||
    key.startsWith("pk_prd_") ||
    key.startsWith("pk_prod_")
  ) {
    return "production";
  }
  return null;
}

export function isTestKey(key: string): boolean {
  return keyModeOf(key) === "sandbox";
}

export function isLiveKey(key: string): boolean {
  return keyModeOf(key) === "production";
}

/**
 * Strip a key down to a displayable masked form. Full plaintext secret keys
 * must never be shown twice — the create response is the only time they exist.
 */
export function maskKeyValue(key: string): string {
  if (key.length <= 16) return `${key.slice(0, 4)}…`;
  return `${key.slice(0, 12)}…${key.slice(-4)}`;
}
