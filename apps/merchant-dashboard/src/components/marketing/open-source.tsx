"use client";

import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

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
    url: "https://github.com/tazama-lf/tazama",
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
    url: "https://github.com/OpenPay-App/openpay",
    language: "TypeScript",
  },
];

function ToolCard({ tool, index }: { tool: typeof tools[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLAnchorElement>({ threshold: 0.1 });

  return (
    <Link
      ref={ref}
      key={tool.name}
      href={tool.url}
      target="_blank"
      className={`group flex items-start gap-4 p-5 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 80}ms`,
        transitionProperty: "opacity, transform",
        transitionDuration: "0.7s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/5 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-secondary/10 group-hover:scale-105 transition-all duration-300">
        <Github className="w-5 h-5 text-text-muted group-hover:text-secondary transition-colors duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white text-sm group-hover:text-orange-300 transition-colors duration-300">
            {tool.name}
          </p>
          <ExternalLink className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
        <p className="text-xs text-text-secondary mt-0.5">
          {tool.description}
        </p>
        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-white/5 text-text-muted text-xs font-medium border border-white/[0.04]">
          {tool.language}
        </span>
      </div>
    </Link>
  );
}

export function OpenSource() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: toolsRef, isVisible: toolsVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden" id="open-source">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-secondary/[0.02] to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full glass text-white text-sm font-medium mb-6">
            <Github className="w-4 h-4 text-orange-400" />
            MIT Licensed
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Built on a foundation of{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              open source
            </span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-12">
            Every component in the OpenPay stack is open source. No black
            boxes, no proprietary logic, just transparent, auditable code
            that the community can trust and improve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-600/25 active:scale-100"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                <Github className="w-5 h-5" />
                Star on GitHub
              </span>
            </Link>
            <Link
              href="https://github.com/OpenPay-App/openpay/discussions"
              target="_blank"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-white/10 text-white/60 font-medium hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              Join the community
            </Link>
          </div>
        </div>

        {/* Tool stack */}
        <div
          ref={toolsRef}
          className={`mb-20 transition-all duration-700 ${
            toolsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-xl font-semibold text-white text-center mb-8">
            The open-source tools powering OpenPay
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <ToolCard key={tool.name} tool={tool} index={index} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto transition-all duration-700 ${
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {[
            { value: "100%", label: "Open source" },
            { value: "$0", label: "Platform fees" },
            { value: "MIT", label: "License" },
            { value: "5 min", label: "Time to run" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center group">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-b from-orange-400 to-amber-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
