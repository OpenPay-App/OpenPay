import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const entries = [
  {
    date: "2025-01-15",
    version: "0.1.0",
    title: "Initial Release",
    changes: [
      "Merchant dashboard with payment listing and detail views",
      "Customer management",
      "Embedded checkout page",
      "Hyperswitch integration for payment processing",
      "Kinde authentication",
      "Landing page with self-hosting guide",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo.svg"
              alt="OpenPay"
              width={180}
              height={45}
              className="h-9 w-auto"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Home</Link>
            <Link href="/docs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Docs</Link>
            <Link href="/changelog" className="text-sm text-secondary font-medium">Changelog</Link>
            <Link href="/status" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Status</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Changelog</h1>
        <p className="text-lg text-text-secondary mb-12">
          Release notes and updates for the OpenPay platform.
        </p>

        <div className="space-y-12">
          {entries.map((entry) => (
            <div key={entry.version} className="relative pl-8 border-l-2 border-border">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-secondary border-2 border-white" />
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-mono text-secondary font-semibold">
                  v{entry.version}
                </span>
                <span className="text-sm text-text-muted">{entry.date}</span>
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-4">
                {entry.title}
              </h2>
              <ul className="space-y-2">
                {entry.changes.map((change) => (
                  <li
                    key={change}
                    className="text-sm text-text-secondary flex items-start gap-2"
                  >
                    <span className="text-secondary mt-1">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
