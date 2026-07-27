import { Check, X } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Clone the repo",
    code: "git clone https://github.com/OpenPay-App/OpenPay",
  },
  {
    step: "2",
    title: "Configure environment",
    code: "cp .env.example .env && nano .env",
  },
  {
    step: "3",
    title: "Start the platform",
    code: "make up",
  },
];

const comparisons = [
  { feature: "Transaction fees", openPay: "Zero — you pay only Paystack", stripe: "2.9% + 30¢ per txn" },
  { feature: "Data ownership", openPay: "Fully self-hosted, your servers", stripe: "Stripe stores everything" },
  { feature: "Customization", openPay: "Full source code access", stripe: "Limited to API/config" },
  { feature: "Vendor lock-in", openPay: "None — swap processors anytime", stripe: "Heavy lock-in" },
  { feature: "Fraud detection", openPay: "Built-in, customizable rules", stripe: "Radar (additional cost)" },
];

export function SelfHost() {
  return (
    <section className="py-24 bg-bg-alt">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Run it yourself in 5 minutes
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            No signup, no credit card, no waiting. Just clone and go.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative p-6 rounded-xl bg-white border border-border"
            >
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                {s.title}
              </h3>
              <code className="block text-sm font-mono text-text-secondary bg-bg-alt rounded-lg px-4 py-3 mt-3">
                {s.code}
              </code>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Why self-host?
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="grid grid-cols-3 bg-bg-dark text-white text-sm font-semibold">
            <div className="p-4">Feature</div>
            <div className="p-4 text-accent">OpenPay</div>
            <div className="p-4 text-white/60">Stripe</div>
          </div>
          {comparisons.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 text-sm ${
                i < comparisons.length - 1 ? "border-b border-border" : ""
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
    </section>
  );
}
