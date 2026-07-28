"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { getFraudRules, createFraudRule, updateFraudRule, deleteFraudRule } from "@/lib/hyperswitch";
import type { FraudRule } from "@/lib/types";

const severityColors: Record<string, string> = {
  low: "bg-blue-950 text-blue-400 border border-blue-500/30",
  medium: "bg-amber-950 text-amber-400 border border-amber-500/30",
  high: "bg-red-950 text-red-400 border border-red-500/30",
};

export default function FraudRulesPage() {
  const [rules, setRules] = useState<FraudRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    rule_type: "velocity_check" as FraudRule["rule_type"],
    severity: "medium" as FraudRule["severity"],
    threshold: 5,
    time_window_minutes: 60,
    action: "review" as FraudRule["action"],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFraudRules();
      setRules(res.data);
    } catch (err: any) {
      const message = err?.message || "Failed to load fraud rules";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      await createFraudRule(newRule);
      setShowCreate(false);
      setNewRule({
        name: "",
        description: "",
        rule_type: "velocity_check",
        severity: "medium",
        threshold: 5,
        time_window_minutes: 60,
        action: "review",
      });
      loadRules();
    } catch (err: any) {
      setError(err?.message || "Failed to create rule");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (rule: FraudRule) => {
    try {
      await updateFraudRule(rule.rule_id, { enabled: !rule.enabled });
      loadRules();
    } catch (err: any) {
      setError(err?.message || "Failed to update rule");
    }
  };

  const handleDelete = async (ruleId: string) => {
    try {
      await deleteFraudRule(ruleId);
      loadRules();
    } catch (err: any) {
      setError(err?.message || "Failed to delete rule");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Fraud Rule Studio</h1>
          <p className="text-text-secondary text-sm mt-1">
            Configure rules to detect and prevent fraudulent transactions.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-300">
              {error.includes("Cannot reach Hyperswitch")
                ? "Cannot connect to Hyperswitch"
                : error}
            </p>
          </div>
          <button
            onClick={loadRules}
            className="px-3 py-1.5 text-xs font-medium bg-red-950 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-900/50 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 p-5 rounded-xl border border-secondary/30 bg-[#0a0a0a]">
          <h3 className="font-semibold text-text-primary mb-4">Create New Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Rule Name</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g. Block high-velocity cards"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Description</label>
              <input
                type="text"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                placeholder="What does this rule do?"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Rule Type</label>
              <select
                value={newRule.rule_type}
                onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value as FraudRule["rule_type"] })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
                <option value="velocity_check">Velocity Check</option>
                <option value="amount_threshold">Amount Threshold</option>
                <option value="geo_mismatch">Geo Mismatch</option>
                <option value="bin_blocklist">BIN Blocklist</option>
                <option value="email_blocklist">Email Blocklist</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Severity</label>
              <select
                value={newRule.severity}
                onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as FraudRule["severity"] })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Threshold</label>
              <input
                type="number"
                value={newRule.threshold}
                onChange={(e) => setNewRule({ ...newRule, threshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Action</label>
              <select
                value={newRule.action}
                onChange={(e) => setNewRule({ ...newRule, action: e.target.value as FraudRule["action"] })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
                <option value="flag">Flag for Review</option>
                <option value="review">Hold for Review</option>
                <option value="block">Block Transaction</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              disabled={!newRule.name || creating}
              className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 disabled:opacity-50 transition-colors"
            >
              {creating ? "Creating..." : "Create Rule"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="rounded-xl border border-border bg-[#0a0a0a]">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-text-primary">Active Rules</h3>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-bg-alt rounded-lg animate-pulse" />
            ))}
          </div>
        ) : rules.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No fraud rules</p>
            <p className="text-sm text-text-muted mt-1">
              Create your first rule to start detecting suspicious transactions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {rules.map((rule) => (
              <div key={rule.rule_id} className="p-4 flex items-center justify-between hover:bg-bg-alt transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-bg-alt">
                    <Shield className={`w-5 h-5 ${rule.enabled ? "text-secondary" : "text-text-muted"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary">{rule.name}</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[rule.severity]}`}>
                        {rule.severity}
                      </span>
                      {!rule.enabled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-900 text-gray-400">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {rule.description || rule.rule_type} · Threshold: {rule.threshold} · Action: {rule.action}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(rule)}
                    className="p-2 hover:bg-bg-alt rounded-lg transition-colors"
                    title={rule.enabled ? "Disable" : "Enable"}
                  >
                    {rule.enabled ? (
                      <ToggleRight className="w-5 h-5 text-secondary" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-text-muted" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(rule.rule_id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-text-muted hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
