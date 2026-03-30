"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#F59E0B] flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
            C
          </div>
          <span className="text-lg font-bold text-[#F1F5F9]">
            Content<span className="gradient-text">Craft</span>
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[#64748B] hover:text-[#F1F5F9] transition-colors">
            Features
          </a>
          <a href="#generator" className="text-sm text-[#64748B] hover:text-[#F1F5F9] transition-colors">
            Try It Free
          </a>
          <a href="#how-it-works" className="text-sm text-[#64748B] hover:text-[#F1F5F9] transition-colors">
            How It Works
          </a>
        </div>

        {/* CTA */}
        <a href="#generator" className="btn-primary text-sm !py-2.5 !px-5">
          Start Creating
        </a>
      </div>
    </nav>
  );
}
