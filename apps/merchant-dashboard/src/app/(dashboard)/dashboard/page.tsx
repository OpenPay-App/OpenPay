"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  CreditCard,
  AlertTriangle,
  Users,
} from "lucide-react";
import { listPayments } from "@/lib/hyperswitch";
import { formatCurrency } from "@/lib/format";
import { useBusinessProfile } from "@/lib/business-profile-context";
import { useSandboxMode } from "@/lib/sandbox-mode";
import { DashboardChart } from "@/components/dashboard-chart";

interface Stats {
  totalRevenue: number;
  successful: number;
  failed: number;
  activeCustomers: number;
  recentPayments: any[];
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    succeeded: "bg-emerald-50 text-emerald-700",
    failed: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700",
    processing: "bg-blue-50 text-blue-700",
    cancelled: "bg-gray-100 text-gray-600",
    refunded: "bg-purple-50 text-purple-700",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const { currency } = useBusinessProfile();
  const { mode, isSandbox } = useSandboxMode();
  const [data, setData] = useState<Stats>({
    totalRevenue: 0,
    successful: 0,
    failed: 0,
    activeCustomers: 0,
    recentPayments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await listPayments({ limit: 100 });
        const payments = res.data || [];
        setData({
          totalRevenue: payments
            .filter((p) => p.status === "succeeded")
            .reduce((sum, p) => sum + p.amount, 0),
          successful: payments.filter((p) => p.status === "succeeded").length,
          failed: payments.filter((p) => p.status === "failed").length,
          activeCustomers: new Set(
            payments.filter((p) => p.customer_id).map((p) => p.customer_id)
          ).size,
          recentPayments: payments.slice(0, 10),
        });
      } catch {
        // Hyperswitch may be down
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const kpis = [
    {
      label: "Total Revenue",
      value: formatCurrency(data.totalRevenue, currency),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Successful Payments",
      value: String(data.successful),
      icon: CreditCard,
      color: "text-secondary",
      bg: "bg-secondary-light",
    },
    {
      label: "Failed Payments",
      value: String(data.failed),
      icon: AlertTriangle,
      color: "text-error",
      bg: "bg-red-50",
    },
    {
      label: "Active Customers",
      value: String(data.activeCustomers),
      icon: Users,
      color: "text-secondary",
      bg: "bg-secondary-light",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isSandbox
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-emerald-50 border-emerald-300 text-emerald-700"
            }`}>
              {isSandbox ? "Sandbox" : "Production"}
            </span>
          </div>
          <p className="text-text-secondary mt-1">
            {isSandbox ? "Test payment activity — no real charges" : "Live payment activity across your business"}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-text-secondary">
                {stat.label}
              </span>
              <div
                className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-text-primary">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="mb-8">
        <DashboardChart payments={data.recentPayments} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary">
            Recent Transactions
          </h2>
        </div>
        {data.recentPayments.length === 0 ? (
          <div className="p-6">
            <div className="text-center py-12 text-text-muted">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{isSandbox ? "No test transactions yet" : "No transactions yet"}</p>
              <p className="text-sm mt-1">
                {isSandbox
                  ? "Test payments will appear here once you start processing them"
                  : "Live payments will appear here once you start accepting them"}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((p) => (
                  <tr
                    key={p.payment_id}
                    className="border-b border-border last:border-0 hover:bg-bg-alt/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <a
                        href={`/payments/${p.payment_id}`}
                        className="text-sm font-mono text-secondary hover:underline"
                      >
                        {p.payment_id.slice(0, 12)}…
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {p.customer_email || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">
                      {formatCurrency(p.amount, p.currency)}
                    </td>
                    <td className="px-6 py-4">{statusBadge(p.status)}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {new Date(p.created).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
