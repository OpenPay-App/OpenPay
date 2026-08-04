"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderOpen,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { getFraudCases, updateFraudCase } from "@/lib/hyperswitch";
import type { FraudCase } from "@/lib/types";

const statusColors: Record<string, string> = {
  open: "bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]",
  investigating: "bg-[#fffbeb] text-[#d97706] border border-[#fde68a]",
  resolved_legitimate: "bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]",
  resolved_fraudulent: "bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]",
  closed: "bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb]",
};

export default function CasesPage() {
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFraudCases();
      setCases(res.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load cases";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (caseId: string, status: FraudCase["status"]) => {
    try {
      await updateFraudCase(caseId, { status });
      loadCases();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update case";
      setError(message);
    }
  };

  const filtered = filter === "all" ? cases : cases.filter((c) => c.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#333333]">Case Management</h1>
          <p className="text-[#999999] text-sm mt-1">
            Review and manage flagged transactions and suspicious activity.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
        >
          <option value="all">All Cases</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved_legitimate">Resolved (Legit)</option>
          <option value="resolved_fraudulent">Resolved (Fraud)</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-[#fef2f2] border border-[#fecaca] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#dc2626] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#dc2626]">
              {error.includes("Cannot reach Hyperswitch")
                ? "Cannot connect to Hyperswitch"
                : error}
            </p>
          </div>
          <button
            onClick={loadCases}
            className="px-3 py-1 text-xs font-medium text-[#dc2626] bg-white border border-[#fecaca] rounded hover:bg-[#fee2e2] transition-colors flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      <div className="rounded-[8px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[#f8f8f8] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-10 h-10 text-[#AAADB0] mx-auto mb-3" />
            <p className="text-[#666666] font-medium">No cases found</p>
            <p className="text-sm text-[#999999] mt-1">
              {filter === "all"
                ? "No fraud cases have been created yet."
                : "No cases match this filter."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-medium text-[#666666]">Case</th>
                <th className="text-left px-4 py-3 font-medium text-[#666666]">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-[#666666]">Rule</th>
                <th className="text-center px-4 py-3 font-medium text-[#666666]">Risk</th>
                <th className="text-center px-4 py-3 font-medium text-[#666666]">Status</th>
                <th className="text-left px-4 py-3 font-medium text-[#666666]">Created</th>
                <th className="text-center px-4 py-3 font-medium text-[#666666]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.case_id} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa]">
                  <td className="px-4 py-3 font-mono text-xs text-[#333333]">
                    {c.case_id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/payments/${c.payment_id}`}
                      className="text-[#3898EC] hover:underline inline-flex items-center gap-1"
                    >
                      {c.payment_id.slice(0, 8)}...
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#666666]">{c.rule_name || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-[#333333]">{c.risk_score}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[c.status]}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#999999] text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusUpdate(c.case_id, e.target.value as FraudCase["status"])}
                      className="px-2 py-1 border border-[#e2e2e2] rounded text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#3898EC]/20"
                    >
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved_legitimate">Legitimate</option>
                      <option value="resolved_fraudulent">Fraudulent</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
