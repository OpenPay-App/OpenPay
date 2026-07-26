import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ApiCustomersPage() {
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
        Customers API
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Create and manage customers to associate with payments and
        subscriptions.
      </p>

      {/* Base URL */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Base URL
        </h2>
        <div className="rounded-xl bg-[#0d1117] p-4 font-mono text-sm text-white/80">
          <pre>http://localhost:8081</pre>
        </div>
      </section>

      {/* Create Customer */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Create a Customer
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            POST
          </span>
          <code className="text-sm font-mono text-text-primary">/customers</code>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Request Body
        </h3>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto mb-6">
          <pre>{`{
  "email": "jane@example.com",
  "name": "Jane Doe",
  "phone": "+2348012345678",
  "description": "Enterprise customer",
  "metadata": {
    "company": "Acme Corp",
    "plan": "enterprise"
  }
}`}</pre>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Response
        </h3>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`{
  "customer_id": "cus_def456",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "phone": "+2348012345678",
  "description": "Enterprise customer",
  "created_at": "2026-07-26T10:30:00Z",
  "metadata": {
    "company": "Acme Corp",
    "plan": "enterprise"
  }
}`}</pre>
        </div>
      </section>

      {/* Retrieve Customer */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Retrieve a Customer
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            GET
          </span>
          <code className="text-sm font-mono text-text-primary">
            /customers/{`{customer_id}`}
          </code>
        </div>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`curl -X GET http://localhost:8081/customers/cus_def456 \\
  -H "api-key: test_api_key_xxxx"`}</pre>
        </div>
      </section>

      {/* List Customers */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          List Customers
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            GET
          </span>
          <code className="text-sm font-mono text-text-primary">/customers</code>
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
                ["email", "string", "Filter by email address"],
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

      {/* Update Customer */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Update a Customer
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
            PUT
          </span>
          <code className="text-sm font-mono text-text-primary">
            /customers/{`{customer_id}`}
          </code>
        </div>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`{
  "email": "jane.updated@example.com",
  "name": "Jane M. Doe",
  "metadata": {
    "company": "Acme Corp",
    "plan": "enterprise",
    "tier": "gold"
  }
}`}</pre>
        </div>
      </section>

      {/* Delete Customer */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Delete a Customer
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            DELETE
          </span>
          <code className="text-sm font-mono text-text-primary">
            /customers/{`{customer_id}`}
          </code>
        </div>
        <p className="text-text-secondary text-sm">
          Permanently deletes a customer. Associated payments and subscriptions
          are not deleted but will no longer be linked to this customer.
        </p>
      </section>
    </div>
  );
}
