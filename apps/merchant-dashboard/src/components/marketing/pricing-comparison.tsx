"use client";

import { Check, X, ArrowRight, TrendingDown, Server, Shield, Zap, Receipt, Globe, Key, BarChart3, Repeat, CreditCard, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface ComparisonItem {
  feature: string;
  openPay: string;
  stripe: string;
  savings?: string;
  icon: LucideIcon;
}

interface ComparisonGroup {
  category: string;
  items: ComparisonItem[];
}

const comparisons: ComparisonGroup[] = [
  {
    category: "Payment Processing",
    items: [
      {
        feature: "Platform / routing fees",
        openPay: "$0: only your processor's fee",
        stripe: "2.9% + 30¢ per txn",
        savings: "No platform markup",
        icon: CreditCard,
      },
      {
        feature: "Multi-currency conversion",
        openPay: "$0 markup: your processor's rate",
        stripe: "1% conversion fee",
        savings: "No conversion markup",
        icon: Globe,
      },
      {
        feature: "Dispute / chargeback fee",
        openPay: "$0 platform fee",
        stripe: "$3.75 per dispute",
        savings: "No platform dispute fee",
        icon: Shield,
      },
    ],
  },
  {
    category: "Subscriptions & Billing",
    items: [
      {
        feature: "Recurring billing",
        openPay: "$0: powered by Kill Bill",
        stripe: "0.5% per recurring txn",
        savings: "No recurring platform fee",
        icon: Repeat,
      },
      {
        feature: "Invoice generation",
        openPay: "$0: unlimited",
        stripe: "$0.40 per invoice (after 25 free)",
        savings: "Unlimited, no per-invoice fee",
        icon: Receipt,
      },
      {
        feature: "Subscription management",
        openPay: "$0: upgrades, downgrades, trials",
        stripe: "Included in Billing fee",
        icon: BarChart3,
      },
    ],
  },
  {
    category: "Fraud & Security",
    items: [
      {
        feature: "Fraud detection rules",
        openPay: "$0: customizable with Tazama",
        stripe: "$0.05 per transaction (Radar)",
        savings: "No per-transaction fraud fee",
        icon: Shield,
      },
      {
        feature: "Fraud prevention",
        openPay: "$0: real-time scoring",
        stripe: "Radar for Fraud Teams: $0.07/txn",
        savings: "No per-transaction fraud fee",
        icon: Zap,
      },
      {
        feature: "Case management",
        openPay: "$0: built-in admin panel",
        stripe: "Not available",
        icon: BarChart3,
      },
    ],
  },
  {
    category: "Developer Tools",
    items: [
      {
        feature: "API access",
        openPay: "$0: full REST API",
        stripe: "$0",
        icon: Key,
      },
      {
        feature: "Webhooks",
        openPay: "$0: unlimited",
        stripe: "$0",
        icon: Zap,
      },
      {
        feature: "Sandbox / testing",
        openPay: "$0: full sandbox mode",
        stripe: "$0",
        icon: Server,
      },
      {
        feature: "SDKs",
        openPay: "$0: open source",
        stripe: "$0",
        icon: Key,
      },
    ],
  },
  {
    category: "Data & Ownership",
    items: [
      {
        feature: "Data storage",
        openPay: "$0: your servers, your data",
        stripe: "Stripe stores everything",
        savings: "Full data ownership",
        icon: Server,
      },
      {
        feature: "Vendor lock-in",
        openPay: "$0: swap processors anytime",
        stripe: "Heavy lock-in",
        savings: "Zero lock-in",
        icon: TrendingDown,
      },
      {
        feature: "Source code access",
        openPay: "100% MIT licensed",
        stripe: "Proprietary",
        icon: Globe,
      },
      {
        feature: "Self-hosting",
        openPay: "Full Docker Compose stack",
        stripe: "Not available",
        icon: Server,
      },
    ],
  },
];

function FeatureCard({ item, index }: { item: ComparisonItem; index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const Icon = item.icon;
  const hasSavings = !!item.savings;

  return (
    <div
      ref={ref}
      className={`group relative rounded-none border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 transition-all duration-500 overflow-hidden ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
      style={{
        transitionDelay: `${index * 50}ms`,
        transitionProperty: "opacity, transform",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {hasSavings && (
        <div className="absolute top-3 right-3 z-10">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-[#e6f9e6] border border-[#40d63b]/20 text-[#40d63b] text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-0 translate-y-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#40d63b]" />
            {item.savings}
          </div>
        </div>
      )}

      <div className="relative p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 w-9 h-9 rounded-none border border-[#e2e2e2] bg-white flex items-center justify-center group-hover:bg-[#e8f0fe] group-hover:border-[#3898EC]/20 group-hover:scale-105 transition-all duration-300">
            <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors duration-300" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              {item.feature}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-none bg-[#e6f9e6] border border-[#40d63b]/10 group-hover:border-[#40d63b]/20 transition-all duration-300">
            <div className="shrink-0 w-5 h-5 rounded-full bg-[#40d63b]/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-[#40d63b]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-[#40d63b]/70 uppercase tracking-wider mb-0.5">
                OpenPay
              </div>
              <div className="text-sm font-medium text-gray-900 leading-tight">
                {item.openPay}
              </div>
            </div>
          </div>

          <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-none bg-gray-50 border border-[#e2e2e2] group-hover:border-gray-300 transition-all duration-300">
            <div className="shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <X className="w-3 h-3 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                Stripe
              </div>
              <div className="text-sm text-gray-500 leading-tight">
                {item.stripe}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySection({ group, index }: { group: ComparisonGroup; index: number }) {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-500 ${
        sectionVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 40}ms`,
      }}
    >
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-white border border-[#e2e2e2] text-gray-700 text-xs font-semibold">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3898EC]" />
          {group.category}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#e2e2e2] to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {group.items.map((item, i) => (
          <FeatureCard key={item.feature} item={item} index={i + (index * 2)} />
        ))}
      </div>
    </div>
  );
}

