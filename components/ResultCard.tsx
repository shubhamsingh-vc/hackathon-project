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
        copied ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]" : "bg-white/5 border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
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

  // Classify hashtags: trending (short, generic), niche (specific, longer)
  const categorize = (tag: string) => {
    const t = tag.toLowerCase();
    const trending = ["#fyp", "#foryou", "#foryoupage", "#viral", "#trending", "#explore", "#reels", "#shorts", "#tiktok"];
    if (trending.some((tr) => t.includes(tr.replace("#", "")))) return "trending";
    if (tag.length > 16) return "niche";
    return "regular";
  };

  const trending = content.filter((t) => categorize(t) === "trending");
  const niche = content.filter((t) => categorize(t) === "niche");
  const regular = content.filter((t) => categorize(t) === "regular");

  const TagBadge = ({ tag }: { tag: string }) => {
    const cat = categorize(tag);
    const styles: Record<string, { bg: string; border: string; color: string; shadow: string }> = {
      trending: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", color: "#F87171", shadow: "0 0 12px rgba(239,68,68,0.15)" },
      niche: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", color: "#34D399", shadow: "0 0 12px rgba(16,185,129,0.15)" },
      regular: { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", color: "#A855F7", shadow: "0 0 12px rgba(168,85,247,0.15)" },
    };
    const s = styles[cat];

    return (
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(tag); }}
        className="group relative px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap"
        style={{
          background: s.bg,
          border: `1px solid ${s.border}`,
          color: s.color,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = s.shadow;
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        }}
        title={`Click to copy: ${tag}`}
      >
        {tag}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px]" style={{ background: "rgba(168,85,247,0.15)", color: "#A855F7" }}>#</span>
          <span className="text-[11px] font-bold text-[#A855F7] uppercase tracking-wider">Hashtags</span>
          <span className="text-[11px] text-[#6B7280]">{content.length} tags</span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(allTags); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-300 ${
            copiedAll ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]" : "bg-white/5 border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
          }`}
        >
          {copiedAll ? "✓ Copied!" : "Copy All"}
        </button>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F87171" }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#F87171" }}>Trending</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trending.map((tag, i) => <TagBadge key={i} tag={tag} />)}
          </div>
        </div>
      )}

      {/* Regular */}
      {regular.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A855F7" }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#A855F7" }}>Popular</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {regular.map((tag, i) => <TagBadge key={i} tag={tag} />)}
          </div>
        </div>
      )}

      {/* Niche */}
      {niche.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#34D399" }}>Niche</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {niche.map((tag, i) => <TagBadge key={i} tag={tag} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hooks Output ───
function HooksOutput({ content }: { content: string[] }) {
  const hookTypes = [
    { label: "Story Hook", icon: "📖", accent: "#A855F7", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
    { label: "Stat Hook", icon: "📊", accent: "#F59E0B", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)" },
    { label: "Question Hook", icon: "❓", accent: "#10B981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.2)" },
    { label: "Bold Hook", icon: "🔥", accent: "#EF4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.2)" },
  ];

  return (
    <div className="space-y-3">
      {content.map((hook, i) => {
        const hookMeta = hookTypes[i % hookTypes.length];
        const isQuestion = hook.includes("?");
        const hasStat = /\d+%|\d+K|\$\d/.test(hook);
        const hasExclamation = hook.includes("!") && hook.split("!").length > 2;

        return (
          <div
            key={i}
            className="group relative rounded-2xl p-5 transition-all duration-500"
            style={{
              background: hookMeta.bg,
              border: `1px solid ${hookMeta.border}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${hookMeta.accent}50`;
              (e.currentTarget as HTMLDivElement).style.background = hookMeta.bg.replace("0.06", "0.12").replace("0.08", "0.14");
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = hookMeta.border;
              (e.currentTarget as HTMLDivElement).style.background = hookMeta.bg;
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[14px] font-bold"
                  style={{ background: `${hookMeta.accent}20`, color: hookMeta.accent }}
                >
                  {hookMeta.icon}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: hookMeta.accent }}>
                  {hookMeta.label}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: `${hookMeta.accent}15`,
                    color: hookMeta.accent,
                    border: `1px solid ${hookMeta.accent}30`,
                  }}
                >
                  #{i + 1}
                </span>
              </div>
              <CopyBtn text={hook} />
            </div>

            {/* Hook text — styled by type */}
            <p
              className="text-[15px] leading-relaxed font-semibold"
              style={{
                color: hookMeta.accent,
                textShadow: `0 0 30px ${hookMeta.accent}20`,
              }}
            >
              {hook}
            </p>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-6 right-6 h-px rounded-full transition-opacity duration-500"
              style={{
                background: `linear-gradient(90deg, transparent, ${hookMeta.accent}40, transparent)`,
                opacity: 0,
              }}
              id={`hook-accent-${i}`}
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
      <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px]" style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8" }}>✍</span>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#6366F1" }}>Caption</span>
        </div>
        <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
        {isLongForm && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[rgba(99,102,241,0.1)] text-[#818CF8] border border-[rgba(99,102,241,0.2)]">
            Long Form
          </span>
        )}
        <div className="ml-auto">
          <CopyBtn text={content} label="Copy Caption" />
        </div>
      </div>

      {/* Caption lines */}
      <div className="space-y-3">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          const isEmoji = /^[\p{Emoji}\s]+$/u.test(trimmed) && trimmed.length <= 10;
          const isEllipsis = trimmed === "..." || trimmed === "…";
          const isCTA = /\b(link in bio|follow|comment|share|save this|link|bio|dm me|tag a friend|follow for more|subscribe)\b/i.test(trimmed);
          const isHashtag = trimmed.startsWith("#") || /^\s*#\w/.test(line);
          const isMention = /@[\w]+/.test(trimmed);
          const isBold = /^\*\*.+\*\*$/.test(trimmed);

          if (isEmoji) {
            return (
              <p key={i} className="text-3xl leading-none py-1" style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.3))" }}>
                {trimmed}
              </p>
            );
          }

          if (isEllipsis) {
            return (
              <p key={i} className="text-[14px] text-[#6B7280] text-center py-1 tracking-widest">
                · · ·
              </p>
            );
          }

          if (isCTA) {
            return (
              <p key={i} className="text-[14px] leading-relaxed font-semibold" style={{ color: "#10B981", textShadow: "0 0 20px rgba(16,185,129,0.2)" }}>
                {line}
              </p>
            );
          }

          if (isBold) {
            return (
              <p key={i} className="text-[14px] leading-relaxed font-bold" style={{ color: "#E5E7EB" }}>
                {trimmed.replace(/\*\*/g, "")}
              </p>
            );
          }

          if (isHashtag) {
            // Render inline hashtags with distinct color
            const parts = line.split(/(\s+#\w+)/g);
            return (
              <p key={i} className="text-[13px] leading-relaxed" style={{ color: "rgba(168,85,247,0.75)" }}>
                {parts.map((part, pi) =>
                  part.startsWith("#") ? (
                    <span key={pi} className="hover:underline cursor-pointer" style={{ color: "#A855F7" }}>{part}</span>
                  ) : (
                    <span key={pi}>{part}</span>
                  )
                )}
              </p>
            );
          }

          if (isMention) {
            return (
              <p key={i} className="text-[14px] leading-relaxed" style={{ color: "rgba(99,102,241,0.85)" }}>
                {line}
              </p>
            );
          }

          // Default body text
          return (
            <p key={i} className="text-[14px] leading-relaxed" style={{ color: "#E5E7EB" }}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

// ─── Script Output ───
// Each parsed item has a type so we can style it distinctly
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

    // ── Timestamp: [0:00] or [0:00] standalone ──
    const tsMatch = line.match(/^\[(\d+:\d+)\]$/);
    if (tsMatch) {
      items.push({ kind: "timestamp", text: tsMatch[1] });
      continue;
    }

    // ── Scene/direction cue in brackets ──
    if (/^\[.+\]$/.test(line)) {
      const clean = line.slice(1, -1).trim();
      // Skip if it's just a section label disguised as a scene cue
      if (/^(HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT)\s*$/i.test(clean)) continue;
      items.push({ kind: "scene", text: clean });
      continue;
    }

    // ── Standalone section label: "HOOK" or "CTA:" etc. ──
    const labelMatch = line.match(/^(HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT)\s*[:.\-]?\s*$/i);
    if (labelMatch) {
      const label = labelMatch[1].toUpperCase();
      if (label === "CTA") {
        items.push({ kind: "divider", label: "Call to Action" });
      } else if (label === "HOOK") {
        items.push({ kind: "divider", label: "Hook" });
      } else if (label === "INTRO" || label === "OUTRO") {
        items.push({ kind: "divider", label });
      } else {
        items.push({ kind: "divider", label: "Body" });
      }
      continue;
    }

    // ── Label with content on same line: "HOOK: You won't believe..." ──
    const labelContentMatch = line.match(/^(HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT)\s*[:.\-]\s*(.+)/i);
    if (labelContentMatch) {
      const label = labelContentMatch[1].toUpperCase();
      const text = labelContentMatch[2].trim();
      if (label === "CTA") {
        if (text) items.push({ kind: "cta", text });
      } else if (label === "HOOK") {
        if (text) items.push({ kind: "hook", text });
      } else {
        if (text) items.push({ kind: "body", text });
      }
      continue;
    }

    // ── Everything else: read the original line for true content ──
    // Re-read original (not trimmed/stripped) line to preserve original casing
    const origLine = rawLines[i - 1].trim();
    // Strip any leftover label prefix from the raw line
    const stripped = origLine.replace(/^(HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT)\s*[:.\-]\s*/i, "").trim();

    if (!stripped) continue;

    // Detect CTA patterns: ask audience, subscribe, follow, link in bio, comment, share
    const isCTA = /\b(subscribe|follow|comment|share|save|link in bio|like|hit|check out|visit|tap|dm|tag)\b/i.test(stripped);
    if (isCTA) {
      items.push({ kind: "cta", text: stripped });
      continue;
    }

    // Detect hook patterns: bold statements, questions, stats at start
    const isHook = /^(did you|what if|i tried|i spent|i make|i'll show|here'?s|you'?ll never|this is|stop|stuck|can'?t believe)/i.test(stripped)
      || /(!{2,}|[\d,]+[\s\w]+(?:people|views|followers|subscribers)|^\d+%|\$[\d,]+k?)/.test(stripped)
      || (stripped.length < 80 && /^[A-Z]/.test(stripped));
    if (isHook) {
      items.push({ kind: "hook", text: stripped });
      continue;
    }

    items.push({ kind: "body", text: stripped });
  }

  return items;
}

function ScriptOutput({ content }: { content: string }) {
  const items = parseScriptItems(content);
  const totalChars = content.length;

  // Fallback: if nothing parsed, render raw lines as plain readable body
  if (items.length === 0) {
    const rawLines = content.split("\n").filter((l) => l.trim());
    if (rawLines.length === 0) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Script</span>
          <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
          <CopyBtn text={content} label="Copy" />
        </div>
        {rawLines.map((line, i) => (
          <div key={i} className="group flex items-start gap-3 py-1.5">
            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(139,92,246,0.5)" }} />
            <span className="text-[15px] text-[#E5E7EB] leading-relaxed">{line.trim()}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Script</span>
        <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
        <CopyBtn text={content} label="Copy Script" />
      </div>

      {/* Script items */}
      <div className="space-y-2">
        {items.map((item, i) => {
          // ── Section divider ──
          if (item.kind === "divider") {
            const colors: Record<string, { dot: string; text: string }> = {
              Hook: { dot: "#A855F7", text: "#A855F7" },
              "Call to Action": { dot: "#10B981", text: "#10B981" },
              INTRO: { dot: "#6366F1", text: "#818CF8" },
              OUTRO: { dot: "#F59E0B", text: "#F59E0B" },
              BODY: { dot: "#8B5CF6", text: "#A78BFA" },
            };
            const c = colors[item.label] || { dot: "#8B5CF6", text: "#A78BFA" };
            return (
              <div key={i} className="flex items-center gap-3 pt-3">
                <div className="h-px flex-1" style={{ background: `${c.dot}20` }} />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ color: c.text, background: `${c.dot}12`, border: `1px solid ${c.dot}25` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                  {item.label}
                </div>
                <div className="h-px flex-1" style={{ background: `${c.dot}20` }} />
              </div>
            );
          }

          // ── Timestamp badge ──
          if (item.kind === "timestamp") {
            return (
              <div key={i} className="flex items-center gap-3 mt-3">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono flex-shrink-0" style={{ background: "rgba(99,102,241,0.12)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.2)" }}>
                  {item.text}
                </span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.25), transparent)" }} />
              </div>
            );
          }

          // ── Scene / direction cue ──
          if (item.kind === "scene") {
            return (
              <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded-lg" style={{ background: "rgba(168,85,247,0.06)" }}>
                <span className="text-[11px] mt-0.5 flex-shrink-0">🎬</span>
                <span className="text-[12px] italic leading-relaxed" style={{ color: "rgba(168,85,247,0.7)" }}>{item.text}</span>
              </div>
            );
          }

          // ── Hook card ──
          if (item.kind === "hook") {
            return (
              <div key={i} className="group rounded-xl p-4" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(124,58,237,0.25)", color: "#A855F7" }}>⚡</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#A855F7" }}>Hook</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[15px] text-[#FAFAFA] font-semibold leading-relaxed flex-1">{item.text}</span>
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
              <div key={i} className="group rounded-xl p-4" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>→</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#10B981" }}>Call to Action</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[15px] text-[#10B981] font-medium leading-relaxed flex-1">{item.text}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-0.5">
                    <CopyBtn text={item.text} />
                  </div>
                </div>
              </div>
            );
          }

          // ── Body line ──
          return (
            <div key={i} className="group flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors duration-300">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(139,92,246,0.45)" }} />
              <span className="text-[15px] text-[#D1D5DB] leading-relaxed flex-1">{item.text}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-0.5">
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
function EditOverlay({
  content,
  type,
  onSave,
  onCancel,
}: {
  content: string | string[];
  type: string;
  onSave: (newContent: string | string[]) => void;
  onCancel: () => void;
}) {
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
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#F59E0B", boxShadow: "0 0 6px #F59E0B" }} />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#F59E0B]">Editing — make your changes below</span>
      </div>
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-[rgba(245,158,11,0.04)] border border-[rgba(245,158,11,0.3)] rounded-xl p-4 text-[14px] text-[#E5E7EB] leading-relaxed font-mono resize-none outline-none focus:border-[rgba(245,158,11,0.6)] transition-colors duration-300"
        style={{ minHeight: "200px" }}
        autoFocus
        placeholder={isArray ? "Enter each item on a new line..." : "Edit your content..."}
      />
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-[#6B7280]">{draft.length} characters</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full text-[13px] font-medium bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20 transition-all duration-300">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10B981] hover:bg-[rgba(16,185,129,0.2)] transition-all duration-300">
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
  hook: { label: "Viral Hook", color: "#7C3AED" },
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

  // Sync new content from parent
  if (JSON.stringify(initialContent) !== JSON.stringify(content) && !editing) {
    setContent(initialContent);
  }

  const meta = TYPE_META[type] || { label: type, color: "#7C3AED" };

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
      {/* Header */}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-500 ${
                copiedAll ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]" : "bg-white/5 border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
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
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20 transition-all duration-500"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>

            {session ? (
              <button type="button" onClick={handleSave} disabled={saving} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-500 ${
                saved ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]" : "bg-white/5 border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
              }`}>
                {saving ? <><span className="spinner !w-3 !h-3" />Saving...</> : saved ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Saved!</> : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Save</>}
              </button>
            ) : (
              <button type="button" onClick={() => router.push("/auth/signin")} className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20 transition-all duration-500">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Save
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <div className="bezel-outer mb-6">
          <div className="bezel-inner">
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #F59E0B80, transparent)" }} />
            <div className="p-6">
              <EditOverlay content={content} type={type} onSave={handleEditSave} onCancel={() => setEditing(false)} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bezel-outer">
          <div className="bezel-inner">
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${meta.color}80, transparent)` }} />
            <div className="p-7">
              {type === "hashtags" && Array.isArray(content) && <HashtagsOutput content={content} />}
              {type === "hook" && Array.isArray(content) && <HooksOutput content={content} />}
              {type === "caption" && !Array.isArray(content) && <CaptionOutput content={content} />}
              {type === "script" && !Array.isArray(content) && <ScriptOutput content={content} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
