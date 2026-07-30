import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-border bg-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logo-dark.svg" alt="OpenPay" width={180} height={45} className="h-9 w-auto brightness-0 invert" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-white transition-colors">Home</Link>
            <Link href="/docs" className="text-sm text-text-secondary hover:text-white transition-colors">Docs</Link>
            <Link href="/changelog" className="text-sm text-text-secondary hover:text-white transition-colors">Changelog</Link>
            <Link href="/status" className="text-sm text-text-secondary hover:text-white transition-colors">Status</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none text-text-secondary space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Acceptance</h2>
            <p>By using OpenPay, you agree to these terms. OpenPay is provided as open-source software under the MIT License. You are responsible for your use of the software and compliance with applicable laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Self-Hosted Use</h2>
            <p>OpenPay is designed to be self-hosted. When you deploy OpenPay, you are the operator and are responsible for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Security and maintenance of your deployment</li>
              <li>Compliance with payment regulations in your jurisdiction</li>
              <li>Customer data protection and privacy</li>
              <li>PCI DSS compliance for card data handling</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">No Warranty</h2>
            <p>OpenPay is provided &ldquo;as is&rdquo; without warranty of any kind. The OpenPay contributors and maintainers are not responsible for any damages, losses, or liabilities arising from your use of the software.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Payment Processing</h2>
            <p>OpenPay facilitates payment processing through third-party providers (e.g., Paystack). Your use of these services is governed by their respective terms of service. OpenPay does not process, store, or have access to your payment transactions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Modifications</h2>
            <p>As open-source software, you are free to modify OpenPay to suit your needs. Contributions back to the project are welcome via pull requests on GitHub.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Termination</h2>
            <p>Since OpenPay is open-source and self-hosted, there is no account to terminate. You may stop using the software at any time by shutting down your deployment.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>For questions about these terms, open an issue on <Link href="https://github.com/OpenPay-App/openpay" className="text-secondary hover:underline">GitHub</Link>.</p>
          </section>
        </div>
      </main>

      <footer className="bg-bg-dark text-white mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image src="/brand/logo-dark.svg" alt="OpenPay" width={120} height={30} className="h-7 w-auto brightness-0 invert" />
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} OpenPay. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
