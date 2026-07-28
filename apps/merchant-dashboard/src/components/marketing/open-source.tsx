import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    name: "Hyperswitch",
    description: "Core payment router and orchestrator",
    url: "https://github.com/juspay/hyperswitch",
    language: "Rust",
  },
  {
    name: "Kill Bill",
    description: "Subscription billing and invoicing engine",
    url: "https://github.com/killbill/killbill",
    language: "Java",
  },
  {
    name: "Tazama",
    description: "Real-time fraud detection and rule evaluation",
    url: "https://github.com/tazama-labs/tazama",
    language: "Go",
  },
  {
    name: "NATS JetStream",
    description: "Event streaming and message broker",
    url: "https://github.com/nats-io/nats-server",
    language: "Go",
  },
  {
    name: "Superposition",
    description: "Configuration management and feature flags",
    url: "https://github.com/juspay/superposition",
    language: "Rust",
  },
  {
    name: "OpenPay Dashboard",
    description: "Merchant dashboard and admin interface",
    url: "https://github.com/OpenPay-App/OpenPay",
    language: "TypeScript",
  },
];

export function OpenSource() {
  return (
    <section className="py-24 bg-white" id="open-source">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-dark/5 border border-border text-text-primary text-sm font-medium mb-6">
            <Github className="w-4 h-4" />
            MIT Licensed
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Built on a foundation of open source
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-12">
            Every component in the OpenPay stack is open source. No black
            boxes, no proprietary logic — just transparent, auditable code
            that the community can trust and improve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              href="https://github.com/OpenPay-App/OpenPay"
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-bg-dark text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <Github className="w-5 h-5" />
              Star on GitHub
            </Link>
            <Link
              href="https://github.com/OpenPay-App/OpenPay/discussions"
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-border text-text-primary font-semibold hover:bg-bg-alt transition-colors"
            >
              Join the community
            </Link>
          </div>
        </div>

        {/* Tool stack */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-text-primary text-center mb-8">
            The open-source tools powering OpenPay
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.url}
                target="_blank"
                className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-white hover:border-secondary/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-bg-alt flex items-center justify-center shrink-0 group-hover:bg-secondary-light transition-colors">
                  <Github className="w-5 h-5 text-text-muted group-hover:text-secondary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text-primary text-sm">
                      {tool.name}
                    </p>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {tool.description}
                  </p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-bg-alt text-text-muted text-xs font-medium">
                    {tool.language}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">100%</div>
            <div className="text-sm text-text-muted mt-1">Open source</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">$0</div>
            <div className="text-sm text-text-muted mt-1">Platform fees</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">MIT</div>
            <div className="text-sm text-text-muted mt-1">License</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">5 min</div>
            <div className="text-sm text-text-muted mt-1">Time to run</div>
          </div>
        </div>
      </div>
    </section>
  );
}
