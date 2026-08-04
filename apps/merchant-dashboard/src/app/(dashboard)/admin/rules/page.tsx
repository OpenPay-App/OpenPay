"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from "lucide-react";
import { getFraudRules, createFraudRule, updateFraudRule, deleteFraudRule } from "@/lib/hyperswitch";
import type { FraudRule } from "@/lib/types";

const severityColors: Record<string, string> = {
  low: "bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]",
  medium: "bg-[#fffbeb] text-[#d97706] border border-[#fde68a]",
  high: "bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]",
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
          <h1 className="text-2xl font-semibold text-[#333333]">Fraud Rule Studio</h1>
          <p className="text-[#999999] text-sm mt-1">
            Configure rules to detect and prevent fraudulent transactions.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2c7dd6] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#dc2626] mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#dc2626]">
              {error.includes("Cannot reach Hyperswitch")
                ? "Cannot connect to Hyperswitch"
                : error}
            </p>
          </div>
          <button
            onClick={loadRules}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-[#fecaca] rounded-[3px] text-[#dc2626] hover:bg-[#fee2e2] transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 p-5 rounded-[8px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <h3 className="font-semibold text-[#333333] mb-4">Create New Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#666666] mb-1 block">Rule Name</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g. Block high-velocity cards"
                className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
              />
            </div>
            <div>
              <label className="text-sm text-[#666666] mb-1 block">Description</label>
              <input
                type="text"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                placeholder="What does this rule do?"
                className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
              />
            </div>
            <div>
              <label className="text-sm text-[#666666] mb-1 block">Rule Type</label>
              <select
                value={newRule.rule_type}
                onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value as FraudRule["rule_type"] })}
                className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
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
              <label className="text-sm text-[#666666] mb-1 block">Severity</label>
              <select
                value={newRule.severity}
                onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as FraudRule["severity"] })}
                className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#666666] mb-1 block">Threshold</label>
              <input
                type="number"
                value={newRule.threshold}
                onChange={(e) => setNewRule({ ...newRule, threshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
              />
            </div>
            <div>
              <label className="text-sm text-[#666666] mb-1 block">Action</label>
              <select
                value={newRule.action}
                onChange={(e) => setNewRule({ ...newRule, action: e.target.value as FraudRule["action"] })}
                className="w-full px-3 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
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
              className="px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2c7dd6] disabled:opacity-50 transition-colors"
            >
              {creating ? "Creating..." : "Create Rule"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#666666] hover:text-[#333333] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="rounded-[8px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="p-4 border-b border-[#e2e2e2]">
          <h3 className="font-semibold text-[#333333]">Active Rules</h3>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[#f8f8f8] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : rules.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-10 h-10 text-[#AAADB0] mx-auto mb-3" />
            <p className="text-[#666666] font-medium">No fraud rules</p>
            <p className="text-sm text-[#999999] mt-1">
              Create your first rule to start detecting suspicious transactions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e2e2e2]">
            {rules.map((rule) => (
              <div key={rule.rule_id} className="p-4 flex items-center justify-between hover:bg-[#fafafa] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#f8f8f8]">
                    <Shield className={`w-5 h-5 ${rule.enabled ? "text-[#3898EC]" : "text-[#999999]"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#333333]">{rule.name}</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[rule.severity]}`}>
                        {rule.severity}
                      </span>
                      {!rule.enabled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[#f3f4f6] text-[#6b7280]">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#666666] mt-0.5">
                      {rule.description || rule.rule_type} · Threshold: {rule.threshold} · Action: {rule.action}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(rule)}
                    className="p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors"
                    title={rule.enabled ? "Disable" : "Enable"}
                  >
                    {rule.enabled ? (
                      <ToggleRight className="w-5 h-5 text-[#3898EC]" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-[#999999]" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(rule.rule_id)}
                    className="p-2 hover:bg-[#fef2f2] rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-[#999999] hover:text-[#dc2626]" />
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
