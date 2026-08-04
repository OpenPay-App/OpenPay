import Link from "next/link";
import Image from "next/image";

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
            <Link href="/" className="text-sm text-[#999999] hover:text-[#333333] transition-colors">Home</Link>
            <Link href="/docs" className="text-sm text-[#999999] hover:text-[#333333] transition-colors">Docs</Link>
            <Link href="/changelog" className="text-sm text-[#3898EC] font-medium">Changelog</Link>
            <Link href="/status" className="text-sm text-[#999999] hover:text-[#333333] transition-colors">Status</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-[#333333] mb-4">Changelog</h1>
        <p className="text-lg text-[#999999] mb-12">
          Release notes and updates for the OpenPay platform.
        </p>

        <div className="space-y-12">
          {entries.map((entry) => (
            <div key={entry.version} className="relative pl-8 border-l-2 border-[#e2e2e2]">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#3898EC] border-2 border-white" />
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-mono text-[#3898EC] font-semibold">
                  v{entry.version}
                </span>
                <span className="text-sm text-[#AAADB0]">{entry.date}</span>
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-4">
                {entry.title}
              </h2>
              <ul className="space-y-2">
                {entry.changes.map((change) => (
                  <li
                    key={change}
                    className="text-sm text-[#999999] flex items-start gap-2"
                  >
                    <span className="text-[#3898EC] mt-1">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-[#fafafa] border-t border-[#e2e2e2] mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image src="/brand/logo.svg" alt="AVA" width={120} height={32} className="h-7 w-auto" />
            <p className="text-xs text-[#AAADB0]">&copy; {new Date().getFullYear()} OpenPay. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
