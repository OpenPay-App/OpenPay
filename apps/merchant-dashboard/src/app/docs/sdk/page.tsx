import Link from "next/link";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const sdks = [
  {
    name: "JavaScript / TypeScript",
    package: "@openpay/sdk",
    install: "npm install @openpay/sdk",
    description: "Full-featured client for Node.js and browser environments.",
    status: "Coming Soon",
    icon: "📦",
  },
  {
    name: "Python",
    package: "openpay",
    install: "pip install openpay",
    description: "Python client with async support and type hints.",
    status: "Coming Soon",
    icon: "🐍",
  },
  {
    name: "Go",
    package: "github.com/OpenPay-App/openpay-go",
    install: "go get github.com/OpenPay-App/openpay-go",
    description: "Go client with context support and retries.",
    status: "Coming Soon",
    icon: "🔷",
  },
  {
    name: "PHP",
    package: "OpenPay-App/openpay-php",
    install: "composer require OpenPay-App/openpay-php",
    description: "PHP SDK with Laravel and Symfony integrations.",
    status: "Coming Soon",
    icon: "🐘",
  },
];

export default function SdkPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[3px] bg-[#3898EC]/10 border border-[#3898EC]/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-[#3898EC]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            SDKs & Libraries
          </h1>
        </div>
        <p className="text-lg text-gray-500 max-w-2xl">
          Official client libraries to integrate OpenPay into your application.
          All SDKs are open-source and available on GitHub.
        </p>
      </div>

      <div className="space-y-6">
        {sdks.map((sdk) => (
          <div
            key={sdk.name}
            className="rounded-[8px] border border-gray-200 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-gray-300 transition-colors"
          >
            {/* macOS-style header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
              {/* macOS dots */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>

              {/* Centered label */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {sdk.icon} {sdk.name}
                </span>
              </div>

              {/* Status badge */}
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                {sdk.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">{sdk.description}</p>
              
              {/* Install command as code block */}
              <div className="mb-4">
                <CodeBlock title="Install">{sdk.install}</CodeBlock>
              </div>

              {/* Package info and link */}
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                  {sdk.package}
                </code>
                <Link
                  href="https://github.com/OpenPay-App/openpay"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3898EC] hover:underline transition-colors"
                >
                  GitHub <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Build your own */}
      <section className="mt-16 p-8 rounded-[8px] border border-gray-200 bg-white text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Build Your Own SDK
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mb-6">
          OpenPay&apos;s API is fully open. Use the{" "}
          <Link href="/docs/api" className="text-[#3898EC] hover:underline">
            API Reference
          </Link>{" "}
          to build client libraries in any language.
        </p>
        <Link
          href="/docs/api"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] bg-[#3898EC] text-white text-sm font-medium hover:bg-[#2d7fd4] transition-colors"
        >
          View API Reference
        </Link>
      </section>
    </div>
  );
}
