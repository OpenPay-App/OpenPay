"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Customer } from "@/lib/types";
import { formatDate } from "@/lib/format";


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [pageHistory, setPageHistory] = useState<string[]>([]);
  const perPage = 20;

  const fetchCustomers = useCallback(async (startingAfter?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(perPage) });
      if (startingAfter) params.set("starting_after", startingAfter);

      const res = await fetch(`/api/customers?${params}`);
      const data = await res.json();
      setCustomers(data.data || []);
      setHasMore(!!data.next);
      setCursor(data.next);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const goNext = () => {
    if (cursor) {
      setPageHistory((h) => [
        ...h,
        ...customers.map((c) => c.customer_id).filter(Boolean),
      ]);
      setPage((p) => p + 1);
      fetchCustomers(cursor);
    }
  };

  const goPrev = () => {
    if (pageHistory.length > 0) {
      const prevCursor = pageHistory[pageHistory.length - perPage];
      setPageHistory((h) => h.slice(0, -perPage));
      setPage((p) => p - 1);
      fetchCustomers(prevCursor);
    }
  };

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      c.customer_id.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Customers
            </h1>

          </div>
          <p className="text-gray-500 mt-1">
            People who have paid you
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-[3px] border border-[#e2e2e2] p-4 mb-6 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 bg-[#fafafa] rounded-[3px] px-3 py-2 max-w-sm border border-[#e2e2e2]">
          <Search className="w-4 h-4 text-[#AAADB0]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#333333] placeholder:text-[#AAADB0] outline-none w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3px] border border-[#e2e2e2] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#AAADB0] uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#AAADB0] uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#AAADB0] uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#AAADB0] uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 text-[#3898EC] animate-spin" />
                    <p className="text-[#AAADB0]">Loading customers...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <Users className="w-12 h-12 mx-auto mb-3 text-[#AAADB0] opacity-50" />
                    <p className="text-[#AAADB0]">No customers found</p>
                    <p className="text-sm text-[#AAADB0] mt-1">
                      {search
                        ? "Try adjusting your search"
                        : "Customers will appear after their first payment"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.customer_id}
                    className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <a
                        href={`/customers/${c.customer_id}`}
                        className="text-sm font-medium text-gray-900 hover:text-[#3898EC] transition-colors"
                      >
                        {c.name || "—"}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {c.email || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-[#AAADB0]">
                        {c.customer_id.slice(0, 12)}…
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#AAADB0]">
                      {formatDate(c.created)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#e2e2e2] flex items-center justify-between">
          <span className="text-sm text-[#AAADB0]">Page {page}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[3px] border border-[#e2e2e2] text-sm text-gray-700 hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={goNext}
              disabled={!hasMore}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[3px] border border-[#e2e2e2] text-sm text-gray-700 hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
