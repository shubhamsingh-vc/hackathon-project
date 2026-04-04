import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import GeneratorForm from "@/components/GeneratorForm";
import ScrollReveal from "@/components/ScrollReveal";
import TestimonialsScroll from "@/components/TestimonialsScroll";

/* ===== DATA ===== */
const STATS = [
  { value: "4", label: "AI Content Tools" },
  { value: "3", label: "Platforms Supported" },
  { value: "6", label: "Tone Options" },
  { value: "< 5s", label: "Avg. Generation Time" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Viral Hook Generator",
    description: "Scroll-stopping opening lines that make viewers stop and watch. Perfect for Reels, Shorts, and TikToks.",
    accent: "#7C3AED",
    delay: 0,
  },
  {
    icon: "✍️",
    title: "Caption Generator",
    description: "Engaging, platform-optimized captions that drive comments, saves, and shares — in your unique voice.",
    accent: "#6366F1",
    delay: 100,
  },
  {
    icon: "#️⃣",
    title: "Hashtag Suggestions",
    description: "20+ relevant, trending hashtags that balance reach and niche. Never stare at a blank hashtag field again.",
    accent: "#A855F7",
    delay: 200,
  },
  {
    icon: "🎬",
    title: "Script Generator",
    description: "Short-form or long-form video scripts with built-in structure. Hook, Body, CTA — ready to film.",
    accent: "#8B5CF6",
    delay: 300,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Enter Your Topic",
    description: "Type your idea, niche, or message. Pick a platform, content type, and tone that fits your brand.",
  },
  {
    number: "02",
    title: "AI Creates Magic",
    description: "Claude generates scroll-stopping hooks, captions, hashtags, or scripts tailored for your audience.",
  },
  {
    number: "03",
    title: "Copy & Create",
    description: "Copy with one click. Paste into your scheduler or post directly. Your content, amplified.",
  },
];

const TESTIMONIALS = [
  { quote: "I went from spending 3 hours on captions to 30 seconds. The hooks are genuinely viral-worthy.", name: "Sarah Chen", handle: "@sarahchen.creates", avatar: "😀", platform: "Instagram", followers: "45K followers", accent: "#E1306C" },
  { quote: "The hashtag suggestions alone got me on the FYP for the first time ever. Game changer for my channel.", name: "Marcus Rivera", handle: "@marcusrivera", avatar: "😎", platform: "TikTok", followers: "82K followers", accent: "#00F2EA" },
  { quote: "I use ContentCraft every single day. It replaced my $200/month copywriter for first drafts.", name: "Aisha Okafor", handle: "@aishaokafor.fit", avatar: "🤩", platform: "YouTube", followers: "28K subscribers", accent: "#FF0000" },
  { quote: "The script generator saved me hours every week. Long-form content used to be a nightmare, now it's effortless.", name: "Jake Thompson", handle: "@jakethompson.fit", avatar: "💪", platform: "YouTube", followers: "120K subscribers", accent: "#FF0000" },
  { quote: "Best tool I've found for short-form content hooks. My retention rates went up 40% since I started using it.", name: "Priya Patel", handle: "@priyacreates", avatar: "✨", platform: "Instagram", followers: "67K followers", accent: "#E1306C" },
  { quote: "As a brand manager, I generate 20+ pieces of content daily. ContentCraft makes it possible.", name: "David Kim", handle: "@davidkim.mkt", avatar: "🎯", platform: "TikTok", followers: "150K followers", accent: "#00F2EA" },
  { quote: "The tone options are perfect for testing different content styles. I found my voice using this tool.", name: "Emma Rodriguez", handle: "@emmarodriguez", avatar: "🌟", platform: "Instagram", followers: "33K followers", accent: "#E1306C" },
  { quote: "The posting schedule feature is underrated. It actually helped me build a consistent content calendar.", name: "Chris Nguyen", handle: "@chrisnguyen.tv", avatar: "📺", platform: "YouTube", followers: "55K subscribers", accent: "#FF0000" },
];

