"use client";

import Link from "next/link";
import {
  Shield,
  Globe,
  Lock,
  DollarSign,
  Eye,
  Server,
  RefreshCw,
  Users,
} from "lucide-react";

export default function WhyDevelopersLeaveStripePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Tired of payment processors that work against you?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who&apos;ve switched to OpenPay — the
            open-source payment infrastructure you control.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/docs/quickstart"
              className="px-8 py-3 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0052CC] transition-colors"
            >
              Start Free — No Platform Fees
            </Link>
            <Link
              href="/docs"
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Problems We&apos;re Solving
          </h2>
          
          <div className="space-y-8">
            {/* Pain Point 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    &quot;They froze my account and held my money for 120 days&quot;
                  </h3>
                  <blockquote className="text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
                    &quot;Stripe will freeze your account, turn off processing,
                    refund your money to all the customers, and then hold the
                    remainder for 120 days. No warning, no explanation.&quot;
                    <cite className="block text-sm text-gray-500 mt-1">
                      — Reddit user, r/startups
                    </cite>
                  </blockquote>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-semibold text-green-800">
                      The OpenPay Difference
                    </p>
                    <p className="text-green-700">
                      Self-hosted means no one can freeze your account. You
                      control your infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pain Point 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    &quot;Once you&apos;re locked in, there&apos;s no way out&quot;
                  </h3>
                  <blockquote className="text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
                    &quot;Once Stripe shuts you down, it&apos;s game over. You have
                    to end up going with authorized.net and rebuilding
                    everything.&quot;
                    <cite className="block text-sm text-gray-500 mt-1">
                      — Reddit user, r/Entrepreneur
                    </cite>
                  </blockquote>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-semibold text-green-800">
                      The OpenPay Difference
                    </p>
                    <p className="text-green-700">
                      Hyperswitch supports 100+ processors. Switch anytime
                      without code changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pain Point 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    &quot;2.9% + 30¢ adds up fast&quot;
                  </h3>
                  <blockquote className="text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
                    &quot;Stripe charges 2.9% + 30¢ per transaction. For a $10M
                    business, that&apos;s $290,000+ per year in fees.&quot;
                    <cite className="block text-sm text-gray-500 mt-1">
                      — Reddit user, r/SaaS
                    </cite>
                  </blockquote>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-semibold text-green-800">
                      The OpenPay Difference
                    </p>
                    <p className="text-green-700">
                      $0 platform fees. You only pay your processor&apos;s fees
                      and your own infrastructure costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pain Point 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    &quot;Their fraud detection is terrible&quot;
                  </h3>
                  <blockquote className="text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
                    &quot;Stripe&apos;s out-of-the-box fraud solutions are terrible
                    for medium to large businesses.&quot;
                    <cite className="block text-sm text-gray-500 mt-1">
                      — Reddit user, r/mongodb
                    </cite>
                  </blockquote>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-semibold text-green-800">
                      The OpenPay Difference
                    </p>
                    <p className="text-green-700">
                      Custom fraud rules with Tazama. Build your own risk
                      scoring and detection logic.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pain Point 5 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    &quot;No one answers support tickets&quot;
                  </h3>
                  <blockquote className="text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
                    &quot;Support never answers. You can&apos;t get anyone to tell
                    you what&apos;s happening with your account.&quot;
                    <cite className="block text-sm text-gray-500 mt-1">
                      — Reddit user, r/webdev
                    </cite>
                  </blockquote>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-semibold text-green-800">
                      The OpenPay Difference
                    </p>
                    <p className="text-green-700">
                      Open-source community support. GitHub Discussions. Full
                      transparency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Stripe vs OpenPay
          </h2>
          
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Feature</th>
                  <th className="text-center px-6 py-4 font-semibold">Stripe</th>
                  <th className="text-center px-6 py-4 font-semibold text-[#0066FF]">
                    OpenPay
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4">Account freezes</td>
                  <td className="text-center px-6 py-4 text-red-600">Possible</td>
                  <td className="text-center px-6 py-4 text-green-600">
                    Impossible (self-hosted)
                  </td>
                </tr>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-6 py-4">Processor lock-in</td>
                  <td className="text-center px-6 py-4 text-red-600">Yes</td>
                  <td className="text-center px-6 py-4 text-green-600">
                    No (100+ connectors)
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4">Platform fees</td>
                  <td className="text-center px-6 py-4 text-red-600">
                    2.9% + 30¢
                  </td>
                  <td className="text-center px-6 py-4 text-green-600">$0</td>
                </tr>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-6 py-4">Fraud detection</td>
                  <td className="text-center px-6 py-4 text-yellow-600">Basic</td>
                  <td className="text-center px-6 py-4 text-green-600">
                    Custom (Tazama)
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4">Data ownership</td>
                  <td className="text-center px-6 py-4 text-red-600">
                    Stripe&apos;s servers
                  </td>
                  <td className="text-center px-6 py-4 text-green-600">
                    Your servers
                  </td>
                </tr>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-6 py-4">Transparency</td>
                  <td className="text-center px-6 py-4 text-red-600">
                    Closed source
                  </td>
                  <td className="text-center px-6 py-4 text-green-600">
                    100% open source
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4">Support</td>
                  <td className="text-center px-6 py-4 text-yellow-600">
                    Ticket queue
                  </td>
                  <td className="text-center px-6 py-4 text-green-600">
                    Community + docs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                icon: Server,
                title: "Self-Host",
                desc: "Deploy on your own infrastructure with Docker",
              },
              {
                step: "2",
                icon: Globe,
                title: "Connect Processors",
                desc: "Add Stripe, Paystack, Adyen, or 100+ others",
              },
              {
                step: "3",
                icon: RefreshCw,
                title: "Route Payments",
                desc: "Intelligent routing with automatic fallbacks",
              },
              {
                step: "4",
                icon: Shield,
                title: "Detect Fraud",
                desc: "Custom rules with real-time risk scoring",
              },
              {
                step: "5",
                icon: Eye,
                title: "Own Your Data",
                desc: "Everything stays on your servers",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-[#0066FF] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Get Started in 5 Minutes
          </h2>
          
          <div className="bg-gray-900 rounded-xl p-6 text-white">
            <pre className="font-mono text-sm overflow-x-auto">
              <code>
{`git clone https://github.com/OpenPay-App/openpay.git
cd openpay
cp .env.example .env
make init
docker compose --profile core up -d`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Developers Are Saying
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "We switched from Stripe to OpenPay and saved $50K/year in fees. Plus, we never have to worry about account freezes.",
                author: "SaaS Founder",
                role: "Series A Startup",
              },
              {
                quote:
                  "The ability to switch processors without code changes is a game-changer for our international business.",
                author: "E-commerce Developer",
                role: "Global Marketplace",
              },
              {
                quote:
                  "Finally, a payment processor that treats developers as first-class citizens. The documentation is excellent.",
                author: "Indie Hacker",
                role: "Building in Public",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <p className="text-gray-600 italic mb-4">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#0066FF]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Ready to take control of your payments?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start free. No platform fees. No lock-in. Full transparency.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/docs/quickstart"
              className="px-8 py-3 bg-white text-[#0066FF] font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <a
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
