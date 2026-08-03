"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ExternalLink,
  Webhook,
  RotateCw,
  AlertTriangle,
} from "lucide-react";
import { listWebhooks, createWebhook, deleteWebhook } from "@/lib/hyperswitch";
import type { WebhookEndpoint } from "@/lib/types";

const availableEvents = [
  "payment_intent.created",
  "payment_intent.succeeded",
  "payment_intent.failed",
  "payment_intent.processing",
  "refund.created",
  "refund.succeeded",
  "refund.failed",
  "customer.created",
  "customer.updated",
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "payment_intent.succeeded",
    "payment_intent.failed",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listWebhooks();
      setWebhooks(res.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newUrl.trim()) return;
    setError(null);
    try {
      const res = await createWebhook(newUrl.trim(), selectedEvents);
      if (res.data) {
        setWebhooks((prev) => [res.data!, ...prev]);
        setNewUrl("");
        setShowCreate(false);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteWebhook(id);
      setWebhooks((prev) => prev.filter((w) => w.webhook_id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const statusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-950 text-emerald-400 border border-emerald-500/30";
      case "failing":
        return "bg-red-950/50 text-red-700";
      case "disabled":
        return "bg-gray-900 text-gray-400 border border-gray-700";
      default:
        return "bg-gray-900 text-gray-400 border border-gray-700";
    }
  };

  return (
    <div>
      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-950/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              {error.includes("Cannot reach Hyperswitch")
                ? "Cannot connect to Hyperswitch. Make sure the backend is running."
                : error}
            </p>
            <button
              onClick={() => { setError(null); loadWebhooks(); }}
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
          Webhooks send real-time event notifications to your server. Configure
          endpoints and choose which events to subscribe to.
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Endpoint
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 p-5 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Endpoint URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://your-server.com/webhooks/openpay"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Events to send
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableEvents.map((event) => (
                  <label
                    key={event}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-[#0a0a0a] text-sm cursor-pointer hover:border-secondary/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event)}
                      onChange={() => toggleEvent(event)}
                      className="rounded border-border text-secondary focus:ring-secondary/20"
                    />
                    <code className="text-xs font-mono text-text-secondary">
                      {event}
                    </code>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
              >
                Create Endpoint
              </button>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setNewUrl("");
                }}
                className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhooks List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-[#0a0a0a] border border-border animate-pulse" />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-border bg-[#0a0a0a]">
          <Webhook className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No webhook endpoints configured</p>
          <p className="text-sm text-text-muted mt-1">
            Add an endpoint to receive event notifications from OpenPay.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div
              key={wh.webhook_id}
              className="p-4 rounded-xl border border-border bg-[#0a0a0a]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Webhook className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-text-primary break-all">
                        {wh.url}
                      </code>
                      <ExternalLink className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(wh.status)}`}
                      >
                        {wh.status || "active"}
                      </span>
                      {wh.last_triggered && (
                        <span className="text-xs text-text-muted">
                          Last triggered{" "}
                          {new Date(wh.last_triggered).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {wh.events.map((event) => (
                        <span
                          key={event}
                          className="px-2 py-0.5 rounded bg-bg-alt text-text-secondary text-xs font-mono"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-alt transition-colors">
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(wh.webhook_id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-950/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
