"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "youtube", label: "YouTube", color: "#FF0000" },
  { id: "tiktok", label: "TikTok", color: "#00F2EA" },
];

const CONTENT_TYPES = [
  { id: "hook", label: "Hook", description: "Scroll-stopping opener", icon: "⚡" },
  { id: "caption", label: "Caption", description: "Engaging caption", icon: "✍️" },
  { id: "hashtags", label: "Hashtags", description: "Trending tags", icon: "#️⃣" },
  { id: "script", label: "Script", description: "Video script", icon: "🎬" },
];

const TONES = [
  "Professional",
  "Funny",
  "Luxury",
  "Casual",
  "Inspirational",
  "Bold",
];

const SCRIPT_DURATIONS = [
  { id: "short", label: "Short — 15 to 60s" },
  { id: "long", label: "Long — 3 to 10 min" },
];

const PLACEHOLDERS: Record<string, string> = {
  hook: "e.g. Why I stopped scrolling and started creating...",
  caption: "e.g. My morning workout routine that changed everything",
  hashtags: "e.g. Healthy meal prep for busy professionals",
  script: "e.g. How I went from 0 to 100K followers",
};

type ResultType = {
  type: string;
  content: string | string[];
} | null;

export default function GeneratorForm() {
  const [platform, setPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("hook");
  const [tone, setTone] = useState("Casual");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("short");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or idea to generate content.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpointMap: Record<string, string> = {
        hook: "/api/generate/hook",
        caption: "/api/generate/caption",
        hashtags: "/api/generate/hashtags",
        script: "/api/generate/script",
      };

      const payload: Record<string, string> = { topic, platform, tone };
      if (contentType === "script") {
        payload.duration = duration;
      }

      const res = await fetch(endpointMap[contentType], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      let content: string | string[];
      if (contentType === "hook") {
        content = data.hooks || [];
      } else if (contentType === "hashtags") {
        content = data.hashtags || [];
      } else {
        content = data.caption || data.script || "";
      }

      setResult({ type: contentType, content });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Platform Selector */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-4">
          Platform
        </label>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`chip ${platform === p.id ? "active" : ""}`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: platform === p.id ? p.color : "transparent",
                  border: `1.5px solid ${p.color}`,
                  opacity: platform === p.id ? 1 : 0.6,
                }}
              />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Type Grid */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-4">
          Content Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.id}
              onClick={() => {
                setContentType(ct.id);
                setResult(null);
              }}
              className={`bezel-inner-subtle text-left cursor-pointer group transition-all duration-500 ${
                contentType === ct.id
                  ? "border-[rgba(124,58,237,0.5)] bg-[rgba(124,58,237,0.08)]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">{ct.icon}</span>
                <span className="text-[14px] font-semibold text-[#FAFAFA]">{ct.label}</span>
              </div>
              <p className="text-[11px] text-[#6B7280]">{ct.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Duration (Script only) */}
      {contentType === "script" && (
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-4">
            Video Length
          </label>
          <div className="flex gap-3">
            {SCRIPT_DURATIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDuration(d.id)}
                className={`chip ${duration === d.id ? "active" : ""}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tone Selector */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-4">
          Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`chip text-[13px] ${tone === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Input */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-4">
          Your Topic or Idea
        </label>
        <textarea
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setError(null); }}
          placeholder={PLACEHOLDERS[contentType]}
          className="input-base"
          rows={3}
        />
        {error && (
          <p className="mt-3 text-[13px] text-[#EF4444] flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`btn-primary w-full justify-center text-[15px] py-4 ${loading ? "opacity-80" : ""}`}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Generating with AI...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Generate {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
            <span className="icon-circle">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H5M11 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </>
        )}
      </button>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          <div className="skeleton h-20" />
          <div className="skeleton h-20" />
          <div className="skeleton h-20" />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <ResultCard
          type={result.type}
          content={result.content}
          platform={platform}
          tone={tone}
          topic={topic}
        />
      )}
    </div>
  );
}
