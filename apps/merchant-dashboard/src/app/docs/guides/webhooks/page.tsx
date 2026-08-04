import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const events = [
  {
    type: "payments.charge.completed",
    description: "A payment was successfully captured.",
  },
  {
    type: "payments.charge.failed",
    description: "A payment attempt failed.",
  },
  {
    type: "payments.charge.pending",
    description: "A payment is awaiting completion.",
  },
  {
    type: "payments.charge.refunded",
    description: "A payment was fully refunded.",
  },
  {
    type: "payments.charge.disputed",
    description: "A payment was disputed by the customer.",
  },
  {
    type: "payments.refund.completed",
    description: "A refund was processed successfully.",
  },
  {
    type: "payments.refund.failed",
    description: "A refund attempt failed.",
  },
  {
    type: "dlq.event.failed",
    description: "An event failed processing after max retries.",
  },
];

export default function WebhooksGuidePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Webhooks
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          Receive real-time notifications when events happen in your OpenPay
          instance. Events are delivered via NATS JetStream and follow the
          CloudEvents v1.0 specification.
        </p>
      </div>

      {/* Event format */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Event Format
        </h2>
        <p className="text-gray-600 mb-4">
          Every event is wrapped in a CloudEvents envelope:
        </p>
        <CodeBlock title="JSON">{`{
  "specversion": "1.0",
  "id": "evt_abc123",
  "source": "urn:core-financial:payment-system",
  "type": "payments.charge.completed",
  "time": "2025-01-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {
    "paymentId": "pay_xyz789",
    "amount": 500000,
    "currency": "NGN",
    "status": "succeeded",
    "reference": "txn_abc123"
  }
}`}</CodeBlock>
      </section>

      {/* Event types */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Event Types
        </h2>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.type}
              className="flex items-start gap-4 p-4 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <code className="text-sm font-mono text-[#3898EC] whitespace-nowrap">
                {event.type}
              </code>
              <p className="text-sm text-gray-600">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NATS subjects */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          NATS JetStream Subjects
        </h2>
        <CodeBlock title="NATS subjects">{`# Stream: PAYMENT_EVENTS
# Subjects:
payments.charge.pending
payments.charge.completed
payments.charge.failed
payments.charge.refunded
payments.charge.disputed
payments.refund.completed
payments.refund.failed

# Stream: DLQ_EVENTS
dlq.event.failed`}</CodeBlock>
      </section>

      {/* Retry policy */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Retry Policy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="font-semibold text-gray-900 mb-2">
              Payment Events
            </h3>
            <p className="text-sm text-gray-600">
              Max 3 delivery attempts with 30-second acknowledgment wait. Failed
              events are moved to the DLQ stream.
            </p>
          </div>
          <div className="p-6 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="font-semibold text-gray-900 mb-2">
              Dead Letter Queue
            </h3>
            <p className="text-sm text-gray-600">
              Failed events are retained for 7 days. Events in the DLQ include
              the original event, error details, and retry count.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
