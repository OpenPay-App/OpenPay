"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Key,
  Webhook,
  CreditCard,
  Users,
} from "lucide-react";

const tabs = [
  { href: "/settings", label: "Business", icon: Building2, exact: true },
  { href: "/settings/api-keys", label: "API Keys", icon: Key },
  { href: "/settings/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/settings/payment-methods", label: "Payment Methods", icon: CreditCard },
  { href: "/settings/team", label: "Team", icon: Users },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account and platform configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e2e2e2] mb-8">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-[#3898EC] text-[#3898EC]"
                    : "border-transparent text-gray-500 hover:text-[#333333] hover:border-[#e2e2e2]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}
