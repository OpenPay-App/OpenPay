"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Globe, Shield, Zap, RefreshCw } from "lucide-react";

const cardProcessors = [
  { name: "Stripe", regions: "Global", currencies: "135+", status: "supported" },
  { name: "Adyen", regions: "Global", currencies: "150+", status: "supported" },
  { name: "Checkout.com", regions: "Global", currencies: "40+", status: "supported" },
  { name: "Braintree", regions: "Global", currencies: "25+", status: "supported" },
  { name: "Square", regions: "US, CA, AU, UK, JP", currencies: "USD, CAD, AUD, GBP, JPY", status: "supported" },
];

const regionalProcessors = [
  { name: "Paystack", region: "Africa", currencies: "NGN, USD, GHS, ZAR, KES", status: "supported" },
  { name: "Flutterwave", region: "Africa", currencies: "NGN, USD, GHS, ZAR, KES", status: "supported" },
  { name: "Razorpay", region: "India", currencies: "INR", status: "supported" },
  { name: "Mollie", region: "Europe", currencies: "EUR, GBP", status: "supported" },
  { name: "Conekta", region: "Mexico", currencies: "MXN, USD", status: "supported" },
  { name: "PagSeguro", region: "Brazil", currencies: "BRL, USD", status: "supported" },
];

const switchingSteps = [
  {
    step: 1,
    title: "Get API Keys from New Processor",
    description: "Sign up at the new processor's dashboard and generate API keys (secret + publishable). Note the webhook signing secret.",
    icon: Shield,
  },
  {
    step: 2,
    title: "Add Connector in Hyperswitch",
    description: "Go to Dashboard → Settings → Payment Methods → Add Connector. Select the new processor and enter API keys.",
    icon: Zap,
  },
  {
    step: 3,
    title: "Configure Routing Rules",
    description: "Go to Dashboard → Settings → Routing. Set primary processor and optional fallback. Configure by currency, amount, or payment method.",
    icon: RefreshCw,
  },
  {
    step: 4,
    title: "Update Webhooks",
    description: "Add webhook endpoint in new processor's dashboard. Copy signing secret and update your .env file.",
    icon: Globe,
  },
  {
    step: 5,
    title: "Test and Verify",
    description: "Make test payment with new processor. Verify payment appears in dashboard and webhook is received.",
    icon: CheckCircle,
  },
];

const troubleshootingIssues = [
  {
    issue: "Payment Failed with New Processor",
    solutions: [
      "Check API keys are correct",
      "Verify processor supports the currency",
      "Check processor dashboard for errors",
      "Review Hyperswitch logs: docker compose logs hyperswitch",
    ],
  },
  {
    issue: "Webhooks Not Received",
    solutions: [
      "Verify webhook URL is correct",
      "Check webhook signing secret",
      "Test with webhook debugger tool",
      "Check Traefik logs for routing issues",
    ],
  },
];

export default function ProcessorsPage() {
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
            <Globe className="w-5 h-5 text-[#3898EC]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Supported Payment Processors</h1>
        </div>
        <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
          OpenPay supports 100+ payment processors through Hyperswitch. You can switch
          processors at any time without changing your integration code.
        </p>
      </div>

      {/* Key Benefits */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="w-10 h-10 rounded-[3px] bg-[#e6f9e6] flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5 text-[#40d63b]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Lock-in</h3>
            <p className="text-sm text-gray-500">Switch processors anytime without code changes. Your integration stays the same.</p>
          </div>
          <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="w-10 h-10 rounded-[3px] bg-[#e8f0fe] flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-[#3898EC]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Automatic Fallback</h3>
            <p className="text-sm text-gray-500">Configure fallback processors. If primary fails, Hyperswitch retries automatically.</p>
          </div>
          <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="w-10 h-10 rounded-[3px] bg-[#fff3e6] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-[#ff8c00]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Routing</h3>
            <p className="text-sm text-gray-500">Route by currency, amount, or payment method to optimize costs and approval rates.</p>
          </div>
        </div>
      </section>

      {/* Card Network Processors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Card Network Processors</h2>
        <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Processor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Regions</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Currencies</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {cardProcessors.map((processor) => (
                <tr key={processor.name} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{processor.name}</td>
                  <td className="px-4 py-3 text-gray-500">{processor.regions}</td>
                  <td className="px-4 py-3 text-gray-500">{processor.currencies}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-[#e6f9e6] text-[#40d63b] border border-[#40d63b]/30">
                      ✅ Supported
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Regional Processors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Processors</h2>
        <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Processor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Currencies</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {regionalProcessors.map((processor) => (
                <tr key={processor.name} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{processor.name}</td>
                  <td className="px-4 py-3 text-gray-500">{processor.region}</td>
                  <td className="px-4 py-3 text-gray-500">{processor.currencies}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-[#e6f9e6] text-[#40d63b] border border-[#40d63b]/30">
                      ✅ Supported
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Switch Processors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Switch Processors</h2>
        <div className="space-y-4">
          {switchingSteps.map((item) => (
            <div key={item.step} className="flex gap-4 p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 transition-colors shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#3898EC] to-[#0066FF] text-white text-sm font-bold flex items-center justify-center">
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

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
        <div className="space-y-4">
          {troubleshootingIssues.map((item) => (
            <div key={item.issue} className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-gray-900 mb-3">{item.issue}</h3>
              <ul className="space-y-2">
                {item.solutions.map((solution, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#40d63b] mt-0.5 shrink-0" />
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/docs/guides/high-risk"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              High-Risk Merchant Guide
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Support for high-risk industries
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors" />
        </Link>
        <Link
          href="/docs/guides/compliance"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              KYC & Compliance Guide
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Compliance requirements and verification
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors" />
        </Link>
      </section>
    </div>
  );
}
