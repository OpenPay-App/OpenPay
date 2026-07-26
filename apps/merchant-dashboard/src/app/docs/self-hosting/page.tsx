import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SelfHostingPage() {
  return (
    <div>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      <h1 className="text-4xl font-bold text-text-primary mb-4">
        Self-Hosting with Docker
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Deploy the complete OpenPay platform on your own infrastructure using
        Docker Compose. One command starts all services.
      </p>

      {/* Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          What You&apos;ll Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Hyperswitch",
              description: "Payment orchestration engine",
            },
            {
              title: "Kill Bill",
              description: "Subscription billing & invoicing",
            },
            {
              title: "Tazama",
              description: "Real-time fraud detection",
            },
            {
              title: "NATS JetStream",
              description: "Event streaming bus",
            },
            {
              title: "PostgreSQL",
              description: "Primary database",
            },
            {
              title: "Redis",
              description: "Cache & session store",
            },
            {
              title: "Traefik",
              description: "Reverse proxy & TLS",
            },
            {
              title: "Merchant Dashboard",
              description: "Next.js admin panel",
            },
          ].map((s) => (
            <div key={s.title} className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-text-primary text-sm">
                {s.title}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Quick Start
        </h2>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`# Clone the repo
git clone https://github.com/OpenPay-App/OpenPay.git
cd OpenPay

# Copy environment files
cp .env.example .env
cp event-bus/.env.example event-bus/.env
cp payment-system/hyperswitch/.env.example payment-system/hyperswitch/.env
cp payment-system/killbill/.env.example payment-system/killbill/.env

# Edit .env with your keys (Paystack, Kinde, etc.)
nano .env

# Start everything
make up

# Initialize NATS streams
./event-bus/nats/scripts/init-streams.sh

# Watch logs
make logs`}</pre>
        </div>
      </section>

      {/* Ports */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Default Ports
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Service
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Port
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Merchant Dashboard", "3000", "Next.js UI"],
                ["Traefik", "8080", "Reverse proxy dashboard"],
                ["Hyperswitch API", "8081", "Payment processing API"],
                ["Kill Bill", "8082", "Subscription billing API"],
                ["NATS Monitoring", "8222", "JetStream monitoring"],
                ["PostgreSQL", "5432", "Database (internal only)"],
                ["Redis", "6379", "Cache (internal only)"],
                ["NATS", "4222", "Event bus (internal only)"],
              ].map(([service, port, purpose]) => (
                <tr key={service} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {service}
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">
                      {port}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          System Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-border text-center">
            <p className="text-3xl font-bold text-secondary">4GB</p>
            <p className="text-sm text-text-secondary mt-1">Minimum RAM</p>
          </div>
          <div className="p-5 rounded-xl border border-border text-center">
            <p className="text-3xl font-bold text-secondary">20GB</p>
            <p className="text-sm text-text-secondary mt-1">Disk space</p>
          </div>
          <div className="p-5 rounded-xl border border-border text-center">
            <p className="text-3xl font-bold text-secondary">2+</p>
            <p className="text-sm text-text-secondary mt-1">CPU cores</p>
          </div>
        </div>
      </section>

      {/* Next */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/docs/self-hosting/env-vars"
          className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
        >
          <div>
            <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
              Environment Variables
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Complete reference for all config options
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
        </Link>
        <Link
          href="/docs/self-hosting/production"
          className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
        >
          <div>
            <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
              Production Deploy
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Hardening guide for live environments
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
        </Link>
      </section>
    </div>
  );
}
