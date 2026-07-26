import {
  DollarSign,
  CreditCard,
  AlertTriangle,
  Users,
} from "lucide-react";
import { listPayments } from "@/lib/hyperswitch";
import { formatCurrency } from "@/lib/format";
import { DashboardChart } from "@/components/dashboard-chart";

async function getStats() {
  try {
    const res = await listPayments({ limit: 100 });
    const payments = res.data || [];

    const totalRevenue = payments
      .filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + p.amount, 0);

    const successful = payments.filter((p) => p.status === "succeeded").length;
    const failed = payments.filter((p) => p.status === "failed").length;
    const uniqueCustomers = new Set(
      payments.filter((p) => p.customer_id).map((p) => p.customer_id)
    ).size;

    return {
      totalRevenue,
      successful,
      failed,
      activeCustomers: uniqueCustomers,
      recentPayments: payments.slice(0, 10),
    };
  } catch {
    return {
      totalRevenue: 0,
      successful: 0,
      failed: 0,
      activeCustomers: 0,
      recentPayments: [],
    };
  }
}

const stats = (s: Awaited<ReturnType<typeof getStats>>) => [
  {
    label: "Total Revenue",
    value: formatCurrency(s.totalRevenue, "NGN"),
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Successful Payments",
    value: String(s.successful),
    icon: CreditCard,
    color: "text-secondary",
    bg: "bg-secondary-light",
  },
  {
    label: "Failed Payments",
    value: String(s.failed),
    icon: AlertTriangle,
    color: "text-error",
    bg: "bg-red-50",
  },
  {
    label: "Active Customers",
    value: String(s.activeCustomers),
    icon: Users,
    color: "text-secondary",
    bg: "bg-secondary-light",
  },
];

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

export default async function DashboardPage() {
  const data = await getStats();
  const kpis = stats(data);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Overview of your payment activity
        </p>
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
              <p>No transactions yet</p>
              <p className="text-sm mt-1">
                Payments will appear here once you start accepting them
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
