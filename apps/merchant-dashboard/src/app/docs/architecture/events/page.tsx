import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function EventsPage() {
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
        Event Flow
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        All inter-service communication happens through NATS JetStream. This
        page documents every event type, its subject, and which services
        produce and consume it.
      </p>

      {/* Stream Configuration */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          JetStream Configuration
        </h2>
        <CodeBlock title="nats CLI">{`# Stream: payments
# Subjects: payments.>
# Retention: limits (max messages or max age)
# Storage: file (persisted to disk)
# Replicas: 1 (single-node)
# Max age: 72h (3 days)
# Max bytes: 1GB

nats stream add payments \\
  --subjects "payments.>" \\
  --retention limits \\
  --max-msgs 100000 \\
  --max-age 72h \\
  --max-bytes 1GB \\
  --storage file \\
  --replicas 1 \\
  --defaults`}</CodeBlock>
      </section>

      {/* Event Types */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Event Types
        </h2>

        <div className="space-y-8">
          {/* Payment Events */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Payment Events
            </h3>
            <div className="space-y-3">
              {[
                {
                  subject: "payments.payment_intent.created",
                  producer: "Hyperswitch",
                  consumers: "Tazama, NATS-KB Bridge",
                  description:
                    "Fired when a new payment intent is created. The payment has not yet been processed.",
                },
                {
                  subject: "payments.payment_intent.succeeded",
                  producer: "Hyperswitch",
                  consumers: "NATS-KB Bridge, Webhooks",
                  description:
                    "Fired when a payment succeeds. The connector has authorized the transaction.",
                },
                {
                  subject: "payments.payment_intent.failed",
                  producer: "Hyperswitch",
                  consumers: "NATS-KB Bridge, Webhooks",
                  description:
                    "Fired when a payment fails. Includes the connector error code and message.",
                },
                {
                  subject: "payments.payment_intent.processing",
                  producer: "Hyperswitch",
                  consumers: "Webhooks",
                  description:
                    "Fired when a payment is sent to the connector for processing. Used for async payment methods.",
                },
                {
                  subject: "payments.refund.created",
                  producer: "Hyperswitch",
                  consumers: "Tazama, Webhooks",
                  description:
                    "Fired when a refund is initiated. Includes the refund amount and reason.",
                },
                {
                  subject: "payments.refund.succeeded",
                  producer: "Hyperswitch",
                  consumers: "Webhooks",
                  description:
                    "Fired when the refund is confirmed by the connector.",
                },
              ].map((event) => (
                <div
                  key={event.subject}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <code className="font-mono text-xs text-secondary bg-secondary-light px-2 py-0.5 rounded">
                        {event.subject}
                      </code>
                      <p className="text-sm text-text-secondary mt-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="text-text-muted">
                      Producer:{" "}
                      <span className="text-text-secondary font-medium">
                        {event.producer}
                      </span>
                    </span>
                    <span className="text-text-muted">
                      Consumers:{" "}
                      <span className="text-text-secondary font-medium">
                        {event.consumers}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fraud Events */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Fraud Events
            </h3>
            <div className="space-y-3">
              {[
                {
                  subject: "fraud_alerts.alert.triggered",
                  producer: "Tazama",
                  consumers: "Webhooks",
                  description:
                    "Fired when Tazama flags a transaction. Contains the risk score, triggered rules, and recommended action.",
                },
                {
                  subject: "fraud_alerts.alert.resolved",
                  producer: "Tazama",
                  consumers: "Webhooks",
                  description:
                    "Fired when a fraud alert is manually resolved by an admin.",
                },
              ].map((event) => (
                <div
                  key={event.subject}
                  className="p-4 rounded-lg border border-border"
                >
                  <code className="font-mono text-xs text-secondary bg-secondary-light px-2 py-0.5 rounded">
                    {event.subject}
                  </code>
                  <p className="text-sm text-text-secondary mt-2">
                    {event.description}
                  </p>
                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="text-text-muted">
                      Producer:{" "}
                      <span className="text-text-secondary font-medium">
                        {event.producer}
                      </span>
                    </span>
                    <span className="text-text-muted">
                      Consumers:{" "}
                      <span className="text-text-secondary font-medium">
                        {event.consumers}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Schema */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Event Schema
        </h2>
        <p className="text-text-secondary mb-4">
          All events follow a consistent envelope format:
        </p>
        <CodeBlock title="JSON">{`{
  "event_id": "evt_abc123",
  "event_type": "payments.payment_intent.succeeded",
  "timestamp": "2026-07-26T10:30:00Z",
  "data": {
    "payment_id": "pay_xyz789",
    "amount": 100000,
    "currency": "NGN",
    "status": "Succeeded",
    "connector": "paystack",
    "customer_id": "cus_abc123",
    "metadata": {
      "order_id": "order_456"
    }
  },
  "metadata": {
    "service": "hyperswitch",
    "version": "1.0.0"
  }
}`}</CodeBlock>
      </section>

      {/* Webhook Integration */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Subscribing to Events
        </h2>
        <p className="text-text-secondary mb-4">
          To receive events in your application, you can either:
        </p>
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Option 1: Webhooks (Recommended)
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              Configure a webhook endpoint in the dashboard. OpenPay delivers
              events via HTTP POST to your URL with retry logic.
            </p>
            <Link
              href="/docs/guides/webhooks"
              className="text-sm font-medium text-secondary hover:underline"
            >
              Webhook Guide →
            </Link>
          </div>
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Option 2: NATS Consumer
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              Connect directly to NATS from your application for real-time
              event streaming with exactly-once delivery.
            </p>
            <code className="text-xs font-mono text-text-muted">
              nats-cli sub payments.&gt;
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}
