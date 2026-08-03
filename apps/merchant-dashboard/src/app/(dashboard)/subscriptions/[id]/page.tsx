"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Pause,
  Play,
  XCircle,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";
import {
  getSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
} from "@/lib/hyperswitch";
import { formatCurrency } from "@/lib/format";
import { useSandboxMode } from "@/lib/sandbox-mode";
import type { Subscription } from "@/lib/types";

const statusColors: Record<string, string> = {
  active: "bg-emerald-950 text-emerald-400 border border-emerald-500/30",
  paused: "bg-amber-950 text-amber-400 border border-amber-500/30",
  cancelled: "bg-red-950 text-red-400 border border-red-500/30",
  trialing: "bg-blue-950 text-blue-400 border border-blue-500/30",
  past_due: "bg-orange-950 text-orange-400 border border-orange-500/30",
  incomplete: "bg-gray-900 text-gray-400 border border-gray-700",
};

export default function SubscriptionDetailPage() {
  const { isSandbox } = useSandboxMode();
  const params = useParams();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const s = await getSubscription(params.id as string);
      setSub(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscription");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleAction = async (action: "pause" | "resume" | "cancel") => {
    if (!sub) return;
    setActionLoading(true);
    setError(null);
    try {
      if (action === "pause") await pauseSubscription(sub.subscription_id);
      if (action === "resume") await resumeSubscription(sub.subscription_id);
      if (action === "cancel") await cancelSubscription(sub.subscription_id);
      const updated = await getSubscription(sub.subscription_id);
      setSub(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} subscription`);
    } finally {
      setActionLoading(false);
      setShowConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-bg-alt rounded animate-pulse" />
        <div className="h-64 bg-[#0a0a0a] rounded-xl border border-border animate-pulse" />
      </div>
    );
  }

  if (error && !sub) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 bg-red-50 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={fetchSubscription}
            className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
          >
            Retry
          </button>
          <Link
            href="/subscriptions"
            className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Back to Subscriptions
          </Link>
        </div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">Subscription not found</p>
        <Link href="/subscriptions" className="text-secondary text-sm mt-2 inline-block hover:underline">
          Back to Subscriptions
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/subscriptions"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Subscriptions
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-text-primary">
              {sub.tier_name}
            </h1>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[sub.status]}`}>
              {sub.status}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isSandbox
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-emerald-50 border-emerald-300 text-emerald-700"
            }`}>
              {isSandbox ? "Sandbox" : "Production"}
            </span>
          </div>
          <p className="text-sm text-text-muted">{sub.subscription_id}</p>
        </div>
        <div className="flex gap-2">
          {sub.status === "active" && (
            <>
              <button
                onClick={() => setShowConfirm("pause")}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-secondary/30 transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button
                onClick={() => setShowConfirm("cancel")}
                className="flex items-center gap-2 px-4 py-2 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-900/50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
          {sub.status === "paused" && (
            <button
              onClick={() => handleAction("resume")}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && sub && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 bg-red-950/50">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-400 transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="mb-6 p-5 rounded-xl border border-amber-500/30 bg-amber-950/50">
          <p className="text-sm text-amber-300 font-medium mb-3">
            {showConfirm === "pause"
              ? "Pause this subscription? The customer will lose access until resumed."
              : "Cancel this subscription? This action cannot be undone."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleAction(showConfirm as "pause" | "cancel")}
              disabled={actionLoading}
              className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : "Confirm"}
            </button>
            <button
              onClick={() => setShowConfirm(null)}
              className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Plan Details */}
        <div className="p-5 rounded-xl border border-border bg-white">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-secondary" />
            Plan Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Plan</span>
              <span className="font-medium text-text-primary">{sub.tier_name}</span>
            </div>
            {sub.product_name && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Product</span>
                <span className="font-medium text-text-primary">{sub.product_name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Amount</span>
              <span className="font-medium text-text-primary">
                {formatCurrency(sub.amount, sub.currency, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Currency</span>
              <span className="font-medium text-text-primary">{sub.currency}</span>
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="p-5 rounded-xl border border-border bg-white">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            Billing Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Current Period</span>
              <span className="text-text-primary">
                {new Date(sub.current_period_start).toLocaleDateString()} —{" "}
                {new Date(sub.current_period_end).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Next Billing</span>
              <span className="text-text-primary">
                {sub.next_billing_date
                  ? new Date(sub.next_billing_date).toLocaleDateString()
                  : "—"}
              </span>
            </div>
            {sub.trial_end && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Trial Ends</span>
                <span className="text-text-primary">
                  {new Date(sub.trial_end).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Started</span>
              <span className="text-text-primary">
                {new Date(sub.created).toLocaleDateString()}
              </span>
            </div>
            {sub.cancelled_at && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Cancelled</span>
                <span className="text-red-600">
                  {new Date(sub.cancelled_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Customer */}
        <div className="p-5 rounded-xl border border-border bg-white">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-secondary" />
            Customer
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Name</span>
              <Link
                href={`/customers/${sub.customer_id}`}
                className="font-medium text-secondary hover:underline"
              >
                {sub.customer_name || "—"}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Email</span>
              <span className="text-text-primary">{sub.customer_email || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Customer ID</span>
              <code className="text-xs font-mono text-text-muted">{sub.customer_id}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
