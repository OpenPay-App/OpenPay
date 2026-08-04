"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ children, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = children;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [children]);

  const label = title || language || "Code";

  return (
    <div className="group relative rounded-[8px] bg-white border border-[#e2e2e2] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e2e2] bg-white">
        {/* macOS dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Centered label */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {title && (
            <span className="text-sm font-medium text-[#666666]">{title}</span>
          )}
          {!title && language && (
            <span className="text-sm font-medium text-[#666666] uppercase">
              {language}
            </span>
          )}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-sm font-medium transition-all duration-200 border border-[#e2e2e2] hover:border-[#3898EC] hover:bg-[#3898EC]/5 text-[#666666] hover:text-[#3898EC]"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#40d63b]" />
              <span className="text-[#40d63b]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="p-4 font-mono text-[13px] text-[#333333] overflow-x-auto leading-[1.6] bg-white">
        <code>{children}</code>
      </pre>
    </div>
  );
}
