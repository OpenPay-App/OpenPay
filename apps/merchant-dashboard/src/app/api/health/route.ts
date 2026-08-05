import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface HealthCheck {
  name: string;
  status: "up" | "down";
  latency: number;
}

const services = [
  {
    name: "Hyperswitch (Payments API)",
    url: process.env.HEALTH_CHECK_HYPERSWITCH_URL || "http://localhost:8081/health",
  },
  {
    name: "Kill Bill (Subscriptions)",
    url: process.env.HEALTH_CHECK_KILLBILL_URL || "http://localhost:8082/1.0/healthcheck",
  },
  {
    name: "NATS JetStream",
    url: process.env.HEALTH_CHECK_NATS_URL || "http://localhost:8222/healthz",
  },
  {
    name: "Tazama (Fraud Detection)",
    url: process.env.HEALTH_CHECK_TAZAMA_URL || "http://localhost:8084/health",
  },
];

export async function GET() {
  const checks: HealthCheck[] = await Promise.all(
    services.map(async (service) => {
      try {
        const start = Date.now();
        const res = await fetch(service.url, {
          method: "GET",
          signal: AbortSignal.timeout(5000),
          cache: "no-store",
        });
        const latency = Date.now() - start;
        return {
          name: service.name,
          status: res.ok ? "up" as const : "down" as const,
          latency,
        };
      } catch {
        return {
          name: service.name,
          status: "down" as const,
          latency: 0,
        };
      }
    })
  );

  return NextResponse.json({
    services: checks,
    lastChecked: new Date().toISOString(),
  });
}
