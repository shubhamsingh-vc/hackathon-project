"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { useRouter } from "next/navigation";

// ─── Types ───
interface QueueItem {
  id: string;
  topic: string;
  platform: string;
  type: string;
  tone: string;
  duration: string;
  status: "pending" | "generating" | "done";
  day: string; // "monday" | "tuesday" | etc.
  generatedContent?: string | string[];
  createdAt: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const CONTENT_TYPES = [
  { id: "hook", label: "Hook", color: "#C084FC", icon: "⚡" },
  { id: "caption", label: "Caption", color: "#34D399", icon: "✍️" },
  { id: "hashtags", label: "Hashtags", color: "#FB923C", icon: "#️⃣" },
  { id: "script", label: "Script", color: "#334155", icon: "🎬" },
];
const PLATFORMS = ["Instagram", "TikTok", "YouTube"];
const TONNES = ["Viral", "Educational", "Entertaining", "Inspirational"];
const DURATIONS = [
  { id: "short", label: "Short (15-60s)" },
  { id: "long", label: "Long (3-10 min)" },
];

const DAY_COLORS: Record<string, string> = {
  Monday: "#6366F1",
  Tuesday: "#8B5CF6",
  Wednesday: "#EC4899",
  Thursday: "#F59E0B",
  Friday: "#10B981",
  Saturday: "#F97316",
  Sunday: "#06B6D4",
};

// ─── Add to Queue Modal ───
function AddToQueueModal({ onAdd, onClose }: { onAdd: (item: Omit<QueueItem, "id" | "status" | "createdAt">) => void; onClose: () => void }) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [type, setType] = useState("hook");
  const [tone, setTone] = useState("Viral");
  const [duration, setDuration] = useState("short");
  const [day, setDay] = useState("Monday");

