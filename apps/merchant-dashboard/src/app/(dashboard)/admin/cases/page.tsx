"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderOpen,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { getFraudCases, updateFraudCase } from "@/lib/hyperswitch";
import type { FraudCase } from "@/lib/types";

const statusColors: Record<string, string> = {
  open: "bg-blue-950 text-blue-400 border border-blue-500/30",
  investigating: "bg-amber-950 text-amber-400 border border-amber-500/30",
  resolved_legitimate: "bg-emerald-950 text-emerald-400 border border-emerald-500/30",
  resolved_fraudulent: "bg-red-950 text-red-400 border border-red-500/30",
  closed: "bg-gray-900 text-gray-400 border border-gray-700",
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
          <h1 className="text-2xl font-semibold text-text-primary">Case Management</h1>
          <p className="text-text-secondary text-sm mt-1">
            Review and manage flagged transactions and suspicious activity.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
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
        <div className="mb-4 p-4 rounded-lg bg-red-950/50 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-300">
              {error.includes("Cannot reach Hyperswitch")
                ? "Cannot connect to Hyperswitch"
                : error}
            </p>
          </div>
          <button
            onClick={loadCases}
            className="px-3 py-1 text-xs font-medium text-red-400 bg-red-950 border border-red-500/30 rounded hover:bg-red-900/50 transition-colors flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-[#0a0a0a]">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-bg-alt rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No cases found</p>
            <p className="text-sm text-text-muted mt-1">
              {filter === "all"
                ? "No fraud cases have been created yet."
                : "No cases match this filter."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Case</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Rule</th>
                <th className="text-center px-4 py-3 font-medium text-text-secondary">Risk</th>
                <th className="text-center px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Created</th>
                <th className="text-center px-4 py-3 font-medium text-text-secondary">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.case_id} className="border-b border-border last:border-0 hover:bg-bg-alt">
                  <td className="px-4 py-3 font-mono text-xs text-text-primary">
                    {c.case_id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/payments/${c.payment_id}`}
                      className="text-secondary hover:underline inline-flex items-center gap-1"
                    >
                      {c.payment_id.slice(0, 8)}...
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{c.rule_name || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-text-primary">{c.risk_score}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[c.status]}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusUpdate(c.case_id, e.target.value as FraudCase["status"])}
                      className="px-2 py-1 border border-border rounded text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-secondary/20"
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
