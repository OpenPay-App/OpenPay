"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowRight,
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
import { getRevenueMetrics, getTopCustomers } from "@/lib/hyperswitch";
import { useBusinessProfile } from "@/lib/business-profile-context";
import { useSandboxMode } from "@/lib/sandbox-mode";
import { formatCurrency as fmt } from "@/lib/format";
import type { RevenueMetric, TopCustomer } from "@/lib/types";

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState<RevenueMetric[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [days, setDays] = useState(30);
  const { currency } = useBusinessProfile();
  const { isSandbox } = useSandboxMode();
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [rev, cust] = await Promise.all([
      getRevenueMetrics(days),
      getTopCustomers(10),
    ]);
    setRevenue(rev.data);
    setTopCustomers(cust.data);
    setLoading(false);
  }, [days]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalRevenue = revenue.reduce((sum, r) => sum + r.revenue, 0);
  const totalRefunds = revenue.reduce((sum, r) => sum + r.refunds, 0);
  const netRevenue = revenue.reduce((sum, r) => sum + r.net, 0);

  const formatCurrency = (amount: number) => fmt(amount, currency, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-text-secondary">
            Revenue and payment analytics across your business.
          </p>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isSandbox
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-emerald-50 border-emerald-300 text-emerald-700"
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
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-secondary">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs text-emerald-600">Gross revenue</span>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-secondary">Refunds</p>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(totalRefunds)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-text-muted">
              {totalRevenue > 0
                ? ((totalRefunds / totalRevenue) * 100).toFixed(1)
                : "0"}
              % refund rate
            </span>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-secondary">Net Revenue</p>
            <BarChart3 className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(netRevenue)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-text-muted">After refunds</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <h3 className="font-semibold text-white mb-4">
            Revenue Over Time
          </h3>
          {loading ? (
            <div className="h-64 bg-bg-alt rounded-lg animate-pulse" />
          ) : revenue.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-text-muted text-sm">
              {isSandbox ? "No test revenue data yet" : "No revenue data yet"}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F56600" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F56600" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
                />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v) => `${(v / 100).toFixed(0)}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F56600" fill="url(#revenueGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="net" stroke="#10b981" fill="transparent" strokeWidth={1.5} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Customers */}
        <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <h3 className="font-semibold text-white mb-4">
            Top Customers
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-bg-alt rounded-lg animate-pulse" />
              ))}
            </div>
          ) : topCustomers.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-text-muted text-sm">
              {isSandbox ? "No test customer data yet" : "No customer data yet"}
            </div>
          ) : (
            <div className="space-y-3">
              {topCustomers.slice(0, 5).map((c, i) => (
                <Link
                  key={c.customer_id}
                  href={`/customers/${c.customer_id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-4">
                      {i + 1}.
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {c.name || c.email || c.customer_id}
                      </p>
                      <p className="text-xs text-text-muted">
                        {c.payment_count} payments
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(c.total_spent)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sub-pages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/analytics/revenue"
          className="flex items-center justify-between p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 hover:shadow-md transition-all group"
        >
          <div>
            <h3 className="font-semibold text-white group-hover:text-secondary transition-colors">
              Revenue Details
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              MRR, revenue by product, by currency
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
        </Link>
        <Link
          href="/analytics/customers"
          className="flex items-center justify-between p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 hover:shadow-md transition-all group"
        >
          <div>
            <h3 className="font-semibold text-white group-hover:text-secondary transition-colors">
              Customer Metrics
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Growth, churn, LTV
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
        </Link>
        <Link
          href="/analytics/payments"
          className="flex items-center justify-between p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 hover:shadow-md transition-all group"
        >
          <div>
            <h3 className="font-semibold text-white group-hover:text-secondary transition-colors">
              Payment Analytics
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Success rates, failure reasons
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
        </Link>
      </div>
    </div>
  );
}
