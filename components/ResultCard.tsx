"use client";

import { useState, useRef } from "react";
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
  duration?: string;
  onRegenerate?: (newContent: string | string[]) => void;
}

// ─── Shimmer Gradient Border wrapper ───
function ShimmerBorder({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "#0A0A0A",
        boxShadow: `0 0 0 1px ${accent}15, 0 8px 40px rgba(0,0,0,0.6), 0 0 60px ${accent}08`,
      }}
    >
      {/* Animated shimmer line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}60 40%, ${accent} 50%, ${accent}60 60%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 2.5s ease-in-out infinite",
        }}
      />
      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}20, transparent)` }}
      />
      {/* Corner accent dots */}
      <div
        className="absolute top-0 left-0 w-16 h-16 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${accent}30 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-0 right-0 w-16 h-16 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${accent}30 0%, transparent 70%)`,
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

// ─── Reusable Copy Button ───
function CopyBtn({ text, label }: { text: string; label?: string }) {
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-300 cursor-pointer ${
        copied
          ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]"
          : "bg-white/5 border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/25 hover:bg-white/8"
      }`}
    >
      {copied ? (
        <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied</>
      ) : (
        <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>{label || "Copy"}</>
      )}
    </button>
  );
}

// ─── Hashtags Output ───
function HashtagsOutput({ content }: { content: string[] }) {
  const allTags = content.join(" ");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const categorize = (tag: string) => {
    const t = tag.toLowerCase();
    const trending = ["fyp", "foryou", "foryoupage", "viral", "trending", "explore", "reels", "shorts", "tiktok", "fypシ", "シ"];
    if (trending.some((tr) => t.includes(tr))) return "trending";
    if (tag.length > 16) return "niche";
    return "regular";
  };

  const trending = content.filter((t) => categorize(t) === "trending");
  const niche = content.filter((t) => categorize(t) === "niche");
  const regular = content.filter((t) => categorize(t) === "regular");

  const catMeta: Record<string, { accent: string; bg: string; label: string; icon: string }> = {
    trending: { accent: "#F87171", bg: "rgba(239,68,68,0.07)", label: "Trending", icon: "🔥" },
    regular: { accent: "#A855F7", bg: "rgba(168,85,247,0.07)", label: "Popular", icon: "⭐" },
    niche: { accent: "#34D399", bg: "rgba(16,185,129,0.07)", label: "Niche", icon: "🎯" },
  };

  const TagBadge = ({ tag }: { tag: string }) => {
    const cat = categorize(tag);
    const meta = catMeta[cat];
    const isCopied = copiedTag === tag;

    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigator.clipboard.writeText(tag);
          setCopiedTag(tag);
          setTimeout(() => setCopiedTag(null), 1500);
        }}
        className="relative px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap"
        style={{
          background: meta.bg,
          border: `1px solid ${meta.accent}30`,
          color: meta.accent,
          boxShadow: `0 0 0 0 ${meta.accent}00`,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.boxShadow = `0 0 16px ${meta.accent}25, 0 4px 12px rgba(0,0,0,0.4)`;
          el.style.transform = "translateY(-2px) scale(1.02)";
          el.style.borderColor = `${meta.accent}50`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.boxShadow = `0 0 0 0 ${meta.accent}00`;
          el.style.transform = "translateY(0) scale(1)";
          el.style.borderColor = `${meta.accent}30`;
        }}
      >
        {isCopied ? (
          <span className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Copied
          </span>
        ) : (
          tag
        )}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[15px] font-bold"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.08))",
              color: "#A855F7",
              border: "1px solid rgba(168,85,247,0.2)",
              boxShadow: "0 0 20px rgba(168,85,247,0.15)",
            }}
          >
            #
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#A855F7" }}>Hashtags</div>
            <div className="text-[11px] text-[#6B7280]">{content.length} tags · tap to copy</div>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(allTags); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-300 ${
            copiedAll
              ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]"
              : "bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
          }`}
        >
          {copiedAll ? (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
          ) : (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy All</>
          )}
        </button>
      </div>

      {/* Tag Groups */}
      {(["trending", "regular", "niche"] as const).map((cat) => {
        const tags = cat === "trending" ? trending : cat === "regular" ? regular : niche;
        if (tags.length === 0) return null;
        const meta = catMeta[cat];
        return (
          <div key={cat} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[13px]">{meta.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.accent }}>{meta.label}</span>
              <div className="flex-1 h-px" style={{ background: `${meta.accent}15` }} />
              <span className="text-[10px] font-mono" style={{ color: `${meta.accent}60` }}>{tags.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => <TagBadge key={i} tag={tag} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Hooks Output ───
function HooksOutput({ content }: { content: string[] }) {
  const hookMeta = [
    { label: "Story Hook", icon: "📖", accent: "#A855F7", glow: "rgba(168,85,247,0.25)", bg: "rgba(168,85,247,0.06)", border: "rgba(168,85,247,0.15)" },
    { label: "Stat Hook", icon: "📊", accent: "#F59E0B", glow: "rgba(245,158,11,0.25)", bg: "rgba(245,158,11,0.05)", border: "rgba(245,158,11,0.15)" },
    { label: "Question Hook", icon: "❓", accent: "#10B981", glow: "rgba(16,185,129,0.25)", bg: "rgba(16,185,129,0.05)", border: "rgba(16,185,129,0.15)" },
    { label: "Bold Hook", icon: "🔥", accent: "#EF4444", glow: "rgba(239,68,68,0.25)", bg: "rgba(239,68,68,0.05)", border: "rgba(239,68,68,0.15)" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid rgba(168,85,247,0.08)" }}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#A855F7]">Viral Hooks</div>
        <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.08)" }} />
        <span className="text-[10px] text-[#6B7280]">{content.length} options</span>
      </div>

      {content.map((hook, i) => {
        const meta = hookMeta[i % hookMeta.length];

        return (
          <div
            key={i}
            className="group relative rounded-2xl p-5 transition-all duration-500 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${meta.bg}, transparent)`,
              border: `1px solid ${meta.border}`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = `${meta.accent}40`;
              el.style.boxShadow = `0 0 30px ${meta.glow}, inset 0 1px 0 ${meta.accent}20`;
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = meta.border;
              el.style.boxShadow = "none";
              el.style.transform = "translateY(0)";
            }}
          >
            {/* Ambient glow at bottom-left */}
            <div
              className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
                opacity: 0.5,
              }}
            />

            {/* Header row */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[15px]"
                  style={{
                    background: `linear-gradient(135deg, ${meta.accent}25, ${meta.accent}10)`,
                    color: meta.accent,
                    border: `1px solid ${meta.accent}30`,
                    boxShadow: `0 0 15px ${meta.accent}20`,
                  }}
                >
                  {meta.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.accent }}>{meta.label}</div>
                  <div className="text-[10px] text-[#6B7280] font-mono">#{i + 1}</div>
                </div>
              </div>
              <CopyBtn text={hook} />
            </div>

            {/* Hook text — large, glowing */}
            <p
              className="text-[16px] leading-relaxed font-semibold relative z-10 pr-6"
              style={{
                color: meta.accent,
                textShadow: `0 0 40px ${meta.glow}, 0 0 2px ${meta.accent}50`,
              }}
            >
              {hook}
            </p>

            {/* Hover reveal: gradient overlay at bottom */}
            <div
              className="absolute inset-x-0 bottom-0 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(to top, ${meta.bg}, transparent)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Caption Output ───
function CaptionOutput({ content }: { content: string }) {
  const lines = content.split("\n").filter((l) => l.trim() !== "");
  const totalChars = content.length;
  const isLongForm = totalChars > 200;

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 mb-3" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[14px]"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.06))",
              color: "#818CF8",
              border: "1px solid rgba(99,102,241,0.2)",
              boxShadow: "0 0 20px rgba(99,102,241,0.15)",
            }}
          >
            ✍
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#6366F1" }}>Caption</div>
            <div className="text-[11px] text-[#6B7280]">{totalChars} characters</div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isLongForm && (
            <span
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(99,102,241,0.1)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              Long Form
            </span>
          )}
          <CopyBtn text={content} label="Copy" />
        </div>
      </div>

      {/* Caption lines */}
      <div className="space-y-4">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          const isEmoji = /^[\p{Emoji}\s]+$/u.test(trimmed) && trimmed.length <= 12;
          const isEllipsis = trimmed === "..." || trimmed === "…";
          const isCTA = /\b(link in bio|follow|comment|share|save this|link|bio|dm me|tag a friend|follow for more|subscribe)\b/i.test(trimmed);
          const isHashtag = /(^|\s)#\w/.test(line);
          const isMention = /@[\w]+/.test(trimmed);
          const isBold = /^\*\*.+\*\*$/.test(trimmed);
          const isFirst = i === 0;

          if (isEmoji) {
            return (
              <p key={i} className="text-4xl leading-none" style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.4))" }}>
                {trimmed}
              </p>
            );
          }

          if (isEllipsis) {
            return (
              <div key={i} className="flex items-center justify-center gap-1 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]/20" />
              </div>
            );
          }

          if (isCTA) {
            return (
              <p
                key={i}
                className="text-[14px] leading-relaxed font-semibold"
                style={{ color: "#10B981", textShadow: "0 0 25px rgba(16,185,129,0.3)", padding: "6px 0" }}
              >
                {line}
              </p>
            );
          }

          if (isBold) {
            return (
              <p key={i} className="text-[15px] leading-relaxed font-bold" style={{ color: "#FAFAFA" }}>
                {trimmed.replace(/\*\*/g, "")}
              </p>
            );
          }

          if (isHashtag) {
            const parts = line.split(/(\s+#\w+\S*)/g);
            return (
              <p key={i} className="text-[13px] leading-relaxed">
                {parts.map((part, pi) =>
                  part.match(/^\s*#/) ? (
                    <span key={pi} className="font-semibold" style={{ color: "#A855F7" }}>{part}</span>
                  ) : (
                    <span key={pi} style={{ color: "rgba(168,85,247,0.5)" }}>{part}</span>
                  )
                )}
              </p>
            );
          }

          if (isMention) {
            return (
              <p key={i} className="text-[14px] leading-relaxed" style={{ color: "#818CF8" }}>
                {line}
              </p>
            );
          }

          // First line = lead, gets special treatment
          if (isFirst) {
            return (
              <p key={i} className="text-[16px] leading-relaxed font-medium" style={{ color: "#F3F4F6" }}>
                {line}
              </p>
            );
          }

          return (
            <p key={i} className="text-[14px] leading-relaxed" style={{ color: "#D1D5DB" }}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

// ─── Script Output ───
type ScriptItem =
  | { kind: "timestamp"; text: string }
  | { kind: "scene"; text: string }
  | { kind: "hook"; text: string }
  | { kind: "cta"; text: string }
  | { kind: "body"; text: string }
  | { kind: "divider"; label: string };

function parseScriptItems(content: string): ScriptItem[] {
  const rawLines = content.split("\n");
  const items: ScriptItem[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i].trim();
    i++;
    if (!line) continue;

    const tsMatch = line.match(/^\[(\d+:\d+)\]$/);
    if (tsMatch) { items.push({ kind: "timestamp", text: tsMatch[1] }); continue; }

    if (/^\[.+\]$/.test(line)) {
      const clean = line.slice(1, -1).trim();
      if (/^(HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT)\s*$/i.test(clean)) continue;
      items.push({ kind: "scene", text: clean }); continue;
    }

    const labelMatch = line.match(/^(HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT)\s*[:.\-]?\s*$/i);
    if (labelMatch) {
      const label = labelMatch[1].toUpperCase();
      if (label === "CTA") items.push({ kind: "divider", label: "Call to Action" });
      else if (label === "HOOK") items.push({ kind: "divider", label: "Hook" });
      else if (label === "INTRO" || label === "OUTRO") items.push({ kind: "divider", label });
      else items.push({ kind: "divider", label: "Body" });
      continue;
    }

    const labelContentMatch = line.match(/^(HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT)\s*[:.\-]\s*(.+)/i);
    if (labelContentMatch) {
      const label = labelContentMatch[1].toUpperCase();
      const text = labelContentMatch[2].trim();
      if (label === "CTA" && text) items.push({ kind: "cta", text });
      else if (label === "HOOK" && text) items.push({ kind: "hook", text });
      else if (text) items.push({ kind: "body", text });
      continue;
    }

    const origLine = rawLines[i - 1].trim();
    const stripped = origLine.replace(/^(HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT)\s*[:.\-]\s*/i, "").trim();
    if (!stripped) continue;

    const isCTA = /\b(subscribe|follow|comment|share|save|link in bio|like|hit|check out|visit|tap|dm|tag)\b/i.test(stripped);
    if (isCTA) { items.push({ kind: "cta", text: stripped }); continue; }

    const isHook =
      /^(did you|what if|i tried|i spent|i make|i'll show|here'?s|you'?ll never|this is|stop|stuck|can'?t believe)/i.test(stripped) ||
      /(!{2,}|[\d,]+[\s\w]+(?:people|views|followers|subscribers)|^\d+%|\$[\d,]+k?)/.test(stripped) ||
      (stripped.length < 80 && /^[A-Z]/.test(stripped));
    if (isHook) { items.push({ kind: "hook", text: stripped }); continue; }

    items.push({ kind: "body", text: stripped });
  }

  return items;
}

function ScriptOutput({ content }: { content: string }) {
  const items = parseScriptItems(content);
  const totalChars = content.length;

  if (items.length === 0) {
    const rawLines = content.split("\n").filter((l) => l.trim());
    if (rawLines.length === 0) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-4 mb-3" style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold" style={{ background: "rgba(139,92,246,0.15)", color: "#A78BFA" }}>✍</div>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Script</span>
          <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
          <CopyBtn text={content} label="Copy" />
        </div>
        {rawLines.map((line, i) => (
          <p key={i} className="text-[15px] text-[#E5E7EB] leading-relaxed">{line.trim()}</p>
        ))}
      </div>
    );
  }

  const dividerMeta: Record<string, { accent: string; bg: string; glow: string; icon: string }> = {
    Hook: { accent: "#A855F7", bg: "rgba(168,85,247,0.08)", glow: "rgba(168,85,247,0.2)", icon: "⚡" },
    "Call to Action": { accent: "#10B981", bg: "rgba(16,185,129,0.08)", glow: "rgba(16,185,129,0.2)", icon: "→" },
    INTRO: { accent: "#6366F1", bg: "rgba(99,102,241,0.06)", glow: "rgba(99,102,241,0.15)", icon: "▶" },
    OUTRO: { accent: "#F59E0B", bg: "rgba(245,158,11,0.06)", glow: "rgba(245,158,11,0.15)", icon: "■" },
    Body: { accent: "#8B5CF6", bg: "rgba(139,92,246,0.04)", glow: "rgba(139,92,246,0.1)", icon: "◆" },
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 mb-3" style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.06))",
            color: "#A78BFA",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 0 20px rgba(139,92,246,0.15)",
          }}
        >
          ✍
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#8B5CF6" }}>Script</div>
          <div className="text-[11px] text-[#6B7280]">{totalChars} characters</div>
        </div>
        <div className="ml-auto">
          <CopyBtn text={content} label="Copy Script" />
        </div>
      </div>

      {/* Script items */}
      <div className="space-y-2">
        {items.map((item, i) => {
          // ── Section divider ──
          if (item.kind === "divider") {
            const meta = dividerMeta[item.label] || dividerMeta["Body"];
            return (
              <div key={i} className="flex items-center gap-3 pt-4 pb-1">
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}30)` }} />
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest"
                  style={{
                    color: meta.accent,
                    background: meta.bg,
                    border: `1px solid ${meta.accent}30`,
                    boxShadow: `0 0 20px ${meta.glow}, inset 0 1px 0 ${meta.accent}15`,
                  }}
                >
                  <span className="text-[13px]">{meta.icon}</span>
                  {item.label}
                </div>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${meta.accent}30, transparent)` }} />
              </div>
            );
          }

          // ── Timestamp badge ──
          if (item.kind === "timestamp") {
            return (
              <div key={i} className="flex items-center gap-3 mt-1">
                <span
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.06))",
                    color: "#818CF8",
                    border: "1px solid rgba(99,102,241,0.25)",
                    boxShadow: "0 0 15px rgba(99,102,241,0.15)",
                  }}
                >
                  {item.text}
                </span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }} />
              </div>
            );
          }

          // ── Scene cue ──
          if (item.kind === "scene") {
            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 px-4 rounded-xl my-1"
                style={{
                  background: "rgba(168,85,247,0.05)",
                  border: "1px solid rgba(168,85,247,0.12)",
                }}
              >
                <span className="text-[12px] flex-shrink-0" style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,0.5))" }}>🎬</span>
                <span className="text-[12px] italic leading-relaxed" style={{ color: "rgba(168,85,247,0.6)" }}>{item.text}</span>
              </div>
            );
          }

          // ── Hook card ──
          if (item.kind === "hook") {
            return (
              <div
                key={i}
                className="group relative rounded-2xl p-5 transition-all duration-500 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(168,85,247,0.04))",
                  border: "1px solid rgba(168,85,247,0.2)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(168,85,247,0.45)";
                  el.style.boxShadow = "0 0 40px rgba(168,85,247,0.25), inset 0 1px 0 rgba(168,85,247,0.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(168,85,247,0.2)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(168,85,247,0.15) 0%, transparent 60%)" }} />
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold" style={{ background: "rgba(168,85,247,0.2)", color: "#A855F7", boxShadow: "0 0 12px rgba(168,85,247,0.3)" }}>⚡</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#A855F7" }}>Hook</span>
                </div>
                <div className="flex items-start gap-3 relative z-10">
                  <span className="text-[15px] text-[#FAFAFA] font-semibold leading-relaxed flex-1" style={{ textShadow: "0 0 30px rgba(168,85,247,0.2)" }}>{item.text}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-0.5">
                    <CopyBtn text={item.text} />
                  </div>
                </div>
              </div>
            );
          }

          // ── CTA card ──
          if (item.kind === "cta") {
            return (
              <div
                key={i}
                className="group relative rounded-2xl p-5 transition-all duration-500 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.04))",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(16,185,129,0.4)";
                  el.style.boxShadow = "0 0 40px rgba(16,185,129,0.2), inset 0 1px 0 rgba(16,185,129,0.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(16,185,129,0.18)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(16,185,129,0.12) 0%, transparent 60%)" }} />
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", boxShadow: "0 0 12px rgba(16,185,129,0.2)" }}>→</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#10B981" }}>Call to Action</span>
                </div>
                <div className="flex items-start gap-3 relative z-10">
                  <span className="text-[15px] font-semibold leading-relaxed flex-1" style={{ color: "#10B981", textShadow: "0 0 25px rgba(16,185,129,0.3)" }}>{item.text}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-0.5">
                    <CopyBtn text={item.text} />
                  </div>
                </div>
              </div>
            );
          }

          // ── Body line ──
          return (
            <div
              key={i}
              className="group flex items-start gap-4 py-2.5 px-4 rounded-xl transition-all duration-300"
              style={{}}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(139,92,246,0.04)";
                el.style.borderRadius = "10px";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "transparent";
              }}
            >
              <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ background: "rgba(139,92,246,0.4)" }} />
                <span className="w-px h-3 mt-1" style={{ background: "rgba(139,92,246,0.15)" }} />
              </div>
              <span className="text-[15px] text-[#D1D5DB] leading-relaxed flex-1 pt-0.5">{item.text}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                <CopyBtn text={item.text} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Edit Overlay ───
