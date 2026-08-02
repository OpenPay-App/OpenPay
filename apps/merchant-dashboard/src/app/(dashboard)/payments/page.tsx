"use client";

import { useState, useEffect, useCallback } from "react";
import { CreditCard, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Payment, PaymentListResponse } from "@/lib/types";
import { formatCurrency, formatDate, statusColor } from "@/lib/format";
import { ModeBadge } from "@/components/mode-badge";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [pageHistory, setPageHistory] = useState<string[]>([]);
  const perPage = 20;

  const fetchPayments = useCallback(async (startingAfter?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(perPage) });
      if (startingAfter) params.set("starting_after", startingAfter);

      const res = await fetch(`/api/payments?${params}`);
      const data: PaymentListResponse = await res.json();
      setPayments(data.data || []);
      setHasMore(!!data.next);
      setCursor(data.next);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const goNext = () => {
    if (cursor) {
      setPageHistory((h) => [...h, ...payments.map((p) => p.payment_id).filter(Boolean)]);
      setPage((p) => p + 1);
      fetchPayments(cursor);
    }
  };

  const goPrev = () => {
    if (pageHistory.length > 0) {
      const prevCursor = pageHistory[pageHistory.length - perPage];
      setPageHistory((h) => h.slice(0, -perPage));
      setPage((p) => p - 1);
      fetchPayments(prevCursor);
    }
  };

  const filtered = payments.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.payment_id.toLowerCase().includes(q) ||
        (p.customer_email || "").toLowerCase().includes(q) ||
        (p.customer_name || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-text-primary">Payments</h1>
            <ModeBadge />
          </div>
          <p className="text-text-secondary mt-1">
            All transactions across your account
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-[#0a0a0a] rounded-xl border border-border p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-black rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm border border-border">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-text-muted outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm text-text-secondary bg-transparent border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20"
          >
            <option value="all">All statuses</option>
            <option value="succeeded">Succeeded</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-text-muted" />
          <span className="text-sm text-text-muted">
            {filtered.length} payment{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] rounded-xl border border-border">
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 text-secondary animate-spin" />
                    <p className="text-text-muted">Loading payments...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-50" />
                    <p className="text-text-muted">No payments found</p>
                    <p className="text-sm text-text-muted mt-1">
                      {search || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "Transactions will appear here"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.payment_id}
                    className="border-b border-border last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <a
                        href={`/payments/${p.payment_id}`}
                        className="text-sm font-mono text-secondary hover:underline"
                      >
                        {p.payment_id.slice(0, 16)}…
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {p.customer_email || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">
                      {formatCurrency(p.amount, p.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(p.status)}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {formatDate(p.created)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-text-muted">
            Page {page}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={goNext}
              disabled={!hasMore}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
