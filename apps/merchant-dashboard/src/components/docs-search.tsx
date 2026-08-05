"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Hash, Search } from "lucide-react";
import { searchDocs, SearchResultItem } from "@/lib/docs-search-engine";

export function DocsSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const groupedResults = useMemo(() => searchDocs(query), [query]);

  const flatResults = useMemo(() => {
    const list: SearchResultItem[] = [];
    for (const group of groupedResults) {
      for (const item of group.items) {
        list.push(item);
      }
    }
    return list;
  }, [groupedResults]);

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
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const target = flatResults[activeIndex];
      if (target) {
        e.preventDefault();
        router.push(target.href);
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    const active = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let globalIndexCounter = 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search documentation (Ctrl+K)"
        className="flex items-center justify-between w-full sm:w-64 px-3 py-2 rounded-xl bg-gray-50/80 border border-gray-200/80 text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm"
      >
        <span className="flex items-center gap-2 text-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="hidden sm:inline font-medium">Search documentation...</span>
          <span className="sm:hidden font-medium">Search...</span>
        </span>
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-[11px] font-semibold text-gray-500 shadow-sm">
          CtrlK
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[8vh] px-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handlePanelKey}
          >
            {/* Header / Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white shrink-0">
              <Search className="w-5 h-5 text-[#3898EC] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="What are you searching for?"
                className="flex-1 bg-transparent text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <kbd
                className="px-2 py-1 rounded-md bg-gray-100 border border-gray-200 text-[11px] font-semibold text-gray-500 shadow-sm cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => setOpen(false)}
              >
                Esc
              </kbd>
            </div>

            {/* Results Container */}
            <div className="bg-gray-50/50 p-3 overflow-y-auto flex-1">
              {flatResults.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-gray-500">
                  No results found for &quot;<span className="font-semibold text-gray-700">{query}</span>&quot;.
                </div>
              ) : (
                <ul ref={listRef} className="space-y-4">
                  {groupedResults.map((group) => (
                    <li key={group.title} className="space-y-1">
                      {/* Document Title Header */}
                      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5 text-[#3898EC]" />
                        <span>{group.title}</span>
                        {group.section && (
                          <span className="text-gray-400 font-normal">
                            · {group.section}
                          </span>
                        )}
                      </div>

                      {/* Items under this Document */}
                      <div className="space-y-1 pl-2">
                        {group.items.map((item) => {
                          const currentIndex = globalIndexCounter++;
                          const isActive = currentIndex === activeIndex;

                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              data-index={currentIndex}
                              onClick={() => setOpen(false)}
                              onMouseEnter={() => setActiveIndex(currentIndex)}
                              className={`flex items-start gap-3 p-3 text-sm rounded-xl transition-all ${
                                isActive
                                  ? "bg-gray-100/90 border border-gray-300 text-gray-900 shadow-sm"
                                  : "bg-white border border-gray-100 text-gray-800 hover:bg-gray-50 hover:border-gray-200"
                              }`}
                            >
                              <div
                                className={`p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors ${
                                  isActive
                                    ? "bg-[#3898EC]/10 text-[#3898EC]"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {item.heading ? (
                                  <Hash className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className={`font-semibold text-sm leading-snug truncate ${
                                  isActive ? "text-gray-900" : "text-gray-800"
                                }`}>
                                  {item.heading || item.title}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.content}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}