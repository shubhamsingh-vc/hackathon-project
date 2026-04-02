"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

interface AppShellProps {
  children: React.ReactNode;
  /** Pages that don't require auth but can show the sidebar if logged in */
  allowGuest?: boolean;
}

export default function AppShell({ children, allowGuest = false }: AppShellProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && !allowGuest) {
      router.push("/auth/signin");
    }
  }, [status, router, allowGuest]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#050505" }}>
        <div
          className="w-10 h-10 border-2 rounded-full animate-spin"
          style={{ borderColor: "rgba(124,58,237,0.3)", borderTopColor: "#7C3AED" }}
        />
      </div>
    );
  }

  // If not logged in and page requires auth, show nothing while redirecting
  if (!session && !allowGuest) {
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#050505" }}>
      {/* Sidebar — only when logged in */}
      {session && <Sidebar />}

      {/* Main content area */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          session ? "ml-60" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
