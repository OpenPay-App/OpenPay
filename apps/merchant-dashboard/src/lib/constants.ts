export const KEY_PREFIXES = {
  OPENPAY_TEST: "op_test_",
  OPENPAY_LIVE: "op_live_",
  PAYSTACK_TEST: "sk_test_",
  PAYSTACK_LIVE: "sk_live_",
} as const;

export function getKeyPrefix(mode: "sandbox" | "production"): string {
  return mode === "sandbox" ? KEY_PREFIXES.OPENPAY_TEST : KEY_PREFIXES.OPENPAY_LIVE;
}

export function getPaystackPrefix(mode: "sandbox" | "production"): string {
  return mode === "sandbox" ? KEY_PREFIXES.PAYSTACK_TEST : KEY_PREFIXES.PAYSTACK_LIVE;
}

export function isTestKey(key: string): boolean {
  return key.startsWith(KEY_PREFIXES.OPENPAY_TEST) || key.startsWith(KEY_PREFIXES.PAYSTACK_TEST);
}

export function isLiveKey(key: string): boolean {
  return key.startsWith(KEY_PREFIXES.OPENPAY_LIVE) || key.startsWith(KEY_PREFIXES.PAYSTACK_LIVE);
}
