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

// Server-side: use the Docker service name (hyperswitch:8080)
// Client-side / browser: use the public-facing port (localhost:8081)
const BASE_URL =
  process.env.HYPERSWITCH_URL ||
  (typeof window === "undefined"
    ? "http://hyperswitch:8080"
    : "http://localhost:8081");
const API_KEY = process.env.HYPERSWITCH_API_KEY || process.env.NEXT_PUBLIC_HYPERSWITCH_API_KEY || "";

export class HyperswitchError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "HyperswitchError";
  }
}

export async function hyperswitchFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "api-key": API_KEY } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
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
      `Cannot reach Hyperswitch at ${BASE_URL} — ${(err as Error).message}`
    );
  } finally {
    clearTimeout(timeout);
  }
}

// ── Payments ──────────────────────────────────────────────

export async function listPayments(params?: {
  limit?: number;
  starting_after?: string;
  created?: { gt?: number; lt?: number };
}): Promise<PaymentListResponse> {
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
    });
  } catch {
    return { data: [] };
  }
}

export async function getPayment(id: string): Promise<Payment> {
  const res = await hyperswitchFetch<Payment>(`/payments/${id}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return res;
}

export async function refundPayment(id: string, amount?: number): Promise<RefundResponse> {
  const body: Record<string, unknown> = {
    payment_id: id,
  };
  if (amount) body.amount = amount;

  const res = await hyperswitchFetch<RefundResponse>(`/refunds`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

// ── Customers ─────────────────────────────────────────────

export async function getCustomer(id: string): Promise<Customer> {
  const res = await hyperswitchFetch<Customer>(`/customers/${id}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return res;
}

export async function listCustomers(params?: {
  limit?: number;
  starting_after?: string;
}): Promise<{ data: Customer[]; next?: string }> {
  const body: Record<string, unknown> = {
    limit: params?.limit || 20,
  };
  if (params?.starting_after) body.starting_after = params.starting_after;

  return hyperswitchFetch(`/customers/list`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Health ────────────────────────────────────────────────

export async function checkHealth(): Promise<{ status: string }> {
  return hyperswitchFetch("/health");
}

// ── Settings: API Keys ────────────────────────────────────

const API_KEYS_CACHE = "openpay_api_keys";

function readApiKeysCache(): ApiKey[] {
  try {
    const raw = localStorage.getItem(API_KEYS_CACHE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeApiKeysCache(keys: ApiKey[]): void {
  try {
    localStorage.setItem(API_KEYS_CACHE, JSON.stringify(keys));
  } catch {}
}

function generateApiKey(mode: "sandbox" | "production"): string {
  const prefix = mode === "sandbox" ? "op_test_" : "op_live_";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 24; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + id;
}

export async function listApiKeys(): Promise<{ data: ApiKey[] }> {
  return { data: readApiKeysCache() };
}

export async function createApiKey(
  name: string,
  mode: "sandbox" | "production" = "sandbox"
): Promise<ApiResponse<ApiKey>> {
  const key: ApiKey = {
    api_key: generateApiKey(mode),
    name,
    created: new Date().toISOString(),
    enabled: true,
  };
  const existing = readApiKeysCache();
  existing.unshift(key);
  writeApiKeysCache(existing);
  return { data: key };
}

export async function deleteApiKey(key: string): Promise<void> {
  const existing = readApiKeysCache();
  writeApiKeysCache(existing.filter((k) => k.api_key !== key));
}

// ── Settings: Webhooks ────────────────────────────────────

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

// ── Settings: Connectors ──────────────────────────────────

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

// ── Settings: Business Profile ────────────────────────────

const PROFILE_CACHE_KEY = "openpay_business_profile";

function readProfileCache(): Partial<BusinessProfile> | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeProfileCache(profile: BusinessProfile): void {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
  } catch {}
}

export async function getBusinessProfile(): Promise<BusinessProfile> {
  let apiProfile: BusinessProfile;
  try {
    const res = await hyperswitchFetch<any>(
      "/account/default/business_profile/list",
      { method: "POST", body: JSON.stringify({}) }
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

  const cached = readProfileCache();
  if (cached) {
    apiProfile = { ...apiProfile, ...cached };
  }
  writeProfileCache(apiProfile);
  return apiProfile;
}

export async function updateBusinessProfile(profile: Partial<BusinessProfile>): Promise<void> {
  const current = readProfileCache() || {};
  const updated = { ...current, ...profile };
  writeProfileCache(updated as BusinessProfile);

  try {
    await hyperswitchFetch("/account/default/business_profile", {
      method: "POST",
      body: JSON.stringify({
        profile_name: profile.business_name,
        default_currency: profile.default_currency,
      }),
    });
  } catch {
    // API update not available — localStorage is source of truth
  }
}

// ── Subscriptions: Products ───────────────────────────────

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

// ── Subscriptions: Pricing Tiers ──────────────────────────

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

// ── Subscriptions: Subscriptions ──────────────────────────

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

// ── Subscriptions: Invoices ───────────────────────────────

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

export async function getInvoice(id: string): Promise<Invoice | null> {
  try {
    const res = await hyperswitchFetch<ApiResponse<Invoice>>(`/invoices/${id}`);
    return res.data || null;
  } catch {
    return null;
  }
}

export async function sendInvoice(id: string): Promise<void> {
  try { await hyperswitchFetch(`/invoices/${id}/send`, { method: "POST" }); } catch {}
}

// ── Analytics ─────────────────────────────────────────────

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

// ── Admin: Fraud Rules ────────────────────────────────────

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

// ── Admin: Cases ──────────────────────────────────────────

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

// ── Admin: System Health ──────────────────────────────────

export async function getSystemHealth(): Promise<{ data: ServiceHealth[] }> {
  try { return await hyperswitchFetch<{ data: ServiceHealth[] }>("/health/all"); } catch { return { data: [] }; }
}

export async function getAlertLogs(limit?: number): Promise<{ data: AlertLog[] }> {
  try {
    const qs = limit ? `?limit=${limit}` : "";
    return await hyperswitchFetch<{ data: AlertLog[] }>(`/alerts${qs}`);
  } catch { return { data: [] }; }
}
