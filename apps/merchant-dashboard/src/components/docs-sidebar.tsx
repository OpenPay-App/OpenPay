"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    label: "Getting Started",
    children: [
      { label: "About OpenPay", href: "/docs" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "First Payment", href: "/docs/first-payment" },
    ],
  },
  {
    label: "Architecture",
    children: [
      { label: "Overview", href: "/docs/architecture" },
      { label: "Services", href: "/docs/architecture/services" },
      { label: "Event Flow", href: "/docs/architecture/events" },
    ],
  },
  {
    label: "Security",
    children: [
      { label: "Overview", href: "/docs/security" },
    ],
  },
  {
    label: "Self-Hosting",
    children: [
      { label: "Docker Setup", href: "/docs/self-hosting" },
      { label: "Environment Variables", href: "/docs/self-hosting/env-vars" },
      { label: "Third-Party Tools", href: "/docs/self-hosting/tools" },
      { label: "Monitoring & Grafana", href: "/docs/self-hosting/monitoring" },
      { label: "Email Delivery & Team Invites", href: "/docs/self-hosting/email-delivery" },
      { label: "Production Deploy", href: "/docs/self-hosting/production" },
      { label: "Upgrades & Rollbacks", href: "/docs/self-hosting/upgrades" },
      { label: "Troubleshooting", href: "/docs/self-hosting/troubleshooting" },
    ],
  },
  {
    label: "API Reference",
    children: [
      { label: "Overview", href: "/docs/api" },
      { label: "Payments", href: "/docs/api/payments" },
      { label: "Customers", href: "/docs/api/customers" },
      { label: "Refunds", href: "/docs/api/refunds" },
    ],
  },
  {
    label: "Guides",
    children: [
      { label: "Accepting Payments", href: "/docs/guides/accepting-payments" },
      { label: "Webhooks", href: "/docs/guides/webhooks" },
    ],
  },
  {
    label: "SDKs & Libraries",
    href: "/docs/sdk",
  },
  {
    label: "Contributing",
    href: "/docs/contributing",
  },
  {
    label: "Changelog",
    href: "/changelog",
  },
];

function NavSection({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const isActive = item.href && pathname === item.href;
  const isChildActive =
    item.children?.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    ) ?? false;

  if (item.href && !item.children) {
    return (
      <li>
        <Link
          href={item.href}
          className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
            depth > 0 ? "ml-4" : ""
          } ${
            isActive
              ? "bg-[rgba(85,108,214,0.05)] text-[#556cd6] font-medium"
              : "text-gray-600 hover:text-[#141f41] hover:bg-white/50"
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-sm rounded-md transition-colors ${
          depth > 0 ? "ml-4" : ""
        } ${
          isChildActive
            ? "text-text-primary font-medium"
            : "text-gray-600 hover:text-[#141f41] hover:bg-white/50"
        }`}
      >
        <span>{item.label}</span>
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 opacity-30" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 opacity-30" />
        )}
      </button>
      {open && item.children && (
        <ul className="mt-1 space-y-0.5">
          {item.children.map((child) => (
            <NavSection key={child.label} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DocsSidebar() {
  return (
    <nav className="w-[220px] shrink-0 border-r border-[#e2e2e2] bg-white h-[calc(100vh-4rem)] overflow-y-auto sticky top-0 py-4 pr-4">
      <ul className="space-y-1">
        {navigation.map((item) => (
          <NavSection key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
}