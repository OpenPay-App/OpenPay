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
    <footer className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,102,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,102,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/brand/logo-dark.svg"
              alt="OpenPay"
              width={200}
              height={50}
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm text-white/50 leading-relaxed">
              Open-source payment infrastructure you actually own.
            </p>
            {/* Decorative dot */}
            <div className="flex gap-1 mt-6">
              <span className="w-2 h-2 rounded-full bg-secondary/60" />
              <span className="w-2 h-2 rounded-full bg-accent/40" />
              <span className="w-2 h-2 rounded-full bg-secondary/20" />
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white/70 mb-4 tracking-wide">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-orange-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} OpenPay. MIT License.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/30">
              Built with care for the open-source community.
            </p>
            <span className="w-1 h-1 rounded-full bg-orange-500/50" />
            <span className="text-xs text-orange-400/50">100% open source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
