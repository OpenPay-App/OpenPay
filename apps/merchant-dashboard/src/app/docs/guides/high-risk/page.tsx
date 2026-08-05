"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Shield, Globe, RefreshCw } from "lucide-react";

const supportedCategories = [
  { category: "Cryptocurrency", examples: "Exchanges, wallets, DeFi", notes: "Some processors support crypto payments" },
  { category: "CBD/Hemp", examples: "Oil, supplements, derivatives", notes: "Legal in most jurisdictions" },
  { category: "Adult Content", examples: "Legal adult entertainment", notes: "Requires age verification" },
  { category: "Travel", examples: "Airlines, hotels, booking", notes: "Higher chargeback rates" },
  { category: "Gaming", examples: "Online casinos, esports", notes: "Regulated in many jurisdictions" },
  { category: "Nutraceuticals", examples: "Supplements, vitamins", notes: "FDA regulations apply" },
  { category: "Firearms", examples: "Licensed dealers", notes: "Strict federal regulations" },
  { category: "Subscription Boxes", examples: "Recurring billing", notes: "Higher churn rates" },
];

const restrictedCategories = [
  { category: "Illegal Drugs", reason: "Legal restrictions", alternatives: "N/A" },
  { category: "Weapons (Unlicensed)", reason: "Legal restrictions", alternatives: "N/A" },
  { category: "Counterfeit Goods", reason: "Legal restrictions", alternatives: "N/A" },
];

const processorCompatibility = [
  { processor: "Stripe", support: "Limited", notes: "May require additional documentation" },
  { processor: "Adyen", support: "Good", notes: "Supports most high-risk categories" },
  { processor: "Checkout.com", support: "Good", notes: "Flexible underwriting" },
  { processor: "Paystack", support: "Good", notes: "Strong in Africa" },
  { processor: "Braintree", support: "Limited", notes: "PayPal-owned, stricter policies" },
];

const bestPractices = [
  {
    title: "Transparent Billing",
    items: ["Clear merchant descriptors", "Detailed receipts", "Easy refund process"],
  },
  {
    title: "Chargeback Prevention",
    items: ["Use 3D Secure for high-risk transactions", "Implement fraud rules in Tazama", "Monitor chargeback ratios"],
  },
  {
    title: "Documentation Ready",
    items: ["Business license", "Compliance certificates", "Processing history"],
  },
  {
    title: "Multiple Processors",
    items: ["Always have a backup processor", "Test fallback routing", "Monitor processor health"],
  },
];

export default function HighRiskPage() {
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
          <div className="w-10 h-10 rounded-[3px] bg-[#fff3e6] border border-[#ff8c00]/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#ff8c00]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">High-Risk Merchant Guide</h1>
        </div>
        <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
          OpenPay is designed to support high-risk merchants who are often rejected or
          restricted by traditional payment processors. Because you self-host OpenPay,
          you have full control over your payment infrastructure.
        </p>
      </div>

      {/* Key Advantages */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="w-10 h-10 rounded-[3px] bg-[#e6f9e6] flex items-center justify-center mb-4">
              <CheckCircle className="w-5 h-5 text-[#40d63b]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Platform TOS</h3>
            <p className="text-sm text-gray-500">Self-hosted means no platform terms of service to violate. Your infrastructure, your rules.</p>
          </div>
          <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="w-10 h-10 rounded-[3px] bg-[#e8f0fe] flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5 text-[#3898EC]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multi-Processor Fallback</h3>
            <p className="text-sm text-gray-500">If one processor drops you, switch to another instantly. No code changes required.</p>
          </div>
          <div className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="w-10 h-10 rounded-[3px] bg-[#fff3e6] flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-[#ff8c00]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Custom Fraud Rules</h3>
            <p className="text-sm text-gray-500">Configure Tazama to handle high-risk with custom rules and risk scoring.</p>
          </div>
        </div>
      </section>

      {/* What is a High-Risk Merchant */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What is a High-Risk Merchant?</h2>
        <div className="p-6 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-gray-600 mb-4">
            High-risk merchants are businesses in industries that payment processors
            consider elevated risk due to:
          </p>
          <ul className="space-y-2">
            {[
              "Higher chargeback rates",
              "Regulatory complexity",
              "Fraud potential",
              "Industry reputation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <AlertTriangle className="w-4 h-4 text-[#ff8c00] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Supported Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported High-Risk Categories</h2>
        <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Examples</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {supportedCategories.map((item) => (
                <tr key={item.category} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.category}</td>
                  <td className="px-4 py-3 text-gray-500">{item.examples}</td>
                  <td className="px-4 py-3 text-gray-500">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Restricted Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Restricted Categories</h2>
        <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Reason</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Alternatives</th>
              </tr>
            </thead>
            <tbody>
              {restrictedCategories.map((item) => (
                <tr key={item.category} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.category}</td>
                  <td className="px-4 py-3 text-gray-500">{item.reason}</td>
                  <td className="px-4 py-3 text-gray-500">{item.alternatives}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Processor Compatibility */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Processor Compatibility</h2>
        <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Processor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">High-Risk Support</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {processorCompatibility.map((item) => (
                <tr key={item.processor} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.processor}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                      item.support === "Good" 
                        ? "bg-[#e6f9e6] text-[#40d63b] border-[#40d63b]/30"
                        : "bg-amber-50 text-amber-700 border-amber-500/30"
                    }`}>
                      {item.support}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices for High-Risk Merchants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bestPractices.map((practice) => (
            <div key={practice.title} className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-gray-900 mb-3">{practice.title}</h3>
              <ul className="space-y-2">
                {practice.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#40d63b] shrink-0" />
                    {item}
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
          href="/docs/guides/processors"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              Supported Processors
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              List of all supported payment processors
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
