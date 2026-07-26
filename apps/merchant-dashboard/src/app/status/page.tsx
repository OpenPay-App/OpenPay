"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

interface ServiceStatus {
  name: string;
  url: string;
  status: "up" | "down" | "checking";
  latency?: number;
}

const services: Omit<ServiceStatus, "status" | "latency">[] = [
  { name: "Hyperswitch (Payments API)", url: "http://localhost:8081/health" },
  { name: "Kill Bill (Subscriptions)", url: "http://localhost:8082/1.0/healthcheck" },
  { name: "NATS JetStream", url: "http://localhost:8222/healthz" },
  { name: "Tazama (Fraud Detection)", url: "http://localhost:8084/health" },
  { name: "Merchant Dashboard", url: "/" },
];

export default function StatusPage() {
  const [statuses, setStatuses] = useState<ServiceStatus[]>(
    services.map((s) => ({ ...s, status: "checking" }))
  );

  useEffect(() => {
    async function checkAll() {
      const results = await Promise.all(
        services.map(async (service) => {
          try {
            const start = Date.now();
            const res = await fetch(service.url, {
              method: "HEAD",
              signal: AbortSignal.timeout(3000),
            });
            const latency = Date.now() - start;
            return {
              ...service,
              status: res.ok ? ("up" as const) : ("down" as const),
              latency,
            };
          } catch {
            return { ...service, status: "down" as const };
          }
        })
      );
      setStatuses(results);
    }

    checkAll();
    const interval = setInterval(checkAll, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logo.svg" alt="OpenPay" width={180} height={45} className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Home</Link>
            <Link href="/docs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Docs</Link>
            <Link href="/changelog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Changelog</Link>
            <Link href="/status" className="text-sm text-secondary font-medium">Status</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-text-primary mb-4">System Status</h1>
        <p className="text-lg text-text-secondary mb-12">
          Real-time health status of all OpenPay services. Checks every 30 seconds.
        </p>

        <div className="space-y-3">
          {statuses.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-white"
            >
              <div className="flex items-center gap-3">
                {service.status === "checking" ? (
                  <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
                ) : service.status === "up" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-error" />
                )}
                <span className="text-sm font-medium text-text-primary">
                  {service.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {service.latency !== undefined && (
                  <span className="text-xs text-text-muted font-mono">
                    {service.latency}ms
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    service.status === "up"
                      ? "bg-emerald-50 text-emerald-700"
                      : service.status === "checking"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {service.status === "up"
                    ? "Operational"
                    : service.status === "checking"
                      ? "Checking..."
                      : "Down"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-muted mt-8">
          Last checked: {new Date().toLocaleTimeString()}
        </p>
      </main>

      <footer className="bg-bg-dark text-white mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image src="/brand/logo.svg" alt="OpenPay" width={120} height={30} className="h-7 w-auto brightness-0 invert" />
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} OpenPay. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
