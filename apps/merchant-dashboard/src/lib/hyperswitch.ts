import {
  Payment,
  PaymentListResponse,
  RefundResponse,
  Customer,
  ApiResponse,
  ApiKey,
  WebhookEndpoint,
  Connector,
  BusinessProfile,
  Product,
  PricingTier,
  Subscription,
  Invoice,
  RevenueMetric,
  CustomerMetric,
  PaymentMetric,
  TopCustomer,
  FailureReason,
  FraudRule,
  FraudCase,
  ServiceHealth,
  AlertLog,
  Currency,
} from "./types";
import { getMode, modeToEnvironment, type Mode } from "./mode";

// ── Per-mode configuration ────────────────────────────────────────────────
// Phase 3: the client resolves test/live credentials separately. Per-mode
// pairs win, the legacy single `HYPERSWITCH_URL` / `HYPERSWITCH_API_KEY`
// remains the backwards-compatible fallback, and a hardcoded localhost is the
// last resort. Server-side, a live-mode request with NO live credential fails
// fast instead of silently reusing the test key.

interface HyperConfig {
  baseUrl: string;
  apiKey: string;
}

function envOr(name: string): string | undefined {
  return process.env[name] || process.env[`NEXT_PUBLIC_${name}`];
}

const isServer = typeof window === "undefined";

export function getHyperswitchConfig(mode: Mode): HyperConfig {
  const env = modeToEnvironment(mode); // "test" | "live"

  const testUrl = envOr("HYPERSWITCH_URL_TEST");
  const liveUrl = envOr("HYPERSWITCH_URL_LIVE");
  const testKey = envOr("HYPERSWITCH_API_KEY_TEST");
  const liveKey = envOr("HYPERSWITCH_API_KEY_LIVE");

  const legacyUrl = process.env.HYPERSWITCH_URL || process.env.NEXT_PUBLIC_HYPERSWITCH_URL || "http://localhost:8081";
  const legacyKey = process.env.HYPERSWITCH_API_KEY || process.env.NEXT_PUBLIC_HYPERSWITCH_API_KEY || "";

  const baseUrl = (env === "test" ? testUrl : liveUrl) || legacyUrl;
  const apiKey = (env === "test" ? testKey : liveKey) || legacyKey;

  // Fail fast on the server: never let a production request silently run on
  // test-only credentials. The browser can't see the secret keys, so the real
  // gate lives here (server route handlers / server components).
  if (mode === "production" && isServer && !liveKey && !legacyKey) {
    throw new HyperswitchError(
      "Live mode is not configured. Set HYPERSWITCH_URL_LIVE and " +
        "HYPERSWITCH_API_KEY_LIVE (or the legacy HYPERSWITCH_URL / " +
        "HYPERSWITCH_API_KEY) before sending live requests. Refusing to " +
        "reuse test credentials for a production request.",
      503
    );
  }

  return { baseUrl, apiKey };
}

/** The public publishable key for a mode (used by the checkout page). */
export function getPublishableKey(mode: Mode): string {
  const env = modeToEnvironment(mode);
  return (
    (env === "test"
      ? process.env.NEXT_PUBLIC_OPENPAY_PUBLISHABLE_KEY_TEST
      : process.env.NEXT_PUBLIC_OPENPAY_PUBLISHABLE_KEY_LIVE) ||
    process.env.NEXT_PUBLIC_HYPERSWITCH_PUBLISHABLE_KEY ||
    ""
  );
}

/** Whether the active mode has at least one usable credential configured. */
export function hasModeCredential(mode: Mode): boolean {
  const testKey = envOr("HYPERSWITCH_API_KEY_TEST");
  const liveKey = envOr("HYPERSWITCH_API_KEY_LIVE");
  if (mode === "sandbox") return Boolean(testKey);
  // For production, only a dedicated live key counts — never fall back to
  // the legacy key which may be a test credential.
  return Boolean(liveKey);
}

// ── Mode-aware fetch ───────────────────────────────────────────────────────

