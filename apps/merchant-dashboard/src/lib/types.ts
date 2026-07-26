export type PaymentStatus = "pending" | "processing" | "requires_confirmation" | "succeeded" | "failed" | "cancelled" | "refunded" | "partially_refunded";

export type Currency = "NGN" | "USD" | "GHS" | "ZAR" | "KES";

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
