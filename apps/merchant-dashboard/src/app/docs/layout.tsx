import Link from "next/link";
import Image from "next/image";
import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo.svg"
              alt="OpenPay"
              width={180}
              height={45}
              className="h-9 w-auto"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="text-sm text-secondary font-medium"
            >
              Docs
            </Link>
            <Link
              href="/changelog"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Changelog
            </Link>
            <Link
              href="/status"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Status
            </Link>
            <a
              href="https://github.com/OpenPay-App/OpenPay"
              target="_blank"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        <DocsSidebar />
        <main className="flex-1 min-w-0 max-w-4xl px-8 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
