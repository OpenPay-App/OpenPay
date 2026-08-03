"use client";

import { Check, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const steps = [
  {
    step: "1",
    title: "Clone the repo",
    code: "git clone https://github.com/OpenPay-App/openpay",
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
  { feature: "Transaction fees", openPay: "Zero: you pay only your payment processor", stripe: "2.9% + 30¢ per txn" },
  { feature: "Data ownership", openPay: "Fully self-hosted, your servers", stripe: "Stripe stores everything" },
  { feature: "Customization", openPay: "Full source code access", stripe: "Limited to API/config" },
  { feature: "Vendor lock-in", openPay: "None: swap processors anytime", stripe: "Heavy lock-in" },
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
      {index < steps.length - 1 && (
        <div className="absolute -top-1 left-0 right-0 flex items-center justify-center hidden md:block">
          <div className="absolute top-4 left-[calc(50%+28px)] right-[calc(50%+28px)] h-px bg-gradient-to-r from-[#3898EC]/40 to-[#3898EC]/20" />
        </div>
      )}
      <div className="absolute -top-1 left-0 right-0 flex items-center justify-center">
        <div className="relative w-10 h-10 rounded-full bg-[#3898EC] text-white flex items-center justify-center text-sm font-bold shadow-md shadow-[#3898EC]/20 z-10">
          {step.step}
        </div>
      </div>

      <div className="mt-8 p-6 rounded-none border border-[#e2e2e2] bg-white hover:border-[#3898EC]/20 hover:shadow-md hover:shadow-[#3898EC]/5 transition-all duration-300 group">
        <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors duration-300">
          {step.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 mb-3">{step.description}</p>
        <div className="relative">
          <code className="block text-sm font-mono text-gray-600 bg-gray-50 rounded-none px-4 py-3.5 border border-[#e2e2e2] overflow-x-auto">
            {step.code}
          </code>
          <div className="absolute top-2 right-2 px-2 py-1 rounded-none bg-gray-100 text-gray-400 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
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
    <section className="relative py-24 lg:py-32 bg-[#fafafa] overflow-hidden" id="self-host">
      <div className="relative max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Run it yourself in{" "}
            <span className="text-[#3898EC]">
              5 minutes
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            No signup, no credit card, no waiting. Just clone and go.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((s, i) => (
            <StepCard key={s.step} step={s} index={i} />
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why self-host?
          </h2>
        </div>

        <div
          ref={tableRef}
          className={`rounded-none border border-[#e2e2e2] bg-white overflow-hidden transition-all duration-700 ${
            tableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-3 bg-gray-50 text-gray-900 text-sm font-semibold border-b border-[#e2e2e2]">
            <div className="p-4">Feature</div>
            <div className="p-4 text-[#3898EC]">OpenPay</div>
            <div className="p-4 text-gray-400">Stripe</div>
          </div>
          {comparisons.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 text-sm ${
                i < comparisons.length - 1 ? "border-b border-[#e2e2e2]" : ""
              }`}
            >
              <div className="p-4 font-medium text-gray-900">{row.feature}</div>
              <div className="p-4 flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-[#40d63b] shrink-0" />
                {row.openPay}
              </div>
              <div className="p-4 flex items-center gap-2 text-gray-400">
                <X className="w-4 h-4 text-gray-300 shrink-0" />
                {row.stripe}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-gray-400 max-w-3xl mx-auto text-center leading-relaxed">
          Self-hosting means you take on your own infrastructure and operational
          costs, including servers, monitoring, and maintenance. OpenPay itself
          charges no platform fee; your only payment-related cost is your
          processor&apos;s fee.
        </p>
      </div>
    </section>
  );
}