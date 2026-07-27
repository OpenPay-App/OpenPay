import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logo.svg" alt="OpenPay" width={180} height={45} className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Home</Link>
            <Link href="/docs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Docs</Link>
            <Link href="/changelog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Changelog</Link>
            <Link href="/status" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Status</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none text-text-secondary space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">Overview</h2>
            <p>OpenPay is open-source, self-hosted payment infrastructure. When you self-host OpenPay, all data stays on your servers. We have no access to your data, your customers&apos; data, or your transaction history.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">Data Collection</h2>
            <p>OpenPay itself does not collect any data from self-hosted instances. The OpenPay project maintains no telemetry, analytics, or phone-home mechanisms. Your payment data, customer data, and configuration remain entirely under your control.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">Third-Party Services</h2>
            <p>When you use OpenPay, you connect it to payment processors (e.g., Paystack) and authentication providers (e.g., Kinde). Each of these services has its own privacy policy. We encourage you to review the privacy policies of any third-party services you integrate with OpenPay.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">Cookies</h2>
            <p>OpenPay uses session cookies for authentication via Kinde. These cookies are necessary for the application to function and are not used for tracking purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">Open Source</h2>
            <p>OpenPay is released under the MIT License. You can audit the source code at any time to verify how data is handled. We welcome security reviews and contributions from the community.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">Contact</h2>
            <p>For questions about this privacy policy, open an issue on <Link href="https://github.com/OpenPay-App/OpenPay" className="text-secondary hover:underline">GitHub</Link> or start a discussion in the <Link href="https://github.com/OpenPay-App/OpenPay/discussions" className="text-secondary hover:underline">community forum</Link>.</p>
          </section>
        </div>
      </main>

      <footer className="bg-bg-dark text-white mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image src="/brand/logo.svg" alt="OpenPay" width={120} height={30} className="h-7 w-auto brightness-0 invert" />
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} OpenPay. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
