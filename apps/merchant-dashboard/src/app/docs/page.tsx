import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe, Code2 } from "lucide-react";

export default function DocsIntroPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Introduction to OpenPay
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          OpenPay is a self-hosted, open-source payment infrastructure that
          gives you full control over your payments stack. Accept card
          payments, manage subscriptions, and detect fraud — all on your own
          servers with zero vendor lock-in.
        </p>
      </div>

      {/* Why OpenPay */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Why OpenPay?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Globe,
              title: "Self-Hosted",
              description:
                "Deploy on your own infrastructure. Your data never leaves your servers. No third-party has access to your transaction data.",
            },
            {
              icon: Zap,
              title: "Zero Transaction Fees",
              description:
                "OpenPay charges nothing. You only pay the fees charged by your payment processor (e.g., Paystack). No hidden costs.",
            },
            {
              icon: Code2,
              title: "Fully Open Source",
              description:
                "Every line of code is available on GitHub. Audit it, modify it, contribute to it. The platform belongs to the community.",
            },
            {
              icon: Shield,
              title: "Production Ready",
              description:
                "Built on battle-tested components: Hyperswitch for payments, Kill Bill for subscriptions, NATS for events, Tazama for fraud detection.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-white"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary-light flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What you can do */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          What Can You Do?
        </h2>
        <div className="space-y-4">
          {[
            {
              title: "Accept Payments",
              description:
                "Process card payments, bank transfers, USSD, and mobile money across African markets (NGN, USD, GHS, ZAR, KES) via Paystack and other connectors.",
            },
            {
              title: "Manage Subscriptions",
              description:
                "Create products, pricing tiers, and handle the full subscription lifecycle — trials, upgrades, downgrades, cancellations, and invoicing via Kill Bill.",
            },
            {
              title: "Detect Fraud",
              description:
                "Build custom fraud rules (amount thresholds, velocity checks, geo-blocking) and review flagged transactions with the built-in case management system.",
            },
            {
              title: "Event-Driven Architecture",
              description:
                "Every payment event flows through NATS JetStream. Build reactive workflows, trigger webhooks, and sync data to external systems without polling.",
            },
            {
              title: "Embed Checkout",
              description:
                "Drop a hosted checkout page into your site via iframe or redirect. Customers enter card details on a secure, branded payment page.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-4 rounded-lg border border-border"
            >
              <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Tech Stack
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Component
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Technology
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Payment Orchestration", "Hyperswitch (Rust)", "Route payments to processors, handle retries"],
                ["Subscription Billing", "Kill Bill (Java)", "Product catalog, plans, invoicing, dunning"],
                ["Event Bus", "NATS JetStream", "Async event streaming between services"],
                ["Fraud Detection", "Tazama", "Rule evaluation, risk scoring, case management"],
                ["Reverse Proxy", "Traefik v2.10", "TLS termination, rate limiting, routing"],
                ["Database", "PostgreSQL 15", "Persistent storage for all services"],
                ["Cache", "Redis 7", "Session cache, rate limiting"],
                ["Dashboard", "Next.js 15 + TypeScript", "Merchant dashboard, landing page, docs"],
                ["Authentication", "Kinde", "Login, register, RBAC, JWT sessions"],
              ].map(([component, tech, purpose]) => (
                <tr key={component} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {component}
                  </td>
                  <td className="px-4 py-3 text-secondary font-mono text-xs">
                    {tech}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/docs/quickstart"
            className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
                Quickstart Guide
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Get OpenPay running in under 10 minutes
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
          </Link>
          <Link
            href="/docs/architecture"
            className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
                Architecture Overview
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Understand how all the services fit together
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
          </Link>
          <Link
            href="/docs/guides/accepting-payments"
            className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
                Accept Your First Payment
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Step-by-step guide to processing a payment
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
          </Link>
          <Link
            href="/docs/api"
            className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
                API Reference
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Complete REST API documentation
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
          </Link>
        </div>
      </section>
    </div>
  );
}
