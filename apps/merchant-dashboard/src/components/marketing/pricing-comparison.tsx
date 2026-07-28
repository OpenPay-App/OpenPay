import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

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

export function PricingComparison() {
  return (
    <section className="py-24 bg-bg-alt" id="pricing">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-6">
            Save thousands per year
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            What Stripe charges for — we include free
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Every feature below costs extra on Stripe. With OpenPay, you pay
            zero platform fees — only the payment processor charges apply.
          </p>
        </div>

        {/* Big comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-xl bg-white border-2 border-secondary shadow-lg shadow-secondary/10">
            <div className="text-5xl font-bold text-secondary mb-2">$0</div>
            <div className="text-lg font-semibold text-text-primary mb-1">
              OpenPay platform fees
            </div>
            <p className="text-sm text-text-secondary">
              No per-transaction fees, no percentage cuts, no subscription
              charges. Pay only your payment processor.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-white border border-border">
            <div className="text-5xl font-bold text-red-500 mb-2">2.9%+</div>
            <div className="text-lg font-semibold text-text-primary mb-1">
              Stripe processing fees
            </div>
            <p className="text-sm text-text-secondary">
              Plus 30¢ per transaction, plus Radar, Billing, Tax, and other
              add-on fees that stack up quickly.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-white border border-border">
            <div className="text-5xl font-bold text-text-muted mb-2">$0</div>
            <div className="text-lg font-semibold text-text-primary mb-1">
              Your data, your servers
            </div>
            <p className="text-sm text-text-secondary">
              Full self-hosting with Docker. No vendor lock-in, no data
              leaving your infrastructure. MIT licensed.
            </p>
          </div>
        </div>

        {/* Detailed breakdown */}
        {comparisons.map((group) => (
          <div key={group.category} className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4 px-1">
              {group.category}
            </h3>
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="grid grid-cols-3 bg-bg-dark text-white text-sm font-semibold">
                <div className="p-4">Feature</div>
                <div className="p-4 text-accent">OpenPay</div>
                <div className="p-4 text-white/60">Stripe</div>
              </div>
              {group.items.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 text-sm ${
                    i < group.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="p-4 font-medium text-text-primary">
                    {row.feature}
                  </div>
                  <div className="p-4 flex items-center gap-2 text-text-secondary">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    {row.openPay}
                  </div>
                  <div className="p-4 flex items-center gap-2 text-text-muted">
                    <X className="w-4 h-4 text-error shrink-0" />
                    {row.stripe}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="https://github.com/OpenPay-App/OpenPay"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-hover transition-colors"
          >
            Start saving today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
