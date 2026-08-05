"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";

const refundStatuses = [
  {
    status: "pending",
    color: "bg-amber-50 text-amber-700 border-amber-500/30",
    description: "Refund has been initiated but not yet processed by the payment processor.",
    icon: Clock,
  },
  {
    status: "processing",
    color: "bg-blue-50 text-blue-700 border-blue-500/30",
    description: "Refund is being processed by the payment processor.",
    icon: RefreshCw,
  },
  {
    status: "succeeded",
    color: "bg-[#e6f9e6] text-[#40d63b] border-[#40d63b]/30",
    description: "Refund has been successfully processed and funds returned to the customer.",
    icon: CheckCircle,
  },
  {
    status: "failed",
    color: "bg-red-50 text-[#ea384c] border-[#ea384c]/30",
    description: "Refund processing failed. Check the error message for details.",
    icon: AlertCircle,
  },
];

const refundTimelines = [
  { method: "Credit/Debit Card", timeline: "5-10 business days", notes: "Depends on customer's bank" },
  { method: "Bank Transfer", timeline: "3-5 business days", notes: "Direct bank processing" },
  { method: "Mobile Money", timeline: "1-3 business days", notes: "Varies by provider" },
  { method: "Digital Wallet", timeline: "1-3 business days", notes: "Instant to 3 days" },
];

const troubleshootingIssues = [
  {
    issue: "Refund failed - insufficient funds",
    cause: "The merchant account doesn't have enough balance to process the refund.",
    solution: "Ensure your merchant account has sufficient funds. Contact your payment processor if the issue persists.",
  },
  {
    issue: "Refund pending for too long",
    cause: "Payment processor may be experiencing delays or additional verification required.",
    solution: "Check the processor's status page. If pending for more than 10 business days, contact support.",
  },
  {
    issue: "Refund not showing in dashboard",
    cause: "Webhook sync delay between processor and OpenPay.",
    solution: "Refresh the page. If still missing, check webhooks are configured correctly.",
  },
  {
    issue: "Cannot refund older transactions",
    cause: "Some processors have time limits for refunding transactions (typically 90-180 days).",
    solution: "Check your processor's refund policy. Older transactions may need manual handling.",
  },
];

export default function RefundsGuidePage() {
  return (
    <div>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[3px] bg-[#e8f0fe] border border-[#3898EC]/20 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-[#3898EC]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Refund Guide</h1>
        </div>
        <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
          Learn how to issue refunds from the OpenPay dashboard or API. This guide covers
          full and partial refunds, refund statuses, timelines, and common troubleshooting.
        </p>
      </div>

      {/* How Refunds Work */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How Refunds Work</h2>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Initiate Refund",
              description: "Select a completed payment and choose to issue a full or partial refund.",
            },
            {
              step: 2,
              title: "Processor Processing",
              description: "OpenPay sends the refund request to your payment processor (Stripe, Paystack, etc.).",
            },
            {
              step: 3,
              title: "Bank Processing",
              description: "The processor forwards the refund to the customer's bank for approval.",
            },
            {
              step: 4,
              title: "Funds Returned",
              description: "The customer receives the refund in their account (typically 5-10 business days).",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 rounded-[3px] border border-[#e2e2e2] hover:border-[#3898EC]/30 transition-colors bg-white">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#3898EC] to-[#0066FF] text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Issuing a Refund from Dashboard */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Issuing a Refund from Dashboard</h2>
        <div className="p-6 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#3898EC] text-white text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="font-medium text-gray-900">Navigate to Payments</p>
                <p className="text-sm text-gray-500">Go to Dashboard → Payments in the sidebar.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#3898EC] text-white text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="font-medium text-gray-900">Select the Payment</p>
                <p className="text-sm text-gray-500">Find and click on the completed payment you want to refund.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#3898EC] text-white text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="font-medium text-gray-900">Click Refund</p>
                <p className="text-sm text-gray-500">Click the &quot;Refund&quot; button on the payment detail page.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#3898EC] text-white text-xs font-bold flex items-center justify-center">4</span>
              <div>
                <p className="font-medium text-gray-900">Choose Refund Type</p>
                <p className="text-sm text-gray-500">Select <strong>Full Refund</strong> or <strong>Partial Refund</strong>. For partial, enter the amount.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#3898EC] text-white text-xs font-bold flex items-center justify-center">5</span>
              <div>
                <p className="font-medium text-gray-900">Add Reason (Optional)</p>
                <p className="text-sm text-gray-500">Enter a reason for the refund for your records.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#3898EC] text-white text-xs font-bold flex items-center justify-center">6</span>
              <div>
                <p className="font-medium text-gray-900">Confirm Refund</p>
                <p className="text-sm text-gray-500">Review the details and click &quot;Confirm Refund&quot; to process.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Refund Statuses */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Statuses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {refundStatuses.map((item) => (
            <div key={item.status} className="p-4 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${item.color}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Refund Timelines */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Timelines</h2>
        <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Payment Method</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Timeline</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {refundTimelines.map((item) => (
                <tr key={item.method} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.method}</td>
                  <td className="px-4 py-3 text-[#3898EC] font-medium">{item.timeline}</td>
                  <td className="px-4 py-3 text-gray-500">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
        <div className="p-6 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <h3 className="font-semibold text-gray-900 mb-4">Issue a Refund via API</h3>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100 font-mono">
{`POST /api/payments/{payment_id}/refund

{
  "amount": 5000,        // Optional: partial refund amount (in smallest currency unit)
  "reason": "customer_request"  // Optional: reason for refund
}`}
            </pre>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            For full API documentation, visit{" "}
            <Link href="/docs/api/refunds" className="text-[#3898EC] hover:underline">
              API Reference - Refunds
            </Link>
          </p>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
        <div className="space-y-4">
          {troubleshootingIssues.map((item) => (
            <div key={item.issue} className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-gray-900 mb-2">{item.issue}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Cause:</strong> {item.cause}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Solution:</strong> {item.solution}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/docs/api/refunds"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              API Reference
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Complete API documentation for refunds
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors" />
        </Link>
        <Link
          href="/docs/guides/accepting-payments"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              Accepting Payments
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Guide to processing payments
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors" />
        </Link>
      </section>
    </div>
  );
}
