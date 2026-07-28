"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Search, Filter, AlertTriangle, Plus } from "lucide-react";
import { listSubscriptions } from "@/lib/hyperswitch";
import { formatCurrency } from "@/lib/format";
import { useSandboxMode } from "@/lib/sandbox-mode";
import type { Subscription, SubscriptionStatus } from "@/lib/types";

const statusColors: Record<SubscriptionStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  paused: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  trialing: "bg-blue-50 text-blue-700",
  past_due: "bg-orange-50 text-orange-700",
  incomplete: "bg-gray-50 text-gray-500",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const { isSandbox } = useSandboxMode();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, [statusFilter]);

  const loadSubscriptions = async () => {
    try {
      setError(null);
      const res = await listSubscriptions({ status: statusFilter || undefined });
      setSubscriptions(res.data);
    } catch (e: any) {
      setError(e?.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = subscriptions.filter(
    (s) =>
      s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      s.subscription_id.toLowerCase().includes(search.toLowerCase()) ||
      s.tier_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-text-secondary">
            All customer subscriptions. Manage billing cycles, plan changes, and
            cancellations.
          </p>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isSandbox
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-emerald-50 border-emerald-300 text-emerald-700"
          }`}>
            {isSandbox ? "Sandbox" : "Production"}
          </span>
        </div>
        <button
          onClick={() => {
            alert("Create Subscription coming soon!");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Subscription
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, ID, or plan..."
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
          <option value="trialing">Trialing</option>
          <option value="past_due">Past Due</option>
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-lg bg-red-50 border border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="flex-1 text-sm text-red-800">
            {error.includes("Cannot reach Hyperswitch")
              ? "Cannot connect to Hyperswitch"
              : error}
          </p>
          <button
            onClick={loadSubscriptions}
            className="px-3 py-1 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Plan
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Current Period
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Next Billing
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-bg-alt rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 && !error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <RefreshCw className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-text-secondary">{isSandbox ? "No test subscriptions found" : "No subscriptions found"}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {isSandbox
                        ? "Test subscriptions will appear here when customers subscribe to your plans."
                        : "Subscriptions will appear here when customers subscribe to your plans."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr
                    key={sub.subscription_id}
                    className="border-b border-border last:border-0 hover:bg-bg-alt/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/customers/${sub.customer_id}`}
                        className="hover:text-secondary transition-colors"
                      >
                        <p className="font-medium text-text-primary">
                          {sub.customer_name || sub.customer_email || sub.customer_id}
                        </p>
                        {sub.customer_email && sub.customer_name && (
                          <p className="text-xs text-text-muted">
                            {sub.customer_email}
                          </p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-text-primary">{sub.tier_name}</p>
                      {sub.product_name && (
                        <p className="text-xs text-text-muted">
                          {sub.product_name}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[sub.status]}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {formatCurrency(sub.amount, sub.currency, 0)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {new Date(sub.current_period_start).toLocaleDateString()} —{" "}
                      {new Date(sub.current_period_end).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {sub.next_billing_date
                        ? new Date(sub.next_billing_date).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
