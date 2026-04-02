"use client";

import { useState, useEffect } from "react";
import ResultCard from "./ResultCard";

type CreatorProfile = {
  niche: string;
  targetAudience: string;
  goals: string[];
};

const AUDIENCE_OPTIONS = [
  "Women 18-34",
  "Men 18-34",
  "Gen Z (13-26)",
  "Millennials (27-42)",
  "Gen X (43-58)",
  "Seniors 58+",
  "Teenagers",
  "College Students",
  "Working Professionals",
  "Busy Moms",
  "Dads",
  "Entrepreneurs",
  "Fitness Enthusiasts",
  "Beauty & Fashion Lovers",
  "Foodies",
  "Tech Lovers",
  "Gamers",
  "Travelers",
  "Parents",
  "Small Business Owners",
  "Creators & Influencers",
  "Students",
  "Remote Workers",
  "Health & Wellness Seekers",
  "DIY & Crafters",
  "Pet Owners",
  "Book Lovers",
  "Music Lovers",
  "Parents of Toddlers",
  "Parents of Teens",
];

const NICHES = [
  { id: "lifestyle", label: "Lifestyle", emoji: "✨", color: "#F472B6" },
  { id: "fitness", label: "Fitness & Health", emoji: "💪", color: "#10B981" },
  { id: "fashion", label: "Fashion & Beauty", emoji: "👗", color: "#EC4899" },
  { id: "tech", label: "Tech & Gadgets", emoji: "⚡", color: "#6366F1" },
  { id: "food", label: "Food & Cooking", emoji: "🍳", color: "#F59E0B" },
  { id: "travel", label: "Travel", emoji: "✈️", color: "#0EA5E9" },
  { id: "finance", label: "Finance & Investing", emoji: "📈", color: "#22C55E" },
  { id: "education", label: "Education & Learning", emoji: "📚", color: "#8B5CF6" },
  { id: "entertainment", label: "Entertainment", emoji: "🎭", color: "#EF4444" },
  { id: "business", label: "Business & Marketing", emoji: "🚀", color: "#F97316" },
  { id: "gaming", label: "Gaming", emoji: "🎮", color: "#A855F7" },
  { id: "art", label: "Art & Design", emoji: "🎨", color: "#E879F9" },
  { id: "parenting", label: "Parenting & Family", emoji: "👨‍👩‍👧", color: "#FB923C" },
  { id: "selfimprovement", label: "Self-Improvement", emoji: "🌱", color: "#34D399" },
  { id: "photography", label: "Photography", emoji: "📸", color: "#64748B" },
  { id: "pets", label: "Pets & Animals", emoji: "🐾", color: "#D97706" },
  { id: "music", label: "Music", emoji: "🎵", color: "#06B6D4" },
  { id: "other", label: "Other", emoji: "🌟", color: "#9CA3AF" },
];

const GOALS = [
  { id: "grow", label: "Grow Audience" },
  { id: "engage", label: "Drive Engagement" },
  { id: "brand", label: "Build Brand" },
  { id: "educate", label: "Educate & Inform" },
  { id: "entertain", label: "Entertain" },
  { id: "inspire", label: "Inspire & Motivate" },
  { id: "document", label: "Document Journey" },
  { id: "showcase", label: "Showcase Work" },
];

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