function EditOverlay({ content, type, onSave, onCancel }: { content: string | string[]; type: string; onSave: (newContent: string | string[]) => void; onCancel: () => void }) {
  const isArray = Array.isArray(content);
  const editText = isArray ? content.join("\n") : content;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState(editText);

  const handleChange = (val: string) => {
    setDraft(val);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSave = () => {
    if (isArray) {
      const lines = draft.split("\n").map((l) => l.trim()).filter(Boolean);
      onSave(lines);
    } else {
      onSave(draft);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: "#F59E0B", boxShadow: "0 0 8px #F59E0B" }} />
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#F59E0B]">Editing Mode</span>
      </div>
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-[rgba(245,158,11,0.04)] border border-[rgba(245,158,11,0.3)] rounded-xl p-4 text-[14px] text-[#E5E7EB] leading-relaxed resize-none outline-none focus:border-[rgba(245,158,11,0.6)] transition-colors duration-300"
        style={{ minHeight: "200px" }}
        autoFocus
        placeholder={isArray ? "Enter each item on a new line..." : "Edit your content..."}
      />
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-[#6B7280]">{draft.length} characters</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl text-[13px] font-medium bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20 transition-all duration-300">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-semibold bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10B981] hover:bg-[rgba(16,185,129,0.2)] transition-all duration-300">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ResultCard ───
const TYPE_META: Record<string, { label: string; color: string }> = {
  hook: { label: "Viral Hook", color: "#A855F7" },
  caption: { label: "Caption", color: "#6366F1" },
  hashtags: { label: "Hashtags", color: "#A855F7" },
  script: { label: "Script", color: "#8B5CF6" },
};

export default function ResultCard({ type, content: initialContent, platform, tone, topic, creatorProfile, duration, onRegenerate }: ResultCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (JSON.stringify(initialContent) !== JSON.stringify(content) && !editing) {
    setContent(initialContent);
  }

  const meta = TYPE_META[type] || { label: type, color: "#A855F7" };
  const getFullText = () => Array.isArray(content) ? content.join("\n") : content;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(getFullText()).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = getFullText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleEditSave = (newContent: string | string[]) => {
    setContent(newContent);
    setEditing(false);
    if (onRegenerate) onRegenerate(newContent);
  };

  const handleSave = async () => {
    if (status === "loading") return;
    if (!session) { router.push("/auth/signin"); return; }
    setSaving(true);
    const saveData = { type, platform, tone, topic, content, creatorProfile, savedAt: new Date().toISOString() };
    try {
      const res = await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(saveData) });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); return; }
      throw new Error("API failed");
    } catch {
      try {
        const existing = JSON.parse(localStorage.getItem("contentcraft_saved") || "[]");
        existing.unshift({ _id: `local_${Date.now()}`, ...saveData });
        localStorage.setItem("contentcraft_saved", JSON.stringify(existing.slice(0, 100)));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch { /* silent */ }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow" style={{ borderColor: `${meta.color}40`, color: meta.color, background: `${meta.color}12` }}>{meta.label}</span>
          <span className="eyebrow">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
          {type !== "hashtags" && <span className="eyebrow">{tone}</span>}
          {creatorProfile?.niche && <span className="eyebrow" style={{ borderColor: "rgba(124,58,237,0.3)", color: "#A855F7", background: "rgba(124,58,237,0.08)" }}>{creatorProfile.niche}</span>}
          {editing && <span className="eyebrow !text-[#F59E0B] !border-[rgba(245,158,11,0.4)] !bg-[rgba(245,158,11,0.1)]">Editing</span>}
        </div>

        {!editing && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-500 ${
                copiedAll ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]" : "bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/25"
              }`}
            >
              {copiedAll ? (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy All</>
              )}
            </button>

            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/25 transition-all duration-500"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>

            {session ? (
              <button type="button" onClick={handleSave} disabled={saving} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-500 ${
                saved ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]" : "bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/25"
              }`}>
                {saving ? <><span className="spinner !w-3 !h-3" />Saving...</> : saved ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Saved!</> : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Save</>}
              </button>
            ) : (
              <button type="button" onClick={() => router.push("/auth/signin")} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/25 transition-all duration-500">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Save
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Card */}
      {editing ? (
        <ShimmerBorder accent="#F59E0B">
          <div className="p-7">
            <EditOverlay content={content} type={type} onSave={handleEditSave} onCancel={() => setEditing(false)} />
          </div>
        </ShimmerBorder>
      ) : (
        <ShimmerBorder accent={meta.color}>
          <div className="p-7">
            {type === "hashtags" && Array.isArray(content) && <HashtagsOutput content={content} />}
            {type === "hook" && Array.isArray(content) && <HooksOutput content={content} />}
            {type === "caption" && !Array.isArray(content) && <CaptionOutput content={content} />}
            {type === "script" && !Array.isArray(content) && <ScriptOutput content={content} />}
          </div>
        </ShimmerBorder>
      )}
    </div>
  );
}
