"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Loader2,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { Customer, Payment } from "@/lib/types";
import { formatCurrency as fmtCurrency, formatDate, statusColor } from "@/lib/format";
import { useBusinessProfile } from "@/lib/business-profile-context";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useBusinessProfile();
  const [activeTab, setActiveTab] = useState<"payments" | "subscriptions" | "invoices">("payments");

  const formatCurrency = (amount: number, cur?: string) => fmtCurrency(amount, cur || currency);

  useEffect(() => {
    async function load() {
      try {
        const [custRes, payRes] = await Promise.all([
          fetch(`/api/customers/${id}`),
          fetch(`/api/payments?limit=50`),
        ]);

        if (custRes.ok) setCustomer(await custRes.json());
        else setError("Customer not found");

        if (payRes.ok) {
          const data = await payRes.json();
          setPayments(
            (data.data || []).filter((p: Payment) => p.customer_id === id)
          );
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-32">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-error" />
        <p className="text-text-muted">{error || "Customer not found"}</p>
        <Link
          href="/customers"
          className="text-sm text-secondary hover:underline mt-4 inline-block"
        >
          ← Back to customers
        </Link>
      </div>
    );
  }

  const totalSpent = payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  const tabs = [
    { id: "payments" as const, label: "Payments" },
    { id: "subscriptions" as const, label: "Subscriptions" },
    { id: "invoices" as const, label: "Invoices" },
  ];

  return (
    <div>
      <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="bg-[#0a0a0a] rounded-xl border border-border p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-xl font-semibold text-text-primary">
              {customer.name || "Unnamed Customer"}
            </h1>
            <p className="text-sm text-text-muted mt-1">{customer.email}</p>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { label: "Customer ID", value: customer.customer_id },
              { label: "Total Spent", value: formatCurrency(totalSpent) },
              { label: "Payments", value: String(payments.length) },
              { label: "Joined", value: formatDate(customer.created) },
            ].map((field) => (
              <div
                key={field.label}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-sm text-text-secondary">
                  {field.label}
                </span>
                <span className="text-sm font-medium text-text-primary text-right max-w-[60%] truncate">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-[#0a0a0a] rounded-xl border border-border">
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-secondary border-b-2 border-secondary"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "payments" && (
                <>
                  {payments.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No payments yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left px-4 py-2 text-xs font-semibold text-text-muted uppercase">
                              ID
                            </th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-text-muted uppercase">
                              Amount
                            </th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-text-muted uppercase">
                              Status
                            </th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-text-muted uppercase">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((p) => (
                            <tr
                              key={p.payment_id}
                              className="border-b border-border last:border-0 hover:bg-bg-alt/50 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <a
                                  href={`/payments/${p.payment_id}`}
                                  className="text-sm font-mono text-secondary hover:underline"
                                >
                                  {p.payment_id.slice(0, 12)}…
                                </a>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                {formatCurrency(p.amount, p.currency)}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(p.status)}`}
                                >
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-text-muted">
                                {formatDate(p.created)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {activeTab === "subscriptions" && (
                <div className="text-center py-12 text-text-muted">
                  <p className="text-sm">Subscriptions coming in Phase 3</p>
                </div>
              )}

              {activeTab === "invoices" && (
                <div className="text-center py-12 text-text-muted">
                  <p className="text-sm">Invoices coming in Phase 3</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
