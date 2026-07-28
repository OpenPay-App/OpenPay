"use client";

import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const comparisons = [
  {
    category: "Payment Processing",
    items: [
      { feature: "Platform / routing fees", openPay: "$0 — only processor fees", stripe: "2.9% + 30¢ per txn" },
      { feature: "Multi-currency conversion", openPay: "$0 — real exchange rate", stripe: "1% conversion fee" },
      { feature: "Dispute / chargeback fee", openPay: "$0 platform fee", stripe: "$3.75 per dispute" },
    ],
  },
  {
    category: "Subscriptions & Billing",
    items: [
      { feature: "Recurring billing", openPay: "$0 — powered by Kill Bill", stripe: "0.5% per recurring txn" },
      { feature: "Invoice generation", openPay: "$0 — unlimited", stripe: "$0.40 per invoice (after 25 free)" },
      { feature: "Subscription management", openPay: "$0 — upgrades, downgrades, trials", stripe: "Included in Billing fee" },
    ],
  },
  {
    category: "Fraud & Security",
    items: [
      { feature: "Fraud detection rules", openPay: "$0 — customizable with Tazama", stripe: "$0.05 per transaction (Radar)" },
      { feature: "Fraud prevention", openPay: "$0 — real-time scoring", stripe: "Radar for Fraud Teams: $0.07/txn" },
      { feature: "Case management", openPay: "$0 — built-in admin panel", stripe: "Not available" },
    ],
  },
  {
    category: "Developer Tools",
    items: [
      { feature: "API access", openPay: "$0 — full REST API", stripe: "$0" },
      { feature: "Webhooks", openPay: "$0 — unlimited", stripe: "$0" },
      { feature: "Sandbox / testing", openPay: "$0 — full sandbox mode", stripe: "$0" },
      { feature: "SDKs", openPay: "$0 — open source", stripe: "$0" },
    ],
  },
  {
    category: "Data & Ownership",
    items: [
      { feature: "Data storage", openPay: "$0 — your servers, your data", stripe: "Stripe stores everything" },
      { feature: "Vendor lock-in", openPay: "$0 — swap processors anytime", stripe: "Heavy lock-in" },
      { feature: "Source code access", openPay: "100% — MIT licensed", stripe: "Proprietary" },
      { feature: "Self-hosting", openPay: "Full Docker Compose stack", stripe: "Not available" },
    ],
  },
];

function ComparisonRow({ row, index, isLast }: { row: typeof comparisons[number]["items"][number]; index: number; isLast: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`grid grid-cols-3 text-sm transition-all duration-500 ${
        !isLast ? "border-b border-white/[0.05]" : ""
      } ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="p-4 font-medium text-white">{row.feature}</div>
      <div className="p-4 flex items-center gap-2 text-text-secondary">
        <Check className="w-4 h-4 text-accent shrink-0" />
        {row.openPay}
      </div>
      <div className="p-4 flex items-center gap-2 text-text-muted">
        <X className="w-4 h-4 text-error shrink-0" />
        {row.stripe}
      </div>
    </div>
  );
}

export function PricingComparison() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section className="relative py-24 lg:py-32 bg-[#0a0a0a] overflow-hidden" id="pricing">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-secondary/[0.03] to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/[0.02] to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Save thousands per year
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            What Stripe charges for —{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              we include free
            </span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Every feature below costs extra on Stripe. With OpenPay, you pay
            zero platform fees — only the payment processor charges apply.
          </p>
        </div>

        {/* Big comparison cards */}
        <div
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-700 ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* OpenPay featured card */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a] border-2 border-secondary/50 hover:border-secondary shadow-xl shadow-secondary/5 hover:shadow-secondary/15 transition-all duration-500">
            {/* Subtle glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-secondary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none" />
            <div className="relative">
              <div className="text-5xl font-bold text-secondary mb-2">$0</div>
              <div className="text-lg font-semibold text-white mb-1">
                OpenPay platform fees
              </div>
              <p className="text-sm text-text-secondary">
                No per-transaction fees, no percentage cuts, no subscription
                charges. Pay only your payment processor.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <div className="text-5xl font-bold text-red-400 mb-2">2.9%+</div>
            <div className="text-lg font-semibold text-white mb-1">
              Stripe processing fees
            </div>
            <p className="text-sm text-text-secondary">
              Plus 30¢ per transaction, plus Radar, Billing, Tax, and other
              add-on fees that stack up quickly.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <div className="text-5xl font-bold text-text-muted mb-2">$0</div>
            <div className="text-lg font-semibold text-white mb-1">
              Your data, your servers
            </div>
            <p className="text-sm text-text-secondary">
              Full self-hosting with Docker. No vendor lock-in, no data
              leaving your infrastructure. MIT licensed.
            </p>
          </div>
        </div>

        {/* Detailed breakdown tables */}
        {comparisons.map((group, gi) => (
          <div key={group.category} className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 px-1">
              {group.category}
            </h3>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
              <div className="grid grid-cols-3 bg-black/50 text-white text-sm font-semibold border-b border-white/[0.05]">
                <div className="p-4">Feature</div>
                <div className="p-4 text-accent">OpenPay</div>
                <div className="p-4 text-white/40">Stripe</div>
              </div>
              {group.items.map((row, i) => (
                <ComparisonRow
                  key={row.feature}
                  row={row}
                  index={i}
                  isLast={i === group.items.length - 1}
                />
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`text-center mt-12 transition-all duration-700 ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="https://github.com/OpenPay-App/OpenPay"
            target="_blank"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-600/25 active:scale-100"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center gap-2">
              Start saving today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
