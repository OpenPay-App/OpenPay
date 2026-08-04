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
          <p className="text-sm text-gray-500">
            Revenue and payment analytics across your business.
          </p>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isSandbox
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-[#e6f9e6] border-[#40d63b]/30 text-[#40d63b]"
          }`}>
            {isSandbox ? "Sandbox" : "Production"}
          </span>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-[#3898EC]" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#40d63b]" />
            <span className="text-xs text-[#40d63b]">Gross revenue</span>
          </div>
        </div>
        <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Refunds</p>
            <TrendingDown className="w-5 h-5 text-[#ea384c]" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalRefunds)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[#AAADB0]">
              {totalRevenue > 0
                ? ((totalRefunds / totalRevenue) * 100).toFixed(1)
                : "0"}
              % refund rate
            </span>
          </div>
        </div>
        <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Net Revenue</p>
            <BarChart3 className="w-5 h-5 text-[#3898EC]" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(netRevenue)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[#AAADB0]">After refunds</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <h3 className="font-semibold text-gray-900 mb-4">
            Revenue Over Time
          </h3>
          {loading ? (
            <div className="h-64 bg-[#fafafa] rounded-[3px] animate-pulse" />
          ) : revenue.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-[#AAADB0] text-sm">
              {isSandbox ? "No test revenue data yet" : "No revenue data yet"}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3898EC" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3898EC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e2e2" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#999999" }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
                />
                <YAxis tick={{ fontSize: 11, fill: "#999999" }} tickFormatter={(v) => `${(v / 100).toFixed(0)}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  contentStyle={{ borderRadius: "3px", border: "1px solid #e2e2e2", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3898EC" fill="url(#revenueGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="net" stroke="#40d63b" fill="transparent" strokeWidth={1.5} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Customers */}
        <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <h3 className="font-semibold text-gray-900 mb-4">
            Top Customers
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[#fafafa] rounded-[3px] animate-pulse" />
              ))}
            </div>
          ) : topCustomers.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-[#AAADB0] text-sm">
              {isSandbox ? "No test customer data yet" : "No customer data yet"}
            </div>
          ) : (
            <div className="space-y-3">
              {topCustomers.slice(0, 5).map((c, i) => (
                <Link
                  key={c.customer_id}
                  href={`/customers/${c.customer_id}`}
                  className="flex items-center justify-between p-3 rounded-[3px] hover:bg-[#fafafa] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#AAADB0] w-4">
                      {i + 1}.
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {c.name || c.email || c.customer_id}
                      </p>
                      <p className="text-xs text-[#AAADB0]">
                        {c.payment_count} payments
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
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
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              Revenue Details
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              MRR, revenue by product, by currency
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#AAADB0] group-hover:text-[#3898EC] transition-colors" />
        </Link>
        <Link
          href="/analytics/customers"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              Customer Metrics
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Growth, churn, LTV
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#AAADB0] group-hover:text-[#3898EC] transition-colors" />
        </Link>
        <Link
          href="/analytics/payments"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              Payment Analytics
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Success rates, failure reasons
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#AAADB0] group-hover:text-[#3898EC] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