function getPlaceholder(contentType: string, niche: string): string {
  if (!niche) return PLACEHOLDERS[contentType] || "Describe your topic...";
  return PLACEHOLDERS[contentType] || `Your ${niche} topic...`;
}

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

  // Creator Profile state
  const [niche, setNiche] = useState("");
  const [nicheOpen, setNicheOpen] = useState(false);
  const [nicheSearch, setNicheSearch] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [audienceSearch, setAudienceSearch] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Filtered niches for search
  const filteredNiches = NICHES.filter((n) =>
    n.label.toLowerCase().includes(nicheSearch.toLowerCase())
  );

  // Filtered audience for search
  const filteredAudience = AUDIENCE_OPTIONS.filter((a) =>
    a.toLowerCase().includes(audienceSearch.toLowerCase())
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest(".niche-dropdown") && !target.closest(".audience-dropdown")) {
        setNicheOpen(false);
        setNicheSearch("");
        setAudienceOpen(false);
        setAudienceSearch("");
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Load existing creator profile on mount
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.creatorProfile) {
          setNiche(data.creatorProfile.niche || "");
          setTargetAudience(data.creatorProfile.targetAudience || "");
          setGoals(data.creatorProfile.goals || []);
          if (data.creatorProfile.niche && !topic) {
            setTopic(data.creatorProfile.niche);
          }
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    const profile = { niche, targetAudience, goals };
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorProfile: profile }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {
      // MongoDB failed — save to localStorage as fallback
      localStorage.setItem("creatorProfile", JSON.stringify(profile));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } finally {
      setProfileSaving(false);
    }
  };

  const creatorProfile: CreatorProfile = { niche, targetAudience, goals };
  const hasProfile = niche || targetAudience || goals.length > 0;

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

      const payload: Record<string, unknown> = { topic, platform, tone, creatorProfile };
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>

      {/* ─── Creator Profile Section ─── */}
      <div
        className="rounded-2xl border"
        style={{
          background: "rgba(124,58,237,0.04)",
          border: "1px solid rgba(124,58,237,0.2)",
          boxShadow: "0 0 24px rgba(124,58,237,0.08)",
        }}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#7C3AED", boxShadow: "0 0 6px #7C3AED" }}
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A855F7]">
              Creator Profile
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={profileSaving}
            className={`text-[12px] px-4 py-1.5 rounded-full font-medium transition-all duration-300 ${
              profileSaved
                ? "bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]"
                : "bg-[rgba(124,58,237,0.2)] text-[#A855F7] border border-[rgba(124,58,237,0.4)] hover:bg-[rgba(124,58,237,0.3)]"
            }`}
          >
            {profileSaving ? (
              <span className="flex items-center gap-1.5">
                <span className="spinner !w-3 !h-3" />
                Saving...
              </span>
            ) : profileSaved ? (
              <span className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved!
              </span>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 pb-6 pt-5 space-y-4">
          {/* Niche Smart Dropdown */}
          <div className="niche-dropdown relative">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
              Content Niche
            </label>

            {/* Trigger */}
            <button
              type="button"
              onClick={() => setNicheOpen(!nicheOpen)}
              className={`
                w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer text-left
                ${nicheOpen
                  ? "border-[rgba(124,58,237,0.5)] bg-[rgba(124,58,237,0.08)]"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]"
                }
              `}
              style={nicheOpen ? { boxShadow: "0 0 20px rgba(124,58,237,0.2)" } : {}}
            >
              {niche ? (
                (() => {
                  const selected = NICHES.find((n) => n.label === niche);
                  return (
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{selected?.emoji || "✨"}</span>
                      <span className="text-[14px] text-[#FAFAFA] font-medium">{niche}</span>
                    </span>
                  );
                })()
              ) : (
                <span className="text-[14px] text-[#6B7280]">Select your niche...</span>
              )}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={nicheOpen ? "#A855F7" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 transition-transform duration-300"
                style={{ transform: nicheOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {nicheOpen && (
              <div
                className="mt-2 rounded-xl border border-white/[0.1] overflow-hidden"
                style={{
                  background: "#0D0D0D",
                  boxShadow: "0 0 40px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
                }}
              >
                {/* Search */}
                <div className="p-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      value={nicheSearch}
                      onChange={(e) => setNicheSearch(e.target.value)}
                      placeholder="Search niches..."
                      className="flex-1 bg-transparent text-[13px] text-[#E5E7EB] placeholder-[#4B5563] outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="max-h-64 overflow-y-auto py-2">
                  {filteredNiches.length === 0 ? (
                    <div className="px-4 py-6 text-center text-[13px] text-[#6B7280]">
                      No niches found
                    </div>
                  ) : (
                    filteredNiches.map((n) => {
                      const isSelected = niche === n.label;
                      return (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            setNiche(n.label);
                            setNicheOpen(false);
                            setNicheSearch("");
                          }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 cursor-pointer
                            ${isSelected ? "bg-[rgba(124,58,237,0.12)]" : "hover:bg-white/[0.04]"}
                          `}
                        >
                          <span className="text-xl w-7 text-center">{n.emoji}</span>
                          <span className={`text-[14px] ${isSelected ? "text-white font-medium" : "text-[#9CA3AF]"}`}>
                            {n.label}
                          </span>
                          {isSelected && (
                            <svg className="ml-auto flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Target Audience */}
          <div className="audience-dropdown relative">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
              Target Audience
            </label>

            {/* Trigger */}
            <button
              type="button"
              onClick={() => setAudienceOpen(!audienceOpen)}
              className={`
                w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer text-left
                ${audienceOpen
                  ? "border-[rgba(124,58,237,0.5)] bg-[rgba(124,58,237,0.08)]"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]"
                }
              `}
              style={audienceOpen ? { boxShadow: "0 0 20px rgba(124,58,237,0.2)" } : {}}
            >
              {targetAudience ? (
                <span className="text-[14px] text-[#FAFAFA] font-medium">{targetAudience}</span>
              ) : (
                <span className="text-[14px] text-[#6B7280]">Select your audience...</span>
              )}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={audienceOpen ? "#A855F7" : "#6B7280"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 transition-transform duration-300"
                style={{ transform: audienceOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {audienceOpen && (
              <div
                className="mt-2 rounded-xl border border-white/[0.1] overflow-hidden absolute top-full left-0 right-0 z-50"
                style={{
                  background: "#0D0D0D",
                  boxShadow: "0 0 40px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
                }}
              >
                {/* Search */}
                <div className="p-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      value={audienceSearch}
                      onChange={(e) => setAudienceSearch(e.target.value)}
                      placeholder="Search audience..."
                      className="flex-1 bg-transparent text-[13px] text-[#E5E7EB] placeholder-[#4B5563] outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="max-h-52 overflow-y-auto py-2">
                  {filteredAudience.length === 0 ? (
                    <div className="px-4 py-6 text-center text-[13px] text-[#6B7280]">
                      No results found
                    </div>
                  ) : (
                    filteredAudience.map((option, i) => {
                      const isSelected = targetAudience === option;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setTargetAudience(option);
                            setAudienceOpen(false);
                            setAudienceSearch("");
                          }}
                          className={`
                            w-full flex items-center justify-between px-4 py-2.5 transition-all duration-200 cursor-pointer
                            ${isSelected ? "bg-[rgba(124,58,237,0.12)]" : "hover:bg-white/[0.04]"}
                          `}
                        >
                          <span className={`text-[14px] ${isSelected ? "text-white font-medium" : "text-[#9CA3AF]"}`}>
                            {option}
                          </span>
                          {isSelected && (
                            <svg className="flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content Goals */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
              Content Goals
            </label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((goal) => {
                const isActive = goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-300 cursor-pointer ${
                      isActive ? "text-white" : "text-[#6B7280] border-white/[0.08] hover:border-white/[0.15]"
                    }`}
                    style={isActive ? {
                      background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.25))",
                      border: "1px solid rgba(124,58,237,0.5)",
                      boxShadow: "0 0 12px rgba(124,58,237,0.25)",
                    } : {}}
                  >
                    {goal.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Selector */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-4">
          Platform
        </label>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
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
          {CONTENT_TYPES.map((ct) => {
            const isActive = contentType === ct.id;
            return (
              <button
                key={ct.id}
                type="button"
                onClick={() => {
                  setContentType(ct.id);
                  setResult(null);
                }}
                className={`
                  relative overflow-hidden rounded-2xl p-5 text-left cursor-pointer
                  transition-all duration-500 ease-out
                  border backdrop-blur-sm
                  ${isActive
                    ? "border-[rgba(124,58,237,0.6)] scale-[1.03] bg-[rgba(124,58,237,0.1)]"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] hover:scale-[1.01]"
                  }
                `}
                style={{
                  boxShadow: isActive
                    ? "0 0 24px rgba(124,58,237,0.25), inset 0 0 16px rgba(124,58,237,0.06)"
                    : "none",
                }}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background: "linear-gradient(90deg, #7C3AED, #A855F7)",
                    boxShadow: "0 0 12px rgba(124,58,237,0.6)",
                  }}
                />
                <div
                  className={`text-2xl mb-3 transition-all duration-500 ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                >
                  {ct.icon}
                </div>
                <div className={`text-[14px] font-bold mb-1 transition-colors duration-500 ${
                  isActive ? "text-[#FAFAFA]" : "text-[#9CA3AF]"
                }`}>
                  {ct.label}
                </div>
                <div className={`text-[11px] transition-colors duration-500 ${
                  isActive ? "text-[#A855F7]" : "text-[#6B7280]"
                }`}>
                  {ct.description}
                </div>
              </button>
            );
          })}
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
                type="button"
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
              type="button"
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
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder(contentType, niche)}
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
        type="submit"
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
          creatorProfile={creatorProfile}
        />
      )}
    </form>
  );
}
