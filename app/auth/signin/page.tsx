"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

type Mode = "signin" | "signup";

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backdropFilter: "blur(24px)", background: "rgba(5,5,5,0.85)" }}>
      <div className="bezel-outer w-full max-w-sm">
        <div className="bezel-inner p-8 text-center relative">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#6B7280] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l10 10M11 1L1 11"/>
            </svg>
          </button>

          {sent ? (
            <>
              <div className="w-14 h-14 rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#FAFAFA] mb-3">Check your email</h2>
              <p className="text-[14px] text-[#6B7280] leading-relaxed mb-8">
                If an account with that email exists, we sent a password reset link. Check your inbox (and spam folder).
              </p>
              <button onClick={onClose} className="btn-primary text-[14px] py-3 px-8">
                Got it
              </button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-900/40">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#FAFAFA] mb-2">Forgot password?</h2>
              <p className="text-[14px] text-[#6B7280] leading-relaxed mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-base text-[14px]"
                  />
                </div>

                {error && <p className="text-[13px] text-[#EF4444] text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center text-[14px] py-3"
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <p className="text-[12px] text-[#374151] mt-4">
                Remember your password?{" "}
                <button onClick={onClose} className="text-[#7C3AED] hover:text-[#A855F7] transition-colors cursor-pointer">
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [showForgot, setShowForgot] = useState(false);

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up fields
  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: signInEmail,
      password: signInPassword,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (signUpPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (signUpPassword !== signUpConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: signUpEmail,
        password: signUpPassword,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created! Please sign in with your credentials.");
        setMode("signin");
        setSignInEmail(signUpEmail);
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-[2]">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="bezel-outer w-full max-w-md relative">
        <div className="bezel-inner p-10 text-center">
          {/* Logo */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg shadow-purple-900/40">
            C
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center justify-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.07] mb-8 max-w-xs mx-auto">
            <button
              onClick={() => { setMode("signin"); setError(""); }}
              className={`flex-1 py-2 px-5 rounded-full text-[13px] font-semibold transition-all duration-500 cursor-pointer ${
                mode === "signin"
                  ? "bg-white/[0.1] text-[#FAFAFA] border border-white/[0.1]"
                  : "text-[#6B7280] hover:text-[#9CA3AF]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2 px-5 rounded-full text-[13px] font-semibold transition-all duration-500 cursor-pointer relative ${
                mode === "signup"
                  ? "bg-white/[0.1] text-[#FAFAFA] border border-white/[0.1]"
                  : "text-[#6B7280] hover:text-[#9CA3AF]"
              }`}
              style={
                mode === "signup"
                  ? {
                      boxShadow: "0 0 16px rgba(124,58,237,0.35), 0 0 4px rgba(124,58,237,0.2)",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }
                  : {}
              }
            >
              Sign Up
            </button>
          </div>

          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[#FAFAFA] font-medium text-[15px] transition-all duration-500 mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-[#6B7280] uppercase tracking-wider">
              {mode === "signin" ? "or sign in" : "or sign up"}
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* ===== SIGN IN FORM ===== */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-base text-[14px]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] text-[#7C3AED] hover:text-[#A855F7] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Forgot?
                    <span className="w-4 h-4 rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.4)] flex items-center justify-center text-[9px] font-bold leading-none" style={{ color: "#7C3AED" }}>
                      ?
                    </span>
                  </button>
                </div>
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-base text-[14px]"
                />
              </div>

              {error && (
                <p className="text-[13px] text-[#EF4444] text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-[15px] py-3.5"
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <p className="text-[12px] text-[#6B7280] text-center">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); }}
                  className="relative text-[#7C3AED] font-semibold hover:text-[#A855F7] transition-colors cursor-pointer"
                  style={{
                    textShadow: "0 0 12px rgba(124,58,237,0.5)",
                  }}
                >
                  Sign up now
                </button>
              </p>
            </form>
          )}

          {/* ===== SIGN UP FORM ===== */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className="input-base text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-base text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="input-base text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signUpConfirm}
                  onChange={(e) => setSignUpConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="input-base text-[14px]"
                />
              </div>

              {error && (
                <p className="text-[13px] text-[#EF4444] text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-[15px] py-3.5"
                style={{
                  boxShadow: "0 0 24px rgba(124,58,237,0.4), 0 0 6px rgba(124,58,237,0.2)",
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-[12px] text-[#6B7280] text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(""); }}
                  className="text-[#7C3AED] hover:text-[#A855F7] transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </p>

              <p className="text-[11px] text-[#374151] text-center leading-relaxed">
                By creating an account, you agree that your generated content is yours to use commercially.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}
