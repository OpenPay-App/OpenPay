"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Copy,
  Trash2,
  CheckCircle,
  Key,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { listApiKeys, createApiKey, deleteApiKey } from "@/lib/hyperswitch";
import { useSandboxMode } from "@/lib/sandbox-mode";
import type { ApiKey } from "@/lib/types";

export default function ApiKeysPage() {
  const { mode } = useSandboxMode();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  useEffect(() => {
    setRevealedKey(null);
    setJustCreated(false);
  }, [mode]);

  const loadKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listApiKeys();
      setKeys(res.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await createApiKey(newKeyName.trim(), mode === "sandbox" ? "sandbox" : "production");
      if (res.data) {
        setKeys((prev) => [res.data!, ...prev]);
        setRevealedKey(res.data.api_key);
        setJustCreated(true);
        setTimeout(() => setJustCreated(false), 2000);
        setNewKeyName("");
        setShowCreate(false);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteApiKey(key);
      setKeys((prev) => prev.filter((k) => k.api_key !== key));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskKey = (key: string) => {
    if (key.length <= 12) return key;
    return key.slice(0, 8) + "..." + key.slice(-4);
  };

  const getKeyMode = (key: string) => {
    if (key.startsWith("op_test_") || key.startsWith("sk_test_")) return "sandbox";
    if (key.startsWith("op_live_") || key.startsWith("sk_live_")) return "production";
    return "unknown";
  };

  const filteredKeys = keys.filter((k) => {
    const keyMode = getKeyMode(k.api_key);
    if (mode === "sandbox") return keyMode === "sandbox" || keyMode === "unknown";
    return keyMode === "production" || keyMode === "unknown";
  });

  return (
    <div>
      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              {error.includes("Cannot reach Hyperswitch")
                ? "Cannot connect to Hyperswitch. Make sure the backend is running."
                : error}
            </p>
            <button
              onClick={() => { setError(null); loadKeys(); }}
              className="mt-2 text-xs text-red-700 hover:underline"
            >
              Retry
            </button>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            ×
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          API keys authenticate your requests to the OpenPay API. Keep secret
          keys confidential.
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create {mode === "sandbox" ? "Sandbox" : "Production"} Key
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 p-4 rounded-xl border border-secondary/30 bg-secondary/5 animate-slide-in">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Key Name
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder={mode === "sandbox" ? "e.g., Test Backend" : "e.g., Production Backend"}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              autoFocus
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover disabled:opacity-50 transition-colors"
            >
              {creating ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setNewKeyName("");
              }}
              className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Newly Created Key */}
      {revealedKey && (
        <div className={`mb-6 p-5 rounded-xl border transition-all duration-500 animate-fade-in ${
          justCreated
            ? "border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-100 scale-[1.01]"
            : "border-amber-300 bg-amber-50"
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
              justCreated
                ? "bg-emerald-100 animate-bounce-once"
                : "bg-amber-100"
            }`}>
              {justCreated ? (
                <Sparkles className="w-5 h-5 text-emerald-600" />
              ) : (
                <Key className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                justCreated ? "text-emerald-800" : "text-amber-800"
              }`}>
                {justCreated
                  ? "API key generated successfully!"
                  : "Copy your API key now — it won't be shown again."}
                {" "}
                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ml-1 ${
                  revealedKey.startsWith("op_live_")
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {revealedKey.startsWith("op_live_") ? "Production" : "Sandbox"}
                </span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className={`flex-1 px-3 py-2.5 rounded-lg border font-mono text-sm break-all transition-all duration-300 ${
                  justCreated
                    ? "bg-white border-emerald-200 text-emerald-900"
                    : "bg-white border-amber-200 text-text-primary"
                }`}>
                  {revealedKey}
                </code>
                <button
                  onClick={() => copyKey(revealedKey)}
                  className="shrink-0 p-2.5 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  {copied === revealedKey ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-amber-600" />
                  )}
                </button>
              </div>
              <button
                onClick={() => setRevealedKey(null)}
                className="mt-2 text-xs text-amber-700 hover:underline"
              >
                I&apos;ve copied it, dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white border border-border animate-pulse" />
          ))}
        </div>
      ) : filteredKeys.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-border bg-white">
          <Key className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">
            {error
              ? "Could not load API keys"
              : `No ${mode} API keys yet`}
          </p>
          <p className="text-sm text-text-muted mt-1">
            {error
              ? "Make sure Hyperswitch is running and try again."
              : `Create a ${mode} key to start integrating with the OpenPay API.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKeys.map((key) => {
            const keyMode = getKeyMode(key.api_key);
            return (
              <div
                key={key.api_key}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-white animate-slide-in"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary-light flex items-center justify-center">
                    <Key className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary text-sm">
                        {key.name}
                      </p>
                      {keyMode !== "unknown" && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          keyMode === "sandbox"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {keyMode === "sandbox" ? "Test" : "Live"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <code className="text-xs font-mono text-text-muted">
                        {maskKey(key.api_key)}
                      </code>
                      <button
                        onClick={() => copyKey(key.api_key)}
                        className="text-text-muted hover:text-text-primary transition-colors"
                      >
                        {copied === key.api_key ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium">
                    {key.enabled ? "Active" : "Disabled"}
                  </span>
                  {key.last_used && (
                    <span className="text-xs text-text-muted">
                      Last used {new Date(key.last_used).toLocaleDateString()}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(key.api_key)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