const PLATFORM_USE_CASES = [
  {
    platform: "Instagram",
    color: "#E1306C",
    emoji: "📸",
    benefits: [
      "Reels hooks that stop the scroll in 1.5 seconds",
      "Caption styles optimized for the algorithm",
      "Hashtag sets that maximize discoverability",
      "CTA phrasing that drives saves and shares",
    ],
    tip: "Instagram's algorithm rewards saves and shares — our captions are engineered for exactly that.",
  },
  {
    platform: "YouTube",
    color: "#FF0000",
    emoji: "▶️",
    benefits: [
      "Shorts hooks optimized for the first 5 seconds",
      "Long-form script templates with structure",
      "SEO-friendly descriptions and tags",
      "Community post caption ideas",
    ],
    tip: "YouTube Shorts and long-form both need different approaches — we handle both natively.",
  },
  {
    platform: "TikTok",
    color: "#00F2EA",
    emoji: "🎵",
    benefits: [
      "Trend-aware hook patterns that fit sounds",
      "Casual, conversational caption voice",
      "Viral hashtag mix — niche + trending",
      "Script pacing for 15-60 second videos",
    ],
    tip: "TikTok rewards authenticity and speed. Our scripts are built for fast-paced, conversational delivery.",
  },
];

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

const MARQUEE_ITEMS = [
  "Content Creation", "Social Media", "Creator Economy", "Hook Writing",
  "Viral Growth", "YouTube Shorts", "TikTok Strategy", "Instagram Reels",
  "Caption Writing", "Hashtag Research", "Video Scripts", "Creator Tools",
];

