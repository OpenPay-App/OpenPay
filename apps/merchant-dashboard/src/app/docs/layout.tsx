"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsSearch } from "@/components/docs-search";
import { CopyPageButton } from "@/components/copy-page-button";
import { DocsTOC } from "@/components/docs-toc";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dynamic breadcrumb layer segments
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

  return (
    <div className="min-h-screen bg-black text-text-primary">
      {/* Top Header Navigation */}
      <header className="border-b border-border/60 bg-black sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/brand/logo-dark.svg"
                alt="OpenPay"
                width={160}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/showcase"
                className="text-text-secondary hover:text-white transition-colors"
              >
                Showcase
              </Link>
              <Link
                href="/docs"
                className="text-white font-semibold"
              >
                Docs
              </Link>
              <Link
                href="/blog"
                className="text-text-secondary hover:text-white transition-colors"
              >
                Blog
              </Link>
              <a
                href="https://github.com/OpenPay-App/openpay/tree/main/templates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-white transition-colors flex items-center gap-0.5"
              >
                Templates <span className="text-xs">↗</span>
              </a>
              <Link
                href="/enterprise"
                className="text-text-secondary hover:text-white transition-colors flex items-center gap-0.5"
              >
                Enterprise <span className="text-xs">↗</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <DocsSearch />
            <a
              href="https://github.com/OpenPay-App/openpay/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-md text-sm font-medium border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              Feedback
            </a>
            <Link
              href="/docs/quickstart"
              className="px-3.5 py-1.5 rounded-md text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors"
            >
              Learn
            </Link>
          </div>
        </div>
      </header>

      {/* Layout Grid matching Next.js */}
      <div className="max-w-full mx-auto px-6 flex justify-between gap-8">
        <DocsSidebar />

        <div className="flex-1 min-w-0 py-8 px-4 max-w-4xl">
          {/* Breadcrumb Layer Nesting + Copy Page inline row */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-text-secondary overflow-x-auto py-1">
              <Link href="/docs" className="hover:text-white transition-colors shrink-0">
                Docs
              </Link>
              {pathSegments.slice(1).map((part, index) => (
                <span key={index} className="flex items-center gap-2 shrink-0">
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                  <span
                    className={
                      index === pathSegments.length - 2
                        ? "text-white font-medium"
                        : "hover:text-white transition-colors"
                    }
                  >
                    {part}
                  </span>
                </span>
              ))}
            </div>

            <div className="shrink-0">
              <CopyPageButton />
            </div>
          </div>

          <main>{children}</main>
        </div>

        <DocsTOC />
      </div>
    </div>
  );
}


