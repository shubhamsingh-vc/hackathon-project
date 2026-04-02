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
  return (
    <button
      type="button"
      onClick={(e) => {
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
      }}
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(allTags);
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2000);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-300 ${
            copiedAll ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]" : "bg-white/5 border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
          }`}
        >
          {copiedAll ? "Copied!" : "Copy All"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {content.map((tag, i) => (
          <CopyBtn key={i} text={tag} label={tag.length > 15 ? tag.substring(0, 15) + "…" : tag} />
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
interface ScriptLine { type: "timestamp" | "scene" | "hook" | "cta" | "body" | "blank"; text: string; timestamp?: string; }
function parseScript(content: string): ScriptLine[] {
  const lines = content.split("\n");
  const result: ScriptLine[] = [];
  let hookCount = 0;
  let bodyStarted = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { result.push({ type: "blank", text: line }); continue; }
    const ts = trimmed.match(/^\[(\d+:\d+)\]/);
    if (ts) { result.push({ type: "timestamp", text: trimmed, timestamp: ts[1] }); continue; }
    const isScene = /^\[|^🎬|^\(.*\)$/.test(trimmed);
    if (isScene) { result.push({ type: "scene", text: trimmed }); continue; }
    if (!bodyStarted && hookCount < 3) { result.push({ type: "hook", text: trimmed }); hookCount++; bodyStarted = true; continue; }
    const remaining = lines.slice(i).filter((l) => l.trim());
    if (remaining.length <= 2 && !trimmed.startsWith("[")) { result.push({ type: "cta", text: trimmed }); continue; }
    result.push({ type: "body", text: trimmed });
  }
  return result;
}
function ScriptOutput({ content }: { content: string }) {
  const lines = parseScript(content);
  const totalChars = content.length;
  const timestamps = content.match(/\d+:\d+/g);
  const duration = timestamps && timestamps.length >= 2 ? "15–60s" : null;
  return (
    <div className="space-y-0.5 font-mono text-[13px]">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Script</span>
        <span className="text-[11px] text-[#6B7280]">{totalChars} chars</span>
        {duration && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(139,92,246,0.1)] text-[#8B5CF6] border border-[rgba(139,92,246,0.2)]">{duration}</span>}
      </div>
      {lines.map((line, i) => {
        if (line.type === "blank") return <div key={i} className="h-2" />;
        if (line.type === "timestamp") return (
          <div key={i} className="flex items-center gap-3 mt-3 mb-1">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono" style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8" }}>{line.timestamp}</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }} />
          </div>
        );
        if (line.type === "scene") return (
          <div key={i} className="flex items-center gap-2 py-2 text-[12px] italic" style={{ color: "rgba(168,85,247,0.7)" }}>
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#A855F7" }} />{line.text.replace(/^\[|]$/g, "")}
          </div>
        );
        if (line.type === "hook") return (
          <div key={i} className="group flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(124,58,237,0.25)", color: "#A855F7" }}>⚡</span>
            <div className="flex-1"><span className="text-[9px] font-bold uppercase tracking-widest mb-1 block" style={{ color: "#A855F7" }}>Hook</span><span className="text-[#FAFAFA] font-semibold leading-relaxed">{line.text}</span></div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"><CopyBtn text={line.text} /></div>
          </div>
        );
        if (line.type === "cta") return (
          <div key={i} className="group flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>→</span>
            <div className="flex-1"><span className="text-[9px] font-bold uppercase tracking-widest mb-1 block" style={{ color: "#10B981" }}>Call to Action</span><span className="text-[#10B981] font-medium leading-relaxed">{line.text}</span></div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"><CopyBtn text={line.text} /></div>
          </div>
        );
        return (
          <div key={i} className="group flex items-start gap-3 py-1 pl-4 hover:bg-white/[0.02] rounded transition-colors duration-300">
            <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#4B5563" }} />
            <span className="text-[#9CA3AF] leading-relaxed flex-1">{line.text}</span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"><CopyBtn text={line.text} /></div>
          </div>
        );
      })}
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
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const meta = TYPE_META[type] || { label: type, color: "#7C3AED" };

  // Sync when new content comes in
  const handleContentChange = (newContent: string | string[]) => {
    setContent(newContent);
    if (onRegenerate) onRegenerate(newContent);
  };

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

  const handleEdit = () => {
    setEditedText(getFullText());
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    const newContent = editedText;
    setContent(newContent);
    setEditMode(false);
    if (onRegenerate) onRegenerate(newContent);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedText("");
  };

  const handleShuffle = async () => {
    setShuffling(true);
    try {
      const endpointMap: Record<string, string> = {
        hook: "/api/generate/hook",
        caption: "/api/generate/caption",
        hashtags: "/api/generate/hashtags",
        script: "/api/generate/script",
      };
      const payload: Record<string, unknown> = { topic, platform, tone, creatorProfile };
      if (type === "script") payload.duration = duration || "short";

      const res = await fetch(endpointMap[type], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        let newContent: string | string[];
        if (type === "hook") newContent = data.hooks || [];
        else if (type === "hashtags") newContent = data.hashtags || [];
        else newContent = data.caption || data.script || "";
        handleContentChange(newContent);
      }
    } finally {
      setShuffling(false);
    }
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
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow" style={{ borderColor: `${meta.color}40`, color: meta.color, background: `${meta.color}12` }}>{meta.label}</span>
          <span className="eyebrow">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
          {type !== "hashtags" && <span className="eyebrow">{tone}</span>}
          {creatorProfile?.niche && <span className="eyebrow" style={{ borderColor: "rgba(124,58,237,0.3)", color: "#A855F7", background: "rgba(124,58,237,0.08)" }}>{creatorProfile.niche}</span>}
          {editMode && <span className="eyebrow !text-[#F59E0B] !border-[rgba(245,158,11,0.4)] !bg-[rgba(245,158,11,0.1)]">Editing</span>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Shuffle */}
          <button
            type="button"
            onClick={handleShuffle}
            disabled={shuffling}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20 transition-all duration-500"
          >
            {shuffling ? (
              <><span className="spinner !w-3 !h-3" />Regenerating...</>
            ) : (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>Shuffle</>
            )}
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={editMode ? handleSaveEdit : handleEdit}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-500 ${
              editMode
                ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)] hover:bg-[rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
            }`}
          >
            {editMode ? (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Save</>
            ) : (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</>
            )}
          </button>

          {/* Copy All */}
          <button
            type="button"
            onClick={handleCopyAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-500 ${
              copiedAll ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)]" : "bg-white/5 border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
            }`}
          >
            {copiedAll ? "Copied!" : "Copy All"}
          </button>

          {/* Save */}
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
      </div>

      {/* Edit Mode */}
      {editMode ? (
        <div className="bezel-outer mb-6">
          <div className="bezel-inner">
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #F59E0B80, transparent)" }} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <span className="text-[13px] font-semibold text-[#F59E0B]">Edit your content</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Make your changes below
                </div>
              </div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-white/[0.03] border border-[rgba(245,158,11,0.3)] rounded-xl p-4 text-[14px] text-[#E5E7EB] leading-relaxed font-mono resize-y outline-none focus:border-[rgba(245,158,11,0.6)] transition-colors duration-300"
                style={{ minHeight: "200px", background: "rgba(245,158,11,0.04)" }}
                autoFocus
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[12px] text-[#6B7280]">{editedText.length} characters</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-full text-[13px] font-medium bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10B981] hover:bg-[rgba(16,185,129,0.2)] transition-all duration-300"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Content */}
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
    </div>
  );
}
