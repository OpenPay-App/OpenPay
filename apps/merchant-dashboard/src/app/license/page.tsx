import Link from "next/link";
import Image from "next/image";
import { Shield, Github, Heart } from "lucide-react";

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e2e2e2] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo.svg"
              alt="AVA"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-[#999999] hover:text-[#333333] transition-colors">
              Home
            </Link>
            <Link href="/docs" className="text-sm text-[#999999] hover:text-[#333333] transition-colors">
              Docs
            </Link>
            <Link
              href="https://github.com/OpenPay-App/openpay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#999999] hover:text-[#333333] transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-[3px] bg-[#e8f0fe] border border-[#3898EC]/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#3898EC]" />
          </div>
          <h1 className="text-4xl font-bold text-[#333333] mb-2">MIT License</h1>
          <p className="text-[#999999] text-sm mb-2">
            Copyright &copy; {new Date().getFullYear()} OpenPay Contributors
          </p>
          <p className="text-[#AAADB0] text-xs max-w-md mx-auto">
            OpenPay is 100% open source and free to use, modify, and distribute.
          </p>
        </div>

        {/* License Card */}
        <div className="rounded-[3px] border border-[#e2e2e2] bg-white p-8 mb-8 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="prose prose-gray max-w-none text-[#999999] space-y-4 text-sm leading-relaxed">
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

            <div className="p-4 rounded-[3px] bg-[#e8f0fe] border border-[#3898EC]/10">
              <p className="text-[#333333] font-medium">
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
              className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white text-center shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
            >
              <div className="w-10 h-10 rounded-[3px] bg-[#e8f0fe] flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-5 h-5 text-[#3898EC]" />
              </div>
              <h3 className="font-semibold text-[#333333] text-sm mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#999999]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* GitHub Link */}
        <div className="text-center">
          <a
            href="https://github.com/OpenPay-App/openpay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-[#3898EC] text-white font-medium text-sm hover:bg-[#2c7dd6] transition-all"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e2e2e2] mt-24 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image
              src="/brand/logo.svg"
              alt="AVA"
              width={120}
              height={32}
              className="h-7 w-auto"
            />
            <p className="text-xs text-[#AAADB0]">
              &copy; {new Date().getFullYear()} OpenPay. MIT License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
