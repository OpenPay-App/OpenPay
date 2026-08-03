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
      className={`group flex items-start gap-4 p-5 rounded-none border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md hover:shadow-[#3898EC]/5 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 80}ms`,
        transitionProperty: "opacity, transform",
        transitionDuration: "0.7s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="w-10 h-10 rounded-none bg-[#e8f0fe] border border-[#e2e2e2] flex items-center justify-center shrink-0 group-hover:shadow-md group-hover:shadow-[#3898EC]/10 group-hover:scale-105 transition-all duration-300">
        <Github className="w-5 h-5 text-gray-400 group-hover:text-[#3898EC] transition-colors duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 text-sm group-hover:text-[#3898EC] transition-colors duration-300">
            {tool.name}
          </p>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {tool.description}
        </p>
        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-none bg-gray-100 text-gray-400 text-xs font-medium border border-[#e2e2e2]">
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
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden" id="open-source">
      <div className="relative max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-none bg-[#e8f0fe] border border-[#3898EC]/20 text-[#3898EC] text-sm font-medium mb-6">
            <Github className="w-4 h-4 text-[#3898EC]" />
            MIT Licensed
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Built on a foundation of{" "}
            <span className="text-[#3898EC]">
              open source
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Every component in the OpenPay stack is open source. No black
            boxes, no proprietary logic, just transparent, auditable code
            that the community can trust and improve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-none bg-[#3898EC] text-white font-semibold overflow-hidden transition-all duration-300 hover:bg-[#2c7dd6] hover:shadow-lg hover:shadow-[#3898EC]/25 active:scale-100"
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
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-none border border-[#e2e2e2] text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-300"
            >
              Join the community
            </Link>
          </div>
        </div>

        <div
          ref={toolsRef}
          className={`mb-20 transition-all duration-700 ${
            toolsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">
            The open-source tools powering OpenPay
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <ToolCard key={tool.name} tool={tool} index={index} />
            ))}
          </div>
        </div>

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
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-4xl lg:text-5xl font-bold text-[#3898EC] group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}