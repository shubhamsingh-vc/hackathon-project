"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Generator", href: "/generate" },
  { label: "Dashboard", href: "/dashboard", authOnly: true },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
        style={{ backdropFilter: "blur(20px)", background: scrolled ? "rgba(5,5,5,0.85)" : "transparent" }}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-900/40 group-hover:shadow-purple-900/60 transition-all duration-500 group-hover:scale-105">
              C
            </div>
            <span className="text-[16px] font-bold text-[#FAFAFA]">
              Content<span className="glow-text">Craft</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.filter(l => !l.authOnly).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-full text-[13px] font-medium text-[#6B7280] hover:text-[#FAFAFA] hover:bg-white/5 transition-all duration-500"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Section */}
          {session?.user ? (
            <div className="hidden lg:flex items-center gap-3">
              {/* Dashboard link */}
              <a href="/dashboard" className="px-4 py-2 rounded-full text-[13px] font-medium text-[#6B7280] hover:text-[#FAFAFA] hover:bg-white/5 transition-all duration-500">
                Dashboard
              </a>

              {/* User Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={28}
                      height={28}
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

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bezel-outer">
                    <div className="bezel-inner p-2">
                      <p className="text-[12px] text-[#6B7280] px-3 py-2 truncate">
                        {session.user.email}
                      </p>
                      <div className="h-px bg-white/[0.06] my-1" />
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-[13px] text-[#E5E7EB] hover:bg-white/5 transition-colors"
                      >
                        My Dashboard
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] text-[#EF4444] hover:bg-white/5 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <a href="/auth/signin" className="btn-primary text-[13px] !py-2.5 !px-5">
                Sign In
              </a>
              <a href="/generate" className="btn-ghost text-[13px] !py-2.5 !px-5">
                Start Free
              </a>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-white transition-all duration-500 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block w-5 h-px bg-white transition-all duration-500 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-white transition-all duration-500 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 flex flex-col items-center justify-center transition-all duration-700 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backdropFilter: "blur(32px)", background: "rgba(5,5,5,0.92)" }}
      >
        <div className="flex flex-col items-center gap-2">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl font-bold text-[#FAFAFA]/70 hover:text-[#FAFAFA] transition-all duration-500 py-3 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? `${i * 60 + 100}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className={`h-px w-16 bg-white/10 my-4 ${
              menuOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? "400ms" : "0ms" }}
          />

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={`text-[16px] font-medium text-[#EF4444] py-3 transition-all duration-500 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? "460ms" : "0ms" }}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setMenuOpen(false)}
              className={`btn-primary mt-4 text-[15px] ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? "460ms" : "0ms" }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
