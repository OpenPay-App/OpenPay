"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Star, Terminal } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function Hero() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: codeRef, isVisible: codeVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section className="relative text-gray-800 overflow-hidden bg-white min-h-screen flex items-center">
      <div className="relative w-full max-w-6xl mx-auto px-6 py-24 lg:py-32">
        {/* Glass nav */}
        <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-6xl glass rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/logo.svg"
              alt="AVA"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/docs/quickstart"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Quickstart
            </Link>
            <Link
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </nav>

        <div className="mt-20 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            ref={titleRef}
            className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#e8f0fe] border border-[#3898EC]/20 text-[#3898EC] text-sm font-medium mb-8 transition-all duration-700 ${
              titleVisible ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#3898EC] animate-pulse shadow-lg shadow-[#3898EC]/50" />
            Open source &middot; Self-hosted &middot; Zero platform fees
            <span className="ml-1 px-2 py-0.5 rounded bg-[#3898EC]/10 text-[#3898EC] text-[10px] font-semibold">
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
            <span className="bg-clip-text text-transparent">
              you actually own
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${
              titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            OpenPay is the open-source payments platform that lets you own
            your payment infrastructure, including payments, subscriptions,
            and fraud detection on your own servers, while staying free to
            choose or switch your payment processor.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
              ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/docs/quickstart"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-none bg-[#3898EC] text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:bg-[#2c7dd6] hover:shadow-lg hover:shadow-[#3898EC]/25 active:scale-100"
            >
              <span className="relative flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Self-host in 5 minutes
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-none border border-[#e2e2e2] text-gray-700 font-medium text-base hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              View on GitHub
              <span className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-medium">
                <Star className="w-2.5 h-2.5" />
                Star
              </span>
            </Link>
          </div>

          {/* Auth note */}
          <p className="mt-4 text-xs text-gray-400">
            No account needed. Authentication is optional and only required if you enable it.
          </p>
          <p className="mt-2 text-xs text-gray-400 max-w-xl mx-auto">
            Zero platform fees. You still pay your payment processor (Stripe,
            Adyen, Paystack, etc.) and the cost of running your own infrastructure.
          </p>

          {/* Code preview */}
          <div
            ref={codeRef}
            className={`mt-20 max-w-2xl mx-auto transition-all duration-700 delay-300 ${
              codeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="group relative rounded-none border border-[#e2e2e2] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500">
              <div className="relative">
                {/* Traffic lights */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#e2e2e2]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-xs text-gray-400 font-mono">
                    terminal &middot; openpay
                  </span>
                </div>
                <pre className="p-6 text-left text-sm font-mono text-gray-600 overflow-x-auto">
                  <code>
                    <span className="text-gray-400">$</span>{" "}
                    <span className="text-[#3898EC]">git</span>{" "}
                    clone https://github.com/OpenPay-App/openpay
                    {"\n"}
                    <span className="text-gray-400">$</span>{" "}
                    <span className="text-[#3898EC]">cd</span> openpay
                    {"\n"}
                    <span className="text-gray-400">$</span>{" "}
                    <span className="text-[#3898EC]">make</span> up
                    {"\n\n"}
                    <span className="text-[#40d63b]">
                      &#10003; Platform running at http://localhost:3000
                    </span>
                  </code>
                </pre>
              </div>
            </div>

            {/* Trust indicator */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
              <span>No signup required</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>MIT licensed</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>100% self-hosted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}