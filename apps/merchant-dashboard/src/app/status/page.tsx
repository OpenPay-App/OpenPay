"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "up" | "down" | "checking";
  latency?: number;
}

export default function StatusPage() {
  const [statuses, setStatuses] = useState<ServiceStatus[]>([
    { name: "Hyperswitch (Payments API)", status: "checking" },
    { name: "Kill Bill (Subscriptions)", status: "checking" },
    { name: "NATS JetStream", status: "checking" },
    { name: "Tazama (Fraud Detection)", status: "checking" },
  ]);
  const [lastChecked, setLastChecked] = useState<string>("");

  useEffect(() => {
    async function checkAll() {
      try {
        const res = await fetch("/api/health", { signal: AbortSignal.timeout(10000) });
        if (res.ok) {
          const data = await res.json();
          setStatuses(
            data.services.map((s: { name: string; status: string; latency: number }) => ({
              name: s.name,
              status: s.status as "up" | "down",
              latency: s.latency,
            }))
          );
          setLastChecked(new Date().toLocaleTimeString());
        }
      } catch {
        // Keep previous status on error
      }
    }

    checkAll();
    const interval = setInterval(checkAll, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#e2e2e2] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logo.svg" alt="AVA" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-[#999999] hover:text-[#333333] transition-colors">Home</Link>
            <Link href="/docs" className="text-sm text-[#999999] hover:text-[#333333] transition-colors">Docs</Link>
            <Link href="/changelog" className="text-sm text-[#999999] hover:text-[#333333] transition-colors">Changelog</Link>
            <Link href="/status" className="text-sm text-[#3898EC] font-medium">Status</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-[#333333] mb-4">System Status</h1>
        <p className="text-lg text-[#999999] mb-12">
          Real-time health status of all OpenPay services. Checks every 30 seconds.
        </p>

        <div className="space-y-3">
          {statuses.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-4 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center gap-3">
                {service.status === "checking" ? (
                  <Loader2 className="w-5 h-5 text-[#AAADB0] animate-spin" />
                ) : service.status === "up" ? (
                  <CheckCircle className="w-5 h-5 text-[#40d63b]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#ea384c]" />
                )}
                <span className="text-sm font-medium text-[#333333]">
                  {service.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {service.latency !== undefined && (
                  <span className="text-xs text-[#AAADB0] font-mono">
                    {service.latency}ms
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    service.status === "up"
                      ? "bg-[#e6f9e6] text-[#40d63b]"
                      : service.status === "checking"
                        ? "bg-gray-100 text-[#AAADB0]"
                        : "bg-red-50 text-[#ea384c]"
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

        <p className="text-xs text-[#AAADB0] mt-8">
          Last checked: {lastChecked || "Loading..."}
        </p>
      </main>

      <footer className="bg-[#fafafa] border-t border-[#e2e2e2] mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image src="/brand/logo.svg" alt="AVA" width={120} height={32} className="h-7 w-auto" />
            <p className="text-xs text-[#AAADB0]">&copy; {new Date().getFullYear()} OpenPay. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
