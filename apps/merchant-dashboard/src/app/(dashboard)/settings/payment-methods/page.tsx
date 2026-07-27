"use client";

import { useState, useEffect } from "react";
import {
  ToggleLeft,
  ToggleRight,
  CreditCard,
  Settings,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { listConnectors, toggleConnector } from "@/lib/hyperswitch";
import type { Connector } from "@/lib/types";

const connectorLogos: Record<string, string> = {
  paystack: "P",
  stripe: "S",
  flutterwave: "F",
  adyen: "A",
};

const connectorColors: Record<string, string> = {
  paystack: "bg-blue-600",
  stripe: "bg-indigo-600",
  flutterwave: "bg-blue-400",
  adyen: "bg-cyan-600",
};

export default function PaymentMethodsPage() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listConnectors();
      setConnectors(res.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    await toggleConnector(id, !currentEnabled);
    setConnectors((prev) =>
      prev.map((c) =>
        c.connector_id === id ? { ...c, enabled: !currentEnabled } : c
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          Connect payment processors to accept payments. Enable/disable
          connectors and manage their configuration.
        </p>
        <a
          href="https://hyperswitch.io/docs/connectors"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-secondary/30 transition-colors"
        >
          Browse Connectors
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white border border-border animate-pulse" />
          ))}
        </div>
      ) : connectors.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-border bg-white">
          <CreditCard className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No connectors configured</p>
          <p className="text-sm text-text-muted mt-1 mb-4">
            Connect a payment processor to start accepting payments.
          </p>
          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors"
          >
            <Settings className="w-4 h-4" />
            Open Hyperswitch Dashboard
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {connectors.map((connector) => (
            <div
              key={connector.connector_id}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-white"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${
                    connectorColors[connector.connector_type] || "bg-gray-500"
                  } flex items-center justify-center text-white font-bold text-sm`}
                >
                  {connectorLogos[connector.connector_type] ||
                    connector.connector_type[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-text-primary text-sm">
                      {connector.connector_name || connector.connector_type}
                    </p>
                    {connector.test_mode && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-medium">
                        Test Mode
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-text-muted">
                      {connector.supported_currencies.join(", ")}
                    </span>
                    {connector.last_used && (
                      <span className="text-xs text-text-muted">
                        Last used{" "}
                        {new Date(connector.last_used).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  handleToggle(connector.connector_id, connector.enabled)
                }
                className="flex items-center gap-2 transition-colors"
              >
                {connector.enabled ? (
                  <>
                    <ToggleRight className="w-8 h-8 text-secondary" />
                    <span className="text-sm font-medium text-secondary">
                      Enabled
                    </span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-8 h-8 text-text-muted" />
                    <span className="text-sm font-medium text-text-muted">
                      Disabled
                    </span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