export class HyperswitchError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "HyperswitchError";
  }
}

interface HyperFetchOptions extends RequestInit {
  /** Explicit mode. Falls back to header → browser cookie → env → sandbox. */
  resolveMode?: Mode;
}

export async function hyperswitchFetch<T>(
  path: string,
  options: HyperFetchOptions = {}
): Promise<T> {
  const { resolveMode, ...fetchOptions } = options;
  const mode = resolveMode ?? getMode();
  const { baseUrl, apiKey } = getHyperswitchConfig(mode);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(apiKey ? { "api-key": apiKey } : {}),
    // Let downstream / logs know which scope this request belongs to.
    "X-OpenPay-Mode": mode,
    ...(options.headers as Record<string, string>),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...fetchOptions,
      headers,
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      throw new HyperswitchError(
        `Hyperswitch API error ${res.status}: ${errorBody || res.statusText}`,
        res.status
      );
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof HyperswitchError) throw err;
    throw new HyperswitchError(
      `Cannot reach Hyperswitch at ${baseUrl} — ${(err as Error).message}`
    );
  } finally {
    clearTimeout(timeout);
  }
}

// ── Payments ──────────────────────────────────────────────────────────────

export async function listPayments(
  params?: {
    limit?: number;
    starting_after?: string;
    created?: { gt?: number; lt?: number };
  },
  mode?: Mode
): Promise<PaymentListResponse> {
  try {
    const body: Record<string, unknown> = {
      limit: params?.limit || 20,
    };
    if (params?.starting_after) body.starting_after = params.starting_after;
    if (params?.created?.gt || params?.created?.lt) {
      const filters: Record<string, number> = {};
      if (params.created.gt) filters.gt = params.created.gt;
      if (params.created.lt) filters.lt = params.created.lt;
      body.filters = filters;
    }

    return await hyperswitchFetch<PaymentListResponse>(`/payments/list`, {
      method: "POST",
      body: JSON.stringify(body),
      resolveMode: mode,
    });
  } catch {
    return { data: [] };
  }
}

export async function getPayment(id: string, mode?: Mode): Promise<Payment> {
  const res = await hyperswitchFetch<Payment>(`/payments/${id}`, {
    method: "POST",
    body: JSON.stringify({}),
    resolveMode: mode,
  });
  return res;
}

export async function refundPayment(id: string, amount?: number, mode?: Mode): Promise<RefundResponse> {
  const body: Record<string, unknown> = {
    payment_id: id,
  };
  if (amount) body.amount = amount;

  const res = await hyperswitchFetch<RefundResponse>(`/refunds`, {
    method: "POST",
    body: JSON.stringify(body),
    resolveMode: mode,
  });
  return res;
}

// ── Customers ─────────────────────────────────────────────────────────────

export async function getCustomer(id: string, mode?: Mode): Promise<Customer> {
  const res = await hyperswitchFetch<Customer>(`/customers/${id}`, {
    method: "POST",
    body: JSON.stringify({}),
    resolveMode: mode,
  });
  return res;
}

export async function listCustomers(
  params?: {
    limit?: number;
    starting_after?: string;
  },
  mode?: Mode
): Promise<{ data: Customer[]; next?: string }> {
  const body: Record<string, unknown> = {
    limit: params?.limit || 20,
  };
  if (params?.starting_after) body.starting_after = params.starting_after;

  return hyperswitchFetch(`/customers/list`, {
    method: "POST",
    body: JSON.stringify(body),
    resolveMode: mode,
  });
}

// ── Health ────────────────────────────────────────────────────────────────

export async function checkHealth(mode?: Mode): Promise<{ status: string }> {
  return hyperswitchFetch("/health", { resolveMode: mode });
}

// ── Settings: API Keys ────────────────────────────────────────────────────
// Phase 3: keys are the backend's source of truth (Hyperswitch `/api_keys`),
// NOT localStorage. The client-facing wrappers below proxy through the
// dashboard API routes so the merchant id / admin key never reach the browser.
// Publishable keys are account-level (`pk_*`) and come from env; secret keys
// are created per merchant via the router's /api_keys endpoints and are shown
// in plaintext exactly once, at creation.

