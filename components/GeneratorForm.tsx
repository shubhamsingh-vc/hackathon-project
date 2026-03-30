"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", emoji: "📸" },
  { id: "youtube", label: "YouTube", emoji: "▶️" },
  { id: "tiktok", label: "TikTok", emoji: "🎵" },
];

const CONTENT_TYPES = [
  { id: "hook", label: "Hook", description: "Scroll-stopping opener" },
  { id: "caption", label: "Caption", description: "Engaging caption" },
  { id: "hashtags", label: "Hashtags", description: "Trending tags" },
  { id: "script", label: "Script", description: "Video script" },
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
  { id: "short", label: "Short (15–60s)" },
  { id: "long", label: "Long (3–10 min)" },
];

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
      setError("Please enter a topic or idea first.");
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

      const endpoint = endpointMap[contentType];
      const payload: Record<string, string> = {
        topic,
        platform,
        tone,
      };

      if (contentType === "script") {
        payload.duration = duration;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      // Normalize response based on type
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
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Platform Selector */}
      <div className="mb-8 animate-fade-up">
        <label className="block text-sm font-medium text-[#64748B] mb-3">Platform</label>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`chip ${platform === p.id ? "active" : ""}`}
            >
              <span>{p.emoji}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Type Selector */}
      <div className="mb-8 animate-fade-up-delay-1">
        <label className="block text-sm font-medium text-[#64748B] mb-3">Content Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.id}
              onClick={() => {
                setContentType(ct.id);
                setResult(null);
              }}
              className={`card cursor-pointer text-left transition-all ${
                contentType === ct.id
                  ? "border-[#6366F1] bg-[#1E2330]"
                  : "hover:border-[#6366F1]/30"
              }`}
            >
              <div className="text-sm font-semibold text-[#F1F5F9] mb-0.5">{ct.label}</div>
              <div className="text-xs text-[#64748B]">{ct.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Script Duration (only when script is selected) */}
      {contentType === "script" && (
        <div className="mb-8 animate-fade-up">
          <label className="block text-sm font-medium text-[#64748B] mb-3">Video Duration</label>
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
      <div className="mb-8 animate-fade-up-delay-1">
        <label className="block text-sm font-medium text-[#64748B] mb-3">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`chip text-sm ${tone === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Input */}
      <div className="mb-8 animate-fade-up-delay-2">
        <label className="block text-sm font-medium text-[#64748B] mb-3">
          Your Topic or Idea
        </label>
        <textarea
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setError(null);
          }}
          placeholder={
            contentType === "hook"
              ? "e.g. Why morning routines changed my life..."
              : contentType === "hashtags"
              ? "e.g. Healthy meal prep recipes for busy professionals"
              : contentType === "caption"
              ? "e.g. My morning workout routine that got me in the best shape"
              : "e.g. How I grew my following from 0 to 100K in 6 months"
          }
          className="input-base resize-none"
          rows={3}
        />
        {error && (
          <p className="mt-2 text-sm text-[#EF4444]">{error}</p>
        )}
      </div>

      {/* Generate Button */}
      <div className="mb-10 animate-fade-up-delay-3">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full md:w-auto btn-primary text-base ${
            loading ? "animate-pulse-glow" : ""
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              Generating with AI...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
            </>
          )}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="animate-fade-up">
          <div className="skeleton h-40 w-full mb-4" />
          <div className="skeleton h-20 w-full" />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <ResultCard
          type={result.type}
          content={result.content}
          platform={platform}
          tone={tone}
        />
      )}
    </div>
  );
}
