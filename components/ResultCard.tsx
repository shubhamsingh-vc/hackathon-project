"use client";

import { useState } from "react";

interface ResultCardProps {
  type: string;
  content: string | string[];
  platform: string;
  tone: string;
}

const typeLabels: Record<string, string> = {
  hook: "Viral Hook",
  caption: "Caption",
  hashtags: "Hashtags",
  script: "Script",
};

export default function ResultCard({ type, content, platform, tone }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = Array.isArray(content)
      ? content.join("\n")
      : content;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Result Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30">
            {typeLabels[type] || type}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#151922] text-[#64748B] border border-[#2A3042]">
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </span>
          {type !== "hashtags" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#151922] text-[#64748B] border border-[#2A3042]">
              {tone}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            copied
              ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
              : "bg-[#1E2330] text-[#F1F5F9] border border-[#2A3042] hover:border-[#6366F1]/50 hover:bg-[#6366F1]/10"
          }`}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Result Content */}
      <div className="card !p-0 overflow-hidden">
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#6366F1] to-[#F59E0B]" />

        <div className="p-6">
          {type === "hashtags" && Array.isArray(content) ? (
            <div className="flex flex-wrap gap-2">
              {content.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-sm font-mono bg-[#1E2330] text-[#F59E0B] border border-[#2A3042] hover:border-[#F59E0B]/40 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : type === "hook" && Array.isArray(content) ? (
            <div className="space-y-4">
              {content.map((hook, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl bg-[#1E2330] border border-[#2A3042] hover:border-[#6366F1]/30 transition-colors"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#6366F1]/15 text-[#6366F1] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-[#F1F5F9] leading-relaxed text-sm">{hook}</p>
                </div>
              ))}
            </div>
          ) : type === "script" && typeof content === "string" ? (
            <div className="space-y-1">
              {content.split("\n").map((line, i) => {
                const isScene = line.startsWith("[") || line.startsWith("(");
                const isTimestamp = /^\[\d+:\d+\]/.test(line.trim());
                const isHook = line.toLowerCase().includes("hook") || i < 3;
                return (
                  <p
                    key={i}
                    className={`leading-relaxed text-sm ${
                      isScene
                        ? "text-[#F59E0B] font-mono text-xs mt-3"
                        : isTimestamp
                        ? "text-[#6366F1] font-mono"
                        : isHook
                        ? "text-[#F1F5F9] font-medium"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {(Array.isArray(content) ? content : content.split("\n")).map((line, i) => (
                <p
                  key={i}
                  className={`leading-relaxed text-sm ${
                    line.trim() === "" ? "h-3" : "text-[#F1F5F9]"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
