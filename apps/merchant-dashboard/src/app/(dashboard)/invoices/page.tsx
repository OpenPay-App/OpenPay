"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, FileText, Send, Plus } from "lucide-react";
import { listInvoices, sendInvoice } from "@/lib/hyperswitch";
import { formatCurrency } from "@/lib/format";
import { useSandboxMode } from "@/lib/sandbox-mode";

import type { Invoice, InvoiceStatus } from "@/lib/types";

const statusColors: Record<InvoiceStatus, string> = {
  draft: "bg-gray-100 text-gray-500",
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-[#e6f9e6] text-[#40d63b]",
  overdue: "bg-red-50 text-[#ea384c]",
  void: "bg-gray-100 text-gray-500",
  uncollectible: "bg-red-50 text-[#ea384c]",
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
          <p className="text-sm text-gray-500">
            Generated invoices for subscriptions and one-time charges.
          </p>

        </div>
        <button
          onClick={() => {
            /* TODO: implement create invoice modal */
            alert("Create Invoice coming soon!");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2c7dd6] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
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
            placeholder="Search by customer or invoice ID..."
            className="w-full pl-10 pr-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] placeholder:text-[#AAADB0] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-[3px] border border-[#e2e2e2] bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Invoice
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">
                  Due Date
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#e2e2e2] last:border-0">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#fafafa] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <FileText className="w-8 h-8 text-[#AAADB0] mx-auto mb-2" />
                    <p className="text-gray-500">{isSandbox ? "No test invoices found" : "No invoices found"}</p>
                    <p className="text-xs text-[#AAADB0] mt-1">
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
                    className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/invoices/${inv.invoice_id}`}
                        className="font-mono text-xs text-[#3898EC] hover:underline"
                      >
                        {inv.invoice_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">
                        {inv.customer_name || inv.customer_email || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatCurrency(inv.amount, inv.currency, 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(inv.created).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {inv.due_date
                        ? new Date(inv.due_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.status === "overdue" && (
                        <button
                          onClick={() => handleSendReminder(inv.invoice_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3898EC] border border-[#3898EC]/30 rounded-[3px] hover:bg-[#e8f0fe] transition-colors"
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
