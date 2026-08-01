"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Search } from "lucide-react";
import { navigation } from "@/components/docs-sidebar";

interface SearchEntry {
  label: string;
  href: string;
  section: string;
}

function flattenNav(
  items: typeof navigation,
  section = ""
): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const item of items) {
    if (item.href && !item.children) {
      out.push({ label: item.label, href: item.href, section });
    }
    if (item.children) {
      out.push(...flattenNav(item.children, item.label));
    }
  }
  return out;
}

export function DocsSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const entries = useMemo(() => flattenNav(navigation), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) =>
      `${e.section} ${e.label}`.toLowerCase().includes(q)
    );
  }, [query, entries]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    document.body.style.overflow = "hidden";
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const handlePanelKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const target = results[activeIndex];
      if (target) {
        e.preventDefault();
        router.push(target.href);
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    const active = listRef.current?.children[activeIndex];
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search documentation (Ctrl+K)"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-text-secondary hover:text-white hover:border-white/25 transition-all"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline text-sm">Search docs</span>
        <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-text-muted">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            className="w-full max-w-xl rounded-xl border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handlePanelKey}
          >
            <div className="flex items-center gap-3 px-4 border-b border-white/10">
              <Search className="w-4 h-4 text-text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Search docs…"
                className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder:text-text-muted focus:outline-none"
              />
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-text-muted">
                ESC
              </kbd>
            </div>
            <ul ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-4 py-3 text-sm text-text-muted">
                  No matching pages.
                </li>
              )}
              {results.map((entry, i) => (
                <li
                  key={entry.href}
                  className={`${
                    i === activeIndex ? "bg-white/5" : ""
                  } transition-colors`}
                >
                  <Link
                    href={entry.href}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm"
                  >
                    <FileText className="w-4 h-4 text-text-muted shrink-0" />
                    <div className="min-w-0">
                      <div
                        className={
                          i === activeIndex
                            ? "text-secondary"
                            : "text-white"
                        }
                      >
                        {entry.label}
                      </div>
                      {entry.section && (
                        <div className="text-xs text-text-muted">
                          {entry.section}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
