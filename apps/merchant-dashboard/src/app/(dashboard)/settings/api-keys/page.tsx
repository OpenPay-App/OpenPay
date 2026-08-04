"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Copy,
  Trash2,
  CheckCircle,
  Key,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { listApiKeys, createApiKey, deleteApiKey } from "@/lib/hyperswitch";
import { useSandboxMode } from "@/lib/sandbox-mode";
import { keyModeOf, maskKeyValue } from "@/lib/constants";
import type { ApiKey } from "@/lib/types";

export default function ApiKeysPage() {
  const { mode, isSandbox } = useSandboxMode();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [publishableKey, setPublishableKey] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revealedMode, setRevealedMode] = useState<"sandbox" | "production">("sandbox");
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState(false);
  const [pendingLiveCreate, setPendingLiveCreate] = useState(false);

  const loadKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listApiKeys();
      setKeys(res.data || []);
      setPublishableKey(res.publishable_key || "");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys, mode]);

  useEffect(() => {
    setRevealedKey(null);
    setJustCreated(false);
  }, [mode]);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    if (mode === "production") {
      setPendingLiveCreate(true);
      return;
    }
    await doCreate();
  };

  const doCreate = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await createApiKey(newKeyName.trim(), mode);
      if (res.data) {
        setKeys((prev) => [res.data!, ...prev]);
        setRevealedKey(res.data.api_key);
        setRevealedMode(mode);
        setJustCreated(true);
        setTimeout(() => setJustCreated(false), 2000);
        setNewKeyName("");
        setShowCreate(false);
      } else if (res.error) {
        setError(res.error.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
      setPendingLiveCreate(false);
    }
  };

  const handleDelete = async (key: ApiKey) => {
    try {
      await deleteApiKey(key.key_id || key.api_key);
      setKeys((prev) => prev.filter((k) => k.api_key !== key.api_key));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const copyKey = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredKeys = keys.filter((k) => {
    const keyMode = k.mode ?? keyModeOf(k.api_key);
    if (keyMode === mode) return true;
    return mode === "sandbox" && keyMode === null;
  });

  return (
    <div>
      {/* Live-mode create confirmation */}
      {pendingLiveCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-[8px] p-6 max-w-md mx-4 shadow-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[3px] bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Create a live secret key?
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              You are about to mint a <strong className="font-semibold text-gray-900">production secret key</strong>.
              It can authorize <strong className="font-semibold text-gray-900">real charges</strong> on your live
              merchant account. Only create it if you intend to process live
              payments.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPendingLiveCreate(false)}
                className="px-4 py-2 border border-gray-200 rounded-[3px] text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doCreate}
                disabled={creating}
                className="px-4 py-2 bg-red-600 text-white rounded-[3px] text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {creating ? "Creating..." : "Create Live Key"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-[8px] border border-red-200 bg-red-50 flex items-start gap-3">
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
        <p className="text-sm text-gray-500">
          API keys authenticate your requests to the OpenPay API. Secret keys
          are shown once at creation and can be revoked from this page.
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2d7fd4] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create {mode === "sandbox" ? "Sandbox" : "Production"} Key
        </button>
      </div>

      {/* Publishable key */}
      {publishableKey && (
        <div className="mb-6 p-4 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#3898EC]" />
            <p className="text-sm font-medium text-gray-900">
              {mode === "sandbox" ? "Test" : "Live"} Publishable Key
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-[6px] border border-gray-200 bg-gray-50 font-mono text-xs text-gray-700 break-all">
              {publishableKey}
            </code>
            <button
              onClick={() => copyKey(publishableKey)}
              className="shrink-0 p-2 rounded-[3px] hover:bg-gray-100 transition-colors"
            >
              {copied === publishableKey ? (
                <CheckCircle className="w-4 h-4 text-[#40d63b]" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            Used in the checkout page to initialize the payment SDK. Public and
            safe to embed — never put a secret key here.
          </p>
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 p-4 rounded-[8px] border border-[#3898EC]/30 bg-[#3898EC]/5">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Key Name
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder={mode === "sandbox" ? "e.g., Test Backend" : "e.g., Production Backend"}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3898EC]/20 focus:border-[#3898EC]"
              autoFocus
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2d7fd4] disabled:opacity-50 transition-colors"
            >
              {creating ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setNewKeyName("");
              }}
              className="px-4 py-2 border border-gray-200 rounded-[3px] text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Newly Created Key */}
      {revealedKey && (
        <div className={`mb-6 p-5 rounded-[8px] border transition-all duration-500 ${
          justCreated
            ? "border-[#40d63b]/30 bg-[#40d63b]/5 shadow-lg"
            : "border-amber-300 bg-amber-50"
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-[3px] flex items-center justify-center transition-all duration-500 ${
              justCreated ? "bg-[#40d63b]/10" : "bg-amber-100"
            }`}>
              {justCreated ? (
                <Sparkles className="w-5 h-5 text-[#40d63b]" />
              ) : (
                <Key className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                justCreated ? "text-[#40d63b]" : "text-amber-700"
              }`}>
                {justCreated
                  ? "API key generated successfully!"
                  : "Copy your API key now — it won't be shown again."}
                {" "}
                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ml-1 ${
                  revealedMode === "production"
                    ? "bg-[#40d63b]/10 text-[#40d63b]"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {revealedMode === "production" ? "Live" : "Test"}
                </span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className={`flex-1 px-3 py-2.5 rounded-[6px] border font-mono text-sm break-all transition-all duration-300 ${
                  justCreated
                    ? "bg-white border-[#40d63b]/30 text-gray-900"
                    : "bg-white border-amber-300 text-gray-900"
                }`}>
                  {revealedKey}
                </code>
                <button
                  onClick={() => copyKey(revealedKey)}
                  className="shrink-0 p-2.5 rounded-[3px] hover:bg-gray-100 transition-colors"
                >
                  {copied === revealedKey ? (
                    <CheckCircle className="w-4 h-4 text-[#40d63b]" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              <button
                onClick={() => setRevealedKey(null)}
                className="mt-2 text-xs text-gray-500 hover:underline"
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
            <div key={i} className="h-16 rounded-[8px] bg-gray-100 border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : filteredKeys.length === 0 ? (
        <div className="text-center py-16 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <Key className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">
            {error
              ? "Could not load API keys"
              : `No ${mode} API keys yet`}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {error
              ? "Make sure Hyperswitch is running and try again."
              : `Create a ${mode} key to start integrating with the OpenPay API.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKeys.map((key) => (
            <div
              key={key.key_id || key.api_key}
              className="flex items-center justify-between p-4 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[3px] bg-[#3898EC]/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-[#3898EC]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">
                      {key.name}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isSandbox
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-[#40d63b]/10 text-[#40d63b] border border-[#40d63b]/30"
                    }`}>
                      {isSandbox ? "Test" : "Live"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      secret
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <code className="text-xs font-mono text-gray-500">
                      {maskKeyValue(key.api_key || key.key_id || "")}
                    </code>
                    <button
                      onClick={() => copyKey(key.api_key)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copied === key.api_key ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#40d63b]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {key.expires && (
                  <span className="text-xs text-gray-500">
                    Expires {new Date(key.expires).toLocaleDateString()}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-[#40d63b]/10 text-[#40d63b] border border-[#40d63b]/30 text-xs font-medium">
                  {key.enabled ? "Active" : "Disabled"}
                </span>
                <button
                  onClick={() => handleDelete(key)}
                  className="p-1.5 rounded-[3px] text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
