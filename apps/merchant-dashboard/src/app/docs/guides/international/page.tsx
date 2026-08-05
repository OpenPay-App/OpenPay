"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Globe, MapPin } from "lucide-react";

const majorCurrencies = [
  { currency: "US Dollar", code: "USD", processors: "Stripe, Adyen, Checkout.com" },
  { currency: "Euro", code: "EUR", processors: "Stripe, Adyen, Mollie" },
  { currency: "British Pound", code: "GBP", processors: "Stripe, Adyen, Checkout.com" },
  { currency: "Nigerian Naira", code: "NGN", processors: "Paystack, Flutterwave" },
  { currency: "Indian Rupee", code: "INR", processors: "Razorpay, PayU" },
  { currency: "South African Rand", code: "ZAR", processors: "Paystack, Yoco" },
  { currency: "Kenyan Shilling", code: "KES", processors: "Paystack, M-Pesa" },
];

const africaRegion = [
  { country: "Nigeria", currencies: "NGN", processor: "Paystack, Flutterwave" },
  { country: "Ghana", currencies: "GHS", processor: "Paystack" },
  { country: "South Africa", currencies: "ZAR", processor: "Paystack, Yoco" },
  { country: "Kenya", currencies: "KES", processor: "Paystack, M-Pesa" },
  { country: "Egypt", currencies: "EGP", processor: "Paystack" },
];

const europeRegion = [
  { country: "UK", currencies: "GBP", processor: "Stripe, Adyen" },
  { country: "Germany", currencies: "EUR", processor: "Stripe, Adyen, Mollie" },
  { country: "France", currencies: "EUR", processor: "Stripe, Adyen" },
  { country: "Netherlands", currencies: "EUR", processor: "Mollie, Adyen" },
];

const americasRegion = [
  { country: "USA", currencies: "USD", processor: "Stripe, Adyen" },
  { country: "Canada", currencies: "CAD", processor: "Stripe, Adyen" },
  { country: "Mexico", currencies: "MXN", processor: "Stripe, Conekta" },
  { country: "Brazil", currencies: "BRL", processor: "Stripe, PagSeguro" },
];

const asiaPacificRegion = [
  { country: "India", currencies: "INR", processor: "Razorpay, PayU" },
  { country: "Australia", currencies: "AUD", processor: "Stripe, Adyen" },
  { country: "Japan", currencies: "JPY", processor: "Stripe, Adyen" },
  { country: "Singapore", currencies: "SGD", processor: "Stripe, Adyen" },
];

const regionalConsiderations = [
  {
    region: "Africa",
    considerations: [
      "Mobile money (M-Pesa, MTN) widely used",
      "Bank transfers common for larger amounts",
      "Paystack is the leading processor",
    ],
  },
  {
    region: "Europe",
    considerations: [
      "PSD2/SCA compliance required",
      "3D Secure often mandatory",
      "IBAN transfers common",
    ],
  },
  {
    region: "Asia-Pacific",
    considerations: [
      "UPI (India) very popular",
      "Alipay/WeChat (China)",
      "Local payment methods preferred",
    ],
  },
];

export default function InternationalPage() {
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
          <h1 className="text-4xl font-bold text-gray-900">International Payments Guide</h1>
        </div>
        <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
          OpenPay supports global payments through Hyperswitch&apos;s 100+ processor network.
          Each processor has different regional strengths and currency support.
        </p>
      </div>

      {/* Major Currencies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Major Currencies</h2>
        <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Currency</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Processors</th>
              </tr>
            </thead>
            <tbody>
              {majorCurrencies.map((item) => (
                <tr key={item.code} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.currency}</td>
                  <td className="px-4 py-3">
                    <code className="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono">{item.code}</code>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.processors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Regional Support */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Support</h2>
        
        {/* Africa */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#3898EC]" />
            Africa
          </h3>
          <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Country</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Currencies</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Recommended Processor</th>
                </tr>
              </thead>
              <tbody>
                {africaRegion.map((item) => (
                  <tr key={item.country} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.country}</td>
                    <td className="px-4 py-3">
                      <code className="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono">{item.currencies}</code>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.processor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Europe */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#3898EC]" />
            Europe
          </h3>
          <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Country</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Currencies</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Recommended Processor</th>
                </tr>
              </thead>
              <tbody>
                {europeRegion.map((item) => (
                  <tr key={item.country} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.country}</td>
                    <td className="px-4 py-3">
                      <code className="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono">{item.currencies}</code>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.processor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Americas */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#3898EC]" />
            Americas
          </h3>
          <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Country</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Currencies</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Recommended Processor</th>
                </tr>
              </thead>
              <tbody>
                {americasRegion.map((item) => (
                  <tr key={item.country} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.country}</td>
                    <td className="px-4 py-3">
                      <code className="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono">{item.currencies}</code>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.processor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asia-Pacific */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#3898EC]" />
            Asia-Pacific
          </h3>
          <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Country</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Currencies</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Recommended Processor</th>
                </tr>
              </thead>
              <tbody>
                {asiaPacificRegion.map((item) => (
                  <tr key={item.country} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.country}</td>
                    <td className="px-4 py-3">
                      <code className="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono">{item.currencies}</code>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.processor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Regional Considerations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Considerations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {regionalConsiderations.map((item) => (
            <div key={item.region} className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-gray-900 mb-3">{item.region}</h3>
              <ul className="space-y-2">
                {item.considerations.map((consideration) => (
                  <li key={consideration} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#40d63b] shrink-0" />
                    {consideration}
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
          href="/docs/guides/refunds"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              Refund Guide
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              How to issue refunds from dashboard or API
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors" />
        </Link>
      </section>
    </div>
  );
}
