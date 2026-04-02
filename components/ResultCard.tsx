"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ResultCardProps {
  type: string;
  content: string | string[];
  platform: string;
  tone: string;
  topic: string;
  creatorProfile?: {
    niche: string;
    targetAudience: string;
    goals: string[];
  };
}

// ─── Individual Copy Button ───
function CopyChip({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-300 cursor-pointer ${
        copied
          ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]"
          : "bg-white/5 text-[#6B7280] border-white/10 hover:text-[#FAFAFA] hover:border-white/20"
      }`}
    >
      {copied ? (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label || "Copy"}
        </>
      )}
    </button>
  );
}

// ─── Hashtags Output ───
function HashtagsOutput({ content }: { content: string[] }) {
  const allTags = content.join(" ");
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(allTags).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = allTags;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#A855F7] uppercase tracking-wider">Hashtags</span>
          <span className="text-[11px] text-[#6B7280]">{content.length} tags</span>
        </div>
        <button
          type="button"
          onClick={handleCopyAll}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-300 cursor-pointer ${
            copiedAll
              ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]"
              : "bg-white/5 text-[#6B7280] border-white/10 hover:text-[#FAFAFA] hover:border-white/20"
          }`}
        >
          {copiedAll ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied All!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy All
            </>
          )}
        </button>
      </div>

      {/* Tags Grid */}
      <div className="flex flex-wrap gap-2">
        {content.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full text-[13px] font-mono font-medium bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.2)] text-[#A855F7] hover:bg-[rgba(168,85,247,0.15)] hover:border-[rgba(168,85,247,0.4)] transition-all duration-300 cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hooks Output ───
function HooksOutput({ content }: { content: string[] }) {
  const hookTypes = ["Story Hook", "Stat Hook", "Question Hook", "Bold Claim"];

  return (
    <div className="space-y-3">
      {content.map((hook, i) => {
        const hookLabel = hookTypes[i] || `Hook ${i + 1}`;
        const isQuestion = hook.includes("?");
        const hasStat = /\d+%|\d+K|\$\d/.test(hook);
        const hookStyle = isQuestion ? "question" : hasStat ? "stat" : "bold";

        return (
          <div
            key={i}
            className="group relative rounded-2xl p-5 bg-[rgba(124,58,237,0.06)] border border-[rgba(124,58,237,0.15)] hover:border-[rgba(124,58,237,0.35)] hover:bg-[rgba(124,58,237,0.1)] transition-all duration-500"
            style={{ boxShadow: "0 0 20px rgba(124,58,237,0.05)" }}
          >
            {/* Label */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "rgba(124,58,237,0.2)", color: "#A855F7" }}
                >
                  {i + 1}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#A855F7" }}>
                  {hookLabel}
                </span>
                {hookStyle === "question" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(16,185,129,0.1)] text-[#10B981] border border-[rgba(16,185,129,0.2)]">?</span>
                )}
                {hookStyle === "stat" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]">%</span>
                )}
              </div>
              <CopyChip text={hook} />
            </div>

            {/* Hook Text */}
            <p className="text-[15px] text-[#E5E7EB] leading-relaxed font-medium">
              {hook}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Caption Output ───
function CaptionOutput({ content }: { content: string }) {
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  const totalChars = content.length;
  const isLong = totalChars > 200;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#6366F1" }}>Caption</span>
          <span className="text-[11px] text-[#6B7280]">{totalChars} characters</span>
          {isLong && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(99,102,241,0.1)] text-[#6366F1] border border-[rgba(99,102,241,0.2)]">
              Long form
            </span>
          )}
        </div>
        <CopyChip text={content} label="Full Copy" />
      </div>

      {/* Caption Lines */}
      <div className="space-y-1">
        {lines.map((line, i) => {
          const isEmoji = /^[\p{Emoji}]+$/u.test(line.trim());
          const isEllipsis = line.trim() === "..." || line.trim() === "…";
          const isCTA = /\b(link|bio|follow|comment|share|save|tag)\b/i.test(line);
          const isHashtag = line.trim().startsWith("#");

          return (
            <p
              key={i}
              className={`text-[14px] leading-relaxed transition-colors duration-300 ${
                isEmoji ? "text-2xl" : isEllipsis ? "text-[#6B7280]" : isCTA ? "text-[#10B981] font-medium" : isHashtag ? "text-[#A855F7]" : "text-[#E5E7EB]"
              }`}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

// ─── Script Output ───
interface ScriptLine {
  type: "timestamp" | "scene" | "hook" | "cta" | "body" | "blank";
  text: string;
  timestamp?: string;
}

function parseScript(content: string): ScriptLine[] {
  const lines = content.split("\n");
  const result: ScriptLine[] = [];
  let hookCount = 0;
  let bodyStarted = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      result.push({ type: "blank", text: line });
      continue;
    }

    const timestampMatch = trimmed.match(/^\[(\d+:\d+)\]/);
    if (timestampMatch) {
      result.push({ type: "timestamp", text: trimmed, timestamp: timestampMatch[1] });
      continue;
    }

    const isScene = /^\[|^🎬|^\(.*\)$/.test(trimmed);
    if (isScene) {
      result.push({ type: "scene", text: trimmed });
      continue;
    }

    // First 2-3 non-blank non-scene lines are the hook
    if (!bodyStarted && hookCount < 3) {
      result.push({ type: "hook", text: trimmed });
      hookCount++;
      bodyStarted = true;
      continue;
    }

    // Last 1-2 lines are CTA
    const remaining = lines.slice(i).filter((l) => l.trim());
    if (remaining.length <= 2 && !trimmed.startsWith("[")) {
      result.push({ type: "cta", text: trimmed });
      continue;
    }

    result.push({ type: "body", text: trimmed });
  }

  return result;
}

function ScriptOutput({ content }: { content: string }) {
  const lines = parseScript(content);
  const totalChars = content.length;

  const getDuration = () => {
    const timestamps = content.match(/\d+:\d+/g);
    if (!timestamps || timestamps.length < 2) return null;
    return "15–60s";
  };

  const duration = getDuration();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Script</span>
          <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
          {duration && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(139,92,246,0.1)] text-[#8B5CF6] border border-[rgba(139,92,246,0.2)]">
              {duration}
            </span>
          )}
        </div>
        <CopyChip text={content} label="Full Script" />
      </div>

      {/* Script Lines */}
      <div className="space-y-0.5 font-mono text-[13px]">
        {lines.map((line, i) => {
          if (line.type === "blank") {
            return <div key={i} className="h-2" />;
          }

          if (line.type === "timestamp") {
            return (
              <div key={i} className="flex items-center gap-3 mt-3 mb-1">
                <span
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono"
                  style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8" }}
                >
                  {line.timestamp}
                </span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }} />
              </div>
            );
          }

          if (line.type === "scene") {
            return (
              <div
                key={i}
                className="flex items-center gap-2 py-2 text-[12px] italic"
                style={{ color: "rgba(168,85,247,0.7)" }}
              >
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#A855F7" }} />
                {line.text.replace(/^\[|]$/g, "")}
              </div>
            );
          }

          if (line.type === "hook") {
            return (
              <div
                key={i}
                className="group flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "rgba(124,58,237,0.25)", color: "#A855F7" }}
                >
                  ⚡
                </span>
                <div className="flex-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest mb-1 block" style={{ color: "#A855F7" }}>
                    Hook
                  </span>
                  <span className="text-[#FAFAFA] font-semibold leading-relaxed">{line.text}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                  <CopyChip text={line.text} />
                </div>
              </div>
            );
          }

          if (line.type === "cta") {
            return (
              <div
                key={i}
                className="group flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}
              >
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
                >
                  →
                </span>
                <div className="flex-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest mb-1 block" style={{ color: "#10B981" }}>
                    Call to Action
                  </span>
                  <span className="text-[#10B981] font-medium leading-relaxed">{line.text}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                  <CopyChip text={line.text} />
                </div>
              </div>
            );
          }

          // body
          return (
            <div key={i} className="group flex items-start gap-3 py-1 pl-4 hover:bg-white/[0.02] rounded transition-colors duration-300">
              <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#4B5563" }} />
              <span className="text-[#9CA3AF] leading-relaxed">{line.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ResultCard ───
const TYPE_META: Record<string, { label: string; color: string }> = {
  hook: { label: "Viral Hook", color: "#7C3AED" },
  caption: { label: "Caption", color: "#6366F1" },
  hashtags: { label: "Hashtags", color: "#A855F7" },
  script: { label: "Script", color: "#8B5CF6" },
};

export default function ResultCard({ type, content, platform, tone, topic, creatorProfile }: ResultCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopyAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = Array.isArray(content) ? content.join("\n") : content;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setSaving(true);
    const saveData = {
      type,
      platform,
      tone,
      topic,
      content,
      creatorProfile,
      savedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return;
      }
      throw new Error("API failed");
    } catch {
      try {
        const existing = JSON.parse(localStorage.getItem("contentcraft_saved") || "[]");
        const newItem = { _id: `local_${Date.now()}`, ...saveData };
        existing.unshift(newItem);
        localStorage.setItem("contentcraft_saved", JSON.stringify(existing.slice(0, 100)));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        // silent fail
      }
    } finally {
      setSaving(false);
    }
  };

  const meta = TYPE_META[type] || { label: type, color: "#7C3AED" };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="eyebrow"
            style={{ borderColor: `${meta.color}40`, color: meta.color, background: `${meta.color}12` }}
          >
            {meta.label}
          </span>
          <span className="eyebrow">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
          {type !== "hashtags" && <span className="eyebrow">{tone}</span>}
          {creatorProfile?.niche && (
            <span
              className="eyebrow"
              style={{ borderColor: "rgba(124,58,237,0.3)", color: "#A855F7", background: "rgba(124,58,237,0.08)" }}
            >
              {creatorProfile.niche}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save button */}
          {session && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-500 ${
                saved
                  ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]"
                  : "bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
              }`}
            >
              {saving ? (
                <>
                  <span className="spinner !w-3 !h-3" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  Save
                </>
              )}
            </button>
          )}

          {!session && (
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-500 bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Save
            </button>
          )}

          {/* Copy All button */}
          <button
            type="button"
            onClick={handleCopyAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-500 ${
              copied
                ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]"
                : "bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
            }`}
          >
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bezel-outer">
        <div className="bezel-inner">
          <div
            className="h-px w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${meta.color}80, transparent)` }}
          />
          <div className="p-7">
            {type === "hashtags" && Array.isArray(content) && (
              <HashtagsOutput content={content} />
            )}
            {type === "hook" && Array.isArray(content) && (
              <HooksOutput content={content} />
            )}
            {type === "caption" && !Array.isArray(content) && (
              <CaptionOutput content={content} />
            )}
            {type === "script" && !Array.isArray(content) && (
              <ScriptOutput content={content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
