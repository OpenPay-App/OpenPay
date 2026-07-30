import Link from "next/link";
import Image from "next/image";
import { Shield, Github, Heart } from "lucide-react";

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-border bg-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo-dark.svg"
              alt="OpenPay"
              width={180}
              height={45}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/docs" className="text-sm text-text-secondary hover:text-white transition-colors">
              Docs
            </Link>
            <Link
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/5 border border-secondary/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">MIT License</h1>
          <p className="text-text-secondary text-sm mb-2">
            Copyright &copy; {new Date().getFullYear()} OpenPay Contributors
          </p>
          <p className="text-text-muted text-xs max-w-md mx-auto">
            OpenPay is 100% open source and free to use, modify, and distribute.
          </p>
        </div>

        {/* License Card */}
        <div className="rounded-2xl border border-border bg-[#0a0a0a] p-8 mb-8">
          <div className="prose prose-gray max-w-none text-text-secondary space-y-4 text-sm leading-relaxed">
            <p>
              Permission is hereby granted, free of charge, to any person
              obtaining a copy of this software and associated documentation
              files (the &ldquo;Software&rdquo;), to deal in the Software
              without restriction, including without limitation the rights to
              use, copy, modify, merge, publish, distribute, sublicense,
              and/or sell copies of the Software, and to permit persons to
              whom the Software is furnished to do so, subject to the
              following conditions:
            </p>

            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
              <p className="text-text-primary font-medium">
                The above copyright notice and this permission notice shall be
                included in all copies or substantial portions of the Software.
              </p>
            </div>

            <p>
              THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY
              OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
              THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
              COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
              ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
              USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Heart,
              title: "Free Forever",
              desc: "No paid tiers, no enterprise licenses. MIT licensed, always.",
            },
            {
              icon: Github,
              title: "Open Source",
              desc: "Every line of code is available on GitHub. Transparent and auditable.",
            },
            {
              icon: Shield,
              title: "No Warranty",
              desc: "Use at your own risk. The software is provided 'as is' without warranty.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl border border-border bg-[#0a0a0a] text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* GitHub Link */}
        <div className="text-center">
          <a
            href="https://github.com/OpenPay-App/openpay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-medium text-sm hover:shadow-lg hover:shadow-secondary/20 transition-all"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image
              src="/brand/logo-dark.svg"
              alt="OpenPay"
              width={120}
              height={30}
              className="h-7 w-auto brightness-0 invert"
            />
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} OpenPay. MIT License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
