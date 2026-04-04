"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is ContentCraft really free to use?",
    a: "Yes! The generator is completely free during the hackathon demo. No credit card, no signup required — just enter your topic and generate.",
  },
  {
    q: "Which AI model powers ContentCraft?",
    a: "ContentCraft uses Claude Sonnet 4.6 via the OpusCode API gateway. Claude is known for nuanced, context-aware generation that's especially strong for creative writing tasks.",
  },
  {
    q: "Can I use the generated content commercially?",
    a: "Absolutely. The content you generate is yours to use however you want — on your personal accounts, client projects, or brand channels.",
  },
  {
    q: "What makes a good hook vs. a bad one?",
    a: "Great hooks create curiosity gaps, make bold claims, or tell micro-stories in 1-2 lines. Bad hooks are generic ('Hey everyone!') or don't promise any value. Our generator specifically avoids those patterns.",
  },
  {
    q: "How many hashtags should I actually use?",
    a: "Instagram allows 30, but research shows 8-15 is the sweet spot for reach + relevance. For TikTok, 3-5 highly relevant tags work best. YouTube is most effective with 5-8 targeted tags.",
  },
  {
    q: "Can I generate content for multiple platforms at once?",
    a: "Right now each generation targets one platform at a time — this keeps the output optimized. We're working on a cross-posting mode for the full release.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: isOpen ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isOpen ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {/* Question — clickable */}
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full flex items-start gap-4 p-5 text-left"
            >
              {/* Q badge */}
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
                style={{
                  background: isOpen ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.12)",
                  border: `1px solid ${isOpen ? "rgba(124,58,237,0.4)" : "rgba(124,58,237,0.25)"}`,
                }}
              >
                <span className="text-[10px] font-bold" style={{ color: "#A855F7" }}>Q</span>
              </div>

              {/* Question text */}
              <span
                className="flex-1 text-[15px] font-semibold leading-snug pt-1 transition-colors duration-300"
                style={{ color: isOpen ? "#FAFAFA" : "#E5E7EB" }}
              >
                {faq.q}
              </span>

              {/* Chevron */}
              <div className="flex-shrink-0 mt-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isOpen ? "#A855F7" : "#6B7280"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {/* Answer — animated reveal */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: isOpen ? "500px" : "0",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="px-5 pb-5 pl-5">
                {/* Accent line */}
                <div className="w-10 h-0.5 rounded-full mb-4" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.6), transparent)" }} />
                <p className="text-[14px] text-[#9CA3AF] leading-relaxed pl-0">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
