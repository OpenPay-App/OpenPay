import Link from "next/link";
import { ArrowLeft, Code2, BookOpen } from "lucide-react";

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
  GET: "bg-[#40d63b]/10 text-[#40d63b] border-[#40d63b]/30",
  POST: "bg-[#3898EC]/10 text-[#3898EC] border-[#3898EC]/30",
  PUT: "bg-amber-50 text-amber-600 border-amber-200",
  DELETE: "bg-red-50 text-red-600 border-red-200",
};

export default function ApiReferencePage() {
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[3px] bg-[#3898EC]/10 border border-[#3898EC]/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-[#3898EC]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            API Reference
          </h1>
        </div>
        <p className="text-lg text-gray-500 max-w-2xl">
          REST API endpoints powered by Hyperswitch. All requests return JSON.
          Base URL:{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-sm font-mono text-gray-900">
            http://localhost:8081
          </code>
        </p>
      </div>

      <div className="space-y-6">
        {endpoints.map((ep) => (
          <div
            key={`${ep.method}-${ep.path}`}
            className="rounded-[8px] border border-gray-200 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-gray-300 transition-colors"
          >
            {/* macOS-style header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4 bg-white">
              {/* macOS dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              
              {/* Method badge */}
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-[3px] text-xs font-bold border ${methodColors[ep.method]}`}
              >
                {ep.method}
              </span>
              
              {/* Endpoint path */}
              <code className="text-sm font-mono text-gray-900">
                {ep.path}
              </code>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                {ep.description}
              </p>
              
              {ep.params.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Parameters
                  </h4>
                  <div className="border border-gray-200 rounded-[6px] overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                            Name
                          </th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                            Type
                          </th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {ep.params.map((param) => (
                          <tr
                            key={param.name}
                            className="border-t border-gray-100"
                          >
                            <td className="px-4 py-2 font-mono text-xs text-[#3898EC]">
                              {param.name}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-500">
                              {param.type}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-600">
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
