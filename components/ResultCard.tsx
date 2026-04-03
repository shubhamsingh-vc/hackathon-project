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
          ? "bg-[rgba(16,185,129,0.12)] text-[#10B981] border-[rgba(16,185,129,0.25)]"
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

// ─── Hashtags Output ───
function HashtagsOutput({ content }: { content: string[] }) {
  const allTags = content.join(" ");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const catOf = (tag: string) => {
    const t = tag.toLowerCase();
    if (["fyp", "foryou", "foryoupage", "viral", "trending", "explore", "reels", "shorts", "tiktok", "fypシ"].some((tr) => t.includes(tr))) return "trending";
    return tag.length > 16 ? "niche" : "regular";
  };

  const byCat = (cat: string) => content.filter((t) => catOf(t) === cat);
  const catStyle: Record<string, { accent: string; label: string }> = {
    trending: { accent: "#F87171", label: "Trending" },
    regular: { accent: "#A855F7", label: "Popular" },
    niche: { accent: "#34D399", label: "Niche" },
  };

  return (
    <div>
      <TopBar color="#A855F7" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A855F7]">#{content.length} Hashtags</span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(allTags); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200 ${
            copiedAll ? "bg-[rgba(16,185,129,0.12)] text-[#10B981] border-[rgba(16,185,129,0.25)]" : "bg-white/4 border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15"
          }`}
        >
          {copiedAll ? <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied</> : <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy All</>}
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
                <span className="flex items-center gap-1" style={{ color: "#10B981" }}>
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
  const colors = ["#A855F7", "#6366F1", "#10B981"];

  return (
    <div>
      <TopBar color="#A855F7" />
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A855F7]">{content.length} Opening Hooks</span>
        <span className="text-[11px] text-[#6B7280]">— tap to copy</span>
      </div>

      <div className="space-y-3">
        {content.map((hook, i) => {
          const color = colors[i % colors.length];
          return (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(hook); }}
              className="group w-full text-left rounded-xl p-5 border border-white/8 hover:border-white/15 transition-all duration-200 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; }}
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full" style={{ background: color }} />

              {/* Number */}
              <div className="flex items-start gap-4 pl-3">
                <span
                  className="text-[20px] font-bold flex-shrink-0 leading-none mt-0.5"
                  style={{ color, opacity: 0.5 }}
                >
                  {i + 1}
                </span>
                <span className="text-[14px] leading-relaxed text-[#E5E7EB] flex-1 pt-0.5 group-hover:text-white transition-colors">
                  {hook}
                </span>
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
  const isCTA = (l: string) => /\b(follow|comment|share|save|link in bio|visit|subscribe|tag|dm me|like|hit|check out)/i.test(l);

  return (
    <div>
      <TopBar color="#6366F1" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6366F1]">Caption</span>
          <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
        </div>
        <CopyBtn text={content} label="Copy" />
      </div>

      <div className="space-y-3">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          const prev = lines[i - 1]?.trim() ?? "";
          const isEmojiLine = isEmoji(line);
          const isCTALine = isCTA(trimmed);

          // Emoji opener — large
          if (isEmojiLine && i === 0) {
            return (
              <p key={i} className="text-4xl leading-none mb-1">
                {trimmed}
              </p>
            );
          }

          // CTA — green accent
          if (isCTALine) {
            return (
              <p key={i} className="text-[14px] leading-relaxed font-medium pl-3 py-2 rounded-lg" style={{ color: "#10B981", borderLeft: "3px solid #10B98140" }}>
                {line}
              </p>
            );
          }

          // First text line — slightly larger, brighter
          if (i === 0 || (i === 1 && isEmoji(lines[0] ?? ""))) {
            return (
              <p key={i} className="text-[15px] leading-relaxed font-medium text-[#F3F4F6]">
                {line}
              </p>
            );
          }

          // Body
          return (
            <p key={i} className="text-[14px] leading-relaxed text-[#D1D5DB]">
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

    const isCTA = /\b(Subscribe|follow|comment|share|save|link in bio|like|hit|check out|visit|tap|dm|tag)\b/i.test(stripped);
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
      <div>
        <TopBar color="#8B5CF6" />
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6]">Script · {totalChars} chars</span>
          <CopyBtn text={content} label="Copy" />
        </div>
        <div className="space-y-2">
          {rawLines.map((line, i) => (
            <p key={i} className="text-[14px] leading-relaxed text-[#D1D5DB]">{line.trim()}</p>
          ))}
        </div>
      </div>
    );
  }

  const metaFor = (label: string) => {
    const m: Record<string, { accent: string; label: string }> = {
      Hook: { accent: "#A855F7", label: "Hook" },
      "Call to Action": { accent: "#10B981", label: "Call to Action" },
      INTRO: { accent: "#6366F1", label: "Intro" },
      OUTRO: { accent: "#F59E0B", label: "Outro" },
    };
    return m[label] ?? { accent: "#8B5CF6", label: "Body" };
  };

  // Group into sections
  type Section = { label: string; accent: string; items: ScriptItem[] };
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const item of items) {
    if (item.kind === "divider") {
      if (current) sections.push(current);
      const m = metaFor(item.label);
      current = { label: m.label, accent: m.accent, items: [] };
    } else if (current) {
      current.items.push(item);
    } else {
      const m = metaFor("Body");
      current = { label: m.label, accent: m.accent, items: [item] };
    }
  }
  if (current) sections.push(current);

  return (
    <div>
      <TopBar color="#8B5CF6" />
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6]">Script · {totalChars} chars</span>
        <CopyBtn text={content} label="Copy Script" />
      </div>

      <div className="space-y-4">
        {sections.map((section, si) => (
          <div key={si}>
            {/* Section label */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 rounded-full" style={{ background: section.accent }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: section.accent }}>{section.label}</span>
            </div>

            {/* Items in section */}
            <div className="space-y-1 pl-3">
              {section.items.map((item, li) => {
                if (item.kind === "timestamp") {
                  return (
                    <div key={li} className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "#818CF8" }}>
                        {item.text}
                      </span>
                      <div className="flex-1 h-px" style={{ background: "rgba(99,102,241,0.15)" }} />
                    </div>
                  );
                }

                if (item.kind === "scene") {
                  return (
                    <p key={li} className="text-[12px] italic pl-2 py-1" style={{ color: "rgba(168,85,247,0.5)", borderLeft: "2px solid rgba(168,85,247,0.2)" }}>
                      🎬 {item.text}
                    </p>
                  );
                }

                if (item.kind === "hook" || item.kind === "cta") {
                  const accent = item.kind === "hook" ? "#A855F7" : "#10B981";
                  const text = item.text;
                  return (
                    <p
                      key={li}
                      className="text-[14px] leading-relaxed font-medium pl-3 py-2 rounded-lg"
                      style={{ color: accent, borderLeft: `3px solid ${accent}50`, background: `${accent}08` }}
                    >
                      {text}
                    </p>
                  );
                }

                // Body — plain readable text
                if (item.kind === "body") {
                  return (
                    <button
                      key={li}
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(item.text); }}
                      className="group w-full text-left"
                    >
                      <p className="text-[14px] leading-relaxed text-[#D1D5DB] hover:text-white transition-colors">
                        {item.text}
                      </p>
                    </button>
                  );
                }
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

// ─── Main ResultCard ───
const TYPE_META: Record<string, { label: string; color: string }> = {
  hook: { label: "Hook", color: "#A855F7" },
  caption: { label: "Caption", color: "#6366F1" },
  hashtags: { label: "Hashtags", color: "#A855F7" },
  script: { label: "Script", color: "#8B5CF6" },
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
                copiedAll ? "bg-[rgba(16,185,129,0.12)] text-[#10B981] border-[rgba(16,185,129,0.25)]" : "bg-white/4 border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15"
              }`}
            >
              {copiedAll ? (
                <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
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
                saved ? "bg-[rgba(16,185,129,0.12)] text-[#10B981] border-[rgba(16,185,129,0.25)]" : "bg-white/4 border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15"
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
    </div>
  );
}
