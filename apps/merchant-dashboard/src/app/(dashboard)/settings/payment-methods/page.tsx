"use client";

import { useState, useEffect } from "react";
import {
  ToggleLeft,
  ToggleRight,
  CreditCard,
  Settings,
  ExternalLink,
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
  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    setLoading(true);
    try {
      const res = await listConnectors();
      setConnectors(res.data);
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
        <p className="text-sm text-gray-500">
          Connect payment processors to accept payments. Enable/disable
          connectors and manage their configuration.
        </p>
        <a
          href="https://hyperswitch.io/docs/connectors"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-[3px] text-sm text-gray-600 hover:text-gray-900 hover:border-[#3898EC]/30 transition-colors"
        >
          Browse Connectors
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-[8px] bg-gray-100 border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : connectors.length === 0 ? (
        <div className="text-center py-16 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No connectors configured</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Connect a payment processor to start accepting payments.
          </p>
          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3898EC] text-white rounded-[3px] text-sm font-medium hover:bg-[#2d7fd4] transition-colors"
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
              className="flex items-center justify-between p-4 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-[3px] ${
                    connectorColors[connector.connector_type] || "bg-gray-500"
                  } flex items-center justify-center text-white font-bold text-sm`}
                >
                  {connectorLogos[connector.connector_type] ||
                    connector.connector_type[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">
                      {connector.connector_name || connector.connector_type}
                    </p>
                    {connector.test_mode && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                        Test Mode
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {connector.supported_currencies.join(", ")}
                    </span>
                    {connector.last_used && (
                      <span className="text-xs text-gray-500">
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
                    <ToggleRight className="w-8 h-8 text-[#3898EC]" />
                    <span className="text-sm font-medium text-[#3898EC]">
                      Enabled
                    </span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
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
