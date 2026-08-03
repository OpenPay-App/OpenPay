"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, ExternalLink } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function DocsTOC() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    // Small timeout to allow DOM/React render to complete
    const timer = setTimeout(() => {
      const main = document.querySelector("main");
      if (!main) return;

      const elements = Array.from(main.querySelectorAll("h1, h2, h3"));
      const items: TocItem[] = elements.map((elem, idx) => {
        if (!elem.id) {
          elem.id = `heading-${idx}-${(elem.textContent || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`;
        }
        return {
          id: elem.id,
          text: elem.textContent || "",
          level: elem.tagName.toLowerCase() === "h2" ? 2 : elem.tagName.toLowerCase() === "h3" ? 3 : 1,
        };
      });

      setHeadings(items);

      if (items.length > 0) {
        setActiveId(items[0].id);
      }

      // IntersectionObserver for reliable active scroll highlight
      const observerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      };

      const observerOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      elements.forEach((elem) => observer.observe(elem));

      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  const scrollToHeading = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      const top = elem.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (headings.length === 0) return null;

  return (
    <aside className="w-64 shrink-0 hidden xl:block sticky top-14 self-start max-h-[calc(100vh-4rem)] overflow-y-auto pl-4 border-l border-[#e2e2e2] text-sm py-8">
      <p className="font-semibold text-gray-900 mb-3 text-sm">On this page</p>
      <ul className="space-y-2">

        {headings.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: item.level === 3 ? "0.85rem" : "0" }}
          >
            <button
              onClick={() => scrollToHeading(item.id)}
              className={`text-left block w-full truncate transition-all text-xs leading-relaxed ${
                activeId === item.id
                  ? "text-[#3898EC] font-semibold pl-1"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-4 border-t border-[#e2e2e2]/40 space-y-2.5 text-xs text-gray-500">
        <a
          href="https://github.com/OpenPay-App/openpay"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-[#3898EC] transition-colors"
        >
          <span>Edit this page on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 hover:text-gray-900 transition-colors text-left"
        >
          <span>Scroll to top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}