  const typeMeta = CONTENT_TYPES.find((t) => t.id === type) || CONTENT_TYPES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onAdd({ topic: topic.trim(), platform, type, tone, duration, day });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(16px)", background: "rgba(5,5,5,0.7)" }}
      onClick={onClose}
    >
      <div className="bezel-outer w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="bezel-inner">
          <div className="h-px w-full mb-6" style={{ background: `linear-gradient(90deg, transparent, ${typeMeta.color}60, transparent)` }} />
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">{typeMeta.icon}</span>
            <h2 className="text-[18px] font-bold text-[#FAFAFA]">Add to Content Plan</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Topic */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">Topic / Idea</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why morning routines changed my life"
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#E5E7EB] placeholder-[#374151] outline-none focus:border-white/20 transition-all"
                autoFocus
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">Content Type</label>
              <div className="grid grid-cols-4 gap-2">
                {CONTENT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-[12px] font-medium transition-all ${
                      type === t.id
                        ? "border-current"
                        : "border-white/8 text-[#6B7280] hover:border-white/15"
                    }`}
                    style={type === t.id ? { background: `${t.color}15`, color: t.color, borderColor: `${t.color}40` } : {}}
                  >
                    <span className="text-[18px]">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform + Day row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#E5E7EB] outline-none focus:border-white/20 transition-all appearance-none"
                >
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">Day</label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#E5E7EB] outline-none focus:border-white/20 transition-all appearance-none"
                >
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Tone + Duration row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#E5E7EB] outline-none focus:border-white/20 transition-all appearance-none"
                >
                  {TONNES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {type === "script" && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#E5E7EB] outline-none focus:border-white/20 transition-all appearance-none"
                  >
                    {DURATIONS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/4 border border-white/8 text-[#6B7280] hover:text-[#FAFAFA] hover:border-white/15 transition-all text-[14px] font-medium">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!topic.trim()}
                className="flex-1 py-3 rounded-xl font-medium text-[14px] transition-all disabled:opacity-40"
                style={{ background: `${typeMeta.color}20`, color: typeMeta.color, border: `1px solid ${typeMeta.color}40` }}
              >
                Add to Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Weekly Calendar ───
function WeeklyPlanner({ queue, onRemove }: { queue: QueueItem[]; onRemove: (id: string) => void }) {
  const router = useRouter();
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);

  const weekDates = DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const isToday = (d: Date) =>
    d.toDateString() === today.toDateString();

  const getItemsForDay = (day: string) =>
    queue.filter((q) => q.day === day);

  const pendingCount = queue.filter((q) => q.status === "pending").length;
  const doneCount = queue.filter((q) => q.status === "done").length;

  return (
    <div>
      {/* Progress bar */}
      {queue.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-[#6B7280] font-medium">Week Progress</span>
            <span className="text-[12px] font-semibold" style={{ color: "#34D399" }}>
              {doneCount}/{queue.length} generated
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${queue.length ? (doneCount / queue.length) * 100 : 0}%`, background: "linear-gradient(90deg, #C084FC, #34D399)" }}
            />
          </div>
        </div>
      )}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day, i) => {
          const items = getItemsForDay(day);
          const dayColor = DAY_COLORS[day];
          const date = weekDates[i];

          return (
            <div key={day} className="min-w-0">
              {/* Day header */}
              <div
                className="text-center mb-2 pb-2 rounded-lg"
                style={{ borderBottom: `2px solid ${isToday(date) ? dayColor : "transparent"}` }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">{day.slice(0, 3)}</div>
                <div
                  className="text-[14px] font-bold mt-0.5"
                  style={{ color: isToday(date) ? dayColor : "#9CA3AF" }}
                >
                  {date.getDate()}
                </div>
              </div>

              {/* Content slots */}
              <div className="space-y-1.5">
                {items.map((item) => {
                  const typeMeta = CONTENT_TYPES.find((t) => t.id === item.type) || CONTENT_TYPES[0];
                  return (
                    <div
                      key={item.id}
                      className="relative group rounded-lg p-2 text-[10px] leading-tight cursor-pointer transition-all"
                      style={{
                        background: item.status === "done" ? `${typeMeta.color}20` : `${typeMeta.color}10`,
                        border: `1px solid ${typeMeta.color}30`,
                      }}
                      onClick={() => {
                        if (item.status === "done") {
                          router.push("/generate");
                        }
                      }}
                      title={item.topic}
                    >
                      {/* Status dot */}
                      <div className="flex items-center gap-1 mb-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: item.status === "done" ? "#34D399" : item.status === "generating" ? "#FB923C" : "#6B7280" }}
                        />
                        <span className="text-[9px] font-semibold uppercase tracking-wider truncate" style={{ color: typeMeta.color }}>
                          {typeMeta.label}
                        </span>
                      </div>
                      <p className="text-[#E5E7EB] font-medium leading-tight line-clamp-2">{item.topic}</p>
                      <p className="text-[#6B7280] mt-0.5 truncate">{item.platform}</p>

                      {/* Remove button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Queue Panel ───
function QueuePanel({ queue, onGenerate, onRemove }: { queue: QueueItem[]; onGenerate: () => void; onRemove: (id: string) => void }) {
  const pending = queue.filter((q) => q.status === "pending");
  const generating = queue.find((q) => q.status === "generating");
  const done = queue.filter((q) => q.status === "done");

  return (
    <div className="space-y-4">
      {/* Header + Generate button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-[#FAFAFA]">Content Queue</h3>
          <p className="text-[12px] text-[#6B7280]">{pending.length} pending · {done.length} done</p>
        </div>
        {pending.length > 0 && (
          <button
            onClick={onGenerate}
            disabled={!!generating}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium transition-all disabled:opacity-40"
            style={{ background: "rgba(52,211,153,0.15)", color: "#34D399", border: "1px solid rgba(52,211,153,0.3)" }}
          >
            {generating ? (
              <><span className="spinner !w-3 !h-3" />Generating...</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>Generate All ({pending.length})</>
            )}
          </button>
        )}
      </div>

      {/* Pending items */}
      <div className="space-y-2">
        {pending.length === 0 && done.length === 0 && (
          <div className="text-center py-8 text-[13px] text-[#6B7280]">
            <p>No content in queue</p>
            <p className="text-[11px] mt-1">Add topics from the weekly planner</p>
          </div>
        )}
        {pending.map((item) => {
          const typeMeta = CONTENT_TYPES.find((t) => t.id === item.type) || CONTENT_TYPES[0];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: `${typeMeta.color}08`, border: `1px solid ${typeMeta.color}20` }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] flex-shrink-0" style={{ background: `${typeMeta.color}15` }}>
                {typeMeta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#E5E7EB] truncate">{item.topic}</p>
                <p className="text-[11px] text-[#6B7280]">{item.platform} · {item.day}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${typeMeta.color}15`, color: typeMeta.color }}>
                  {typeMeta.label}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-white/5 transition-all text-[12px]"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}

        {/* Done items */}
        {done.length > 0 && (
          <>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] pt-2">Generated</div>
            {done.map((item) => {
              const typeMeta = CONTENT_TYPES.find((t) => t.id === item.type) || CONTENT_TYPES[0];
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl opacity-60"
                  style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#E5E7EB] truncate">{item.topic}</p>
                    <p className="text-[11px] text-[#6B7280]">{item.platform} · {item.day}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-white/5 transition-all text-[12px]"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───
export default function DashboardPage() {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Load queue from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("contentcraft_queue");
      if (saved) setQueue(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Save queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("contentcraft_queue", JSON.stringify(queue));
    } catch { /* ignore */ }
  }, [queue]);

  const addToQueue = (item: Omit<QueueItem, "id" | "status" | "createdAt">) => {
    setQueue((prev) => [
      ...prev,
      { ...item, id: `q_${Date.now()}`, status: "pending", createdAt: new Date().toISOString() },
    ]);
  };

  const removeFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const generateAll = async () => {
    const pending = queue.filter((q) => q.status === "pending");
    if (!pending.length) return;

    setGenerating(true);

    for (const item of pending) {
      // Mark as generating
      setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, status: "generating" as const } : q));

      try {
        const res = await fetch(`/api/generate/${item.type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: item.topic,
            platform: item.platform.toLowerCase(),
            tone: item.tone.toLowerCase(),
            duration: item.duration,
          }),
        });

        const data = await res.json();

        // Mark as done
        setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, status: "done" as const, generatedContent: data.content } : q));
      } catch {
        // On error, mark as pending again
        setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, status: "pending" as const } : q));
      }
    }

    setGenerating(false);
  };

  const savedCount = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("contentcraft_saved") || "[]");
      return Array.isArray(saved) ? saved.length : 0;
    } catch { return 0; }
  })();

  return (
    <AppShell>
      <div className="pt-10 pb-16 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="eyebrow mb-3 inline-flex">
                <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: "#7C3AED", boxShadow: "0 0 8px #7C3AED80" }} />
                Content Planner
              </span>
              <h1 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-[#FAFAFA]">
                Plan Your Week
              </h1>
              <p className="text-[14px] text-[#6B7280] mt-1">
                {queue.length} items planned · {savedCount} saved items
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/generate" className="btn-ghost text-[14px] !py-2.5 !px-5 flex-shrink-0">
                Quick Generate
              </a>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary text-[14px] !py-2.5 !px-6 flex-shrink-0"
              >
                + Add Content
              </button>
            </div>
          </div>

          {/* This week label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">
              {(() => {
                const now = new Date();
                const monday = new Date(now);
                monday.setDate(now.getDate() - now.getDay() + 1);
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return `${fmt(monday)} — ${fmt(sunday)}`;
              })()}
            </div>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Planner — 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bezel-inner-subtle p-5">
                <WeeklyPlanner queue={queue} onRemove={removeFromQueue} />
              </div>
            </div>

            {/* Queue Panel — 1/3 width */}
            <div className="lg:col-span-1">
              <div className="bezel-inner-subtle p-5">
                <QueuePanel queue={queue} onGenerate={generateAll} onRemove={removeFromQueue} />
              </div>
            </div>
          </div>

          {/* Tips */}
          {queue.length === 0 && (
            <div className="mt-6 bezel-inner-subtle p-6 text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-[16px] font-bold text-[#FAFAFA] mb-2">Plan your content week</h3>
              <p className="text-[13px] text-[#6B7280] mb-5 max-w-sm mx-auto">
                Add content topics to your weekly plan. When you're ready, generate all at once with one click.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary text-[14px] py-2.5 px-8"
              >
                Add Your First Content
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add to Queue Modal */}
      {showAddModal && <AddToQueueModal onAdd={addToQueue} onClose={() => setShowAddModal(false)} />}
    </AppShell>
  );
}
