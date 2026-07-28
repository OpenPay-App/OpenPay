export type PaymentStatus = "pending" | "processing" | "requires_confirmation" | "succeeded" | "failed" | "cancelled" | "refunded" | "partially_refunded";

export type Currency = "EUR" | "USD" | "GBP" | "NGN" | "GHS" | "ZAR" | "KES" | "JPY" | "CAD" | "AUD" | "INR" | "BRL" | "MXN";

export type PaymentMethod = "card" | "bank_transfer" | "ussd" | "mobile_money" | "wallet";

export interface CardAuthorization {
  authorization_code?: string;
  bin?: string;
  last4?: string;
  exp_month?: string;
  exp_year?: string;
  channel?: string;
  card_type?: string;
  bank?: string;
  reusable?: boolean;
}

export interface Payment {
  payment_id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  payment_method?: PaymentMethod;
  payment_method_data?: {
    card?: CardAuthorization;
  };
  created: string;
  modified: string;
  capture_method?: string;
  confirmation_method?: string;
  capture?: boolean;
  confirm?: boolean;
  attempt_count?: number;
  connector?: string;
  authentication_type?: string;
}

export interface PaymentListResponse {
  data: Payment[];
  next?: string;
  total_count?: number;
}

export interface RefundResponse {
  refund_id: string;
  payment_id: string;
  amount: number;
  status: "pending" | "succeeded" | "failed" | "reviewed" | "cancelled";
  created: string;
}

export interface Customer {
  customer_id: string;
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  created: string;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    type: string;
    message: string;
  };
}

// ── Settings Types ────────────────────────────────────────

export interface BusinessProfile {
  business_name: string;
  default_currency: Currency;
  timezone: string;
  support_email: string;
  website: string;
  logo_url?: string;
}

export interface ApiKey {
  api_key: string;
  name: string;
  created: string;
  last_used?: string;
  expires?: string;
  enabled: boolean;
}

export interface WebhookEndpoint {
  webhook_id: string;
  url: string;
  events: string[];
  enabled: boolean;
  created: string;
  last_triggered?: string;
  status?: "active" | "failing" | "disabled";
  secret?: string;
}

export interface Connector {
  connector_id: string;
  connector_type: string;
  connector_name: string;
  enabled: boolean;
  test_mode: boolean;
  supported_currencies: Currency[];
  created: string;
  last_used?: string;
}

export interface TeamMember {
  member_id: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
  avatar_url?: string;
  joined: string;
  last_active?: string;
}

// ── Subscriptions & Invoicing Types ──────────────────────

export type BillingInterval = "monthly" | "yearly" | "weekly" | "daily";

export type SubscriptionStatus =
  | "active"
  | "paused"
  | "cancelled"
  | "trialing"
  | "past_due"
  | "incomplete";

export type InvoiceStatus =
  | "draft"
  | "pending"
  | "paid"
  | "overdue"
  | "void"
  | "uncollectible";

export interface Product {
  product_id: string;
  name: string;
  description?: string;
  features: string[];
  active: boolean;
  created: string;
  metadata?: Record<string, unknown>;
}

export interface PricingTier {
  tier_id: string;
  product_id: string;
  name: string;
  currency: Currency;
  amount: number;
  interval: BillingInterval;
  active: boolean;
  trial_days?: number;
  created: string;
}

export interface Subscription {
  subscription_id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  tier_id: string;
  tier_name: string;
  product_name?: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  next_billing_date?: string;
  trial_end?: string;
  amount: number;
  currency: Currency;
  created: string;
  cancelled_at?: string;
  metadata?: Record<string, unknown>;
}

export interface Invoice {
  invoice_id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  subscription_id?: string;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  due_date?: string;
  paid_at?: string;
  created: string;
  line_items: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  amount: number;
  quantity: number;
}

// ── Analytics Types ───────────────────────────────────────

export interface RevenueMetric {
  date: string;
  revenue: number;
  refunds: number;
  net: number;
  payment_method_breakdown: Record<string, number>;
}

export interface CustomerMetric {
  date: string;
  new_customers: number;
  churned_customers: number;
  total_customers: number;
  churn_rate: number;
  avg_ltv: number;
}

export interface PaymentMetric {
  date: string;
  successful: number;
  failed: number;
  total: number;
  success_rate: number;
  avg_processing_time_ms: number;
}

export interface TopCustomer {
  customer_id: string;
  name: string;
  email: string;
  total_spent: number;
  payment_count: number;
}

export interface FailureReason {
  reason: string;
  count: number;
  percentage: number;
}

// ── Admin Types ───────────────────────────────────────────

export type FraudRuleStatus = "active" | "draft" | "disabled";

export interface FraudRule {
  rule_id: string;
  name: string;
  description: string;
  rule_type: "velocity_check" | "amount_threshold" | "geo_mismatch" | "bin_blocklist" | "email_blocklist" | "custom";
  condition_type: "amount_threshold" | "velocity" | "geo_blocking" | "custom";
  condition_config: Record<string, unknown>;
  severity: "low" | "medium" | "high";
  threshold: number;
  time_window_minutes: number;
  action: "flag" | "review" | "block";
  status: FraudRuleStatus;
  enabled: boolean;
  created: string;
  last_triggered?: string;
  trigger_count: number;
}

export type CaseStatus =
  | "open"
  | "investigating"
  | "resolved_legitimate"
  | "resolved_fraudulent"
  | "approved"
  | "blocked"
  | "escalated"
  | "closed";

export interface FraudCase {
  case_id: string;
  payment_id: string;
  customer_id?: string;
  customer_email?: string;
  amount: number;
  currency: Currency;
  risk_score: number;
  rule_name: string;
  triggered_rule_id: string;
  triggered_rule_name: string;
  status: CaseStatus;
  notes: string[];
  created: string;
  created_at: string;
  updated: string;
}

export interface ServiceHealth {
  service_name: string;
  service: string;
  category: string;
  status: "healthy" | "ok" | "degraded" | "down" | "critical";
  uptime?: number;
  response_time_ms?: number;
  version?: string;
  last_checked?: string;
  uptime_display: string;
  last_check: string;
  response_time?: number;
  error_rate?: number;
}

export interface AlertLog {
  alert_id: string;
  service_name: string;
  service: string;
  level: "info" | "warning" | "error" | "critical";
  severity: "info" | "warning" | "error" | "critical";
  message: string;
  timestamp: string;
  created: string;
  resolved?: string;
}
