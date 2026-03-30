"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${scrolled ? "pt-3" : "pt-8"}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className={`bezel-outer mx-auto transition-all duration-700 ${scrolled ? "w-full max-w-3xl" : "w-max"}`}>
            <div className={`bezel-inner transition-all duration-700 ${scrolled ? "rounded-none rounded-b-[22px]" : "rounded-[22px]"}`}>
              <div className="flex items-center justify-between px-5 py-3">

                {/* Logo */}
                <a href="/" className="flex items-center gap-3 group flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-base shadow-lg shadow-purple-900/40 group-hover:shadow-purple-900/60 transition-shadow duration-500">
                    C
                  </div>
                  <span className="text-[15px] font-semibold text-[#FAFAFA]">
                    Content<span className="glow-text">Craft</span>
                  </span>
                </a>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-1">
                  <Link href="/generate" className="px-4 py-2 rounded-full text-[13px] font-medium text-[#6B7280] hover:text-[#FAFAFA] hover:bg-white/5 transition-all duration-500">
                    Generator
                  </Link>
                  {session && (
                    <Link href="/dashboard" className="px-4 py-2 rounded-full text-[13px] font-medium text-[#6B7280] hover:text-[#FAFAFA] hover:bg-white/5 transition-all duration-500">
                      Dashboard
                    </Link>
                  )}
                </div>

                {/* Auth — logged in: avatar dropdown */}
                {session?.user ? (
                  <div className="hidden md:flex items-center gap-3">
                    <div className="relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500"
                      >
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-xs font-bold">
                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 5l3 3 3-3"/>
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 bezel-outer w-48">
                          <div className="bezel-inner p-2">
                            <p className="text-[12px] text-[#6B7280] px-3 py-2 truncate">
                              {session.user.email}
                            </p>
                            <div className="h-px bg-white/[0.06] my-1" />
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="block px-3 py-2 rounded-xl text-[13px] text-[#E5E7EB] hover:bg-white/5 transition-colors"
                            >
                              Dashboard
                            </Link>
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-[#EF4444] hover:bg-white/5 transition-colors"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Auth — logged out */
                  <Link
                    href="/auth/signin"
                    className="hidden md:flex btn-primary text-[13px] !py-2.5 !px-5 flex-shrink-0"
                  >
                    Sign In
                  </Link>
                )}

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
          <Link href="/" onClick={() => setMenuOpen(false)} className={`text-3xl font-bold text-[#FAFAFA]/80 hover:text-[#FAFAFA] transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: menuOpen ? "100ms" : "0ms" }}>
            Home
          </Link>
          <Link href="/generate" onClick={() => setMenuOpen(false)} className={`text-3xl font-bold text-[#FAFAFA]/80 hover:text-[#FAFAFA] transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: menuOpen ? "180ms" : "0ms" }}>
            Generator
          </Link>
          {session && (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className={`text-3xl font-bold text-[#FAFAFA]/80 hover:text-[#FAFAFA] transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: menuOpen ? "260ms" : "0ms" }}>
              Dashboard
            </Link>
          )}
          {!session ? (
            <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className={`btn-primary mt-2 text-base ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: menuOpen ? "340ms" : "0ms" }}>
              Sign In
            </Link>
          ) : (
            <button onClick={() => signOut({ callbackUrl: "/" })} className={`mt-2 text-[16px] font-medium text-[#EF4444] transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: menuOpen ? "340ms" : "0ms" }}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}
