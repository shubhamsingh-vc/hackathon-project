import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import GeneratorForm from "@/components/GeneratorForm";

const FEATURES = [
  {
    icon: "🔥",
    title: "Viral Hook Generator",
    description: "Generate scroll-stopping opening lines that make viewers stop and watch. Perfect for Reels, Shorts, and TikToks.",
    delay: "animate-fade-up-delay-1",
  },
  {
    icon: "📝",
    title: "Caption Generator",
    description: "Write engaging, platform-optimized captions that drive comments, saves, and shares — in your unique voice.",
    delay: "animate-fade-up-delay-2",
  },
  {
    icon: "#️⃣",
    title: "Hashtag Suggestions",
    description: "Get 20+ relevant, trending hashtags that balance reach and niche. Never stare at a blank hashtag field again.",
    delay: "animate-fade-up-delay-3",
  },
  {
    icon: "🎬",
    title: "Script Generator",
    description: "Short-form or long-form video scripts with built-in structure. Hook → Body → CTA, ready to film.",
    delay: "animate-fade-up-delay-4",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Enter Your Topic",
    description: "Type in your idea, niche, or the message you want to share with your audience.",
  },
  {
    number: "02",
    title: "Pick Your Style",
    description: "Choose a platform, content type, and tone that fits your brand and audience.",
  },
  {
    number: "03",
    title: "Copy & Create",
    description: "Get AI-generated content instantly. Copy with one click and start creating.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/25 text-[#6366F1] text-sm font-medium mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
            Powered by Claude Sonnet 4.6
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up-delay-1">
            Create Content
            <br />
            <span className="gradient-text">10x Faster</span>
            <br />
            with AI
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-2">
            Generate viral hooks, captions, hashtags, and video scripts for Instagram, YouTube, and TikTok — in seconds, not hours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
            <a href="#generator" className="btn-primary text-base">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Start Generating Free
            </a>
            <a href="#features" className="px-7 py-3 rounded-xl border border-[#2A3042] text-[#64748B] hover:text-[#F1F5F9] hover:border-[#6366F1]/40 transition-all font-medium">
              See Features
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center justify-center gap-6 text-sm text-[#64748B] animate-fade-up-delay-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["😀", "😎", "🤩", "🙌"].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#151922] border-2 border-[#2A3042] flex items-center justify-center text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <span>Trusted by 2,000+ creators</span>
            </div>
            <div className="w-px h-4 bg-[#2A3042]" />
            <div className="flex items-center gap-1">
              <span className="text-[#F59E0B]">★★★★★</span>
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PLATFORM LOGOS ===== */}
      <section className="py-12 px-6 border-y border-[#2A3042]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-[#64748B] mb-8">
            Optimized for the biggest platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {[
              { name: "Instagram", color: "#E1306C" },
              { name: "YouTube", color: "#FF0000" },
              { name: "TikTok", color: "#00F2EA" },
            ].map((platform) => (
              <div key={platform.name} className="flex items-center gap-2 text-[#64748B] hover:text-[#F1F5F9] transition-colors">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="font-medium text-sm">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25 mb-4 uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
              Everything a creator needs
            </h2>
            <p className="text-[#64748B] max-w-lg mx-auto">
              Four powerful AI tools, one simple interface. No learning curve, no complicated settings — just great content.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== GENERATOR ===== */}
      <section id="generator" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/25 mb-4 uppercase tracking-wider">
              AI Generator
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
              Try it now — it's free
            </h2>
            <p className="text-[#64748B] max-w-lg mx-auto">
              Pick your platform, enter your topic, and let AI do the heavy lifting.
            </p>
          </div>

          {/* Generator Card */}
          <div className="card p-8 md:p-12 animate-fade-up">
            <GeneratorForm />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-6 border-t border-[#2A3042]">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 mb-4 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
              Three steps to better content
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative text-center">
                {/* Connector Line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] right-0 h-px bg-gradient-to-r from-[#2A3042] to-transparent" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-[#6366F1]/15 border border-[#6366F1]/30 text-[#6366F1] font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">{step.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center bg-gradient-to-br from-[#6366F1]/20 via-[#151922] to-[#F59E0B]/10 border border-[#2A3042]">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-[#6366F1]/5 to-transparent pointer-events-none" />
            <h2 className="relative text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
              Ready to create viral content?
            </h2>
            <p className="relative text-[#64748B] mb-8 max-w-lg mx-auto">
              Stop staring at a blank screen. Start generating content that actually connects with your audience.
            </p>
            <a href="#generator" className="btn-primary relative text-base">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate Your First Content
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#2A3042] py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#F59E0B] flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="text-sm font-semibold text-[#64748B]">
              ContentCraft — Built for creators
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Powered by OpusCode + Claude Sonnet 4.6 · Hackathon Project
          </p>
        </div>
      </footer>
    </div>
  );
}