/* ===== COMPONENT ===== */
export default function Home() {
  return (
    <div className="relative z-[2]">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="min-h-[100dvh] flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center">
        <ScrollReveal>
          <span className="eyebrow mb-8 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: "#7C3AED", boxShadow: "0 0 8px #7C3AED80" }} />
            Powered by Claude Sonnet 4.6
          </span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-[52px] md:text-[88px] lg:text-[108px] font-extrabold tracking-tight leading-[0.92] mb-8 max-w-5xl">
            Create Content
            <br />
            <span className="glow-text">10x Faster</span>
            <br />
            with AI
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-[17px] md:text-[19px] text-[#6B7280] max-w-xl mx-auto mb-12 leading-relaxed">
            Generate viral hooks, captions, hashtags, and video scripts for Instagram, YouTube, and TikTok — in seconds, not hours.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#generator" className="btn-primary text-[15px] py-4 px-8">
              Start Creating Free
              <span className="icon-circle">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 11L11 1M11 1H5M11 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
            <a href="#features" className="btn-ghost text-[15px] py-4 px-8">
              See All Features
            </a>
          </div>
        </ScrollReveal>

        {/* Platform indicators */}
        <ScrollReveal delay={400}>
          <div className="mt-20 flex items-center justify-center gap-8">
            {[
              { name: "Instagram", color: "#E1306C" },
              { name: "YouTube", color: "#FF0000" },
              { name: "TikTok", color: "#00F2EA" },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2.5 opacity-40 hover:opacity-70 transition-opacity duration-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}60` }} />
                <span className="text-[12px] font-medium text-[#6B7280]">{p.name}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="py-8 border-y border-white/[0.05] overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="marquee-track flex items-center gap-8">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="text-[13px] font-medium text-[#374151] flex items-center gap-8">
                <span className="w-1 h-1 rounded-full bg-[#7C3AED]/40 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bezel-outer">
            <div className="bezel-inner">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
                {STATS.map((stat, i) => (
                  <ScrollReveal key={stat.label} delay={i * 80}>
                    <div className="text-center px-8 py-10 first:pl-0 last:pr-0">
                      <div className="text-[36px] md:text-[48px] font-extrabold text-[#FAFAFA] mb-2 glow-text">
                        {stat.value}
                      </div>
                      <div className="text-[13px] text-[#6B7280] font-medium">{stat.label}</div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES — Asymmetric Bento ===== */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="eyebrow mb-6 inline-flex">
                <span style={{ color: "#A855F7" }}>✦</span>
                Features
              </span>
              <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-tight text-[#FAFAFA] mb-5">
                Everything a creator needs
              </h2>
              <p className="text-[16px] text-[#6B7280] max-w-lg mx-auto">
                Four powerful AI tools, one seamless interface. Pick a platform, enter your idea, and watch the magic happen.
              </p>
            </div>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7"><FeatureCard {...FEATURES[0]} delay={0} /></div>
            <div className="md:col-span-5"><FeatureCard {...FEATURES[1]} delay={100} /></div>
            <div className="md:col-span-5"><FeatureCard {...FEATURES[2]} delay={200} /></div>
            <div className="md:col-span-7"><FeatureCard {...FEATURES[3]} delay={300} /></div>
          </div>
        </div>
      </section>

      {/* ===== GENERATOR ===== */}
      <section id="generator" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="eyebrow mb-6 inline-flex">
                <span style={{ color: "#7C3AED" }}>◆</span>
                AI Generator
              </span>
              <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-tight text-[#FAFAFA] mb-5">
                Try it now — it's free
              </h2>
              <p className="text-[16px] text-[#6B7280] max-w-md mx-auto">
                No signup, no credit card. Just your topic and the power of AI.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal blur delay={100}>
            <div className="bezel-outer">
              <div className="bezel-inner p-8 md:p-12">
                <GeneratorForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="eyebrow mb-6 inline-flex">
                <span style={{ color: "#10B981" }}>△</span>
                How It Works
              </span>
              <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-tight text-[#FAFAFA] mb-5">
                Three steps to better content
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 120}>
                <div className="bezel-inner-subtle h-full group relative">
                  <div className="text-[72px] font-extrabold leading-none text-white/[0.04] mb-4 select-none">
                    {step.number}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-12 right-0 translate-x-1/2 z-10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6"/>
                      </svg>
                    </div>
                  )}
                  <h3 className="text-[17px] font-bold text-[#FAFAFA] mb-3">{step.title}</h3>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed group-hover:text-[#9CA3AF] transition-colors duration-500">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLATFORM USE CASES ===== */}
      <section className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="eyebrow mb-6 inline-flex">
                <span style={{ color: "#6366F1" }}>◈</span>
                Platform-Specific
              </span>
              <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-tight text-[#FAFAFA] mb-5">
                Built for every platform
              </h2>
              <p className="text-[16px] text-[#6B7280] max-w-lg mx-auto">
                Each platform has its own algorithm, audience behavior, and content style. We optimize for all of them.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-5">
            {PLATFORM_USE_CASES.map((item, i) => (
              <ScrollReveal key={item.platform} delay={i * 100}>
                <div className="bezel-outer">
                  <div className="bezel-inner p-7 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Platform header */}
                      <div className="md:w-48 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl">{item.emoji}</span>
                          <div>
                            <div className="text-[17px] font-bold text-[#FAFAFA]">{item.platform}</div>
                            <div className="w-8 h-0.5 mt-2 rounded-full" style={{ background: item.color }} />
                          </div>
                        </div>
                        <p className="text-[13px] text-[#6B7280] leading-relaxed">{item.tip}</p>
                      </div>

                      {/* Benefits */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}18` }}>
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="2 6 5 9 10 3"/>
                              </svg>
                            </div>
                            <span className="text-[13px] text-[#9CA3AF] leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS — Scrolling ===== */}
      <TestimonialsScroll />

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="eyebrow mb-6 inline-flex">
                <span style={{ color: "#A855F7" }}>◇</span>
                FAQ
              </span>
              <h2 className="text-[36px] md:text-[48px] font-extrabold tracking-tight text-[#FAFAFA] mb-5">
                Questions? Answers.
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="bezel-inner-subtle">
                  <div className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold" style={{ color: "#7C3AED" }}>Q</span>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#FAFAFA] mb-2">{faq.q}</h3>
                      <p className="text-[14px] text-[#6B7280] leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal blur>
            <div className="bezel-outer">
              <div className="bezel-inner p-14 md:p-20 text-center relative overflow-hidden">
                {/* Ambient glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.15) 0%, transparent 70%)",
                  }}
                />

                <h2 className="relative text-[32px] md:text-[48px] font-extrabold tracking-tight text-[#FAFAFA] mb-5">
                  Ready to create
                  <br />
                  <span className="glow-text">viral content?</span>
                </h2>
                <p className="relative text-[16px] text-[#6B7280] mb-10 max-w-md mx-auto">
                  Stop staring at a blank screen. Start generating content that actually connects with your audience.
                </p>
                <a href="#generator" className="btn-primary text-[15px] py-4 px-8 relative">
                  Generate Your First Content
                  <span className="icon-circle">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 11L11 1M11 1H5M11 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[0.05] py-10 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-900/30">
              C
            </div>
            <span className="text-[13px] font-medium text-[#6B7280]">
              ContentCraft — Built for creators
            </span>
          </div>
          <p className="text-[12px] text-[#374151]">
            Powered by OpusCode + Claude Sonnet 4.6 · Hackathon Project 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
