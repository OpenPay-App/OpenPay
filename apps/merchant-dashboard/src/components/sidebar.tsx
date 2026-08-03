"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/payments", label: "Payments" },
  { href: "/customers", label: "Customers" },
];

const productNav = [
  { href: "/products", label: "Products" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/invoices", label: "Invoices" },
];

const secondaryNav = [
  { href: "/analytics", label: "Analytics" },
  { href: "/admin", label: "Admin" },
  { href: "/settings", label: "Settings" },
];

function NavSection({ items, pathname, label }: { items: typeof primaryNav; pathname: string; label?: string }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {label && (
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 pt-4 pb-1.5 text-left"
        >
          <h5 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            {label}
          </h5>
          <svg
            className={`w-3.5 h-3.5 opacity-30 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5.5 3L10 7.5L5.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {open && (
        <div className="space-y-0.5">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
                  isActive
                    ? "bg-[rgba(85,108,214,0.05)] text-[#556cd6]"
                    : "text-gray-600 hover:text-[#141f41] hover:bg-white/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-[220px] flex-shrink-0 bg-white border-r border-[#e2e2e2] overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#e2e2e2]">
        <Image
          src="/brand/logo.svg"
          alt="AVA"
          width={120}
          height={32}
          className="h-8 w-auto"
        />
      </div>

      {/* Nav */}
      <nav className="px-3 py-3 space-y-1">
        <NavSection items={primaryNav} pathname={pathname} />
        <NavSection items={productNav} pathname={pathname} label="Product" />
        <NavSection items={secondaryNav} pathname={pathname} label="Platform" />
      </nav>
    </aside>
  );
}