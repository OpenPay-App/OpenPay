"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Package,
  RefreshCw,
  FileText,
  BarChart3,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/customers", label: "Customers", icon: Users },
];

const productNav = [
  { href: "/products", label: "Products", icon: Package },
  { href: "/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { href: "/invoices", label: "Invoices", icon: FileText },
];

const secondaryNav = [
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavSection({ items, pathname, label }: { items: typeof primaryNav; pathname: string; label?: string }) {
  return (
    <div>
      {label && (
        <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
          {label}
        </p>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#F56600]/[0.08] text-white"
                  : "text-white/55 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-[#F56600]" />
              )}
              <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-[#F56600]" : "text-white/40 group-hover:text-white/70"}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black text-white flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.08]">
        <Image
          src="/brand/logo-dark.svg"
          alt="OpenPay"
          width={200}
          height={48}
          className="h-10 w-auto"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <NavSection items={primaryNav} pathname={pathname} />
        <NavSection items={productNav} pathname={pathname} label="Product" />
        <NavSection items={secondaryNav} pathname={pathname} label="Platform" />
      </nav>

      {/* Logout */}
      <div className="mx-4 border-t border-white/[0.08]" />
      <div className="px-3 py-3">
        <LogoutLink className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/45 hover:text-white hover:bg-white/[0.06] transition-all duration-150 w-full">
          <LogOut className="w-[18px] h-[18px] text-white/35 group-hover:text-white/60" />
          Sign out
        </LogoutLink>
      </div>
    </aside>
  );
}