interface StatCard {
  value: string;
  valueColor: string;
  title: string;
  description: string;
  accent: string;
  accentBorder: string;
  icon: LucideIcon;
}

function StatCard({ stat, index }: { stat: StatCard; index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className={`group relative p-7 rounded-none border border-[#e2e2e2] bg-white hover:border-gray-300 transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 60}ms`,
        transitionProperty: "opacity, transform",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="relative">
        <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.valueColor} bg-clip-text text-transparent`}>
          {stat.value}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-none border border-[#e2e2e2] bg-white flex items-center justify-center group-hover:border-[#3898EC]/30 transition-colors duration-300">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            {stat.title}
          </h3>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {stat.description}
        </p>
      </div>
    </div>
  );
}

export function PricingComparison() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  const statCards: StatCard[] = [
    {
      value: "$0",
      valueColor: "from-emerald-500 to-emerald-600",
      title: "OpenPay platform fees",
      description: "No platform, per-transaction, or subscription charges. You still pay your processor's fees and your own infrastructure costs.",
      accent: "from-emerald-500/10 to-transparent",
      accentBorder: "border-emerald-500/30",
      icon: TrendingDown,
    },
    {
      value: "2.9%+",
      valueColor: "from-red-400 to-red-500",
      title: "Stripe processing fees",
      description: "Plus 30¢ per transaction, plus Radar, Billing, Tax, and other add-on fees that stack up quickly.",
      accent: "from-red-500/10 to-transparent",
      accentBorder: "border-red-500/30",
      icon: CreditCard,
    },
    {
      value: "$0",
      valueColor: "from-blue-400 to-blue-500",
      title: "Your data, your servers",
      description: "Full self-hosting with Docker. No vendor lock-in, no data leaving your infrastructure. MIT licensed.",
      accent: "from-blue-500/10 to-transparent",
      accentBorder: "border-blue-500/30",
      icon: Server,
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden" id="pricing">
      <div className="relative max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-500 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-none bg-[#e6f9e6] border border-[#40d63b]/20 text-[#40d63b] text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#40d63b]" />
            Control &middot; Portability &middot; No platform fees
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Own the stack.{" "}
            <span className="text-[#3898EC]">
              Skip the platform fees.
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            OpenPay gives you payments, billing, fraud detection, and invoicing,
            self-hosted on infrastructure you control, with no platform fees.
            You pay your processor&apos;s fees and your own infrastructure; nothing
            more, and no lock-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {statCards.map((stat, i) => (
            <StatCard key={stat.title} stat={stat} index={i} />
          ))}
        </div>

        {comparisons.map((group, i) => (
          <CategorySection key={group.category} group={group} index={i} />
        ))}

        <p className="mt-8 text-xs text-gray-400 max-w-3xl mx-auto text-center leading-relaxed">
          OpenPay charges no platform fees. The comparisons above reflect
          OpenPay&apos;s platform fees versus Stripe&apos;s standard published pricing for
          the same features. You will still pay your payment processor (Stripe,
          Adyen, Paystack, etc.) its processing fees, plus the infrastructure
          and operational costs of running OpenPay on your own servers.
          OpenPay is not affiliated with Stripe.
        </p>

        <div className="group relative text-center mt-12">
          <Link
            href="https://github.com/OpenPay-App/openpay"
            target="_blank"
            className="group/btn relative inline-flex items-center gap-2 px-8 py-4 rounded-none bg-[#3898EC] text-white font-semibold overflow-hidden transition-all duration-300 hover:bg-[#2c7dd6] hover:shadow-lg hover:shadow-[#3898EC]/25 active:scale-100"
          >
            <span className="relative flex items-center gap-2">
              Own your payment stack
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}