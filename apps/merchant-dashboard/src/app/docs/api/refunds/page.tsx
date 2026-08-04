import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function ApiRefundsPage() {
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
        Refunds API
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Create and manage refunds for completed payments.
      </p>

      {/* Base URL */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Base URL
        </h2>
        <CodeBlock title="Base URL">http://localhost:8081</CodeBlock>
      </section>

      {/* Create Refund */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Create a Refund
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            POST
          </span>
          <code className="text-sm font-mono text-text-primary">
            /refunds
          </code>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Request Body
        </h3>
        <CodeBlock title="Request Body">{`{
  "payment_id": "pay_xyz789",
  "amount": 50000,
  "currency": "NGN",
  "reason": "requested_by_customer",
  "metadata": {
    "reason_note": "Customer returned item"
  }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Response
        </h3>
        <CodeBlock title="Response">{`{
  "refund_id": "ref_abc789",
  "payment_id": "pay_xyz789",
  "amount": 50000,
  "currency": "NGN",
  "status": "Succeeded",
  "reason": "requested_by_customer",
  "created_at": "2026-07-26T11:00:00Z",
  "metadata": {
    "reason_note": "Customer returned item"
  }
}`}</CodeBlock>
      </section>

      {/* Retrieve Refund */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Retrieve a Refund
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            GET
          </span>
          <code className="text-sm font-mono text-text-primary">
            /refunds/{`{refund_id}`}
          </code>
        </div>
        <CodeBlock title="curl">{`curl -X GET http://localhost:8081/refunds/ref_abc789 \\
  -H "api-key: test_api_key_xxxx"`}</CodeBlock>
      </section>

      {/* List Refunds */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          List Refunds
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            GET
          </span>
          <code className="text-sm font-mono text-text-primary">
            /refunds
          </code>
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
                ["limit", "integer", "Number of results (default 20, max 100)"],
                ["offset", "integer", "Number of results to skip"],
                ["payment_id", "string", "Filter refunds by payment ID"],
                ["status", "string", "Filter by status: Succeeded, Failed, Pending"],
                ["created", "object", "Date range filter"],
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
      </section>

      {/* Refund Statuses */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Refund Statuses
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
                ["Pending", "Refund initiated, awaiting connector confirmation"],
                ["Succeeded", "Refund completed by the connector"],
                ["Failed", "Refund failed at the connector"],
                ["Cancelled", "Refund was cancelled before processing"],
              ].map(([status, desc]) => (
                <tr key={status} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {status}
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
