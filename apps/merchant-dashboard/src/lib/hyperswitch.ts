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
} from "./types";

const BASE_URL = process.env.HYPERSWITCH_URL || "http://localhost:8081";
const API_KEY = process.env.HYPERSWITCH_API_KEY || "";

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
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.starting_after)
    searchParams.set("starting_after", params.starting_after);
  if (params?.created?.gt)
    searchParams.set("created[gte]", String(params.created.gt));
  if (params?.created?.lt)
    searchParams.set("created[lte]", String(params.created.lt));

  const qs = searchParams.toString();
  return hyperswitchFetch<PaymentListResponse>(`/payments${qs ? `?${qs}` : ""}`);
}

export async function getPayment(id: string): Promise<Payment> {
  const res = await hyperswitchFetch<ApiResponse<Payment>>(
    `/payments/${id}`
  );
  if (res.error) throw new Error(res.error.message);
  return res.data!;
}

export async function refundPayment(
  id: string,
  amount?: number
): Promise<RefundResponse> {
  const body: Record<string, unknown> = {};
  if (amount) body.amount = amount;

  const res = await hyperswitchFetch<ApiResponse<RefundResponse>>(
    `/payments/${id}/refund`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
  if (res.error) throw new Error(res.error.message);
  return res.data!;
}

// ── Customers ─────────────────────────────────────────────

export async function getCustomer(id: string): Promise<Customer> {
  const res = await hyperswitchFetch<ApiResponse<Customer>>(
    `/customers/${id}`
  );
  if (res.error) throw new Error(res.error.message);
  return res.data!;
}

export async function listCustomers(params?: {
  limit?: number;
  starting_after?: string;
}): Promise<{ data: Customer[]; next?: string }> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.starting_after)
    searchParams.set("starting_after", params.starting_after);

  const qs = searchParams.toString();
  return hyperswitchFetch(`/customers${qs ? `?${qs}` : ""}`);
}

// ── Health ────────────────────────────────────────────────

export async function checkHealth(): Promise<{ status: string }> {
  return hyperswitchFetch("/health");
}

// ── Settings: API Keys ────────────────────────────────────

export async function listApiKeys(): Promise<{ data: ApiKey[] }> {
  try {
    return await hyperswitchFetch("/api_keys");
  } catch {
    return { data: [] };
  }
}

