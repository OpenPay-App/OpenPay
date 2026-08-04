"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { RefreshCw, Search, AlertTriangle, Plus } from "lucide-react";
import { listSubscriptions } from "@/lib/hyperswitch";
import { formatCurrency } from "@/lib/format";
import { useSandboxMode } from "@/lib/sandbox-mode";

import type { Subscription, SubscriptionStatus } from "@/lib/types";

const statusColors: Record<SubscriptionStatus, string> = {
  active: "bg-[#e6f9e6] text-[#40d63b] border border-[#40d63b]/30",
  paused: "bg-amber-50 text-amber-700 border border-amber-500/30",
  cancelled: "bg-red-50 text-[#ea384c] border border-[#ea384c]/30",
  trialing: "bg-blue-50 text-blue-700 border border-blue-500/30",
  past_due: "bg-orange-50 text-orange-700 border border-orange-500/30",
  incomplete: "bg-gray-100 text-gray-500 border border-gray-300",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const { isSandbox } = useSandboxMode();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async () => {
    try {
      setError(null);
      const res = await listSubscriptions({ status: statusFilter || undefined });
      setSubscriptions(res.data);
    } catch (e: any) {
      setError(e?.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

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
          <p className="text-sm text-gray-500">
            All customer subscriptions. Manage billing cycles, plan changes, and
            cancellations.
          </p>

        </div>
        <button
          onClick={() => {
            alert("Create Subscription coming soon!");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2c7dd6] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Subscription
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#AAADB0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, ID, or plan..."
            className="w-full pl-10 pr-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] placeholder:text-[#AAADB0] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
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
        <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-[3px] bg-red-50 border border-[#ea384c]/30">
          <AlertTriangle className="w-5 h-5 text-[#ea384c] shrink-0" />
          <p className="flex-1 text-sm text-[#ea384c]">
            {error.includes("Cannot reach Hyperswitch")
              ? "Cannot connect to Hyperswitch"
              : error}
          </p>
          <button
            onClick={loadSubscriptions}
            className="px-3 py-1 text-sm font-medium text-[#ea384c] bg-red-50 border border-[#ea384c]/30 rounded-[3px] hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-[3px] border border-[#e2e2e2] bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Plan
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Current Period
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Next Billing
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#e2e2e2] last:border-0">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#fafafa] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 && !error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <RefreshCw className="w-8 h-8 text-[#AAADB0] mx-auto mb-2" />
                    <p className="text-gray-500">{isSandbox ? "No test subscriptions found" : "No subscriptions found"}</p>
                    <p className="text-xs text-[#AAADB0] mt-1">
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
                    className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/customers/${sub.customer_id}`}
                        className="hover:text-[#3898EC] transition-colors"
                      >
                        <p className="font-medium text-gray-900">
                          {sub.customer_name || sub.customer_email || sub.customer_id}
                        </p>
                        {sub.customer_email && sub.customer_name && (
                          <p className="text-xs text-[#AAADB0]">
                            {sub.customer_email}
                          </p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{sub.tier_name}</p>
                      {sub.product_name && (
                        <p className="text-xs text-[#AAADB0]">
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
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatCurrency(sub.amount, sub.currency, 0)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(sub.current_period_start).toLocaleDateString()} —{" "}
                      {new Date(sub.current_period_end).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
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
