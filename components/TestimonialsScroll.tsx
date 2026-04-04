"use client";

import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const TESTIMONIALS = [
  { quote: "I went from spending 3 hours on captions to 30 seconds. The hooks are genuinely viral-worthy.", name: "Sarah Chen", handle: "@sarahchen.creates", avatar: "😀", platform: "Instagram", followers: "45K followers", accent: "#E1306C" },
  { quote: "The hashtag suggestions alone got me on the FYP for the first time ever. Game changer for my channel.", name: "Marcus Rivera", handle: "@marcusrivera", avatar: "😎", platform: "TikTok", followers: "82K followers", accent: "#00F2EA" },
  { quote: "I use ContentCraft every single day. It replaced my $200/month copywriter for first drafts.", name: "Aisha Okafor", handle: "@aishaokafor.fit", avatar: "🤩", platform: "YouTube", followers: "28K subscribers", accent: "#FF0000" },
  { quote: "The script generator saved me hours every week. Long-form content used to be a nightmare, now it's effortless.", name: "Jake Thompson", handle: "@jakethompson.fit", avatar: "💪", platform: "YouTube", followers: "120K subscribers", accent: "#FF0000" },
  { quote: "Best tool I've found for short-form content hooks. My retention rates went up 40% since I started using it.", name: "Priya Patel", handle: "@priyacreates", avatar: "✨", platform: "Instagram", followers: "67K followers", accent: "#E1306C" },
  { quote: "As a brand manager, I generate 20+ pieces of content daily. ContentCraft makes it possible.", name: "David Kim", handle: "@davidkim.mkt", avatar: "🎯", platform: "TikTok", followers: "150K followers", accent: "#00F2EA" },
  { quote: "The tone options are perfect for testing different content styles. I found my voice using this tool.", name: "Emma Rodriguez", handle: "@emmarodriguez", avatar: "🌟", platform: "Instagram", followers: "33K followers", accent: "#E1306C" },
  { quote: "The posting schedule feature is underrated. It helped me build a consistent content calendar.", name: "Chris Nguyen", handle: "@chrisnguyen.tv", avatar: "📺", platform: "YouTube", followers: "55K subscribers", accent: "#FF0000" },
];

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="w-[380px] flex-shrink-0 rounded-2xl p-6 group transition-all duration-500 relative overflow-hidden cursor-pointer testimonial-card"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.borderColor = `${t.accent}30`;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${t.accent}10`;
        if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        if (trackRef.current) trackRef.current.style.animationPlayState = "running";
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-6 right-6 h-px rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${t.accent}40, transparent)` }} />

      {/* Platform badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px]" style={{ background: `${t.accent}15` }}>
            {t.avatar}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#FAFAFA]">{t.name}</div>
            <div className="text-[11px]" style={{ color: t.accent }}>@{t.handle.replace("@", "")}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((star) => (
            <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="text-[22px] leading-snug mb-4" style={{ color: "rgba(250,250,250,0.35)" }}>"</div>
      <p className="text-[14px] text-[#D1D5DB] leading-relaxed mb-6 group-hover:text-[#FAFAFA] transition-colors duration-500">
        {t.quote}
      </p>

      {/* Platform + followers */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${t.accent}20` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.accent }} />
          </div>
          <span className="text-[12px] font-medium" style={{ color: t.accent }}>{t.platform}</span>
        </div>
        <span className="text-[12px] text-[#6B7280]">{t.followers}</span>
      </div>
    </div>
  );
}

export default function TestimonialsScroll() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 border-t border-white/[0.05] overflow-hidden">
      {/* Section header */}
      <div className="px-6 mb-12">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow mb-3 inline-flex">
                  <span style={{ color: "#F59E0B" }}>★</span>
                  Testimonials
                </span>
                <h2 className="text-[28px] md:text-[40px] font-extrabold tracking-tight text-[#FAFAFA]">
                  Loved by creators worldwide
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["😀", "😎", "🤩", "💪", "✨"].map((e, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[14px]">
                      {e}
                    </div>
                  ))}
                </div>
                <div className="ml-3">
                  <div className="text-[14px] font-bold text-[#FAFAFA]">2,400+</div>
                  <div className="text-[11px] text-[#6B7280]">Creators</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Gradient fade edges */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #0A0A0A, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #0A0A0A, transparent)" }} />

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="flex gap-4"
          style={{ width: "max-content", animation: "scrollLeft 60s linear infinite" }}
        >
          {/* Duplicate for seamless loop */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Scroll indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {[1,2,3].map((dot) => (
          <div
            key={dot}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: dot === 1 ? "32px" : "8px",
              background: dot === 1 ? "#7C3AED" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
        <span className="text-[11px] text-[#6B7280] ml-2 hidden md:inline">Auto-scrolling · hover to pause</span>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
