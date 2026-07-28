import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

const sdks = [
  {
    name: "JavaScript / TypeScript",
    package: "@openpay/sdk",
    install: "npm install @openpay/sdk",
    description: "Full-featured client for Node.js and browser environments.",
    status: "Coming Soon",
  },
  {
    name: "Python",
    package: "openpay",
    install: "pip install openpay",
    description: "Python client with async support and type hints.",
    status: "Coming Soon",
  },
  {
    name: "Go",
    package: "github.com/OpenPay-App/OpenPay-go",
    install: "go get github.com/OpenPay-App/OpenPay-go",
    description: "Go client with context support and retries.",
    status: "Coming Soon",
  },
  {
    name: "PHP",
    package: "OpenPay-App/OpenPay-php",
    install: "composer require OpenPay-App/OpenPay-php",
    description: "PHP SDK with Laravel and Symfony integrations.",
    status: "Coming Soon",
  },
];

export default function SdkPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          SDKs & Libraries
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          Official client libraries to integrate OpenPay into your application.
          All SDKs are open-source and available on GitHub.
        </p>
      </div>

      <div className="space-y-6">
        {sdks.map((sdk) => (
          <div
            key={sdk.name}
            className="p-6 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {sdk.name}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {sdk.description}
                </p>
              </div>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-950 text-amber-400 border border-amber-500/30">
                {sdk.status}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <code className="text-sm font-mono bg-bg-alt px-3 py-1.5 rounded-lg text-text-secondary">
                {sdk.install}
              </code>
              <Link
                href="https://github.com/OpenPay-App/OpenPay"
                target="_blank"
                className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
              >
                GitHub <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Build your own */}
      <section className="mt-16 p-8 rounded-xl border border-border bg-bg-alt text-center">
        <h2 className="text-xl font-bold text-text-primary mb-3">
          Build Your Own SDK
        </h2>
        <p className="text-sm text-text-secondary max-w-xl mx-auto mb-6">
          OpenPay&apos;s API is fully open. Use the{" "}
          <Link href="/docs/api" className="text-secondary hover:underline">
            API Reference
          </Link>{" "}
          to build client libraries in any language.
        </p>
        <Link
          href="/docs/api"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary-hover transition-colors"
        >
          View API Reference
        </Link>
      </section>
    </div>
  );
}
