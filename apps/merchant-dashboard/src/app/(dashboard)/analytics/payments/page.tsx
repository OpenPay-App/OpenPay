"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getPaymentMetrics, getFailureReasons } from "@/lib/hyperswitch";
import type { PaymentMetric, FailureReason } from "@/lib/types";

const COLORS = ["#F56600", "#ef4444", "#FFC60A", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function PaymentAnalyticsPage() {
  const [metrics, setMetrics] = useState<PaymentMetric[]>([]);
  const [failures, setFailures] = useState<FailureReason[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getPaymentMetrics(days), getFailureReasons(days)]).then(
      ([m, f]) => {
        setMetrics(m.data);
        setFailures(f.data);
        setLoading(false);
      }
    );
  }, [days]);

  const totalPayments = metrics.reduce((sum, m) => sum + m.total, 0);
  const totalSuccess = metrics.reduce((sum, m) => sum + m.successful, 0);
  const totalFailed = metrics.reduce((sum, m) => sum + m.failed, 0);
  const avgSuccessRate =
    totalPayments > 0 ? (totalSuccess / totalPayments) * 100 : 0;
  const avgProcessingTime =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.avg_processing_time_ms, 0) / metrics.length
      : 0;

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
        <h1 className="text-2xl font-semibold text-white">Payment Analytics</h1>
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
            <CreditCard className="w-4 h-4 text-secondary" />
            <p className="text-xs text-text-secondary">Total Payments</p>
          </div>
          <p className="text-xl font-bold text-white">{totalPayments}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-text-secondary">Success Rate</p>
          </div>
          <p className="text-xl font-bold text-white">
            {avgSuccessRate.toFixed(1)}%
          </p>
          <p className="text-xs text-emerald-600 mt-1">{totalSuccess} succeeded</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <p className="text-xs text-text-secondary">Failed</p>
          </div>
          <p className="text-xl font-bold text-white">{totalFailed}</p>
          <p className="text-xs text-red-600 mt-1">
            {totalPayments > 0 ? ((totalFailed / totalPayments) * 100).toFixed(1) : 0}% failure
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-text-secondary">Avg. Processing</p>
          </div>
          <p className="text-xl font-bold text-white">
            {avgProcessingTime.toFixed(0)}ms
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Success Rate Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <h3 className="font-semibold text-white mb-4">Success Rate Over Time</h3>
          {loading ? (
            <div className="h-64 bg-bg-alt rounded-lg animate-pulse" />
          ) : metrics.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-text-muted text-sm">
              No payment data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                <YAxis
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`]} />
                <Area
                  type="monotone"
                  dataKey="success_rate"
                  stroke="#10b981"
                  fill="url(#successGrad)"
                  strokeWidth={2}
                  name="Success Rate"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Failure Reasons Pie */}
        <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
          <h3 className="font-semibold text-white mb-4">Failure Reasons</h3>
          {loading ? (
            <div className="h-64 bg-bg-alt rounded-lg animate-pulse" />
          ) : failures.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-text-muted text-sm">
              No failures
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={failures.slice(0, 6)}
                    dataKey="count"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                  >
                    {failures.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {failures.slice(0, 5).map((f, i) => (
                  <div key={f.reason} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-text-secondary truncate max-w-[120px]">
                        {f.reason}
                      </span>
                    </div>
                    <span className="font-medium text-white">{f.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Failed Payments Table */}
      <div className="rounded-xl border border-border bg-[#0a0a0a]">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-white">Failure Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-text-secondary">Reason</th>
              <th className="text-right px-4 py-3 font-medium text-text-secondary">Count</th>
              <th className="text-right px-4 py-3 font-medium text-text-secondary">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  <td colSpan={3} className="px-4 py-3">
                    <div className="h-5 bg-bg-alt rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : failures.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-text-muted">
                  No failure data
                </td>
              </tr>
            ) : (
              failures.map((f) => {
                const pct = totalFailed > 0 ? (f.count / totalFailed) * 100 : 0;
                return (
                  <tr key={f.reason} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-white">{f.reason}</td>
                    <td className="px-4 py-3 text-right text-text-secondary">{f.count}</td>
                    <td className="px-4 py-3 text-right text-text-secondary">{pct.toFixed(1)}%</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
