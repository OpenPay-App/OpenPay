import Link from "next/link";
import { ArrowLeft, ArrowRight, Database, Server, Network, Shield, Globe, ExternalLink } from "lucide-react";

export default function ArchitecturePage() {
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
        Architecture Overview
      </h1>
      <p className="text-lg text-text-secondary mb-10 max-w-3xl leading-relaxed">
        OpenPay is composed of 10+ microservices connected through NATS
        JetStream event streams. Every component is open source, containerized
        with Docker, and designed for horizontal scalability.
      </p>

      {/* Architectural Principles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Architectural Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: Server,
              title: "Microservices",
              desc: "Each service has a single responsibility and can be scaled independently.",
            },
            {
              icon: Network,
              title: "Event-Driven",
              desc: "Services communicate asynchronously through NATS JetStream — no blocking calls.",
            },
            {
              icon: Shield,
              title: "Provider-Agnostic",
              desc: "Hyperswitch routes to 100+ processors. Switch providers without code changes.",
            },
            {
              icon: Database,
              title: "Self-Healing",
              desc: "Health checks, automatic restarts, and dead-letter queues for fault tolerance.",
            },
          ].map((p) => (
            <div key={p.title} className="p-4 rounded-xl border border-border bg-[#0a0a0a]">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                <p.icon className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="font-semibold text-text-primary text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          System Architecture Diagram
        </h2>
        <div className="rounded-xl border border-border p-8 bg-[#0a0a0a] font-mono text-xs leading-relaxed text-text-secondary overflow-x-auto">
          <pre>{`
                         ┌─────────────────────────────────┐
                         │           Internet              │
                         └────────────┬──────────┬─────────┘
                                      │          │
                               ┌──────▼──────┐   │
                               │   Traefik   │   │ Processor
                               │  (Reverse   │   │ Webhooks
                               │   Proxy)    │   │
                               └──────┬──────┘   │
                                      │          │
          ┌───────────────────────────┼──────────┼──────────┐
          │                           │          │          │
          │                    ┌──────▼──────┐   │          │
          │                    │ Hyperswitch │   │          │
          │                    │(Rust, 8081) │   │          │
          │                    └──────┬──────┘   │          │
          │                           │          │          │
          │                    ┌──────▼──────────────────┐  │
          │                    │    NATS JetStream        │  │
          │                    │   (ports 4222, 8222)     │  │
          │                    │  PAYMENT_EVENTS · DLQ    │  │
          │                    └────┬────┬────┬────┬─────┘  │
          │                         │    │    │    │        │
          │    ┌────────────────────┘    │    │    └─────┐  │
          │    │                  ┌──────┘    └──────┐   │  │
          │    ▼                  ▼                   ▼   │  │
   ┌──────┴────────┐   ┌────────────────┐   ┌────────────┐ │
   │   Kill Bill   │   │  Tazama Rule   │   │  NATS-KB   │ │
   │  (Java, 8082) │   │  Exec (Go,8084)│   │  Bridge    │ │
   │  Subscriptions│   │  Fraud Rules   │   │  (Go)      │ │
   └───────┬───────┘   └───────┬────────┘   └─────┬──────┘ │
           │                   │                   │        │
           ▼                   ▼                   ▼        │
   ┌─────────────────────────────────────────────────────┐  │
   │            PostgreSQL  +  Redis  +  NATS             │  │
   │          (Data Layer — Docker internal only)         │  │
   └─────────────────────────────────────────────────────┘  │

   ┌────────────────────┐   ┌────────────────────┐
   │ Tazama Rule Studio │   │ Case Management   │
   │  (Web UI, 3000)    │   │  (Web UI, 3001)   │
   │  Rule Authoring    │   │  Alert Review     │
   └────────────────────┘   └────────────────────┘
          `}</pre>
        </div>
        <p className="text-xs text-text-muted mt-3 text-center italic">
          All internal services communicate over the Docker bridge network. Only Traefik (ports 80/443) is exposed to the internet.
        </p>
      </section>

      {/* Event Flow Diagram */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Payment Event Flow
        </h2>
        <div className="rounded-xl border border-border p-8 bg-[#0a0a0a] font-mono text-xs leading-relaxed text-text-secondary overflow-x-auto">
          <pre>{`
  CUSTOMER                   HYPERSWITCH                    NATS                     TAZAMA              YOUR APP
    │                            │                         │                         │                    │
    │  POST /payments            │                         │                         │                    │
    ├────────────────────────────►                         │                         │                    │
    │                            │                         │                         │                    │
    │                            ├── payments.pending ────►│                         │                    │
    │                            │                         ├── fraud check ──────────►│                    │
    │                            │                         │                         │                    │
    │                            │◄── risk_score ──────────┤                         │                    │
    │                            │                         │                         │                    │
    │                            │── Connector request ──► (Payment Processor)       │                    │
    │◄── payment response ───────┤                         │                         │                    │
    │                            │                         │                         │                    │
    │                            ├── payments.completed ──►│                         │                    │
    │                            │                         ├── webhook ────────────────────────────────────►│
    │                            │                         │                         │                    │
    │                            │                         ├── invoice request ──► Kill Bill              │
    │                            │                         │                         │                    │
    │  (or)                      │                         │                         │                    │
    │                            ├── payments.failed ─────►│                         │                    │
    │                            │                         ├── webhook ────────────────────────────────────►│
    │                            │                         │                         │                    │
    │  (on error)                │                         │                         │                    │
    │                            │                         ├── dlq.event ───────────► (Investigate)      │
          `}</pre>
        </div>
      </section>

      {/* Data Flow */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Service Communication Matrix
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Language</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Port</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Storage</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Pub/Sub</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Traefik", "Go", "80, 443, 8080", "—", "—"],
                ["Hyperswitch", "Rust", "8081", "PostgreSQL, Redis", "NATS (publish)"],
                ["Kill Bill", "Java", "8082", "PostgreSQL", "NATS (consume)"],
                ["NATS-KB Bridge", "Go", "—", "—", "NATS (both)"],
                ["Tazama Auth", "Node", "8083", "PostgreSQL, Redis", "—"],
                ["Tazama Rule Exec", "Go", "8084", "PostgreSQL, Redis", "NATS (both)"],
                ["Dashboard", "TypeScript", "3002", "—", "REST (client)"],
                ["PostgreSQL", "—", "5432", "Disk", "—"],
                ["Redis", "—", "6379", "RAM", "—"],
                ["NATS", "Go", "4222, 8222", "Disk", "—"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-border last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-text-primary">{row[0]}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{row[1]}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-secondary">{row[2]}</code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{row[3]}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment Request Flow */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Payment Lifecycle (Step by Step)
        </h2>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Customer initiates payment",
              description:
                "A customer clicks 'Pay' on your checkout page. The payment request is sent to Hyperswitch via the merchant dashboard, your backend, or the embedded checkout.",
              detail: "Endpoint: POST /payments with amount, currency, and payment details",
            },
            {
              step: 2,
              title: "Hyperswitch routes to connector",
              description:
                "Hyperswitch evaluates the payment method, currency, and amount. It selects the optimal connector based on your routing rules (cost-based, volume-based, or fallback).",
              detail: "100+ supported connectors including Stripe, Paystack, Adyen, Razorpay",
            },
            {
              step: 3,
              title: "Fraud pre-check (Tazama)",
              description:
                "Before sending to the connector, Tazama evaluates the transaction against your fraud rules: amount thresholds, velocity checks, BIN country geo-blocking, and custom rules.",
              detail: "Configurable rules in Tazama Rule Studio at port 3000",
            },
            {
              step: 4,
              title: "Connector processes payment",
              description:
                "Hyperswitch sends the payment to the selected connector. The connector handles 3DS authentication, card tokenization, and bank-side authorization.",
              detail: "Response time: typically 200ms–2s depending on the processor",
            },
            {
              step: 5,
              title: "Event published to NATS",
              description:
                "Hyperswitch publishes a payment event (succeeded, failed, or processing) to the PAYMENT_EVENTS stream. This triggers all downstream consumers.",
              detail: "Subject: payments.{intent}.{status}",
            },
            {
              step: 6,
              title: "Webhook delivery",
              description:
                "Your application receives a webhook callback with the final payment status. Webhook retries happen up to 3 times with 30-second acknowledgment windows.",
              detail: "Failed events go to DLQ_EVENTS stream for investigation",
            },
            {
              step: 7,
              title: "Invoice & subscription sync",
              description:
                "NATS-KB Bridge syncs the completed payment to Kill Bill for invoice generation, subscription billing, and dunning if needed.",
              detail: "Kill Bill handles proration, credits, and usage-based billing",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 rounded-lg border border-border hover:border-white/10 transition-colors">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {item.description}
                </p>
                <div className="mt-2 text-xs font-mono text-secondary/70 bg-secondary/5 px-3 py-1.5 rounded-lg inline-block">
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Provider-Agnostic Design */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Provider-Agnostic Architecture
        </h2>
        <div className="p-6 rounded-xl border border-border bg-[#0a0a0a]">
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            One of OpenPay&apos;s core design principles is that you should never be
            locked into a single payment processor. Hyperswitch acts as a
            universal adapter between your application and 100+ payment
            processors worldwide.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-secondary" />
                Switch Processors Without Code Changes
              </h3>
              <p className="text-text-secondary text-xs">
                Update routing rules in the Hyperswitch dashboard and payments
                are instantly rerouted to the new processor. No redeployment,
                no code changes, no downtime.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-secondary" />
                Fallback & Smart Routing
              </h3>
              <p className="text-text-secondary text-xs">
                Configure primary and fallback processors. If the primary fails,
                Hyperswitch automatically retries with the fallback. Route by
                currency, amount, or payment method.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="https://hyperswitch.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:underline"
            >
              Hyperswitch Documentation <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Sub-pages */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Deep Dives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/docs/architecture/services"
            className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
                Service Details
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Every service: ports, config, dependencies, and storage
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
          </Link>
          <Link
            href="/docs/architecture/events"
            className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
                Event Flow
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                NATS streams, subjects, consumers, and event schemas
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
          </Link>
        </div>
      </section>

      {/* External Resources */}
      <section className="p-6 rounded-xl border border-border bg-[#0a0a0a]">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          External Architecture Resources
        </h2>
        <div className="space-y-3">
          {[
            {
              title: "Hyperswitch Architecture",
              url: "https://hyperswitch.io/docs/architecture",
              desc: "Understand how Hyperswitch routes payments, handles retries, and manages connectors",
            },
            {
              title: "NATS JetStream Design",
              url: "https://docs.nats.io/nats-concepts/jetstream",
              desc: "Streams, consumers, delivery guarantees, and exactly-once semantics",
            },
            {
              title: "Kill Bill Architecture",
              url: "https://docs.killbill.io/",
              desc: "Subscription lifecycle, invoice generation, and plugin system",
            },
            {
              title: "Docker Networking Guide",
              url: "https://docs.docker.com/network/",
              desc: "Bridge networks, overlay networks, and service discovery in Docker Compose",
            },
          ].map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-secondary/30 hover:bg-white/5 transition-all group"
            >
              <div>
                <h3 className="text-sm font-medium text-white group-hover:text-secondary transition-colors flex items-center gap-2">
                  {r.title}
                  <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-secondary" />
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">{r.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
