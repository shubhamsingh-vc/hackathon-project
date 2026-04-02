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

  const handleCopy = async () => {
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
      // MongoDB failed — save to localStorage as fallback
      try {
        const existing = JSON.parse(localStorage.getItem("contentcraft_saved") || "[]");
        const newItem = {
          _id: `local_${Date.now()}`,
          ...saveData,
        };
        existing.unshift(newItem);
        localStorage.setItem("contentcraft_saved", JSON.stringify(existing.slice(0, 100)));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        // localStorage also failed — silently fail
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
        </div>

        <div className="flex items-center gap-2">
          {/* Save button */}
          {session && (
            <button
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

          {/* Sign in to save prompt */}
          {!session && (
            <button
              onClick={() => router.push("/auth/signin")}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-500 bg-white/5 border border-white/10 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/20"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Save
            </button>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
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
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result — Double-Bezel */}
      <div className="bezel-outer">
        <div className="bezel-inner">
          {/* Top accent bar */}
          <div
            className="h-px w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${meta.color}80, transparent)` }}
          />

          <div className="p-7">
            {/* Hashtags */}
            {type === "hashtags" && Array.isArray(content) && (
              <div className="flex flex-wrap gap-2">
                {content.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-[13px] font-mono font-medium bg-white/5 border border-white/8 text-[#A855F7] hover:border-[rgba(168,85,247,0.4)] hover:bg-[rgba(168,85,247,0.08)] transition-all duration-500 cursor-default"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Hooks */}
            {type === "hook" && Array.isArray(content) && (
              <div className="space-y-4">
                {content.map((hook, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[rgba(124,58,237,0.2)] hover:bg-[rgba(124,58,237,0.04)] transition-all duration-500 group"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5"
                      style={{ background: `${meta.color}18`, color: meta.color }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-[14px] text-[#E5E7EB] leading-relaxed group-hover:text-white transition-colors duration-500">
                      {hook}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Caption */}
            {type === "caption" && !Array.isArray(content) && (
              <div className="space-y-2">
                {content.split("\n").map((line, i) => (
                  <p key={i} className={`text-[14px] leading-relaxed ${line.trim() === "" ? "h-3" : "text-[#E5E7EB]"}`}>
                    {line}
                  </p>
                ))}
              </div>
            )}

            {/* Script */}
            {type === "script" && !Array.isArray(content) && (
              <div className="space-y-0.5 font-mono text-[13px]">
                {content.split("\n").map((line, i) => {
                  const isScene = /^\[|^🎬|^\(/.test(line.trim());
                  const isTimestamp = /^\[\d+:\d+\]/.test(line.trim());
                  const isHook = i < 3;
                  return (
                    <p
                      key={i}
                      className={`leading-relaxed ${
                        isScene ? "text-[#A855F7]/70 mt-3 -mb-1" :
                        isTimestamp ? "text-[#6366F1]/60" :
                        isHook ? "text-[#FAFAFA] font-semibold" :
                        "text-[#9CA3AF]"
                      }`}
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
