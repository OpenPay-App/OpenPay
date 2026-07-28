"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getRevenueMetrics } from "@/lib/hyperswitch";
import { useBusinessProfile } from "@/lib/business-profile-context";
import { useSandboxMode } from "@/lib/sandbox-mode";
import { formatCurrency as fmt } from "@/lib/format";
import type { RevenueMetric } from "@/lib/types";
import Link from "next/link";

const COLORS = ["#F56600", "#FFC60A", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function RevenueDetailPage() {
  const [data, setData] = useState<RevenueMetric[]>([]);
  const [days, setDays] = useState(30);
  const { currency } = useBusinessProfile();
  const { isSandbox } = useSandboxMode();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRevenueMetrics(days).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [days]);

  const totalRevenue = data.reduce((sum, r) => sum + r.revenue, 0);
  const totalRefunds = data.reduce((sum, r) => sum + r.refunds, 0);
  const netRevenue = data.reduce((sum, r) => sum + r.net, 0);
  const avgDaily = data.length > 0 ? netRevenue / data.length : 0;

  const formatCurrency = (v: number) => fmt(v, currency, 0);

  // Payment method breakdown
  const paymentMethods = data.reduce(
    (acc, r) => {
      Object.entries(r.payment_method_breakdown).forEach(([method, amount]) => {
        acc[method] = (acc[method] || 0) + amount;
      });
      return acc;
    },
    {} as Record<string, number>
  );
  const paymentMethodData = Object.entries(paymentMethods)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

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
          <h1 className="text-2xl font-semibold text-white">Revenue Details</h1>
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
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-secondary" />
            <p className="text-xs text-text-secondary">Gross Revenue</p>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <p className="text-xs text-text-secondary">Refunds</p>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(totalRefunds)}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-text-secondary">Net Revenue</p>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(netRevenue)}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-text-secondary">Avg. Daily</p>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(avgDaily)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <h3 className="font-semibold text-white mb-4">Daily Revenue</h3>
          {loading ? (
            <div className="h-64 bg-bg-alt rounded-lg animate-pulse" />
          ) : data.length === 0 ? (              <div className="h-64 flex items-center justify-center text-text-muted text-sm">{isSandbox ? "No test data yet" : "No data yet"}</div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })
                  }
                />
                <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} tickFormatter={(v) => `${(v / 100).toFixed(0)}`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v)]} />
                <Bar dataKey="revenue" fill="#F56600" radius={[3, 3, 0, 0]} />
                <Bar dataKey="refunds" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Payment Methods Pie */}
        <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <h3 className="font-semibold text-white mb-4">By Payment Method</h3>
          {loading ? (
            <div className="h-64 bg-bg-alt rounded-lg animate-pulse" />
          ) : paymentMethodData.length === 0 ? (              <div className="h-64 flex items-center justify-center text-text-muted text-sm">{isSandbox ? "No test data yet" : "No data yet"}</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [formatCurrency(v)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {paymentMethodData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-text-secondary">{item.name}</span>
                    </div>
                    <span className="font-medium text-white">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
