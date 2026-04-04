"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeColor?: string;
}

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#6B7280"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  );
}

function GeneratorIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#6B7280"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#6B7280"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#6B7280"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon active={false} />,
  },
  {
    label: "Generator",
    href: "/generate",
    icon: <GeneratorIcon active={false} />,
  },
  {
    label: "Saved",
    href: "/saved",
    icon: <LibraryIcon active={false} />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsIcon active={false} />,
  },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium
        transition-all duration-300 group relative
        ${isActive
          ? "bg-[rgba(124,58,237,0.12)] text-[#FAFAFA]"
          : "text-[#6B7280] hover:text-[#9CA3AF] hover:bg-white/[0.04]"
        }
      `}
      style={isActive ? {
        boxShadow: "inset 2px 0 0 #7C3AED, 0 0 16px rgba(124,58,237,0.1)",
      } : {}}
    >
      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-full"
          style={{ background: "linear-gradient(180deg, #7C3AED, #A855F7)", boxShadow: "0 0 8px #7C3AED" }}
        />
      )}

      {/* Icon — re-render on active state change */}
      {(() => {
        const props = { active: isActive };
        if (item.href === "/dashboard") return <DashboardIcon {...props} />;
        if (item.href === "/generate") return <GeneratorIcon {...props} />;
        if (item.href === "/saved") return <LibraryIcon {...props} />;
        if (item.href === "/settings") return <SettingsIcon {...props} />;
        return null;
      })()}

      <span>{item.label}</span>

      {/* Active glow dot */}
      {isActive && (
        <div
          className="ml-auto w-1.5 h-1.5 rounded-full"
          style={{ background: "#7C3AED", boxShadow: "0 0 6px #7C3AED" }}
        />
      )}
    </Link>
  );
}

export default function Sidebar() {
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-60 flex flex-col z-40 border-r"
      style={{
        background: "#080808",
        borderColor: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top: Logo */}
      <div className="px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-base shadow-lg shadow-purple-900/30 group-hover:shadow-purple-900/50 transition-all duration-500 group-hover:scale-105 flex-shrink-0"
          >
            C
          </div>
          <span className="text-[15px] font-bold text-[#FAFAFA]">
            Content<span className="glow-text">Craft</span>
          </span>
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px mx-5" style={{ background: "rgba(255,255,255,0.05)" }} />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Divider */}
        <div className="h-px my-3 mx-1" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* External: Landing page */}
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-[#6B7280] hover:text-[#9CA3AF] hover:bg-white/[0.04] transition-all duration-300"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Home</span>
        </Link>
      </nav>

      {/* Bottom: User Profile */}
      <div className="px-3 pb-5">
        <div className="h-px mb-3 mx-1" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* User button */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-all duration-300 cursor-pointer group"
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <p className="text-[13px] font-semibold text-[#E5E7EB] truncate group-hover:text-white transition-colors">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[11px] text-[#6B7280] truncate">
                {session?.user?.email || ""}
              </p>
            </div>
            <svg
              width="14" height="14" viewBox="0 0 12 12" fill="none"
              stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className={`flex-shrink-0 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`}
            >
              <path d="M3 5l3 3 3-3"/>
            </svg>
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 bezel-outer"
              style={{ borderRadius: "16px" }}
            >
              <div className="bezel-inner p-2" style={{ borderRadius: "14px" }}>
                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-[13px] text-[#E5E7EB] hover:bg-white/5 transition-colors"
                >
                  Settings
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
    </aside>
  );
}
