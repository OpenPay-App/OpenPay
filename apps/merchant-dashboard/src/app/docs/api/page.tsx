import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/payments",
    description: "List all payments with pagination.",
    params: [
      { name: "limit", type: "integer", description: "Max results (default 20, max 100)" },
      { name: "starting_after", type: "string", description: "Payment ID to start after" },
    ],
  },
  {
    method: "GET",
    path: "/payments/{id}",
    description: "Retrieve a single payment by ID.",
    params: [],
  },
  {
    method: "POST",
    path: "/payments",
    description: "Create a new payment intent.",
    params: [
      { name: "amount", type: "integer", description: "Amount in smallest currency unit (e.g. kobo)" },
      { name: "currency", type: "string", description: "NGN, USD, GHS, ZAR, or KES" },
      { name: "confirm", type: "boolean", description: "Confirm immediately" },
      { name: "payment_method", type: "string", description: "card, bank_transfer, ussd, mobile_money" },
    ],
  },
  {
    method: "POST",
    path: "/payments/{id}/refund",
    description: "Refund a completed payment.",
    params: [
      { name: "amount", type: "integer", description: "Partial refund amount (optional, defaults to full)" },
    ],
  },
  {
    method: "GET",
    path: "/customers",
    description: "List all customers.",
    params: [
      { name: "limit", type: "integer", description: "Max results (default 20)" },
      { name: "starting_after", type: "string", description: "Customer ID to start after" },
    ],
  },
  {
    method: "POST",
    path: "/customers",
    description: "Create a new customer.",
    params: [
      { name: "email", type: "string", description: "Customer email" },
      { name: "name", type: "string", description: "Customer name" },
      { name: "phone", type: "string", description: "Customer phone" },
    ],
  },
  {
    method: "GET",
    path: "/customers/{id}",
    description: "Retrieve a single customer.",
    params: [],
  },
  {
    method: "GET",
    path: "/health",
    description: "Health check endpoint.",
    params: [],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-50 text-emerald-700 border-emerald-200",
  POST: "bg-blue-50 text-blue-700 border-blue-200",
  PUT: "bg-amber-50 text-amber-700 border-amber-200",
  DELETE: "bg-red-50 text-red-700 border-red-200",
};

export default function ApiReferencePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          API Reference
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          REST API endpoints powered by Hyperswitch. All requests return JSON.
          Base URL:{" "}
          <code className="bg-bg-alt px-2 py-0.5 rounded text-sm font-mono">
            http://localhost:8081
          </code>
        </p>
      </div>

      <div className="space-y-8">
        {endpoints.map((ep) => (
          <div
            key={`${ep.method}-${ep.path}`}
            className="rounded-xl border border-border bg-white overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold border ${methodColors[ep.method]}`}
              >
                {ep.method}
              </span>
              <code className="text-sm font-mono text-text-primary">
                {ep.path}
              </code>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-text-secondary mb-4">
                {ep.description}
              </p>
              {ep.params.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Parameters
                  </h4>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-bg-alt">
                          <th className="text-left px-4 py-2 text-xs font-semibold text-text-muted">
                            Name
                          </th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-text-muted">
                            Type
                          </th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-text-muted">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ep.params.map((param) => (
                          <tr
                            key={param.name}
                            className="border-t border-border"
                          >
                            <td className="px-4 py-2 font-mono text-xs text-secondary">
                              {param.name}
                            </td>
                            <td className="px-4 py-2 text-xs text-text-muted">
                              {param.type}
                            </td>
                            <td className="px-4 py-2 text-xs text-text-secondary">
                              {param.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
