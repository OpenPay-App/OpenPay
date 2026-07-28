"use client";

import Link from "next/link";
import Image from "next/image";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight, Github } from "lucide-react";

export function Hero() {
  return (
    <section className="relative text-white overflow-hidden bg-black">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(245,102,0,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(245,102,0,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-secondary/20 via-accent/10 to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-32 lg:py-40">
        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/logo-dark.svg"
              alt="OpenPay"
              width={280}
              height={70}
              className="h-16 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link
              href="https://github.com/OpenPay-App/OpenPay"
              target="_blank"
              className="text-white/70 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <LoginLink className="text-sm text-white/70 hover:text-white transition-colors">
              Sign in
            </LoginLink>
          </div>
        </nav>

        {/* Content */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Open source &middot; Self-hosted &middot; Free forever
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            The payment infrastructure
            <br />
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              you actually own
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Accept payments, manage subscriptions, and detect fraud — all
            self-hosted, fully open-source, with zero vendor lock-in. Run it on
            your servers, own your data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RegisterLink className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-secondary/25">
              Get started — it&apos;s free
              <ArrowRight className="w-4 h-4" />
            </RegisterLink>
            <Link
              href="https://github.com/OpenPay-App/OpenPay"
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-white/20 text-white font-medium text-base hover:bg-white/5 transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </Link>
          </div>

          {/* Code preview */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="rounded-xl bg-[#0d1117] border border-white/10 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs text-white/40 font-mono">
                  terminal
                </span>
              </div>
              <pre className="p-6 text-left text-sm font-mono text-white/80 overflow-x-auto">
                <code>
                  <span className="text-text-muted">$</span>{" "}
                  <span className="text-accent">git</span>{" "}
                  clone https://github.com/OpenPay-App/OpenPay
                  {"\n"}
                  <span className="text-text-muted">$</span>{" "}
                  <span className="text-accent">cd</span> openpay
                  {"\n"}
                  <span className="text-text-muted">$</span>{" "}
                  <span className="text-accent">cp</span>{" "}
                  .env.example .env
                  {"\n"}
                  <span className="text-text-muted">$</span>{" "}
                  <span className="text-accent">make</span> up
                  {"\n\n"}
                  <span className="text-accent">
                    &#10003; Platform running at http://localhost:3000
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
