"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Payment } from "@/lib/types";
import { formatCurrency, formatDate, statusColor } from "@/lib/format";
import { useSandboxMode } from "@/lib/sandbox-mode";
import { ModeBadge } from "@/components/mode-badge";

function TimelineEvent({
  label,
  time,
  status,
}: {
  label: string;
  time: string;
  status: "done" | "current" | "pending";
}) {
  const icon =
    status === "done" ? (
      <CheckCircle className="w-5 h-5 text-emerald-500" />
    ) : status === "current" ? (
      <Clock className="w-5 h-5 text-secondary" />
    ) : (
      <XCircle className="w-5 h-5 text-gray-700" />
    );

  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">            <p className="text-sm font-medium text-white">{label}</p>
        {time && (
          <p className="text-xs text-text-muted mt-0.5">{formatDate(time)}</p>
        )}
      </div>
    </div>
  );
}

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { mode } = useSandboxMode();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refunding, setRefunding] = useState(false);
  const [refundResult, setRefundResult] = useState<string | null>(null);
  const [confirmLiveRefund, setConfirmLiveRefund] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/payments/${id}`);
        if (!res.ok) throw new Error("Payment not found");
        setPayment(await res.json());
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleRefund = async () => {
    if (!payment) return;
    // Guardrail: refunding a live payment is a destructive real-money action.
    if (mode === "production" && !confirmLiveRefund) {
      setConfirmLiveRefund(true);
      return;
    }
    setRefunding(true);
    setRefundResult(null);
    try {
      const res = await fetch(`/api/payments/${payment.payment_id}/refund`, {
        method: "POST",
        body: JSON.stringify({ amount: payment.amount }),
      });
      const data = await res.json();
      if (res.ok) {
        setRefundResult("Refund initiated successfully");
        setPayment({ ...payment, status: "refunded" });
      } else {
        setRefundResult(data.error || "Refund failed");
      }
    } catch {
      setRefundResult("Network error — could not process refund");
    } finally {
      setRefunding(false);
      setConfirmLiveRefund(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="text-center py-32">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-error" />
        <p className="text-text-muted">{error || "Payment not found"}</p>
        <Link
          href="/payments"
          className="text-sm text-secondary hover:underline mt-4 inline-block"
        >
          ← Back to payments
        </Link>
      </div>
    );
  }

  const card = payment.payment_method_data?.card;
  const timeline = [
    {
      label: "Created",
      time: payment.created,
      status: "done" as const,
    },
    {
      label: payment.status === "succeeded" ? "Captured" : "Processing",
      time: payment.modified,
      status:
        payment.status === "succeeded"
          ? ("done" as const)
          : payment.status === "failed"
            ? ("pending" as const)
            : ("current" as const),
    },
    {
      label: "Settled",
      time: payment.status === "succeeded" ? payment.modified : "",
      status:
        payment.status === "succeeded"
          ? ("done" as const)
          : ("pending" as const),
    },
  ];

  return (
    <div>
      {/* Live refund confirmation */}
      {confirmLiveRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 max-w-md mx-4 shadow-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Refund a live payment?
              </h3>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              This will <strong>refund real money</strong> back to the customer
              on your live merchant account. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmLiveRefund(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {refunding ? "Refunding..." : "Confirm Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Link
        href="/payments"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to payments
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Payment Details
          </h1>
          <p className="text-text-secondary mt-1 font-mono text-sm">
            {payment.payment_id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ModeBadge />
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${statusColor(payment.status)}`}
          >
            {payment.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text-primary mb-4">
              Transaction Info
            </h2>
            <div className="space-y-4">
              {[
                { label: "Amount", value: formatCurrency(payment.amount, payment.currency) },
                { label: "Currency", value: payment.currency },
                { label: "Payment Method", value: payment.payment_method || "—" },
                { label: "Card", value: card ? `${card.card_type || ""} •••• ${card.last4 || ""}` : "—" },
                { label: "Reference", value: payment.payment_id },
                { label: "Customer", value: payment.customer_email || "—" },
                { label: "Description", value: payment.description || "—" },
                { label: "Connector", value: payment.connector || "—" },
              ].map((field) => (
                <div
                  key={field.label}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-text-secondary">
                    {field.label}
                  </span>
                  <span className="text-sm font-medium text-white text-right max-w-[60%] truncate">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text-primary mb-4">Timeline</h2>
            <div className="space-y-6">
              {timeline.map((event) => (
                <TimelineEvent key={event.label} {...event} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text-primary mb-4">Customer</h2>
            {payment.customer_id ? (
              <Link
                href={`/customers/${payment.customer_id}`}
                className="text-sm text-secondary hover:underline"
              >
                {payment.customer_email || payment.customer_id}
              </Link>
            ) : (
              <div className="text-center py-4 text-text-muted text-sm">
                No customer attached
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-white mb-4">Actions</h2>
            {payment.status === "succeeded" ? (
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="w-full px-4 py-2.5 rounded-lg bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {refunding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Refund Payment"
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full px-4 py-2.5 rounded-lg bg-error/10 text-error text-sm font-medium cursor-not-allowed opacity-50"
              >
                Refund Payment
              </button>
            )}
            {refundResult && (
              <p
                className={`text-sm mt-3 ${refundResult.includes("success") ? "text-emerald-600" : "text-error"}`}
              >
                {refundResult}
              </p>
            )}
          </div>

          {/* Raw data toggle */}
          <details className="bg-white rounded-xl border border-border">
            <summary className="px-6 py-4 text-sm font-medium text-white cursor-pointer hover:bg-white/5 transition-colors">
              Raw Event Data
            </summary>
            <pre className="px-6 pb-4 text-xs font-mono text-text-secondary overflow-x-auto max-h-64 overflow-y-auto">
              {JSON.stringify(payment, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
