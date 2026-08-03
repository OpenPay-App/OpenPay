"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const features = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="fg-credit" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#3898EC" />
            <stop offset="100%" stopColor="#2c7dd6" />
          </linearGradient>
        </defs>
        <rect x="2" y="6" width="28" height="20" rx="4" stroke="url(#fg-credit)" strokeWidth="2" />
        <rect x="2" y="12" width="28" height="4" fill="url(#fg-credit)" opacity="0.25" />
        <rect x="6" y="19" width="10" height="2.5" rx="1.25" fill="url(#fg-credit)" opacity="0.5" />
        <circle cx="24" cy="20" r="2.5" fill="#3898EC" opacity="0.6" />
        <circle cx="21.5" cy="20" r="2.5" fill="#2c7dd6" opacity="0.6" />
      </svg>
    ),
    title: "Payment Processing",
    description:
      "Accept card payments, bank transfers, and local payment methods worldwide. Connect to Stripe, Adyen, or any major processor with no routing fees and no markup.",
    badge: "Stripe charges 2.9% + 30¢",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="fg-repeat" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#3898EC" />
            <stop offset="100%" stopColor="#2c7dd6" />
          </linearGradient>
        </defs>
        <path d="M22 8h4v4" stroke="url(#fg-repeat)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 16a10 10 0 0 1 17.07-7.07L26 12" stroke="url(#fg-repeat)" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 24H6v-4" stroke="url(#fg-repeat)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 16a10 10 0 0 1-17.07 7.07L6 20" stroke="url(#fg-repeat)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Subscription Billing",
    description:
      "Recurring payments, plan management, invoicing, and dunning, powered by Kill Bill. Handle upgrades, downgrades, trials, and usage-based billing.",
    badge: "Stripe charges 0.5% recurring",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="fg-shield" x1="4" y1="2" x2="28" y2="30">
            <stop offset="0%" stopColor="#3898EC" />
            <stop offset="100%" stopColor="#2c7dd6" />
          </linearGradient>
        </defs>
        <path d="M16 3L4 8v7c0 7.18 5.12 13.9 12 16 6.88-2.1 12-8.82 12-16V8L16 3z" stroke="url(#fg-shield)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 16l3 3 5-6" stroke="url(#fg-shield)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fraud Detection",
    description:
      "Real-time rule evaluation, risk scoring, and case management. Build custom fraud rules with Tazama. No per-transaction fees.",
    badge: "Stripe charges $0.05/txn",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="fg-receipt" x1="4" y1="2" x2="28" y2="30">
            <stop offset="0%" stopColor="#3898EC" />
            <stop offset="100%" stopColor="#2c7dd6" />
          </linearGradient>
        </defs>
        <path d="M8 4h16a2 2 0 0 1 2 2v24l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2z" stroke="url(#fg-receipt)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 10h8M12 15h8M12 20h5" stroke="url(#fg-receipt)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Invoicing & Tax",
    description:
      "Generate invoices, manage line items, calculate tax, and send reminders. Full invoice lifecycle without per-invoice charges.",
    badge: "Stripe charges $0.4/invoice",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="fg-globe" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#3898EC" />
            <stop offset="100%" stopColor="#2c7dd6" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="13" stroke="url(#fg-globe)" strokeWidth="2" />
        <ellipse cx="16" cy="16" rx="6" ry="13" stroke="url(#fg-globe)" strokeWidth="1.5" />
        <path d="M3 16h26" stroke="url(#fg-globe)" strokeWidth="1.5" />
        <path d="M5 10h22" stroke="url(#fg-globe)" strokeWidth="1" opacity="0.5" />
        <path d="M5 22h22" stroke="url(#fg-globe)" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    title: "Multi-Currency & Global",
    description:
      "Accept payments in 135+ currencies and payment methods. No currency conversion markup, just the real exchange rate from your processor.",
    badge: "Stripe charges 1% conversion",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="fg-zap" x1="8" y1="2" x2="24" y2="30">
            <stop offset="0%" stopColor="#3898EC" />
            <stop offset="100%" stopColor="#2c7dd6" />
          </linearGradient>
        </defs>
        <path d="M18 3L6 18h9l-2 11 12-15h-9l2-11z" fill="url(#fg-zap)" opacity="0.15" />
        <path d="M18 3L6 18h9l-2 11 12-15h-9l2-11z" stroke="url(#fg-zap)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    title: "Event-Driven Architecture",
    description:
      "Every payment event flows through NATS JetStream. Build reactive webhooks, automate workflows, and integrate with your existing systems.",
    badge: "Included free",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="fg-chart" x1="0" y1="28" x2="32" y2="0">
            <stop offset="0%" stopColor="#3898EC" />
            <stop offset="100%" stopColor="#2c7dd6" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="url(#fg-chart)" strokeWidth="2" />
        <path d="M9 22V16M13 22V12M17 22V18M21 22V10" stroke="url(#fg-chart)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="21" cy="10" r="1.5" fill="#3898EC" />
      </svg>
    ),
    title: "Analytics & Reporting",
    description:
      "Revenue metrics, customer analytics, payment success rates, and failure analysis. Real-time dashboards without enterprise-tier pricing.",
    badge: "Stripe charges for Sigma",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="fg-key" x1="2" y1="2" x2="30" y2="30">
            <stop offset="0%" stopColor="#3898EC" />
            <stop offset="100%" stopColor="#2c7dd6" />
          </linearGradient>
        </defs>
        <circle cx="11" cy="13" r="7" stroke="url(#fg-key)" strokeWidth="2" />
        <circle cx="11" cy="13" r="3" fill="url(#fg-key)" opacity="0.2" />
        <path d="M16.5 18.5L27 29" stroke="url(#fg-key)" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 24l5 5" stroke="url(#fg-key)" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 22l-2 2" stroke="url(#fg-key)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "API Keys & Webhooks",
    description:
      "Sandbox and production API keys, webhook endpoints, and a full REST API. Rate limits that scale with your business, not your plan.",
    badge: "Included free",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group relative p-7 rounded-none border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 transition-all duration-500 overflow-hidden ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 60}ms`,
        transitionProperty: "opacity, transform",
        transitionDuration: "0.7s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="absolute inset-0 bg-[#3898EC]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-start gap-5">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-none border border-[#e2e2e2] bg-white flex items-center justify-center group-hover:shadow-md group-hover:shadow-[#3898EC]/10 group-hover:scale-105 transition-all duration-300">
            {feature.icon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors duration-300">
              {feature.title}
            </h3>
            <span className="shrink-0 px-2.5 py-0.5 rounded-none bg-gray-100 border border-[#e2e2e2] text-gray-500 text-[11px] font-medium whitespace-nowrap">
              {feature.badge}
            </span>
          </div>
          <p className="text-[15px] text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  return (
    <section className="relative py-24 lg:py-32 bg-[#fafafa] overflow-hidden" id="features">
      <div className="relative max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-none bg-[#e8f0fe] border border-[#3898EC]/20 text-[#3898EC] text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3898EC]" />
            Own the stack &middot; Choose your processor &middot; No platform fees
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            A complete financial stack,{" "}
            <span className="text-[#3898EC]">
              under your control
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Payments, subscriptions, fraud detection, invoicing, analytics,
            and more. Open source, self-hosted, and portable across the
            processors you already use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <div className="mt-10 p-6 rounded-none border border-[#e2e2e2] bg-white">
          <p className="text-sm text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-900">The honest cost picture.</span>{" "}
            OpenPay charges no platform fees, no per-transaction fees, and no
            hidden charges. You will still pay your payment processor (Stripe,
            Adyen, Paystack, or whichever you choose) its processing fees, plus
            the infrastructure and operational costs of running OpenPay on your
            own servers. In return you keep full control, data ownership, and the
            freedom to switch processors whenever you want.
          </p>
        </div>
      </div>
    </section>
  );
}