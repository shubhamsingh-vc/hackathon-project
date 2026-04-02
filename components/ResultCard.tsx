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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          {copiedAll ? "Copied!" : "Copy All"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {content.map((tag, i) => (
          <CopyBtn key={i} text={tag} label={tag.length > 18 ? tag.substring(0, 18) + "…" : tag} />
        ))}
      </div>
    </div>
  );
}

// ─── Hooks Output ───
function HooksOutput({ content }: { content: string[] }) {
  const hookTypes = ["Story Hook", "Stat Hook", "Question Hook", "Bold Hook"];
  return (
    <div className="space-y-3">
      {content.map((hook, i) => {
        const isQuestion = hook.includes("?");
        const hasStat = /\d+%|\d+K|\$\d/.test(hook);
        return (
          <div key={i} className="group relative rounded-2xl p-5 bg-[rgba(124,58,237,0.06)] border border-[rgba(124,58,237,0.15)] hover:border-[rgba(124,58,237,0.35)] hover:bg-[rgba(124,58,237,0.1)] transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{ background: "rgba(124,58,237,0.2)", color: "#A855F7" }}>{i + 1}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#A855F7" }}>{hookTypes[i] || `Hook ${i + 1}`}</span>
                {isQuestion && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(16,185,129,0.1)] text-[#10B981] border border-[rgba(16,185,129,0.2)]">?</span>}
                {hasStat && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]">%</span>}
              </div>
              <CopyBtn text={hook} />
            </div>
            <p className="text-[15px] text-[#E5E7EB] leading-relaxed font-medium">{hook}</p>
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
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#6366F1" }}>Caption</span>
        <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
        {totalChars > 200 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(99,102,241,0.1)] text-[#6366F1] border border-[rgba(99,102,241,0.2)]">Long form</span>}
        <CopyBtn text={content} label="Full" />
      </div>
      {lines.map((line, i) => {
        const isEmoji = /^[\p{Emoji}]+$/u.test(line.trim());
        const isEllipsis = line.trim() === "..." || line.trim() === "…";
        const isCTA = /\b(link|bio|follow|comment|share|save|tag)\b/i.test(line);
        return (
          <p key={i} className={`text-[14px] leading-relaxed ${isEmoji ? "text-2xl" : isEllipsis ? "text-[#6B7280]" : isCTA ? "text-[#10B981] font-medium" : "text-[#E5E7EB]"}`}>{line}</p>
        );
      })}
    </div>
  );
}

// ─── Script Output ───
type ScriptSection = { label: string; color: string; bgColor: string; lines: string[] };

function parseScriptSections(content: string): ScriptSection[] {
  const rawLines = content.split("\n");
  const sections: ScriptSection[] = [];
  let currentSection: ScriptSection | null = null;

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const line = rawLine.trim();

    // Empty line — skip but don't change section
    if (!line) continue;

    // Standalone timestamp line (no content after/before it)
    const tsMatch = line.match(/^\[(\d+:\d+)\]$/);
    if (tsMatch) continue; // skip bare timestamps

    // Section label line (just "HOOK", "BODY", "CTA", etc. with optional punctuation)
    const labelMatch = line.match(/^(HOOK|BODY|CTA|INTRO|OUTRO)([:.\-]|\s*$)/i);
    if (labelMatch) {
      const label = labelMatch[1].toUpperCase();
      if (label === "HOOK") {
        currentSection = { label: "Hook", color: "#A855F7", bgColor: "rgba(124,58,237,0.06)", lines: [] };
      } else if (label === "CTA") {
        currentSection = { label: "Call to Action", color: "#10B981", bgColor: "rgba(16,185,129,0.06)", lines: [] };
      } else {
        currentSection = { label, color: "#8B5CF6", bgColor: "rgba(139,92,246,0.04)", lines: [] };
      }
      // Strip the label from the line — anything after it is content
      const rest = line.replace(/^(HOOK|BODY|CTA|INTRO|OUTRO)[:.\-]\s*/i, "").trim();
      if (rest) currentSection.lines.push(rest);
      sections.push(currentSection);
      continue;
    }

    // Line that starts with a section label prefix
    const prefixMatch = line.match(/^(HOOK|BODY|CTA)[:\s]+(.+)/i);
    if (prefixMatch) {
      const label = prefixMatch[1].toUpperCase();
      const text = prefixMatch[2].trim();
      if (label === "HOOK") {
        currentSection = { label: "Hook", color: "#A855F7", bgColor: "rgba(124,58,237,0.06)", lines: text ? [text] : [] };
      } else if (label === "CTA") {
        currentSection = { label: "Call to Action", color: "#10B981", bgColor: "rgba(16,185,129,0.06)", lines: text ? [text] : [] };
      } else {
        currentSection = { label, color: "#8B5CF6", bgColor: "rgba(139,92,246,0.04)", lines: text ? [text] : [] };
      }
      sections.push(currentSection);
      continue;
    }

    // Camera/scene directions in brackets — treat as regular body text
    const sceneClean = line.replace(/^\[|\]$/g, "").trim();
    if (/^\[/.test(line) && !tsMatch) {
      // It's a scene cue — show it as readable text
      if (!currentSection) {
        currentSection = { label: "Script", color: "#8B5CF6", bgColor: "rgba(139,92,246,0.04)", lines: [] };
        sections.push(currentSection);
      }
      currentSection.lines.push(sceneClean);
      continue;
    }

    // Regular content line — add to current section
    if (!currentSection) {
      // No section detected yet — default to "Script" section
      currentSection = { label: "Script", color: "#8B5CF6", bgColor: "rgba(139,92,246,0.04)", lines: [] };
      sections.push(currentSection);
    }
    currentSection.lines.push(line);
  }

  // If we have content but no sections detected, wrap everything in one "Script" section
  if (sections.length === 0) {
    const allLines = rawLines.filter((l) => l.trim() !== "").map((l) => l.trim());
    if (allLines.length > 0) {
      sections.push({ label: "Script", color: "#8B5CF6", bgColor: "rgba(139,92,246,0.04)", lines: allLines });
    }
  }

  return sections;
}

function ScriptOutput({ content }: { content: string }) {
  const sections = parseScriptSections(content);
  const totalChars = content.length;

  // Fallback: if parsing produced nothing, just show raw content
  if (sections.length === 0 || sections.every((s) => s.lines.length === 0)) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Script</span>
          <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
          <CopyBtn text={content} label="Copy" />
        </div>
        {content.split("\n").filter((l) => l.trim()).map((line, i) => (
          <p key={i} className="text-[15px] text-[#E5E7EB] leading-relaxed">{line}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Script</span>
        <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
        <CopyBtn text={content} label="Copy" />
      </div>

      {/* Sections */}
      {sections.map((section, si) => (
        <div key={si} className="space-y-2">
          {/* Section label */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background: `${section.color}20` }} />
            <span className="text-[10px] font-bold uppercase tracking-widest px-2" style={{ color: section.color }}>{section.label}</span>
            <div className="h-px flex-1" style={{ background: `${section.color}20` }} />
          </div>

          {/* Lines in section */}
          <div className="space-y-1.5">
            {section.lines.map((line, li) => (
              <div key={li} className="group flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors duration-300">
                {/* Section-colored bullet */}
                <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: section.color, opacity: 0.6 }} />
                {/* Line text — always readable */}
                <span className="text-[15px] text-[#E5E7EB] leading-relaxed flex-1">{line}</span>
                {/* Copy per line */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-0.5">
                  <CopyBtn text={line} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
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
