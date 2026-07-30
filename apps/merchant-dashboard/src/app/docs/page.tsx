import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe, Code2, Server, Heart, Github, Users, ExternalLink } from "lucide-react";

export default function DocsIntroPage() {
  return (
    <div>
      {/* About OpenPay */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/5 border border-secondary/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            About OpenPay
          </h1>
        </div>

        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p className="text-lg">
            OpenPay is a <strong className="text-white">self-hosted, open-source payment infrastructure</strong> that
            gives you full control over your payments stack — without vendor
            lock-in, hidden fees, or platform taxes.
          </p>

          <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
            <h3 className="font-semibold text-white mb-3">Our Mission</h3>
            <p className="text-sm leading-relaxed">
              We believe payment processing should be transparent, affordable,
              and entirely under your control. Every dollar that Stripe charges
              as a platform fee — 2.9% + $0.30 per transaction, $0.40 per
              invoice, $0.05 per fraud check — we believe should stay in your
              pocket. OpenPay gives you the same capabilities as Stripe, on
              your own infrastructure, at a fraction of the cost.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
            <h3 className="font-semibold text-white mb-3">What We're Building</h3>
            <p className="text-sm leading-relaxed">
              A complete financial platform that includes payment processing
              (via Hyperswitch), subscription billing and invoicing (Kill Bill),
              real-time fraud detection (Tazama), and event-driven architecture
              (NATS JetStream) — all connected through a modern merchant dashboard.
              We connect to Stripe, Paystack, Adyen, and 100+ other processors,
              so you're never locked into a single provider.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-[#0a0a0a]">
            <h3 className="font-semibold text-white mb-3">Who It's For</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                "SaaS companies tired of platform fees eating margins",
                "Developers who want full control over their payment stack",
                "Businesses needing multi-provider payment routing",
                "Fintech teams building on open-source infrastructure",
                "Enterprise teams requiring data sovereignty",
                "Startups scaling without vendor lock-in",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why OpenPay */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Why OpenPay?</h2>
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
              title: "Zero Platform Fees",
              description:
                "OpenPay charges nothing. You only pay the fees charged by your payment processor. No per-transaction fees, no percentage cuts.",
            },
            {
              icon: Code2,
              title: "100% Open Source",
              description:
                "GitHub repository, MIT licensed. Audit it, modify it, contribute to it. The platform belongs to the community.",
            },
            {
              icon: Shield,
              title: "Production Ready",
              description:
                "Built on battle-tested components: Hyperswitch (100+ connectors), Kill Bill, NATS JetStream, and Tazama fraud detection.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/20 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-white">Component</th>
                <th className="text-left px-4 py-3 font-semibold text-white">Technology</th>
                <th className="text-left px-4 py-3 font-semibold text-white">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Payment Orchestration", "Hyperswitch (Rust)", "Route payments to 100+ processors, handle retries"],
                ["Subscription Billing", "Kill Bill (Java)", "Product catalog, plans, invoicing, dunning"],
                ["Event Bus", "NATS JetStream", "Async event streaming between services"],
                ["Fraud Detection", "Tazama (Go)", "Rule evaluation, risk scoring, case management"],
                ["Reverse Proxy", "Traefik v2.10", "TLS termination, rate limiting, routing"],
                ["Database", "PostgreSQL 15", "Persistent storage for all services"],
                ["Cache", "Redis 7", "Session cache, rate limiting"],
                ["Dashboard", "Next.js 15 + TypeScript", "Merchant dashboard, landing page, docs"],
                ["Authentication", "Kinde", "Login, register, RBAC, JWT sessions"],
              ].map(([component, tech, purpose]) => (
                <tr key={component} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{component}</td>
                  <td className="px-4 py-3 text-secondary font-mono text-xs">{tech}</td>
                  <td className="px-4 py-3 text-text-secondary">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">What You Can Build</h2>
        <div className="space-y-4">
          {[
            {
              icon: Server,
              title: "Accept Payments Globally",
              description:
                "Process card payments, bank transfers, and local payment methods worldwide. Connect to any processor — no routing fees, no markup.",
            },
            {
              icon: Zap,
              title: "Manage Subscriptions",
              description:
                "Create products, pricing tiers, and handle the full subscription lifecycle — trials, upgrades, downgrades, cancellations, and invoicing.",
            },
            {
              icon: Shield,
              title: "Detect & Prevent Fraud",
              description:
                "Build custom fraud rules (amount thresholds, velocity checks, geo-blocking) and review flagged transactions with built-in case management.",
            },
            {
              icon: Globe,
              title: "Event-Driven Integrations",
              description:
                "Every payment event flows through NATS JetStream. Build reactive workflows, trigger webhooks, and sync data to external systems without polling.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-4 rounded-lg border border-border hover:border-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* External Resources */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">External Resources</h2>
        <div className="space-y-3">
          {[
            {
              title: "Hyperswitch Documentation",
              url: "https://hyperswitch.io/docs",
              description:
                "Official Hyperswitch docs — payment routing, connector configuration, webhooks",
            },
            {
              title: "Kill Bill Documentation",
              url: "https://docs.killbill.io/",
              description:
                "Subscription billing engine docs — product catalog, plans, invoicing API",
            },
            {
              title: "NATS Documentation",
              url: "https://docs.nats.io/",
              description:
                "NATS JetStream guide — streams, consumers, message delivery guarantees",
            },
            {
              title: "Tazama Documentation",
              url: "https://github.com/tazama-lf/tazama",
              description:
                "Tazama fraud detection — rule authoring, evaluation engine, case management",
            },
            {
              title: "CloudEvents Specification",
              url: "https://cloudevents.io/",
              description:
                "Standard event format used across all OpenPay services",
            },
            {
              title: "Stripe vs OpenPay Comparison",
              url: "/#pricing",
              description:
                "Detailed feature-by-feature pricing comparison on our landing page",
              internal: true,
            },
          ].map((resource) => (
            <Link
              key={resource.title}
              href={resource.url}
              target={resource.internal ? undefined : "_blank"}
              rel={resource.internal ? undefined : "noopener noreferrer"}
              className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-secondary/30 hover:bg-white/5 transition-all group"
            >
              <div>
                <h3 className="font-medium text-white group-hover:text-secondary transition-colors text-sm flex items-center gap-2">
                  {resource.title}
                  {!resource.internal && (
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-secondary transition-colors" />
                  )}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {resource.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/docs/quickstart"
            className="flex items-center justify-between p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 hover:shadow-md transition-all group"
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
            className="flex items-center justify-between p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
                Architecture Overview
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                How all the services fit together
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
          </Link>
          <Link
            href="/docs/guides/accepting-payments"
            className="flex items-center justify-between p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 hover:shadow-md transition-all group"
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
            className="flex items-center justify-between p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 hover:shadow-md transition-all group"
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

      {/* Community CTA */}
      <section className="p-6 rounded-xl border border-border bg-gradient-to-br from-secondary/5 to-accent/5 text-center">
        <h2 className="text-xl font-bold text-white mb-3">Built by the community, for the community</h2>
        <p className="text-sm text-text-secondary max-w-lg mx-auto mb-6">
          OpenPay is MIT licensed and open to everyone. Star us on GitHub, join
          the discussions, and help us build the future of open payment infrastructure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://github.com/OpenPay-App/OpenPay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-medium text-sm hover:shadow-lg hover:shadow-secondary/20 transition-all"
          >
            <Github className="w-4 h-4" />
            Star on GitHub
          </a>
          <a
            href="https://github.com/OpenPay-App/OpenPay/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
          >
            <Users className="w-4 h-4" />
            Join Discussions
          </a>
        </div>
      </section>
    </div>
  );
}
