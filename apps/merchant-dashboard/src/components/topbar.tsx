"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Bell, Search } from "lucide-react";
import Image from "next/image";

export function Topbar() {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex items-center gap-3 bg-bg-alt rounded-lg px-4 py-2 w-96">
        <Search className="w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search payments, customers..."
          className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-bg-alt transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
        </button>

        <div className="flex items-center gap-3">
          {user?.picture ? (
            <Image
              src={user.picture}
              alt={user.given_name || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-semibold">
              {user?.given_name?.[0] || "U"}
            </div>
          )}
          <div className="text-sm">
            <div className="font-medium text-text-primary">
              {user?.given_name} {user?.family_name}
            </div>
            <div className="text-text-muted text-xs">{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
