"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getCustomerMetrics, getTopCustomers } from "@/lib/hyperswitch";
import { useBusinessProfile } from "@/lib/business-profile-context";
import { useSandboxMode } from "@/lib/sandbox-mode";
import { formatCurrency as fmt } from "@/lib/format";
import type { CustomerMetric, TopCustomer } from "@/lib/types";

export default function CustomerAnalyticsPage() {
  const [metrics, setMetrics] = useState<CustomerMetric[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCustomerMetrics(days), getTopCustomers(20)])
      .then(([m, c]) => {
        setMetrics(m.data);
        setTopCustomers(c.data);
      })
      .catch(() => {
        // Hyperswitch may be down
      })
      .finally(() => {
        setLoading(false);
      });
  }, [days]);

  const totalNew = metrics.reduce((sum, m) => sum + m.new_customers, 0);
  const totalChurned = metrics.reduce((sum, m) => sum + m.churned_customers, 0);
  const avgLtv =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.avg_ltv, 0) / metrics.length
      : 0;
  const avgChurn =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.churn_rate, 0) / metrics.length
      : 0;

  const { currency } = useBusinessProfile();
  const { isSandbox } = useSandboxMode();

  const formatCurrency = (v: number) => fmt(v, currency, 0);

  return (
    <div>
      <Link
        href="/analytics"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Analytics
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Customer Metrics</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isSandbox
              ? "bg-amber-950 border-amber-500/30 text-amber-400"
              : "bg-emerald-950 border-emerald-500/30 text-emerald-400"
          }`}>
            {isSandbox ? "Sandbox" : "Production"}
          </span>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-secondary" />
            <p className="text-xs text-text-secondary">New Customers</p>
          </div>
          <p className="text-xl font-bold text-white">{totalNew}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-600">
              +{totalNew} in period
            </span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <p className="text-xs text-text-secondary">Churned</p>
          </div>
          <p className="text-xl font-bold text-white">{totalChurned}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-text-muted">
              {avgChurn.toFixed(1)}% avg churn
            </span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-text-secondary">Avg. LTV</p>
          </div>
          <p className="text-xl font-bold text-white">
            {formatCurrency(avgLtv)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-text-muted">Per customer</span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-text-secondary">Net Growth</p>
          </div>
          <p className="text-xl font-bold text-white">
            {totalNew - totalChurned}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-text-muted">New - Churned</span>
          </div>
        </div>
      </div>

      {/* Customer Growth Chart */}
      <div className="p-5 rounded-xl border border-border bg-[#0a0a0a] mb-8">
        <h3 className="font-semibold text-white mb-4">Customer Growth</h3>
        {loading ? (
          <div className="h-64 bg-bg-alt rounded-lg animate-pulse" />
        ) : metrics.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-text-muted text-sm">              {isSandbox ? "No test customer data yet" : "No customer data yet"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="newCustGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#6B7280" }}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="new_customers"
                stroke="#10b981"
                fill="url(#newCustGrad)"
                strokeWidth={2}
                name="New"
              />
              <Area
                type="monotone"
                dataKey="churned_customers"
                stroke="#ef4444"
                fill="url(#churnGrad)"
                strokeWidth={2}
                name="Churned"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Customers Table */}
      <div className="rounded-xl border border-border bg-[#0a0a0a]">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-white">Top Customers by Revenue</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-text-secondary">#</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">Customer</th>
              <th className="text-center px-4 py-3 font-medium text-text-secondary">Payments</th>
              <th className="text-right px-4 py-3 font-medium text-text-secondary">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td colSpan={4} className="px-4 py-3">
                    <div className="h-5 bg-bg-alt rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : topCustomers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                  {isSandbox ? "No test customer data" : "No customer data"}
                </td>
              </tr>
            ) : (
              topCustomers.map((c, i) => (
                <tr key={c.customer_id} className="border-b border-border last:border-0 hover:bg-bg-alt">
                  <td className="px-4 py-3 text-text-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/customers/${c.customer_id}`}
                      className="text-white hover:text-secondary transition-colors"
                    >
                      {c.name || c.email || c.customer_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center text-text-secondary">{c.payment_count}</td>
                  <td className="px-4 py-3 text-right font-medium text-white">
                    {formatCurrency(c.total_spent)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
