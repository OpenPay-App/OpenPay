"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CreditCard, Shield, Globe, RefreshCw, FileText, Webhook } from "lucide-react";

const guides = [
  {
    title: "Accepting Payments",
    description: "Step-by-step guide to processing your first payment with OpenPay.",
    href: "/docs/guides/accepting-payments",
    icon: CreditCard,
    color: "bg-[#e8f0fe]",
    iconColor: "text-[#3898EC]",
  },
  {
    title: "Supported Processors",
    description: "100+ payment processors supported through Hyperswitch. Switch anytime.",
    href: "/docs/guides/processors",
    icon: RefreshCw,
    color: "bg-[#e6f9e6]",
    iconColor: "text-[#40d63b]",
  },
  {
    title: "High-Risk Merchants",
    description: "Support for high-risk industries with multi-processor fallback.",
    href: "/docs/guides/high-risk",
    icon: Shield,
    color: "bg-[#fff3e6]",
    iconColor: "text-[#ff8c00]",
  },
  {
    title: "KYC & Compliance",
    description: "Compliance requirements and verification guidelines.",
    href: "/docs/guides/compliance",
    icon: FileText,
    color: "bg-[#e8f0fe]",
    iconColor: "text-[#3898EC]",
  },
  {
    title: "International Payments",
    description: "Global payment support and regional considerations.",
    href: "/docs/guides/international",
    icon: Globe,
    color: "bg-[#e6f9e6]",
    iconColor: "text-[#40d63b]",
  },
  {
    title: "Refunds",
    description: "How to issue refunds from the dashboard or API.",
    href: "/docs/guides/refunds",
    icon: RefreshCw,
    color: "bg-[#fff3e6]",
    iconColor: "text-[#ff8c00]",
  },
  {
    title: "Webhooks",
    description: "Configure webhooks to receive real-time payment events.",
    href: "/docs/guides/webhooks",
    icon: Webhook,
    color: "bg-[#e8f0fe]",
    iconColor: "text-[#3898EC]",
  },
];

export default function GuidesPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Guides</h1>
        <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
          Step-by-step guides to help you get the most out of OpenPay. From accepting
          your first payment to managing international transactions.
        </p>
      </div>

      {/* Guides Grid */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <Link
              key={guide.title}
              href={guide.href}
              className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
            >
              <div className={`w-10 h-10 rounded-[3px] ${guide.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <guide.icon className={`w-5 h-5 ${guide.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors mb-2">
                {guide.title}
              </h3>
              <p className="text-sm text-gray-500">{guide.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm text-[#3898EC] opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="p-6 rounded-[3px] border border-[#e2e2e2] bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/docs/quickstart"
            className="flex items-center gap-3 p-3 rounded-[3px] bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#3898EC] text-white text-sm font-bold flex items-center justify-center">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Quickstart</p>
              <p className="text-xs text-gray-500">Get running in 10 minutes</p>
            </div>
          </Link>
          <Link
            href="/docs/first-payment"
            className="flex items-center gap-3 p-3 rounded-[3px] bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#3898EC] text-white text-sm font-bold flex items-center justify-center">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">First Payment</p>
              <p className="text-xs text-gray-500">Process your first test transaction</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