function hyperKeyToApiKey(k: any, mode: Mode): ApiKey {
  return {
    api_key: k.api_key || k.prefix || "",
    key_id: k.key_id,
    name: k.name || "Untitled key",
    created: k.created || new Date().toISOString(),
    expires: k.expiration && k.expiration !== "never" ? k.expiration : undefined,
    enabled: !k.revoked,
    role: "secret",
    mode,
  };
}

/** Server-only: list Hyperswitch API keys for a mode's merchant account. */
export async function listHyperApiKeys(mode: Mode): Promise<{ data: ApiKey[]; publishable_key: string }> {
  const merchantId = getMerchantId(mode);
  const adminKey = getAdminApiKey();
  const res = await hyperswitchFetch<any>(`/api_keys/list`, {
    method: "GET",
    resolveMode: mode,
    headers: {
      "X-Merchant-Id": merchantId,
      ...(adminKey ? { "api-key": adminKey } : {}),
    },
  });
  const rows = Array.isArray(res) ? res : res?.data || [];
  return {
    data: rows.map((k: any) => hyperKeyToApiKey(k, mode)),
    publishable_key: getPublishableKey(mode),
  };
}

/** Server-only: create a Hyperswitch API key for a mode's merchant account. */
export async function createHyperApiKey(
  mode: Mode,
  name: string,
  description?: string
): Promise<ApiResponse<ApiKey>> {
  const merchantId = getMerchantId(mode);
  const adminKey = getAdminApiKey();
  const res = await hyperswitchFetch<any>(`/api_keys/${merchantId}`, {
    method: "POST",
    resolveMode: mode,
    headers: {
      "X-Merchant-Id": merchantId,
      ...(adminKey ? { "api-key": adminKey } : {}),
    },
    body: JSON.stringify({
      name,
      ...(description ? { description } : {}),
      expiration: "never",
    }),
  });
  return { data: hyperKeyToApiKey(res, mode) };
}

/** Server-only: revoke a Hyperswitch API key by key id. */
export async function revokeHyperApiKey(mode: Mode, keyId: string): Promise<void> {
  const adminKey = getAdminApiKey();
  await hyperswitchFetch<any>(`/api_keys/${keyId}`, {
    method: "DELETE",
    resolveMode: mode,
    headers: adminKey ? { "api-key": adminKey } : {},
  });
}

/** Client-facing: list keys for the active mode through the dashboard API. */
export async function listApiKeys(): Promise<{ data: ApiKey[]; publishable_key: string }> {
  const mode = getMode();
  const res = await fetch(`/api/api-keys`, {
    headers: { "X-OpenPay-Mode": mode },
  });
  if (!res.ok) throw new HyperswitchError(`Failed to load API keys (${res.status})`, res.status);
  return res.json();
}

