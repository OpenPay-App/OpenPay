"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { Check, Copy, ChevronDown, FileCode, Bot, Sparkles, MessageSquare } from "lucide-react";

export function CopyPageButton() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(async () => {
    const main = document.querySelector("main");
    if (!main) return;
    const text = main.innerText;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleAiAction = useCallback((target: "v0" | "claude" | "chatgpt" | "markdown") => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const promptMessage = `Read from this URL: ${currentUrl} and explain it to me.`;
    const encodedPrompt = encodeURIComponent(promptMessage);

    if (target === "markdown") {
      const main = document.querySelector("main");
      const text = main ? main.innerText : "";
      const blob = new Blob([text], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${window.location.pathname.replace(/\//g, "-") || "page"}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (target === "v0") {
      window.open(`https://v0.dev/chat?q=${encodedPrompt}`, "_blank");
    } else if (target === "claude") {
      window.open(`https://claude.ai/new?q=${encodedPrompt}`, "_blank");
    } else if (target === "chatgpt") {
      window.open(`https://chatgpt.com/?q=${encodedPrompt}`, "_blank");
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <div className="inline-flex items-center rounded-md border border-white/10 bg-[#0a0a0a] text-xs font-medium overflow-hidden divide-x divide-white/10 hover:border-white/20 transition-colors">
        <button
          onClick={handleCopy}
          title="Copy this page as text"
          className="flex items-center gap-1.5 px-3 py-1.5 text-text-secondary hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy page</span>
            </>
          )}
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="More copy options"
          className="px-1.5 py-1.5 text-text-secondary hover:text-white transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            onClick={() => handleAiAction("markdown")}
            className="w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-colors group"
          >
            <FileCode className="w-4 h-4 text-text-secondary group-hover:text-white mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">View as Markdown</div>
              <div className="text-[11px] text-text-secondary">Open this page in Markdown</div>
            </div>
          </button>

          <button
            onClick={() => handleAiAction("v0")}
            className="w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-colors group"
          >
            <Sparkles className="w-4 h-4 text-text-secondary group-hover:text-white mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">Open in v0</div>
              <div className="text-[11px] text-text-secondary">Ask questions about this page</div>
            </div>
          </button>

          <button
            onClick={() => handleAiAction("claude")}
            className="w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-colors group"
          >
            <Bot className="w-4 h-4 text-text-secondary group-hover:text-white mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">Open in Claude</div>
              <div className="text-[11px] text-text-secondary">Ask questions about this page</div>
            </div>
          </button>

          <button
            onClick={() => handleAiAction("chatgpt")}
            className="w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-colors group"
          >
            <MessageSquare className="w-4 h-4 text-text-secondary group-hover:text-white mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">Open in ChatGPT</div>
              <div className="text-[11px] text-text-secondary">Ask questions about this page</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

