"use client";

import { useState } from "react";
import GeneratorForm from "./GeneratorForm";
import ScrollReveal from "./ScrollReveal";

export default function GeneratorToggle() {
  const [open, setOpen] = useState(false);

  return (
    <section id="generator" className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Collapsed — highlighted CTA button */}
        {!open && (
          <div className="text-center">
            <ScrollReveal>
              <div
                className="relative rounded-2xl p-10 text-center cursor-pointer group transition-all duration-500"
                style={{
                  background: "rgba(124,58,237,0.06)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  boxShadow: "0 0 0 0 rgba(124,58,237,0)",
                }}
                onClick={() => setOpen(true)}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(124,58,237,0.1)";
                  el.style.borderColor = "rgba(124,58,237,0.4)";
                  el.style.boxShadow = "0 0 40px rgba(124,58,237,0.2), 0 0 80px rgba(124,58,237,0.08)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(124,58,237,0.06)";
                  el.style.borderColor = "rgba(124,58,237,0.2)";
                  el.style.boxShadow = "0 0 0 0 rgba(124,58,237,0)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Animated pulse ring */}
                <div
                  className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                  style={{ animationDuration: "3s" }}
                />

                {/* Glow center */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(124,58,237,0.15) 0%, transparent 70%)",
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>

                  <h2 className="text-[24px] md:text-[32px] font-extrabold tracking-tight text-[#FAFAFA] mb-3 group-hover:text-white transition-colors">
                    Try it now — it&apos;s <span className="glow-text">completely free</span>
                  </h2>
                  <p className="text-[14px] text-[#6B7280] mb-6 max-w-sm mx-auto">
                    No signup, no credit card. Just your topic and the power of AI.
                  </p>

                  <div
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[15px] transition-all duration-300"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                    }}
                  >
                    <span>Open AI Generator</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>

                  <p className="text-[11px] text-[#374151] mt-4">Click to expand · Works on all platforms</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Expanded — full generator */}
        {open && (
          <div>
            <ScrollReveal>
              <div className="text-center mb-8">
                <span className="eyebrow mb-4 inline-flex">
                  <span style={{ color: "#7C3AED" }}>◆</span>
                  AI Generator
                </span>
                <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-[#FAFAFA] mb-2">
                  Create Content <span className="glow-text">10x Faster</span>
                </h2>
                <p className="text-[14px] text-[#6B7280]">
                  Generate hooks, captions, hashtags, and scripts — all in seconds.
                </p>
              </div>
            </ScrollReveal>

            {/* Close toggle */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-[12px] text-[#6B7280] hover:text-[#FAFAFA] transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
                Close Generator
              </button>
            </div>

            <ScrollReveal blur delay={100}>
              <div className="bezel-outer">
                <div className="bezel-inner p-6 md:p-10">
                  <GeneratorForm />
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}
