import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
      <p className="text-lg text-text-secondary mb-10">
        OpenPay is composed of 8+ microservices connected through NATS
        JetStream event streams. Here&apos;s how everything fits together.
      </p>

      {/* Architecture Diagram (text-based) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          System Architecture
        </h2>
        <div className="rounded-xl border border-border p-8 bg-bg-alt font-mono text-xs leading-relaxed text-text-secondary overflow-x-auto">
          <pre>{`
    ┌─────────────────────────────────────────────────────┐
    │                   Internet                          │
    └──────────────┬──────────────────────────┬───────────┘
                   │                          │
            ┌──────▼──────┐           ┌───────▼────────┐
            │   Traefik   │           │  Paystack      │
            │  (Reverse   │           │  (Webhooks)    │
            │   Proxy)    │           └───────┬────────┘
            └──────┬──────┘                   │
                   │                          │
       ┌───────────┼───────────┐              │
       │           │           │              │
┌──────▼──┐ ┌─────▼─────┐ ┌──▼──────────┐ ┌──▼──────────┐
│Dashboard│ │ Hyperswitch│ │   Kill Bill  │ │   Tazama    │
│(Next.js)│ │  (Rust)    │ │   (Java)     │ │   (Rules)   │
└─────────┘ └─────┬──────┘ └──────┬──────┘ └──────┬──────┘
                  │               │                │
          ┌───────▼───────────────▼────────────────▼──────┐
          │            NATS JetStream (Event Bus)          │
          └───────┬───────────────┬────────────────┬──────┘
                  │               │                │
            ┌─────▼───┐   ┌──────▼──────┐  ┌──────▼──────┐
            │ Postgres │   │    Redis    │  │  NATS-KB    │
            │  (Data)  │   │   (Cache)   │  │  Bridge     │
            └──────────┘   └─────────────┘  └─────────────┘
          `}</pre>
        </div>
      </section>

      {/* Request Flow */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Payment Request Flow
        </h2>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Customer initiates payment",
              description:
                "A customer clicks 'Pay' on your checkout page. The payment request is sent to Hyperswitch via the merchant dashboard or your backend.",
            },
            {
              step: 2,
              title: "Hyperswitch routes the payment",
              description:
                "Hyperswitch evaluates the payment method, currency, and amount. It selects the best connector (e.g., Paystack for NGN cards) based on your routing rules.",
            },
            {
              step: 3,
              title: "Connector processes the payment",
              description:
                "Hyperswitch sends the payment to Paystack (or another configured connector). The connector handles 3DS, tokenization, and bank-side authorization.",
            },
            {
              step: 4,
              title: "Connector responds",
              description:
                "Paystack returns a result — Succeeded, Failed, or RequiresAction. Hyperswitch stores the response and updates the payment status.",
            },
            {
              step: 5,
              title: "Event published to NATS",
              description:
                "Hyperswitch publishes a payment event to NATS JetStream. This triggers downstream processing — webhooks to your app, fraud checks by Tazama, and invoice updates by Kill Bill.",
            },
            {
              step: 6,
              title: "Fraud evaluation (Tazama)",
              description:
                "Tazama evaluates the transaction against your fraud rules. If the risk score is high, it flags the payment for manual review or auto-rejects it.",
            },
            {
              step: 7,
              title: "Webhook notification",
              description:
                "Your application receives a webhook callback with the final payment status. You can fulfill the order, grant access, or handle the failure.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 rounded-lg border border-border">
              <div className="shrink-0 w-8 h-8 rounded-full bg-secondary text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
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
                What each service does, ports, and config
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
                NATS subjects, streams, and event schemas
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
          </Link>
        </div>
      </section>
    </div>
  );
}
