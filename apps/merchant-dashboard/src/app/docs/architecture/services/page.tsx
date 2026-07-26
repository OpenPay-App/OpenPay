import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ServicesPage() {
  return (
    <div>
      <Link
        href="/docs/architecture"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Architecture
      </Link>

      <h1 className="text-4xl font-bold text-text-primary mb-4">
        Services Reference
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Every service in the OpenPay stack — what it does, how to configure it,
        and what ports it uses.
      </p>

      {/* Traefik */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
            Infrastructure
          </span>
          <h2 className="text-2xl font-bold text-text-primary">Traefik</h2>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-text-secondary mb-4">
            Traefik is the reverse proxy that sits in front of all services. It
            handles TLS termination, rate limiting, load balancing, and routes
            incoming requests to the correct backend container.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-text-primary">Ports</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>
                  <code className="font-mono text-xs">80</code> — HTTP (redirects to HTTPS)
                </li>
                <li>
                  <code className="font-mono text-xs">8080</code> — Dashboard
                </li>
                <li>
                  <code className="font-mono text-xs">443</code> — HTTPS
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-text-primary">Config</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>
                  <code className="font-mono text-xs">traefik.yml</code> — static config
                </li>
                <li>
                  <code className="font-mono text-xs">docker-compose.yml</code> — labels
                </li>
                <li>Rate limiting: 100 req/s per IP</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hyperswitch */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
            Core
          </span>
          <h2 className="text-2xl font-bold text-text-primary">Hyperswitch</h2>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-text-secondary mb-4">
            The payment orchestration engine. Routes payments to connectors,
            handles retries, stores payment records, and exposes the REST API.
            Built in Rust for high throughput and low latency.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-text-primary">Ports</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>
                  <code className="font-mono text-xs">8080</code> — API server
                </li>
                <li>
                  <code className="font-mono text-xs">8081</code> — Admin API
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-text-primary">Data</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>PostgreSQL — payments, refunds, customers</li>
                <li>Redis — session cache, rate limiting</li>
                <li>NATS — event publishing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Kill Bill */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
            Billing
          </span>
          <h2 className="text-2xl font-bold text-text-primary">Kill Bill</h2>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-text-secondary mb-4">
            Handles subscription billing, product catalog management, invoicing,
            and dunning. Integrates with Hyperswitch for payment processing and
            NATS for event synchronization.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-text-primary">Ports</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>
                  <code className="font-mono text-xs">8082</code> — REST API
                </li>
                <li>
                  <code className="font-mono text-xs">8083</code> — Admin API
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-text-primary">Features</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>Product & plan management</li>
                <li>Subscription lifecycle</li>
                <li>Invoice generation</li>
                <li>Dunning & retry logic</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tazama */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
            Fraud
          </span>
          <h2 className="text-2xl font-bold text-text-primary">Tazama</h2>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-text-secondary mb-4">
            Real-time fraud detection engine. Evaluates each transaction against
            configurable rules (amount thresholds, velocity checks, geo-blocking
            by BIN country). Produces risk scores and triggers alerts.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-text-primary">Rules</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>Amount threshold (e.g., &gt; 500,000 NGN)</li>
                <li>Velocity (e.g., &gt; 5 transactions in 10 minutes)</li>
                <li>Geo-blocking (BIN country != NG)</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-text-primary">Data</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>NATS — consumes payment events</li>
                <li>Redis — velocity tracking cache</li>
                <li>PostgreSQL — alert history</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NATS */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200">
            Infrastructure
          </span>
          <h2 className="text-2xl font-bold text-text-primary">
            NATS JetStream
          </h2>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-text-secondary mb-4">
            The event bus that connects all services. Uses JetStream for
            persistent, ordered event delivery. Events are published by
            Hyperswitch and consumed by Tazama, the NATS-KB Bridge, and your
            webhooks.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-text-primary">Ports</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>
                  <code className="font-mono text-xs">4222</code> — client connections
                </li>
                <li>
                  <code className="font-mono text-xs">8222</code> — monitoring
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-text-primary">Streams</span>
              <ul className="mt-1 space-y-1 text-text-secondary">
                <li>
                  <code className="font-mono text-xs">payments</code> — payment events
                </li>
                <li>
                  <code className="font-mono text-xs">refunds</code> — refund events
                </li>
                <li>
                  <code className="font-mono text-xs">fraud_alerts</code> — Tazama alerts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Database */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
            Infrastructure
          </span>
          <h2 className="text-2xl font-bold text-text-primary">PostgreSQL</h2>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-text-secondary mb-4">
            Shared database used by Hyperswitch, Kill Bill, and Tazama. Each
            service uses its own schema within the same PostgreSQL instance.
            The database persists all payment records, subscription data, and
            fraud alert history.
          </p>
          <div className="text-sm">
            <span className="font-medium text-text-primary">Port</span>
            <p className="text-text-secondary mt-1">
              <code className="font-mono text-xs">5432</code> — not exposed
              externally (only accessible via Docker network)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
