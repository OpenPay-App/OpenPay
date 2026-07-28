"use client";

import { Check, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const steps = [
  {
    step: "1",
    title: "Clone the repo",
    code: "git clone https://github.com/OpenPay-App/OpenPay",
    description: "Get the complete platform source code",
  },
  {
    step: "2",
    title: "Configure environment",
    code: "cp .env.example .env && nano .env",
    description: "Set up your database, API keys, and preferences",
  },
  {
    step: "3",
    title: "Start the platform",
    code: "make up",
    description: "Launch all services with a single command",
  },
];

const comparisons = [
  { feature: "Transaction fees", openPay: "Zero — you pay only Paystack", stripe: "2.9% + 30¢ per txn" },
  { feature: "Data ownership", openPay: "Fully self-hosted, your servers", stripe: "Stripe stores everything" },
  { feature: "Customization", openPay: "Full source code access", stripe: "Limited to API/config" },
  { feature: "Vendor lock-in", openPay: "None — swap processors anytime", stripe: "Heavy lock-in" },
  { feature: "Fraud detection", openPay: "Built-in, customizable rules", stripe: "Radar (additional cost)" },
];

function StepCard({ step, index }: { step: typeof steps[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Step number with connector line */}
      <div className="absolute -top-1 left-0 right-0 flex items-center justify-center">
        {/* Connector line (hidden for last) */}
        {index < steps.length - 1 && (
          <div className="absolute top-4 left-[calc(50%+28px)] right-[calc(50%+28px)] h-px bg-gradient-to-r from-secondary/40 to-secondary/20 hidden md:block" />
        )}
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-600/20 z-10">
          {step.step}
        </div>
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 group">
        <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">
          {step.title}
        </h3>
        <p className="text-xs text-text-muted mt-1 mb-3">{step.description}</p>
        <div className="relative">
          <code className="block text-sm font-mono text-text-secondary bg-black/50 rounded-xl px-4 py-3.5 border border-white/[0.04] overflow-x-auto">
            {step.code}
          </code>
          {/* Copy indicator */}
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-white/5 text-white/30 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            {">_"}$ cd ~/{step.step}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SelfHost() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: tableRef, isVisible: tableVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden" id="self-host">
      {/* Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-t from-secondary/[0.02] to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Run it yourself in{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              5 minutes
            </span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            No signup, no credit card, no waiting. Just clone and go.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((s, i) => (
            <StepCard key={s.step} step={s} index={i} />
          ))}
        </div>

        {/* Why self-host comparison */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Why self-host?
          </h2>
        </div>

        <div
          ref={tableRef}
          className={`rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden transition-all duration-700 ${
            tableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-3 bg-black/50 text-white text-sm font-semibold border-b border-white/[0.05]">
            <div className="p-4">Feature</div>
            <div className="p-4 text-accent">OpenPay</div>
            <div className="p-4 text-white/40">Stripe</div>
          </div>
          {comparisons.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 text-sm ${
                i < comparisons.length - 1 ? "border-b border-white/[0.05]" : ""
              }`}
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
          ))}
        </div>
      </div>
    </section>
  );
}
