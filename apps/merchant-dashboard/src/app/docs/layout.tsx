"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { CopyPageButton } from "@/components/copy-page-button";
import { DocsTOC } from "@/components/docs-toc";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
    <div className="min-h-screen bg-white text-text-primary">
      <div className="max-w-full mx-auto px-6 flex justify-between gap-8">
        <DocsSidebar />

        <div className="flex-1 min-w-0 py-8 px-4 max-w-4xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-text-secondary overflow-x-auto py-1">
              <Link href="/docs" className="hover:text-[#556cd6] transition-colors shrink-0">
                Docs
              </Link>
              {pathSegments.slice(1).map((part, index) => (
                <span key={index} className="flex items-center gap-2 shrink-0">
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                  <span
                    className={
                      index === pathSegments.length - 2
                        ? "text-text-primary font-medium"
                        : "hover:text-text-primary transition-colors"
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