export async function createApiKey(
  name: string
): Promise<ApiResponse<ApiKey>> {
  try {
    const res = await hyperswitchFetch<ApiResponse<ApiKey>>("/api_keys", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    return res;
  } catch {
    return { data: undefined, error: { type: "network", message: "Cannot reach Hyperswitch" } };
  }
}

export async function deleteApiKey(key: string): Promise<void> {
  await hyperswitchFetch(`/api_keys/${key}`, { method: "DELETE" });
}

// ── Settings: Webhooks ────────────────────────────────────

export async function listWebhooks(): Promise<{ data: WebhookEndpoint[] }> {
  try {
    return await hyperswitchFetch("/webhooks");
  } catch {
    return { data: [] };
  }
}

export async function createWebhook(
  url: string,
  events: string[]
): Promise<ApiResponse<WebhookEndpoint>> {
  try {
    return await hyperswitchFetch<ApiResponse<WebhookEndpoint>>("/webhooks", {
      method: "POST",
      body: JSON.stringify({ url, events }),
    });
  } catch {
    return { data: undefined, error: { type: "network", message: "Cannot reach Hyperswitch" } };
  }
}

export async function deleteWebhook(id: string): Promise<void> {
  await hyperswitchFetch(`/webhooks/${id}`, { method: "DELETE" });
}

// ── Settings: Connectors ──────────────────────────────────

export async function listConnectors(): Promise<{ data: Connector[] }> {
  try {
    return await hyperswitchFetch("/connectors");
  } catch {
    return { data: [] };
  }
}

export async function toggleConnector(
  id: string,
  enabled: boolean
): Promise<void> {
  await hyperswitchFetch(`/connectors/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  });
}

// ── Settings: Business Profile ────────────────────────────

export async function getBusinessProfile(): Promise<BusinessProfile> {
  try {
    return await hyperswitchFetch("/business_profile");
  } catch {
    return {
      business_name: "",
      default_currency: "NGN",
      timezone: "Africa/Lagos",
      support_email: "",
      website: "",
    };
  }
}

export async function updateBusinessProfile(
  profile: Partial<BusinessProfile>
): Promise<void> {
  await hyperswitchFetch("/business_profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

// ── Subscriptions: Products ───────────────────────────────

export async function listProducts(): Promise<{ data: Product[] }> {
  try {
    return await hyperswitchFetch("/products");
  } catch {
    return { data: [] };
  }
}

export async function createProduct(
  data: Partial<Product>
): Promise<ApiResponse<Product>> {
  try {
    return await hyperswitchFetch<ApiResponse<Product>>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { data: undefined, error: { type: "network", message: "Cannot reach Hyperswitch" } };
  }
}

export async function deleteProduct(id: string): Promise<void> {
  await hyperswitchFetch(`/products/${id}`, { method: "DELETE" });
}

// ── Subscriptions: Pricing Tiers ──────────────────────────

export async function listPricingTiers(
  productId?: string
): Promise<{ data: PricingTier[] }> {
  try {
    const qs = productId ? `?product_id=${productId}` : "";
    return await hyperswitchFetch(`/pricing_tiers${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function createPricingTier(
  data: Partial<PricingTier>
): Promise<ApiResponse<PricingTier>> {
  try {
    return await hyperswitchFetch<ApiResponse<PricingTier>>("/pricing_tiers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { data: undefined, error: { type: "network", message: "Cannot reach Hyperswitch" } };
  }
}

export async function deletePricingTier(id: string): Promise<void> {
  await hyperswitchFetch(`/pricing_tiers/${id}`, { method: "DELETE" });
}

// ── Subscriptions: Subscriptions ──────────────────────────

export async function listSubscriptions(params?: {
  limit?: number;
  status?: string;
}): Promise<{ data: Subscription[] }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    const qs = searchParams.toString();
    return await hyperswitchFetch(`/subscriptions${qs ? `?${qs}` : ""}`);
  } catch {
    return { data: [] };
  }
}

export async function getSubscription(
  id: string
): Promise<Subscription | null> {
  try {
    const res = await hyperswitchFetch<ApiResponse<Subscription>>(
      `/subscriptions/${id}`
    );
    return res.data || null;
  } catch {
    return null;
  }
}

export async function cancelSubscription(id: string): Promise<void> {
  await hyperswitchFetch(`/subscriptions/${id}/cancel`, { method: "POST" });
}

export async function pauseSubscription(id: string): Promise<void> {
  await hyperswitchFetch(`/subscriptions/${id}/pause`, { method: "POST" });
}

export async function resumeSubscription(id: string): Promise<void> {
  await hyperswitchFetch(`/subscriptions/${id}/resume`, { method: "POST" });
}

// ── Subscriptions: Invoices ───────────────────────────────

export async function listInvoices(params?: {
  limit?: number;
  status?: string;
}): Promise<{ data: Invoice[] }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    const qs = searchParams.toString();
    return await hyperswitchFetch(`/invoices${qs ? `?${qs}` : ""}`);
  } catch {
    return { data: [] };
  }
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  try {
    const res = await hyperswitchFetch<ApiResponse<Invoice>>(
      `/invoices/${id}`
    );
    return res.data || null;
  } catch {
    return null;
  }
}

export async function sendInvoice(id: string): Promise<void> {
  await hyperswitchFetch(`/invoices/${id}/send`, { method: "POST" });
}

// ── Analytics ─────────────────────────────────────────────

export async function getRevenueMetrics(days?: number): Promise<{ data: RevenueMetric[] }> {
  try {
    const qs = days ? `?days=${days}` : "";
    return await hyperswitchFetch(`/analytics/revenue${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function getCustomerMetrics(days?: number): Promise<{ data: CustomerMetric[] }> {
  try {
    const qs = days ? `?days=${days}` : "";
    return await hyperswitchFetch(`/analytics/customers${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function getPaymentMetrics(days?: number): Promise<{ data: PaymentMetric[] }> {
  try {
    const qs = days ? `?days=${days}` : "";
    return await hyperswitchFetch(`/analytics/payments${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function getTopCustomers(limit?: number): Promise<{ data: TopCustomer[] }> {
  try {
    const qs = limit ? `?limit=${limit}` : "";
    return await hyperswitchFetch(`/analytics/top-customers${qs}`);
  } catch {
    return { data: [] };
  }
}

export async function getFailureReasons(days?: number): Promise<{ data: FailureReason[] }> {
  try {
    const qs = days ? `?days=${days}` : "";
    return await hyperswitchFetch(`/analytics/failure-reasons${qs}`);
  } catch {
    return { data: [] };
  }
}

// ── Admin: Fraud Rules ────────────────────────────────────

export async function getFraudRules(): Promise<{ data: FraudRule[] }> {
  try {
    return await hyperswitchFetch("/rules");
  } catch {
    return { data: [] };
  }
}

export async function createFraudRule(
  rule: Partial<FraudRule>
): Promise<ApiResponse<FraudRule>> {
  try {
    return await hyperswitchFetch<ApiResponse<FraudRule>>("/rules", {
      method: "POST",
      body: JSON.stringify(rule),
    });
  } catch {
    return { data: undefined, error: { type: "network", message: "Cannot reach Hyperswitch" } };
  }
}

export async function updateFraudRule(
  id: string,
  rule: Partial<FraudRule>
): Promise<void> {
  await hyperswitchFetch(`/rules/${id}`, {
    method: "PUT",
    body: JSON.stringify(rule),
  });
}

export async function deleteFraudRule(id: string): Promise<void> {
  await hyperswitchFetch(`/rules/${id}`, { method: "DELETE" });
}

// ── Admin: Cases ──────────────────────────────────────────

export async function getFraudCases(): Promise<{ data: FraudCase[] }> {
  try {
    return await hyperswitchFetch("/cases");
  } catch {
    return { data: [] };
  }
}

export async function getFraudCase(id: string): Promise<FraudCase | null> {
  try {
    const res = await hyperswitchFetch<ApiResponse<FraudCase>>(`/cases/${id}`);
    return res.data || null;
  } catch {
    return null;
  }
}

export async function updateFraudCase(
  id: string,
  data: Partial<FraudCase>
): Promise<void> {
  await hyperswitchFetch(`/cases/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ── Admin: System Health ──────────────────────────────────

export async function getSystemHealth(): Promise<{ data: ServiceHealth[] }> {
  try {
    return await hyperswitchFetch("/health/all");
  } catch {
    return {
      data: [
        { service_name: "Hyperswitch", service: "hyperswitch", category: "Core", status: "down", uptime: 0, uptime_display: "0%", last_check: new Date().toISOString(), last_checked: new Date().toISOString() },
        { service_name: "Kill Bill", service: "killbill", category: "Billing", status: "down", uptime: 0, uptime_display: "0%", last_check: new Date().toISOString(), last_checked: new Date().toISOString() },
        { service_name: "NATS", service: "nats", category: "Messaging", status: "down", uptime: 0, uptime_display: "0%", last_check: new Date().toISOString(), last_checked: new Date().toISOString() },
        { service_name: "Tazama", service: "tazama", category: "Fraud Detection", status: "down", uptime: 0, uptime_display: "0%", last_check: new Date().toISOString(), last_checked: new Date().toISOString() },
        { service_name: "PostgreSQL", service: "postgres", category: "Database", status: "down", uptime: 0, uptime_display: "0%", last_check: new Date().toISOString(), last_checked: new Date().toISOString() },
        { service_name: "Redis", service: "redis", category: "Cache", status: "down", uptime: 0, uptime_display: "0%", last_check: new Date().toISOString(), last_checked: new Date().toISOString() },
      ],
    };
  }
}

export async function getAlertLogs(limit?: number): Promise<{ data: AlertLog[] }> {
  try {
    const qs = limit ? `?limit=${limit}` : "";
    return await hyperswitchFetch(`/alerts${qs}`);
  } catch {
    return {
      data: [
        {
          alert_id: "alert_sample_1",
          service_name: "Hyperswitch",
          service: "hyperswitch",
          level: "warning",
          severity: "warning",
          message: "Hyperswitch is unreachable — running in demo mode",
          timestamp: new Date().toISOString(),
          created: new Date().toISOString(),
        },
      ],
    };
  }
}
