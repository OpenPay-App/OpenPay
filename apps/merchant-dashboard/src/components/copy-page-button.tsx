"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyPageButton() {
  const [copied, setCopied] = useState(false);

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

  return (
    <button
      onClick={handleCopy}
      title="Copy this page as text"
      aria-label="Copy this page as text"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-white/10 text-text-secondary hover:text-white hover:border-white/25 transition-all"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Copy page</span>
        </>
      )}
    </button>
  );
}