export async function createApiKey(
  name: string,
  mode: Mode = "sandbox"
): Promise<ApiResponse<ApiKey>> {
  const res = await fetch(`/api/api-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-OpenPay-Mode": mode,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return {
      data: null as any,
      error: { type: "api_error", message: body?.error || `Failed to create API key (${res.status})` },
    };
  }
  return res.json();
}

export async function deleteApiKey(keyId: string): Promise<void> {
  const mode = getMode();
  const res = await fetch(`/api/api-keys/${encodeURIComponent(keyId)}`, {
    method: "DELETE",
    headers: { "X-OpenPay-Mode": mode },
  });
  if (!res.ok) throw new HyperswitchError(`Failed to revoke API key (${res.status})`, res.status);
}

/** Merchant account id for a mode (test and live are separate scopes). */
export function getMerchantId(mode: Mode): string {
  const env = modeToEnvironment(mode);
  return (
    (env === "test"
      ? process.env.HYPERSWITCH_MERCHANT_ID_TEST
      : process.env.HYPERSWITCH_MERCHANT_ID_LIVE) || "default"
  );
}

/**
 * Admin credential used to manage API keys. Must match the router's
 * ROUTER__SECRETS__ADMIN_API_KEY. Falls back to the legacy API key.
 */
function getAdminApiKey(): string {
  return (
    process.env.HYPERSWITCH_ADMIN_API_KEY ||
    process.env.HYPERSWITCH_API_KEY ||
    process.env.NEXT_PUBLIC_HYPERSWITCH_API_KEY ||
    ""
  );
}

// ── Settings: Webhooks ────────────────────────────────────────────────────

export async function listWebhooks(): Promise<{ data: WebhookEndpoint[] }> {
  try {
    const res = await hyperswitchFetch<any>("/webhooks/list", {
      method: "POST",
      body: JSON.stringify({}),
    });
    return { data: res.data || [] };
  } catch {
    return { data: [] };
  }
}

export async function createWebhook(url: string, events: string[]): Promise<ApiResponse<WebhookEndpoint>> {
  try {
    const res = await hyperswitchFetch<any>("/webhooks", {
      method: "POST",
      body: JSON.stringify({ url, events }),
    });
    return { data: res };
  } catch {
    return { data: null as any, error: { type: "api_error", message: "Failed to create webhook" } };
  }
}

export async function deleteWebhook(id: string): Promise<void> {
  try {
    await hyperswitchFetch(`/webhooks/${id}`, { method: "DELETE" });
  } catch {
    // silently fail
  }
}

// ── Settings: Connectors ──────────────────────────────────────────────────

export async function listConnectors(): Promise<{ data: Connector[] }> {
  try {
    const res = await hyperswitchFetch<{ data: any[] }>(
      "/account/default/connectors/list",
      { method: "POST", body: JSON.stringify({}) }
    );
    return {
      data: (res.data || []).map((c: any) => ({
        connector_id: c.merchant_connector_id || c.connector_name,
        connector_type: c.connector_type || "payment_processor",
        connector_name: c.connector_name || "unknown",
        enabled: !c.disabled,
        test_mode: c.test_mode ?? true,
        supported_currencies: c.payment_methods_enabled?.[0]?.accepted_currencies || ["USD"],
        created: c.created_at || new Date().toISOString(),
      })),
    };
  } catch {
    return { data: [] };
  }
}

export async function toggleConnector(id: string, enabled: boolean): Promise<void> {
  try {
    await hyperswitchFetch(`/account/default/connectors/${id}`, {
      method: "POST",
      body: JSON.stringify({ disabled: !enabled }),
    });
  } catch {
    // Connector toggle not available — silently fail
  }
}

// ── Settings: Business Profile ────────────────────────────────────────────
// Phase 3: the local cache is namespaced by mode so switching never leaks a
// live profile into the test view (or vice versa).

function profileCacheKey(mode: Mode): string {
  return `openpay_business_profile:${mode}`;
}

function readProfileCache(mode: Mode): Partial<BusinessProfile> | null {
  try {
    const raw = localStorage.getItem(profileCacheKey(mode));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeProfileCache(mode: Mode, profile: BusinessProfile): void {
  try {
    localStorage.setItem(profileCacheKey(mode), JSON.stringify(profile));
  } catch {}
}

export async function getBusinessProfile(mode?: Mode): Promise<BusinessProfile> {
  const activeMode = mode ?? getMode();
  let apiProfile: BusinessProfile;
  try {
    const res = await hyperswitchFetch<any>(
      "/account/default/business_profile/list",
      { method: "POST", body: JSON.stringify({}), resolveMode: activeMode }
    );
    const profile = res.data?.[0] || res;
    apiProfile = {
      business_name: profile.business_name || profile.profile_name || "Default Merchant",
      default_currency: (profile.default_currency as Currency) || "USD",
      timezone: profile.timezone || "UTC",
      support_email: profile.support_email || "support@example.com",
      website: profile.website || "",
      logo_url: profile.logo_url,
    };
  } catch {
    apiProfile = {
      business_name: "Default Merchant",
      default_currency: "USD",
      timezone: "UTC",
      support_email: "support@example.com",
      website: "",
    };
  }

  const cached = readProfileCache(activeMode);
  if (cached) {
    apiProfile = { ...apiProfile, ...cached };
  }
  writeProfileCache(activeMode, apiProfile);
  return apiProfile;
}

export async function updateBusinessProfile(profile: Partial<BusinessProfile>): Promise<void> {
  const mode = getMode();
  const current = readProfileCache(mode) || {};
  const updated = { ...current, ...profile };
  writeProfileCache(mode, updated as BusinessProfile);

  try {
    await hyperswitchFetch("/account/default/business_profile", {
      method: "POST",
      resolveMode: mode,
      body: JSON.stringify({
        profile_name: profile.business_name,
        default_currency: profile.default_currency,
      }),
    });
  } catch {
    // API update not available — localStorage is source of truth
  }
}

// ── Subscriptions: Products ───────────────────────────────────────────────

export async function listProducts(): Promise<{ data: Product[] }> {
  try {
    return await hyperswitchFetch<{ data: Product[] }>("/products");
  } catch {
    return { data: [] };
  }
}

export async function createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
  try {
    return await hyperswitchFetch<ApiResponse<Product>>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { data: null as any };
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await hyperswitchFetch(`/products/${id}`, { method: "DELETE" });
  } catch {}
}

// ── Subscriptions: Pricing Tiers ──────────────────────────────────────────

export async function listPricingTiers(productId?: string): Promise<{ data: PricingTier[] }> {
  try {
    const qs = productId ? `?product_id=${productId}` : "";
    return await hyperswitchFetch<{ data: PricingTier[] }>(`/pricing_tiers${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function createPricingTier(data: Partial<PricingTier>): Promise<ApiResponse<PricingTier>> {
  try {
    return await hyperswitchFetch<ApiResponse<PricingTier>>("/pricing_tiers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { data: null as any };
  }
}

export async function deletePricingTier(id: string): Promise<void> {
  try {
    await hyperswitchFetch(`/pricing_tiers/${id}`, { method: "DELETE" });
  } catch {}
}

// ── Subscriptions: Subscriptions ──────────────────────────────────────────

export async function listSubscriptions(params?: { limit?: number; status?: string }): Promise<{ data: Subscription[] }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    const qs = searchParams.toString();
    return await hyperswitchFetch<{ data: Subscription[] }>(`/subscriptions${qs ? `?${qs}` : ""}`);
  } catch {
    return { data: [] };
  }
}

export async function getSubscription(id: string): Promise<Subscription | null> {
  try {
    const res = await hyperswitchFetch<ApiResponse<Subscription>>(`/subscriptions/${id}`);
    return res.data || null;
  } catch {
    return null;
  }
}

export async function cancelSubscription(id: string): Promise<void> {
  try { await hyperswitchFetch(`/subscriptions/${id}/cancel`, { method: "POST" }); } catch {}
}

export async function pauseSubscription(id: string): Promise<void> {
  try { await hyperswitchFetch(`/subscriptions/${id}/pause`, { method: "POST" }); } catch {}
}

export async function resumeSubscription(id: string): Promise<void> {
  try { await hyperswitchFetch(`/subscriptions/${id}/resume`, { method: "POST" }); } catch {}
}

// ── Subscriptions: Invoices ───────────────────────────────────────────────

export async function listInvoices(params?: { limit?: number; status?: string }): Promise<{ data: Invoice[] }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    const qs = searchParams.toString();
    return await hyperswitchFetch<{ data: Invoice[] }>(`/invoices${qs ? `?${qs}` : ""}`);
  } catch {
    return { data: [] };
  }
}

