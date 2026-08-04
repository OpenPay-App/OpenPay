"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Server,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getSystemHealth, getAlertLogs } from "@/lib/hyperswitch";
import type { ServiceHealth, AlertLog } from "@/lib/types";

export default function SystemHealthPage() {
  const [health, setHealth] = useState<ServiceHealth[]>([]);
  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [h, a] = await Promise.all([getSystemHealth(), getAlertLogs()]);
      setHealth(h.data);
      setAlerts(a.data);
    } catch (err: any) {
      const message = err?.message || "Failed to load system health data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "healthy" || status === "ok") {
      return <CheckCircle className="w-5 h-5 text-[#40d63b]" />;
    }
    if (status === "degraded") {
      return <Activity className="w-5 h-5 text-[#f5a623]" />;
    }
    return <XCircle className="w-5 h-5 text-[#ea384c]" />;
  };

  const statusColor = (status: string) => {
    if (status === "healthy" || status === "ok") return "bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]";
    if (status === "degraded") return "bg-[#fffbeb] text-[#d97706] border border-[#fde68a]";
    return "bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]";
  };

  const alertLevelColors: Record<string, string> = {
    info: "bg-[#eff6ff] text-[#2563eb]",
    warning: "bg-[#fffbeb] text-[#d97706]",
    critical: "bg-[#fef2f2] text-[#dc2626]",
  };

  // Group health by category
  const categories = health.reduce(
    (acc, service) => {
      const cat = service.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(service);
      return acc;
    },
    {} as Record<string, ServiceHealth[]>
  );

  const overallStatus = health.some((s) => s.status === "critical" || s.status === "down")
    ? "critical"
    : health.some((s) => s.status === "degraded")
    ? "degraded"
    : "healthy";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#333333]">System Health</h1>
          <p className="text-[#999999] text-sm mt-1">
            Monitor all backend services and system status.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 border border-[#e2e2e2] rounded-[3px] text-sm text-[#666666] hover:text-[#333333] hover:border-[#3898EC] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-[8px] border mb-8 ${statusColor(overallStatus)}`}>
        <div className="flex items-center gap-3">
          {statusIcon(overallStatus)}
          <div>
            <p className="font-semibold">
              System Status: {overallStatus === "healthy" ? "All Systems Operational" : overallStatus === "degraded" ? "Partial Degradation" : "Service Disruption"}
            </p>
            <p className="text-sm opacity-80">
              {health.length} services monitored · Last checked: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-[8px] border border-[#fecaca] bg-[#fef2f2] mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-[#dc2626]">
                {error.includes("Cannot reach Hyperswitch")
                  ? "Cannot connect to Hyperswitch"
                  : "Error loading system health"}
              </p>
              <p className="text-sm text-[#b91c1c] mt-0.5">{error}</p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#fecaca] rounded-[3px] text-sm text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Services */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#f8f8f8] rounded-[8px] animate-pulse" />
          ))}
        </div>
      ) : health.length === 0 ? (
        <div className="p-12 rounded-[8px] border border-[#e2e2e2] bg-white text-center mb-8 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <Server className="w-10 h-10 text-[#AAADB0] mx-auto mb-3" />
          <p className="text-[#666666] font-medium">No services configured</p>
          <p className="text-sm text-[#999999] mt-1">
            Backend services will appear here once Hyperswitch is connected.
          </p>
        </div>
      ) : (
        Object.entries(categories).map(([category, services]) => (
          <div key={category} className="mb-8">
            <h2 className="text-sm font-semibold text-[#666666] uppercase tracking-wider mb-3">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.service_name}
                  className="p-5 rounded-[8px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {service.status === "healthy" || service.status === "ok" ? (
                        <CheckCircle className="w-5 h-5 text-[#40d63b]" />
                      ) : service.status === "degraded" ? (
                        <Activity className="w-5 h-5 text-[#f5a623]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#ea384c]" />
                      )}
                      <div>
                        <p className="font-medium text-[#333333]">{service.service_name}</p>
                        <p className="text-xs text-[#999999] capitalize">{service.status}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {service.uptime !== undefined && (
                      <div>
                        <span className="text-[#999999]">Uptime</span>
                        <p className="font-medium text-[#333333]">{service.uptime}%</p>
                      </div>
                    )}
                    {service.response_time_ms !== undefined && (
                      <div>
                        <span className="text-[#999999]">Response</span>
                        <p className="font-medium text-[#333333]">{service.response_time_ms}ms</p>
                      </div>
                    )}
                    {service.version && (
                      <div>
                        <span className="text-[#999999]">Version</span>
                        <p className="font-medium text-[#333333]">{service.version}</p>
                      </div>
                    )}
                    {service.last_checked && (
                      <div>
                        <span className="text-[#999999]">Last Check</span>
                        <p className="font-medium text-[#333333]">
                          {new Date(service.last_checked).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Alert Logs */}
      <div className="rounded-[8px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="p-4 border-b border-[#e2e2e2]">
          <h3 className="font-semibold text-[#333333]">Recent Alerts</h3>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-[#f8f8f8] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-[#999999] text-sm">No recent alerts</div>
        ) : (
          <div className="divide-y divide-[#e2e2e2]">
            {alerts.slice(0, 20).map((alert) => (
              <div key={alert.alert_id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      alertLevelColors[alert.level] || "bg-[#f3f4f6] text-[#6b7280]"
                    }`}
                  >
                    {alert.level}
                  </span>
                  <div>
                    <p className="text-sm text-[#333333]">{alert.message}</p>
                    <p className="text-xs text-[#999999]">
                      {alert.service_name} · {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#999999] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
