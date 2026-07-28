"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Download, FileText } from "lucide-react";
import { getInvoice, sendInvoice } from "@/lib/hyperswitch";
import { formatCurrency } from "@/lib/format";
import { useSandboxMode } from "@/lib/sandbox-mode";
import type { Invoice } from "@/lib/types";

const statusColors: Record<string, string> = {
  draft: "bg-gray-900 text-gray-400 border border-gray-700",
  pending: "bg-amber-950 text-amber-400 border border-amber-500/30",
  paid: "bg-emerald-950 text-emerald-400 border border-emerald-500/30",
  overdue: "bg-red-950 text-red-400 border border-red-500/30",
  void: "bg-gray-900 text-gray-500 border border-gray-700",
  uncollectible: "bg-red-950 text-red-400 border border-red-500/30",
};

export default function InvoiceDetailPage() {
  const { isSandbox } = useSandboxMode();
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoice(params.id as string).then((inv) => {
      setInvoice(inv);
      setLoading(false);
    });
  }, [params.id]);

  const handleSend = async () => {
    if (!invoice) return;
    await sendInvoice(invoice.invoice_id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-bg-alt rounded animate-pulse" />
        <div className="h-96 bg-white rounded-xl border border-border animate-pulse" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">Invoice not found</p>
        <Link href="/invoices" className="text-secondary text-sm mt-2 inline-block hover:underline">
          Back to Invoices
        </Link>
      </div>
    );
  }

  const subtotal = invoice.line_items.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0
  );
  const tax = invoice.amount - subtotal;

  return (
    <div>
      <Link
        href="/invoices"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Invoices
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-text-primary">
              Invoice {invoice.invoice_id}
            </h1>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[invoice.status]}`}>
              {invoice.status}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isSandbox
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-emerald-50 border-emerald-300 text-emerald-700"
            }`}>
              {isSandbox ? "Sandbox" : "Production"}
            </span>
          </div>
          <p className="text-sm text-text-muted">
            Created {new Date(invoice.created).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          {(invoice.status === "pending" || invoice.status === "overdue") && (
            <button
              onClick={handleSend}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-secondary/30 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Reminder
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-secondary/30 transition-colors">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items */}
          <div className="rounded-xl border border-border bg-[#0a0a0a] overflow-hidden">
            <div className="p-4 border-b border-border bg-bg-alt">
              <h3 className="font-semibold text-text-primary text-sm">
                Line Items
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Description
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-text-secondary">
                    Qty
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-text-secondary">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((item, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-primary">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-center text-text-secondary">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-text-primary">
                      {formatCurrency(item.amount * item.quantity, invoice.currency, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary">
                  {formatCurrency(subtotal, invoice.currency, 0)}
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tax</span>
                  <span className="text-text-primary">
                    {formatCurrency(tax, invoice.currency, 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                <span className="text-text-primary">Total</span>
                <span className="text-text-primary">
                  {formatCurrency(invoice.amount, invoice.currency, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="p-5 rounded-xl border border-border bg-white">
            <h3 className="font-semibold text-text-primary mb-3 text-sm">
              Customer
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-text-primary font-medium">
                {invoice.customer_name || "—"}
              </p>
              <p className="text-text-secondary">{invoice.customer_email || "—"}</p>
              {invoice.subscription_id && (
                <Link
                  href={`/subscriptions/${invoice.subscription_id}`}
                  className="text-secondary text-xs hover:underline block mt-2"
                >
                  View Subscription →
                </Link>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-5 rounded-xl border border-border bg-white">
            <h3 className="font-semibold text-text-primary mb-3 text-sm">
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    invoice.status === "paid"
                      ? "bg-emerald-50 text-emerald-700"
                      : invoice.status === "overdue"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              {invoice.due_date && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Due Date</span>
                  <span className="text-text-primary">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {invoice.paid_at && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Paid</span>
                  <span className="text-emerald-600">
                    {new Date(invoice.paid_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
