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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200 cursor-pointer ${
        copied
          ? "bg-[rgba(96,165,250,0.12)] text-[#60A5FA] border-[rgba(96,165,250,0.25)]"
          : "bg-white/4 border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15"
      }`}
    >
      {copied ? (
        <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied</>
      ) : (
        <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>{label || "Copy"}</>
      )}
    </button>
  );
}

// ─── Top accent bar for each content type ───
function TopBar({ color }: { color: string }) {
  return <div className="h-px w-full mb-5" style={{ background: `linear-gradient(90deg, transparent, ${color}60, ${color}90, ${color}60, transparent)` }} />;
}

// ─── Content highlight palette ───
// Hook=purple, Caption=green, Hashtags=orange, Script=blue, Body=dark
const HOOK_COLOR   = "#C084FC"; // Purple — hook output
const CAPTION_COLOR = "#34D399"; // Green — caption output
const HASHTAG_COLOR = "#FB923C"; // Orange — hashtags output
const SCRIPT_COLOR  = "#60A5FA"; // Blue — script output
const BODY_COLOR    = "#475569"; // Dark slate — body text
function HashtagsOutput({ content }: { content: string[] }) {
  const allTags = content.join(" ");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const catOf = (tag: string) => {
    const t = tag.toLowerCase();
    if (["fyp", "foryou", "foryoupage", "viral", "trending", "explore", "reels", "shorts", "tiktok", "fypシ"].some((tr) => t.includes(tr))) return "trending";
    return tag.length > 16 ? "niche" : "regular";
  };

  const catStyle: Record<string, { accent: string; label: string }> = {
    trending: { accent: "#FB923C", label: "Trending" },
    regular: { accent: "#FBBF24", label: "Popular" },
    niche: { accent: "#FDBA74", label: "Niche" },
  };

  return (
    <div>
      <TopBar color="#FB923C" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {/* HASHTAGS label */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
            style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FB923C" }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#FB923C" }}>Hashtags</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">#{content.length}</span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(allTags); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200 ${
            copiedAll ? "bg-[rgba(96,165,250,0.12)] text-[#60A5FA] border-[rgba(96,165,250,0.25)]" : "bg-white/4 border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15"
          }`}
        >
          {copiedAll ? <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied</> : <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy All</>}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {content.map((tag, i) => {
          const cat = catOf(tag);
          const s = catStyle[cat];
          const isCopied = copiedTag === tag;
          return (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(tag);
                setCopiedTag(tag);
                setTimeout(() => setCopiedTag(null), 1500);
              }}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium border border-white/8 text-[#9CA3AF] hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer"
            >
              {isCopied ? (
                <span className="flex items-center gap-1" style={{ color: "#60A5FA" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-[10px] uppercase tracking-wider">Copied</span>
                </span>
              ) : (
                <span style={{ color: s.accent }}>{tag}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hooks Output ───
function HooksOutput({ content }: { content: string[] }) {
  return (
    <div>
      <TopBar color="#C084FC" />
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#C084FC]">{content.length} Opening Hooks</span>
        <span className="text-[11px] text-[#6B7280]">— tap to copy</span>
      </div>

      <div className="space-y-3">
        {content.map((hook, i) => {
          return (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(hook); }}
              className="group w-full text-left rounded-xl p-4 border border-white/8 hover:border-white/15 transition-all duration-200 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; }}
            >
              {/* Left accent bar — purple */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full" style={{ background: "#C084FC" }} />

              <div className="flex items-start gap-4 pl-4">
                {/* HOOK label */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md mt-0.5 flex-shrink-0"
                  style={{ background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.25)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C084FC" }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#C084FC" }}>Hook</span>
                </div>

                {/* Number + text */}
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className="text-[18px] font-bold flex-shrink-0 leading-none mt-1"
                    style={{ color: "#C084FC", opacity: 0.35 }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-[14px] leading-relaxed pt-0.5"
                    style={{ color: "#C084FC" }}
                  >
                    {hook}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Caption Output ───
function CaptionOutput({ content }: { content: string }) {
  const lines = content.split("\n").filter((l) => l.trim() !== "");
  const totalChars = content.length;

  const isEmoji = (l: string) => /^[\p{Emoji}\s]+$/u.test(l.trim()) && l.trim().length <= 15;
  const isCTA = (l: string) => /\b(follow|comment|share|save|link in bio|visit|subscribe|tag|dm me|like|hit|check out|follow for more)/i.test(l);
  const isHook = (l: string, idx: number) =>
    idx === 0 || (idx === 1 && isEmoji(lines[0] ?? ""));

  // Find emoji line index
  const emojiIdx = lines.findIndex((l, i) => i === 0 && isEmoji(l));
  // Find first non-emoji line
  const firstTextIdx = emojiIdx === 0 ? 1 : 0;
  // CTA = last 2 lines if they contain CTA words
  const ctaStartIdx = Math.max(firstTextIdx + 1, lines.length - 2);

  // Detect which lines are which type
  const getLineType = (line: string, i: number) => {
    if (isCTA(line)) return "cta";
    if (isHook(line, i)) return "hook";
    return "body";
  };

  const sectionAccents = {
    hook: "#C084FC",
    body: "#34D399",
    cta: "#34D399",
  };

  // Text colors — green theme for caption
  const sectionTextColors = {
    hook: "#C084FC",
    body: "#34D399",
    cta: "#34D399",
  };

  const sectionLabels = {
    hook: "Hook",
    body: "Caption",
    cta: "Call to Action",
  };

  const currentSection = (line: string, i: number) => {
    const t = getLineType(line, i);
    if (t === "hook") return "hook";
    if (t === "cta") return "cta";
    return "body";
  };

  let lastSection = "";

  return (
    <div>
      <TopBar color="#34D399" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#34D399]">Caption</span>
          <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
        </div>
        <CopyBtn text={content} label="Copy" />
      </div>

      <div className="space-y-2">
        {lines.map((line, i) => {
          const type = currentSection(line, i);
          const accent = sectionAccents[type as keyof typeof sectionAccents];
          const label = sectionLabels[type as keyof typeof sectionLabels];
          const textColor = sectionTextColors[type as keyof typeof sectionTextColors];
          const trimmed = line.trim();

          // Show section badge when section changes
          const showBadge = type !== lastSection;
          if (type !== lastSection) lastSection = type;

          // Emoji opener — large
          if (isEmoji(line) && i === 0) {
            return (
              <p key={i} className="text-4xl leading-none mb-1">
                {trimmed}
              </p>
            );
          }

          return (
            <div key={i}>
              {showBadge && (
                <div className="flex items-center gap-2 mt-4 mb-2">
                  <div
                    className="flex items-center gap-2 px-3 py-1 rounded-lg"
                    style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                      {label}
                    </span>
                  </div>
                </div>
              )}
              <p
                className="text-[14px] leading-relaxed pl-1 transition-colors"
                style={{ color: textColor }}
              >
                {line}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Script Output ───
type ScriptLine =
  | { kind: "section"; label: string; accent: string; timestamp?: string }
  | { kind: "spoken"; text: string; timestamp?: string }
  | { kind: "scene"; text: string };

const SECTION_META: Record<string, { accent: string; label: string; secPerLine: number }> = {
  HOOK:  { accent: "#C084FC", label: "Hook",           secPerLine: 3 },
  CTA:   { accent: "#60A5FA", label: "Call to Action", secPerLine: 2 },
  INTRO: { accent: "#C084FC", label: "Intro",          secPerLine: 4 },
  OUTRO: { accent: "#60A5FA", label: "Outro",          secPerLine: 3 },
  BODY:  { accent: "#60A5FA", label: "Body",            secPerLine: 5 },
  SCRIPT:{ accent: "#60A5FA", label: "Body",            secPerLine: 5 },
};

function parseScriptItems(content: string): ScriptLine[] {
  const rawLines = content.split("\n");
  const items: ScriptLine[] = [];
  let i = 0;
  let pendingTs: string | undefined;

  const SECTION_LABELS = "HOOK|BODY|CTA|INTRO|OUTRO|SCRIPT";

  // Helper: strip markdown from content (not section headers)
  const stripContent = (t: string) =>
    t.replace(/\*\*(.+?)\*\*/g, "$1")
     .replace(/\*(.+?)\*/g, "$1")
     .replace(/__(.+?)__/g, "$1")
     .replace(/_(.+?)_/g, "$1")
     .replace(/^[\#\-\*\>]+(\s)/g, "$1")
     .trim();

  while (i < rawLines.length) {
    const line = rawLines[i].trim();
    i++;
    if (!line) continue;

    // Standalone [0:00] timestamp
    const tsMatch = line.match(/^\[(\d+:\d+)\]$/);
    if (tsMatch) { pendingTs = tsMatch[1]; continue; }

    // [SCENE: description] — strip markdown inside
    if (/^\[.+\]$/.test(line)) {
      const clean = stripContent(line.slice(1, -1).trim());
      if (new RegExp(`^(${SECTION_LABELS})\\s*$`, "i").test(clean)) continue;
      items.push({ kind: "scene", text: clean });
      continue;
    }

    // **HOOK** or **HOOK:** — markdown bold section header (label only)
    let m = line.match(new RegExp(`^\\*\\*(${SECTION_LABELS})\\*\\*\\s*[:.\\-]?\\s*$`, "i"));
    if (m) {
      const key = m[1].toUpperCase();
      const meta = SECTION_META[key] || { accent: "#818CF8", label: key };
      items.push({ kind: "section", label: meta.label, accent: meta.accent, timestamp: pendingTs });
      pendingTs = undefined;
      continue;
    }

    // **HOOK:** your script text here — bold section + content
    m = line.match(new RegExp(`^\\*\\*(${SECTION_LABELS})\\*\\*\\s*[:.\\-]\\s*(.+)`, "i"));
    if (m) {
      const key = m[1].toUpperCase();
      const text = stripContent(m[2]);
      const meta = SECTION_META[key] || { accent: "#818CF8", label: key };
      if (text) {
        items.push({ kind: "section", label: meta.label, accent: meta.accent, timestamp: pendingTs });
        items.push({ kind: "spoken", text, timestamp: pendingTs });
      }
      pendingTs = undefined;
      continue;
    }

    // HOOK: or HOOK — plain section header (label only)
    m = line.match(new RegExp(`^(${SECTION_LABELS})\\s*[:.\\-]?\\s*$`, "i"));
    if (m) {
      const key = m[1].toUpperCase();
      const meta = SECTION_META[key] || { accent: "#818CF8", label: key };
      items.push({ kind: "section", label: meta.label, accent: meta.accent, timestamp: pendingTs });
      pendingTs = undefined;
      continue;
    }

    // HOOK: your script text here — plain section + content
    m = line.match(new RegExp(`^(${SECTION_LABELS})\\s*[:.\\-]\\s*(.+)`, "i"));
    if (m) {
      const key = m[1].toUpperCase();
      const text = stripContent(m[2]);
      const meta = SECTION_META[key] || { accent: "#818CF8", label: key };
      if (text) {
        items.push({ kind: "section", label: meta.label, accent: meta.accent, timestamp: pendingTs });
        items.push({ kind: "spoken", text, timestamp: pendingTs });
      }
      pendingTs = undefined;
      continue;
    }

    // Regular content — strip any leftover prefix + markdown
    const origLine = rawLines[i - 1].trim();
    const stripped = stripContent(origLine.replace(new RegExp(`^(${SECTION_LABELS})\\s*[:.\\-]\\s*`, "i"), "")).trim();
    if (!stripped || stripped.length < 2) { pendingTs = undefined; continue; }

    items.push({ kind: "spoken", text: stripped, timestamp: pendingTs });
    pendingTs = undefined;
  }

  return items;
}

function SectionBadge({ label, accent, timestamp }: { label: string; accent: string; timestamp?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>
          {label}
        </span>
      </div>
      {timestamp && (
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
          style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}20` }}
        >
          {timestamp}
        </span>
      )}
    </div>
  );
}

function ScriptOutput({ content }: { content: string }) {
  const [copiedLine, setCopiedLine] = useState<number | null>(null);
  const items = parseScriptItems(content);
  const totalChars = content.length;

  // Fallback: render raw lines with estimated timestamps
  if (items.length === 0) {
    const rawLines = content.split("\n").filter((l) => l.trim());
    if (rawLines.length === 0) return null;
    let secs = 0;
    return (
      <div>
        <TopBar color="#60A5FA" />
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#60A5FA]">Script · {totalChars} chars</span>
          <CopyBtn text={content} label="Copy" />
        </div>
        <div className="space-y-2">
          {rawLines.map((line, i) => {
            const ts = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
            secs += 4;
            const isCopied = copiedLine === i;
            return (
              <div
                key={i}
                className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-all cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(line.trim());
                  setCopiedLine(i);
                  setTimeout(() => setCopiedLine(null), 1500);
                }}
              >
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded shrink-0" style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA" }}>
                  {ts}
                </span>
                <span className={`text-[14px] leading-relaxed flex-1 transition-colors ${isCopied ? "text-[#60A5FA] font-medium" : "text-[#475569] group-hover:text-white"}`}>
                  {isCopied ? "Copied!" : line.trim()}
                </span>
                {isCopied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5" className="shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Group into sections
  type Section = { label: string; accent: string; timestamp?: string; lines: ScriptLine[] };
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const item of items) {
    if (item.kind === "section") {
      if (current) sections.push(current);
      current = { label: item.label, accent: item.accent, timestamp: item.timestamp, lines: [] };
    } else if (current) {
      current.lines.push(item);
    } else {
      current = { label: "Script", accent: "#818CF8", lines: [item] };
    }
  }
  if (current) sections.push(current);

  // Assign timestamps to items that don't have one
  let runningSeconds = 0;
  for (const section of sections) {
    const meta = Object.values(SECTION_META).find((m) => m.label === section.label) || { secPerLine: 5 };
    if (!section.timestamp) {
      section.timestamp = `${Math.floor(runningSeconds / 60)}:${String(runningSeconds % 60).padStart(2, "0")}`;
    }
    for (const line of section.lines) {
      if (line.kind === "scene") continue;
      if (!line.timestamp) {
        line.timestamp = `${Math.floor(runningSeconds / 60)}:${String(runningSeconds % 60).padStart(2, "0")}`;
      }
      runningSeconds += meta.secPerLine;
    }
  }

  return (
    <div>
      <TopBar color="#60A5FA" />
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#60A5FA]">Script · {totalChars} chars</span>
        <CopyBtn text={content} label="Copy Script" />
      </div>

      <div className="space-y-5">
        {sections.map((section, si) => (
          <div key={si}>
            {/* Section header badge */}
            <SectionBadge label={section.label} accent={section.accent} timestamp={section.timestamp} />

            {/* Lines in section */}
            <div className="space-y-1.5 pl-1">
              {section.lines.map((line, li) => {
                // Scene cue
                if (line.kind === "scene") {
                  return (
                    <div key={li} className="flex items-center gap-2 py-1.5 px-3 rounded-lg" style={{ background: "rgba(168,85,247,0.05)", borderLeft: "2px solid rgba(168,85,247,0.2)" }}>
                      <span className="text-[11px]">🎬</span>
                      <span className="text-[12px] italic leading-relaxed" style={{ color: "rgba(168,85,247,0.6)" }}>{line.text}</span>
                    </div>
                  );
                }

                // Spoken line: timestamp + text
                if (line.kind === "spoken") {
                  const lineKey = `${si}-${li}`;
                  const isCopied = copiedLine === li;
                  return (
                    <div
                      key={li}
                      className="group flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(line.text);
                        setCopiedLine(li);
                        setTimeout(() => setCopiedLine(null), 1500);
                      }}
                    >
                      <span
                        className="text-[11px] font-mono font-bold px-2 py-0.5 rounded shrink-0 mt-0.5"
                        style={{
                          background: isCopied ? "rgba(96,165,250,0.15)" : `${section.accent}12`,
                          color: isCopied ? "#60A5FA" : `${section.accent}99`,
                          border: `1px solid ${isCopied ? "rgba(96,165,250,0.3)" : `${section.accent}20`}`,
                        }}
                      >
                        {isCopied ? "✓" : line.timestamp}
                      </span>
                      <span className={`text-[14px] leading-relaxed flex-1 pt-0.5 transition-colors ${isCopied ? "font-medium" : ""}`}
                        style={isCopied ? { color: "#60A5FA" } : { color: section.accent + "CC" }}
                      >
                        {isCopied ? "Copied!" : line.text}
                      </span>
                      {!isCopied && (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 mt-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </span>
                      )}
                      {isCopied && (
                        <span className="shrink-0 mt-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Edit Overlay ───
function EditOverlay({ content, type, onSave, onCancel }: { content: string | string[]; type: string; onSave: (newContent: string | string[]) => void; onCancel: () => void }) {
  const isArray = Array.isArray(content);
  const editText = isArray ? content.join("\n") : content;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
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
      <div className="h-px w-full mb-5" style={{ background: "linear-gradient(90deg, transparent, #F59E0B60, #F59E0B90, #F59E0B60, transparent)" }} />
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#F59E0B]">Editing</span>
      </div>
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-white/3 border border-white/10 rounded-xl p-4 text-[14px] text-[#E5E7EB] leading-relaxed resize-none outline-none focus:border-[rgba(245,158,11,0.4)] transition-colors duration-200"
        style={{ minHeight: "160px" }}
        autoFocus
        placeholder={isArray ? "Enter each item on a new line..." : "Edit your content..."}
      />
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#6B7280]">{draft.length} chars</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full text-[12px] font-medium bg-white/4 border border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15 transition-all duration-200">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)] text-[#10B981] hover:bg-[rgba(16,185,129,0.18)] transition-all duration-200">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Schedule Panel ───
const PEAK_HOURS: Record<string, string[]> = {
  instagram: ["9:00 AM", "12:00 PM", "7:00 PM", "9:00 PM"],
  tiktok: ["7:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"],
  youtube: ["2:00 PM", "5:00 PM", "8:00 PM"],
  twitter: ["8:00 AM", "12:00 PM", "5:00 PM"],
  linkedin: ["8:00 AM", "12:00 PM", "5:00 PM"],
  facebook: ["1:00 PM", "4:00 PM", "8:00 PM"],
};

const BEST_DAYS: Record<string, string[]> = {
  instagram: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
  tiktok: ["Tuesday", "Thursday", "Friday", "Saturday"],
  youtube: ["Thursday", "Friday", "Saturday"],
  twitter: ["Tuesday", "Wednesday", "Thursday"],
  linkedin: ["Tuesday", "Wednesday", "Thursday"],
  facebook: ["Wednesday", "Thursday", "Friday"],
};

const FREQUENCY_RECS: Record<string, { label: string; detail: string; accent: string }> = {
  hook: { label: "1x/day", detail: "Hooks work best with consistent daily posting", accent: "#C084FC" },
  script: { label: "1x/day", detail: "Quality scripts deserve daily visibility", accent: "#60A5FA" },
  caption: { label: "3-5x/week", detail: "Pair with visuals for maximum reach", accent: "#34D399" },
  hashtags: { label: "1x/day", detail: "Fresh hashtags boost discoverability each day", accent: "#FB923C" },
};

function SchedulePanel({ type, platform }: { type: string; platform: string }) {
  const [open, setOpen] = useState(false);
  const platformKey = platform.toLowerCase();
  const peakTimes = PEAK_HOURS[platformKey] || PEAK_HOURS.instagram;
  const bestDays = BEST_DAYS[platformKey] || BEST_DAYS.instagram;
  const freq = FREQUENCY_RECS[type] || FREQUENCY_RECS.caption;

  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="text-[12px] font-semibold text-[#94A3B8]">Posting Schedule</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${freq.accent}15`, color: freq.accent }}>
            {freq.label}
          </span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Frequency */}
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: `${freq.accent}08`, border: `1px solid ${freq.accent}20` }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={freq.accent} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: freq.accent }}>Recommended Frequency</span>
              </div>
              <p className="text-[13px] text-[#CBD5E1] leading-relaxed">{freq.detail}</p>
            </div>
          </div>

          {/* Best times */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FB923C]">Best Times to Post</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {peakTimes.map((time) => (
                <span key={time} className="px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ background: "rgba(251,146,60,0.1)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.2)" }}>
                  {time}
                </span>
              ))}
            </div>
          </div>

          {/* Best days */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C084FC]">Best Days</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bestDays.map((day) => (
                <span key={day} className="px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ background: "rgba(192,132,252,0.1)", color: "#C084FC", border: "1px solid rgba(192,132,252,0.2)" }}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ResultCard ───
const TYPE_META: Record<string, { label: string; color: string }> = {
  hook: { label: "Hook", color: "#C084FC" },
  caption: { label: "Caption", color: "#34D399" },
  hashtags: { label: "Hashtags", color: "#FB923C" },
  script: { label: "Script", color: "#60A5FA" },
};

// Need React import for useRef
import React from "react";

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
    <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200 ${
                copiedAll ? "bg-[rgba(96,165,250,0.12)] text-[#60A5FA] border-[rgba(96,165,250,0.25)]" : "bg-white/4 border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15"
              }`}
            >
              {copiedAll ? (
                <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
              ) : (
                <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy All</>
              )}
            </button>

            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-white/4 border border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15 transition-all duration-200"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>

            {session ? (
              <button type="button" onClick={handleSave} disabled={saving} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200 ${
                saved ? "bg-[rgba(96,165,250,0.12)] text-[#60A5FA] border-[rgba(96,165,250,0.25)]" : "bg-white/4 border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15"
              }`}>
                {saving ? <><span className="spinner !w-3 !h-3" />Saving...</> : saved ? <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Saved!</> : <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Save</>}
              </button>
            ) : (
              <button type="button" onClick={() => router.push("/auth/signin")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-white/4 border border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15 transition-all duration-200">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Save
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <EditOverlay content={content} type={type} onSave={handleEditSave} onCancel={() => setEditing(false)} />
      ) : (
        <>
          {type === "hashtags" && Array.isArray(content) && <HashtagsOutput content={content} />}
          {type === "hook" && Array.isArray(content) && <HooksOutput content={content} />}
          {type === "caption" && !Array.isArray(content) && <CaptionOutput content={content} />}
          {type === "script" && !Array.isArray(content) && <ScriptOutput content={content} />}
        </>
      )}

      {/* Posting Schedule Recommendation */}
      {!editing && <SchedulePanel type={type} platform={platform} />}
    </div>
  );
}
