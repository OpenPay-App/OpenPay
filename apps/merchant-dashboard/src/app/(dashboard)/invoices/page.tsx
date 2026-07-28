"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, FileText, Send, Plus } from "lucide-react";
import { listInvoices, sendInvoice } from "@/lib/hyperswitch";
import { formatCurrency } from "@/lib/format";
import { useSandboxMode } from "@/lib/sandbox-mode";
import type { Invoice, InvoiceStatus } from "@/lib/types";

const statusColors: Record<InvoiceStatus, string> = {
  draft: "bg-gray-50 text-gray-500",
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-red-50 text-red-700",
  void: "bg-gray-50 text-gray-400",
  uncollectible: "bg-red-50 text-red-700",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const { isSandbox } = useSandboxMode();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await listInvoices();
      setInvoices(res.data);
    } catch {
      // graceful
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = statusFilter
    ? invoices.filter((inv) => inv.status === statusFilter)
    : invoices;

  const handleSendReminder = async (id: string) => {
    await sendInvoice(id);
  };

  const filtered = filteredInvoices.filter(
    (inv) =>
      inv.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-text-secondary">
            Generated invoices for subscriptions and one-time charges.
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
            /* TODO: implement create invoice modal */
            alert("Create Invoice coming soon!");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
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
            placeholder="Search by customer or invoice ID..."
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Invoice
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Due Date
                </th>
                <th className="text-right px-4 py-3 font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-bg-alt rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <FileText className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-text-secondary">{isSandbox ? "No test invoices found" : "No invoices found"}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {isSandbox
                        ? "Test invoices will appear here once subscriptions are created."
                        : "Invoices are generated automatically from subscriptions."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr
                    key={inv.invoice_id}
                    className="border-b border-border last:border-0 hover:bg-bg-alt/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/invoices/${inv.invoice_id}`}
                        className="font-mono text-xs text-secondary hover:underline"
                      >
                        {inv.invoice_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-text-primary">
                        {inv.customer_name || inv.customer_email || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {formatCurrency(inv.amount, inv.currency, 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {new Date(inv.created).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {inv.due_date
                        ? new Date(inv.due_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.status === "overdue" && (
                        <button
                          onClick={() => handleSendReminder(inv.invoice_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-secondary border border-secondary/30 rounded-lg hover:bg-secondary-light transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Remind
                        </button>
                      )}
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
