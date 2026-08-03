import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Self-host", href: "#self-host" },
    { label: "Docs", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
  ],
  Developers: [
    { label: "API Reference", href: "/docs/api" },
    { label: "Webhooks", href: "/docs/guides/webhooks" },
    { label: "SDKs", href: "/docs/sdk" },
    { label: "Status", href: "/status" },
  ],
  Community: [
    { label: "GitHub", href: "https://github.com/OpenPay-App/openpay" },
    { label: "Discussions", href: "https://github.com/OpenPay-App/openpay/discussions" },
    { label: "Contributing", href: "https://github.com/OpenPay-App/openpay/blob/main/CONTRIBUTING.md" },
  ],
  Legal: [
    { label: "License", href: "/license" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-[#fafafa] text-gray-800 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3898EC]/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/brand/logo.svg"
              alt="AVA"
              width={120}
              height={32}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-gray-500 leading-relaxed">
              Open-source payment infrastructure you actually own.
            </p>
            <div className="flex gap-1 mt-6">
              <span className="w-2 h-2 rounded-full bg-[#3898EC]/60" />
              <span className="w-2 h-2 rounded-full bg-[#40d63b]/40" />
              <span className="w-2 h-2 rounded-full bg-[#3898EC]/20" />
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-700 mb-4 tracking-wide">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-[#3898EC] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#e2e2e2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} OpenPay. MIT License.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-400">
              Built with care for the open-source community.
            </p>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-xs text-[#3898EC]/50">100% open source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}