import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ApiPaymentsPage() {
  return (
    <div>
      <Link
        href="/docs/api"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to API Reference
      </Link>

      <h1 className="text-4xl font-bold text-text-primary mb-4">
        Payments API
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Create, retrieve, confirm, and manage payments through the Hyperswitch
        REST API.
      </p>

      {/* Base URL */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Base URL
        </h2>
        <div className="rounded-xl bg-[#0d1117] p-4 font-mono text-sm text-white/80">
          <pre>http://localhost:8081</pre>
        </div>
        <p className="text-text-secondary text-sm mt-3">
          All endpoints require an API key passed via the{" "}
          <code className="bg-bg-alt px-1.5 py-0.5 rounded text-xs font-mono">
            api-key
          </code>{" "}
          header.
        </p>
      </section>

      {/* Create Payment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Create a Payment
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            POST
          </span>
          <code className="text-sm font-mono text-text-primary">
            /payments
          </code>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Request Body
        </h3>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto mb-6">
          <pre>{`{
  "amount": 100000,
  "currency": "NGN",
  "confirm": true,
  "capture_method": "automatic",
  "description": "Order #12345",
  "email": "customer@example.com",
  "customer_id": "cus_abc123",
  "metadata": {
    "order_id": "12345"
  },
  "billing": {
    "address": {
      "first_name": "John",
      "last_name": "Doe",
      "line1": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "zip": "100001",
      "country": "NG"
    }
  }
}`}</pre>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Response
        </h3>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`{
  "payment_id": "pay_xyz789",
  "status": "Succeeded",
  "amount": 100000,
  "currency": "NGN",
  "connector": "paystack",
  "connector_transaction_id": "txn_abc123",
  "created_at": "2026-07-26T10:30:00Z",
  "customer_id": "cus_abc123",
  "description": "Order #12345",
  "email": "customer@example.com",
  "metadata": {
    "order_id": "12345"
  }
}`}</pre>
        </div>
      </section>

      {/* Retrieve Payment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Retrieve a Payment
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            GET
          </span>
          <code className="text-sm font-mono text-text-primary">
            /payments/{`{payment_id}`}
          </code>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Example
        </h3>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto mb-4">
          <pre>{`curl -X GET http://localhost:8081/payments/pay_xyz789 \\
  -H "api-key: test_api_key_xxxx"`}</pre>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Response
        </h3>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`{
  "payment_id": "pay_xyz789",
  "status": "Succeeded",
  "amount": 100000,
  "currency": "NGN",
  "connector": "paystack",
  "connector_transaction_id": "txn_abc123",
  "created_at": "2026-07-26T10:30:00Z"
}`}</pre>
        </div>
      </section>

      {/* List Payments */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          List Payments
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            GET
          </span>
          <code className="text-sm font-mono text-text-primary">/payments</code>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Query Parameters
        </h3>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Parameter
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["limit", "integer", "Number of payments to return (default 20, max 100)"],
                ["offset", "integer", "Number of payments to skip"],
                ["status", "string", "Filter by status: Succeeded, Failed, Processing, etc."],
                ["created", "object", "Date range filter with gt, lt, gte, lte"],
              ].map(([param, type, desc]) => (
                <tr key={param} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">{param}</code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{type}</td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Example
        </h3>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`curl -X GET "http://localhost:8081/payments?limit=10&status=Succeeded" \\
  -H "api-key: test_api_key_xxxx"`}</pre>
        </div>
      </section>

      {/* Confirm Payment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Confirm a Payment
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
            POST
          </span>
          <code className="text-sm font-mono text-text-primary">
            /payments/{`{payment_id}`}/confirm
          </code>
        </div>
        <p className="text-text-secondary mb-4">
          Confirm a payment that was created with{" "}
          <code className="bg-bg-alt px-1.5 py-0.5 rounded text-xs font-mono">
            confirm: false
          </code>
          . This triggers the actual payment processing through the connector.
        </p>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`{
  "payment_method": "card",
  "payment_method_data": {
    "card": {
      "card_number": "4084084084084081",
      "card_exp_month": "12",
      "card_exp_year": "2027",
      "card_cvc": "123"
    }
  }
}`}</pre>
        </div>
      </section>

      {/* Cancel Payment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Cancel a Payment
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            POST
          </span>
          <code className="text-sm font-mono text-text-primary">
            /payments/{`{payment_id}`}/cancel
          </code>
        </div>
        <p className="text-text-secondary mb-4">
          Cancel a payment that is in{" "}
          <code className="bg-bg-alt px-1.5 py-0.5 rounded text-xs font-mono">
            RequiresConfirmation
          </code>{" "}
          or{" "}
          <code className="bg-bg-alt px-1.5 py-0.5 rounded text-xs font-mono">
            Processing
          </code>{" "}
          status.
        </p>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`{
  "cancellation_reason": "Customer requested cancellation"
}`}</pre>
        </div>
      </section>

      {/* Payment Statuses */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Payment Statuses
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["RequiresConfirmation", "Payment created but not yet confirmed"],
                ["Processing", "Payment is being processed by the connector"],
                ["Succeeded", "Payment completed successfully"],
                ["Failed", "Payment failed at the connector"],
                ["Cancelled", "Payment was cancelled before processing"],
                ["RequiresAction", "Customer action needed (e.g., 3DS redirect)"],
              ].map(([status, desc]) => (
                <tr key={status} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">{status}</code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
