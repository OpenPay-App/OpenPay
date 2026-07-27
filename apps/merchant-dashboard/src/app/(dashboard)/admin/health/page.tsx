"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Server,
  Database,
  Wifi,
  WifiOff,
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
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
    if (status === "degraded") {
      return <Activity className="w-5 h-5 text-amber-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const statusColor = (status: string) => {
    if (status === "healthy" || status === "ok") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (status === "degraded") return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-red-50 text-red-700 border border-red-200";
  };

  const alertLevelColors: Record<string, string> = {
    info: "bg-blue-50 text-blue-700",
    warning: "bg-amber-50 text-amber-700",
    critical: "bg-red-50 text-red-700",
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
          <h1 className="text-2xl font-semibold text-text-primary">System Health</h1>
          <p className="text-text-secondary text-sm mt-1">
            Monitor all backend services and system status.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-secondary/30 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-xl border mb-8 ${statusColor(overallStatus)}`}>
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
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-red-700">
                {error.includes("Cannot reach Hyperswitch")
                  ? "Cannot connect to Hyperswitch"
                  : "Error loading system health"}
              </p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-3 py-1.5 border border-red-300 rounded-lg text-sm text-red-700 hover:bg-red-100 transition-colors"
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
            <div key={i} className="h-32 bg-bg-alt rounded-xl animate-pulse" />
          ))}
        </div>
      ) : health.length === 0 ? (
        <div className="p-12 rounded-xl border border-border bg-white text-center mb-8">
          <Server className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">No services configured</p>
          <p className="text-sm text-text-muted mt-1">
            Backend services will appear here once Hyperswitch is connected.
          </p>
        </div>
      ) : (
        Object.entries(categories).map(([category, services]) => (
          <div key={category} className="mb-8">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.service_name}
                  className="p-5 rounded-xl border border-border bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {service.status === "healthy" || service.status === "ok" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : service.status === "degraded" ? (
                        <Activity className="w-5 h-5 text-amber-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-text-primary">{service.service_name}</p>
                        <p className="text-xs text-text-muted capitalize">{service.status}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {service.uptime !== undefined && (
                      <div>
                        <span className="text-text-muted">Uptime</span>
                        <p className="font-medium text-text-primary">{service.uptime}%</p>
                      </div>
                    )}
                    {service.response_time_ms !== undefined && (
                      <div>
                        <span className="text-text-muted">Response</span>
                        <p className="font-medium text-text-primary">{service.response_time_ms}ms</p>
                      </div>
                    )}
                    {service.version && (
                      <div>
                        <span className="text-text-muted">Version</span>
                        <p className="font-medium text-text-primary">{service.version}</p>
                      </div>
                    )}
                    {service.last_checked && (
                      <div>
                        <span className="text-text-muted">Last Check</span>
                        <p className="font-medium text-text-primary">
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
      <div className="rounded-xl border border-border bg-white">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-text-primary">Recent Alerts</h3>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-bg-alt rounded-lg animate-pulse" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No recent alerts</div>
        ) : (
          <div className="divide-y divide-border">
            {alerts.slice(0, 20).map((alert) => (
              <div key={alert.alert_id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      alertLevelColors[alert.level] || "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {alert.level}
                  </span>
                  <div>
                    <p className="text-sm text-text-primary">{alert.message}</p>
                    <p className="text-xs text-text-muted">
                      {alert.service_name} · {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-text-muted flex items-center gap-1">
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
