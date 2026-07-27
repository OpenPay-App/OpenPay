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
    { label: "GitHub", href: "https://github.com/OpenPay-App/OpenPay" },
    { label: "Discussions", href: "https://github.com/OpenPay-App/OpenPay/discussions" },
    { label: "Contributing", href: "https://github.com/OpenPay-App/OpenPay/blob/main/CONTRIBUTING.md" },
  ],
  Legal: [
    { label: "License", href: "/license" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-bg-dark text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/brand/logo.svg"
              alt="OpenPay"
              width={200}
              height={50}
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm text-white/50 leading-relaxed">
              Open-source payment infrastructure you actually own.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white/80 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} OpenPay. MIT License.
          </p>
          <p className="text-xs text-white/30">
            Built with care for the open-source community.
          </p>
        </div>
      </div>
    </footer>
  );
}
