"use client";

import { useEffect, useState, useCallback } from "react";
import AppShell from "@/components/AppShell";

interface SavedItem {
  _id: string;
  type: string;
  platform: string;
  tone: string;
  topic: string;
  content: string | string[];
  createdAt: string;
}

const TYPE_META: Record<string, { label: string; color: string }> = {
  hook: { label: "Viral Hook", color: "#7C3AED" },
  caption: { label: "Caption", color: "#6366F1" },
  hashtags: { label: "Hashtags", color: "#A855F7" },
  script: { label: "Script", color: "#8B5CF6" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selected, setSelected] = useState<SavedItem | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/saved/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AppShell>
      <div className="pt-10 pb-16 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="eyebrow mb-3 inline-flex">Dashboard</span>
              <h1 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-[#FAFAFA]">
                Your Saved Content
              </h1>
              <p className="text-[14px] text-[#6B7280] mt-1">
                {items.length} saved item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <a href="/generate" className="btn-primary text-[14px] !py-2.5 !px-6 flex-shrink-0 w-max">
              Generate New
              <span className="icon-circle !w-5 !h-5">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-44" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bezel-inner-subtle text-center py-20 px-10">
              <div className="text-5xl mb-6">📝</div>
              <h2 className="text-xl font-bold text-[#FAFAFA] mb-3">No saved content yet</h2>
              <p className="text-[15px] text-[#6B7280] mb-8 max-w-sm mx-auto">
                Generate some content and click "Save to Library" to build your collection.
              </p>
              <a href="/generate" className="btn-primary text-[15px] py-3 px-8">
                Start Generating
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => {
                const meta = TYPE_META[item.type] || { label: item.type, color: "#7C3AED" };
                const preview = Array.isArray(item.content)
                  ? item.content.slice(0, 2).join(" / ")
                  : item.content.split("\n").slice(0, 2).join(" ");

                return (
                  <div
                    key={item._id}
                    className="bezel-inner-subtle card-interactive h-full flex flex-col cursor-pointer group"
                    onClick={() => setSelected(item)}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span
                        className="eyebrow"
                        style={{ borderColor: `${meta.color}40`, color: meta.color, background: `${meta.color}12` }}
                      >
                        {meta.label}
                      </span>
                      <span className="eyebrow">{item.platform}</span>
                    </div>

                    <h3 className="text-[15px] font-semibold text-[#FAFAFA] mb-2 line-clamp-1">
                      {item.topic}
                    </h3>

                    <p className="text-[13px] text-[#6B7280] line-clamp-2 flex-1 mb-4 leading-relaxed">
                      {preview}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
                      <span className="text-[11px] text-[#374151]">{formatDate(item.createdAt)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                        disabled={deleting === item._id}
                        className="text-[12px] text-[#374151] hover:text-[#EF4444] transition-colors disabled:opacity-50"
                      >
                        {deleting === item._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backdropFilter: "blur(16px)", background: "rgba(5,5,5,0.7)" }}
          onClick={() => setSelected(null)}
        >
          <div className="bezel-outer w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bezel-inner">
              <div
                className="h-px w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${TYPE_META[selected.type]?.color || "#7C3AED"}80, transparent)` }}
              />
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="eyebrow" style={{ borderColor: `${TYPE_META[selected.type]?.color}40`, color: TYPE_META[selected.type]?.color, background: `${TYPE_META[selected.type]?.color}12` }}>
                    {TYPE_META[selected.type]?.label}
                  </span>
                  <span className="eyebrow">{selected.platform}</span>
                  <span className="eyebrow">{selected.tone}</span>
                  <span className="eyebrow">{formatDate(selected.createdAt)}</span>
                </div>

                <h2 className="text-[18px] font-bold text-[#FAFAFA] mb-6">{selected.topic}</h2>

                <div className="space-y-1 font-mono text-[13px]">
                  {(Array.isArray(selected.content) ? selected.content : selected.content.split("\n")).map((line, i) => (
                    <p key={i} className={`leading-relaxed ${line.trim() === "" ? "h-3" : "text-[#9CA3AF]"}`}>{line}</p>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={async () => {
                      const text = Array.isArray(selected.content) ? selected.content.join("\n") : selected.content;
                      await navigator.clipboard.writeText(text);
                    }}
                    className="btn-primary text-[14px] !py-2.5 !px-5"
                  >
                    Copy All
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="btn-ghost text-[14px] !py-2.5 !px-5"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
