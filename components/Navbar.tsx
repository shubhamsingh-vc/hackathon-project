"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Generator", href: "#generator" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${scrolled ? "pt-3" : "pt-8"}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          {/* Floating pill nav */}
          <div className={`bezel-outer mx-auto transition-all duration-700 ${scrolled ? "w-full max-w-3xl" : "w-max"}`}>
            <div className={`bezel-inner transition-all duration-700 ${scrolled ? "rounded-none rounded-b-[22px]" : "rounded-[22px]"}`}>
              <div className="flex items-center justify-between px-5 py-3">
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 group flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-base shadow-lg shadow-purple-900/40 group-hover:shadow-purple-900/60 transition-shadow duration-500">
                    C
                  </div>
                  <span className="text-[15px] font-semibold text-[#FAFAFA]">
                    Content<span className="glow-text">Craft</span>
                  </span>
                </a>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-1">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="px-4 py-2 rounded-full text-[13px] font-medium text-[#6B7280] hover:text-[#FAFAFA] hover:bg-white/5 transition-all duration-500"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="#generator"
                  className="hidden md:flex btn-primary text-[13px] !py-2.5 !px-5 flex-shrink-0"
                >
                  Start Free
                  <span className="icon-circle !w-6 !h-6">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </a>

                {/* Mobile hamburger */}
                <button
                  className="md:hidden w-9 h-9 rounded-full bg-white/5 flex flex-col items-center justify-center gap-1.5 p-2 cursor-pointer border border-white/10 hover:bg-white/10 transition-colors"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  <span className={`block w-4 h-px bg-white transition-all duration-500 ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
                  <span className={`block w-4 h-px bg-white transition-all duration-500 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
                  <span className={`block w-4 h-px bg-white transition-all duration-500 ${menuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 flex flex-col items-center justify-center transition-all duration-700 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backdropFilter: "blur(32px)", background: "rgba(5,5,5,0.85)" }}
      >
        <div className="flex flex-col items-center gap-6">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-3xl font-bold text-[#FAFAFA]/80 hover:text-[#FAFAFA] transition-all duration-500 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? `${i * 80 + 100}ms` : "0ms" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#generator"
            onClick={() => setMenuOpen(false)}
            className={`btn-primary mt-4 text-base ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            style={{ transitionDelay: menuOpen ? "380ms" : "0ms" }}
          >
            Start Free
          </a>
        </div>
      </div>
    </>
  );
}
