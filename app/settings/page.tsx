"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  // Password change
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordChange = async () => {
    setPasswordMsg(null);
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: "error", text: "Please fill in both fields." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: "success", text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setPasswordMsg({ type: "error", text: data.error || "Failed to update password." });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Something went wrong. Try again." });
    }
  };

  return (
    <AppShell>
      <div className="pt-10 pb-16 px-8">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <span className="eyebrow mb-3 inline-flex">Settings</span>
            <h1 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-[#FAFAFA]">
              Account Settings
            </h1>
          </div>

          {/* ─── Profile ─── */}
          <div className="bezel-outer mb-6">
            <div className="bezel-inner p-8">
              <h2 className="text-[16px] font-bold text-[#FAFAFA] mb-6">Profile</h2>

              <div className="flex items-center gap-5 mb-8">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-xl font-bold">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-[16px] font-semibold text-[#FAFAFA]">{session?.user?.name}</p>
                  <p className="text-[13px] text-[#6B7280]">{session?.user?.email}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={session?.user?.name || ""}
                    className="input-base text-[14px]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={session?.user?.email || ""}
                    className="input-base text-[14px]"
                    disabled
                    style={{ opacity: 0.5, cursor: "not-allowed" }}
                  />
                  <p className="text-[11px] text-[#374151] mt-1">Email cannot be changed</p>
                </div>
              </div>

              {/* Change Password */}
              <div className="mt-8 pt-8 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[14px] font-semibold text-[#FAFAFA]">Change Password</div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[12px] text-[#6B7280] hover:text-[#A855F7] transition-colors"
                  >
                    {showPassword ? "Cancel" : "Change"}
                  </button>
                </div>

                {showPassword ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input-base text-[14px]"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-base text-[14px]"
                        placeholder="Min 8 characters"
                      />
                    </div>
                    {passwordMsg && (
                      <p className={`text-[13px] ${passwordMsg.type === "success" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                        {passwordMsg.text}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handlePasswordChange}
                      className="btn-primary text-[14px] !py-2.5 !px-5"
                    >
                      Update Password
                    </button>
                  </div>
                ) : (
                  <p className="text-[13px] text-[#6B7280]">
                    Keep your account secure with a strong, unique password.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ─── Danger Zone ─── */}
          <div className="bezel-outer">
            <div className="bezel-inner p-8">
              <h2 className="text-[16px] font-bold text-[#EF4444] mb-2">Sign Out</h2>
              <p className="text-[13px] text-[#6B7280] mb-6">
                Once you sign out, you&apos;ll need to sign back in to access your saved content.
              </p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-5 py-2.5 rounded-full border border-[rgba(239,68,68,0.3)] text-[13px] font-medium text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-all duration-500"
              >
                Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