export async function getInvoice(id: string, mode?: Mode): Promise<Invoice | null> {
  try {
    const res = await hyperswitchFetch<ApiResponse<Invoice>>(`/invoices/${id}`, { resolveMode: mode });
    return res.data || null;
  } catch {
    return null;
  }
}

export async function sendInvoice(id: string, mode?: Mode): Promise<void> {
  try { await hyperswitchFetch(`/invoices/${id}/send`, { method: "POST", resolveMode: mode }); } catch {}
}

// ── Analytics ─────────────────────────────────────────────────────────────

export async function getRevenueMetrics(days?: number): Promise<{ data: RevenueMetric[] }> {
  try {
    const qs = days ? `?days=${days}` : "";
    return await hyperswitchFetch<{ data: RevenueMetric[] }>(`/analytics/revenue${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function getCustomerMetrics(days?: number): Promise<{ data: CustomerMetric[] }> {
  try {
    const qs = days ? `?days=${days}` : "";
    return await hyperswitchFetch<{ data: CustomerMetric[] }>(`/analytics/customers${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function getPaymentMetrics(days?: number): Promise<{ data: PaymentMetric[] }> {
  try {
    const qs = days ? `?days=${days}` : "";
    return await hyperswitchFetch<{ data: PaymentMetric[] }>(`/analytics/payments${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function getTopCustomers(limit?: number): Promise<{ data: TopCustomer[] }> {
  try {
    const qs = limit ? `?limit=${limit}` : "";
    return await hyperswitchFetch<{ data: TopCustomer[] }>(`/analytics/top-customers${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function getFailureReasons(days?: number): Promise<{ data: FailureReason[] }> {
  try {
    const qs = days ? `?days=${days}` : "";
    return await hyperswitchFetch<{ data: FailureReason[] }>(`/analytics/failure-reasons${qs}`);
  } catch {
    return { data: [] };
  }
}

// ── Admin: Fraud Rules ────────────────────────────────────────────────────

export async function getFraudRules(): Promise<{ data: FraudRule[] }> {
  try { return await hyperswitchFetch<{ data: FraudRule[] }>("/rules"); } catch { return { data: [] }; }
}

export async function createFraudRule(rule: Partial<FraudRule>): Promise<ApiResponse<FraudRule>> {
  try {
    return await hyperswitchFetch<ApiResponse<FraudRule>>("/rules", { method: "POST", body: JSON.stringify(rule) });
  } catch { return { data: null as any }; }
}

export async function updateFraudRule(id: string, rule: Partial<FraudRule>): Promise<void> {
  try { await hyperswitchFetch(`/rules/${id}`, { method: "PUT", body: JSON.stringify(rule) }); } catch {}
}

export async function deleteFraudRule(id: string): Promise<void> {
  try { await hyperswitchFetch(`/rules/${id}`, { method: "DELETE" }); } catch {}
}

// ── Admin: Cases ──────────────────────────────────────────────────────────

export async function getFraudCases(): Promise<{ data: FraudCase[] }> {
  try { return await hyperswitchFetch<{ data: FraudCase[] }>("/cases"); } catch { return { data: [] }; }
}

export async function getFraudCase(id: string): Promise<FraudCase | null> {
  try {
    const res = await hyperswitchFetch<ApiResponse<FraudCase>>(`/cases/${id}`);
    return res.data || null;
  } catch {
    return null;
  }
}

export async function updateFraudCase(id: string, data: Partial<FraudCase>): Promise<void> {
  try { await hyperswitchFetch(`/cases/${id}`, { method: "PATCH", body: JSON.stringify(data) }); } catch {}
}

// ── Admin: System Health ──────────────────────────────────────────────────

export async function getSystemHealth(): Promise<{ data: ServiceHealth[] }> {
  try { return await hyperswitchFetch<{ data: ServiceHealth[] }>("/health/all"); } catch { return { data: [] }; }
}

export async function getAlertLogs(limit?: number): Promise<{ data: AlertLog[] }> {
  try {
    const qs = limit ? `?limit=${limit}` : "";
    return await hyperswitchFetch<{ data: AlertLog[] }>(`/alerts${qs}`);
  } catch { return { data: [] }; }
}
