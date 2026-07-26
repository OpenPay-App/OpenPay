import {
  Payment,
  PaymentListResponse,
  RefundResponse,
  Customer,
  ApiResponse,
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
