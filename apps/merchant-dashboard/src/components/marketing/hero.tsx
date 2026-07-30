"use client";

import Link from "next/link";
import Image from "next/image";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight, Github, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function AnimatedOrb({ className, size = "w-[600px] h-[600px]" }: { className?: string; size?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${size} ${className || ""}`}
      style={{
        background:
          "radial-gradient(circle at center, rgba(245,102,0,0.12) 0%, rgba(255,198,10,0.04) 40%, transparent 70%)",
      }}
    />
  );
}

export function Hero() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: codeRef, isVisible: codeVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section className="relative text-white overflow-hidden bg-black min-h-screen flex items-center">
      {/* Premium grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,102,0,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,102,0,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Diagonal gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,102,0,0.08) 0%, transparent 40%, transparent 60%, rgba(255,198,10,0.04) 100%)",
        }}
      />

      {/* Floating gradient orbs */}
      <AnimatedOrb className="top-1/4 -left-48 animate-float-slow" size="w-[500px] h-[500px]" />
      <AnimatedOrb className="bottom-1/4 -right-48 animate-float" size="w-[400px] h-[400px]" />
      <AnimatedOrb className="top-1/3 left-1/3 animate-float-slow" size="w-[300px] h-[300px]" />

      {/* Radial center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gradient-to-b from-orange-500/5 via-orange-500/2 to-transparent blur-[100px]" />

      <div className="relative w-full max-w-6xl mx-auto px-6 py-24 lg:py-32">
        {/* Glass nav */}
        <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-6xl glass rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/logo-dark.svg"
              alt="OpenPay"
              width={200}
              height={48}
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <LoginLink className="text-sm text-white/60 hover:text-white transition-colors">
              Sign in
            </LoginLink>
          </div>
        </nav>

        <div className="mt-20 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            ref={titleRef}
            className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full glass text-orange-300 text-sm font-medium mb-8 transition-all duration-700 ${
              titleVisible ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-lg shadow-orange-500/50" />
            Open source &middot; Self-hosted &middot; Free forever
            <span className="ml-1 px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-semibold">
              v0.1
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`text-5xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight mb-8 transition-all duration-700 delay-100 ${
              titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            The payment infrastructure
            <br />
            <span
              className="bg-clip-text text-transparent animate-gradient-shift"
              style={{
                backgroundImage: "linear-gradient(135deg, #F56600, #FF8C38, #FFC60A, #F56600, #FF8C38)",
                backgroundSize: "300% 300%",
              }}
            >
              you actually own
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-lg lg:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${
              titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Accept payments, manage subscriptions, and detect fraud — all
            self-hosted, fully open-source, with zero vendor lock-in.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
              ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <RegisterLink className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-600/30 active:scale-100">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                Get started — it&apos;s free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </RegisterLink>
            <Link
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 font-medium text-base hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              View on GitHub
              <span className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded bg-amber-950/50 text-amber-400 text-[10px] font-medium">
                <Star className="w-2.5 h-2.5" />
                Star
              </span>
            </Link>
          </div>

          {/* Code preview */}
          <div
            ref={codeRef}
            className={`mt-20 max-w-2xl mx-auto transition-all duration-700 delay-300 ${
              codeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="group relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 overflow-hidden shadow-2xl shadow-black/60 hover:shadow-orange-600/5 transition-shadow duration-500">
              {/* Glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary/10 via-accent/5 to-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

              <div className="relative">
                {/* Traffic lights */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-xs text-white/30 font-mono">
                    terminal — openpay
                  </span>
                </div>
                <pre className="p-6 text-left text-sm font-mono text-white/60 overflow-x-auto">
                  <code>
                    <span className="text-white/30">$</span>{" "}
                    <span className="text-orange-400">git</span>{" "}
                    clone https://github.com/OpenPay-App/openpay
                    {"\n"}
                    <span className="text-white/30">$</span>{" "}
                    <span className="text-orange-400">cd</span> openpay
                    {"\n"}
                    <span className="text-white/30">$</span>{" "}
                    <span className="text-orange-400">make</span> up
                    {"\n\n"}
                    <span className="text-emerald-400">
                      &#10003; Platform running at http://localhost:3000
                    </span>
                  </code>
                </pre>
              </div>
            </div>

            {/* Trust indicator */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/25">
              <span>No signup required</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>MIT licensed</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>100% self-hosted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
