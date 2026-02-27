"use client";
import { useState } from "react";
import Link from "next/link";
import { authOps } from "@/lib/auth";
import { useTranslation } from "@/hooks/useTranslation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const t = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await authOps.resetPassword(email);
      setMessage({
        type: "success",
        text: "Password reset link sent! Check your inbox.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-[5%] bg-grid noise-overlay relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg shadow-glow-primary transition-all group-hover:scale-110"
            style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B35)" }}
          >
            🚗
          </div>
          <span className="font-display font-extrabold text-xl text-white">
            RoadHelper
          </span>
        </Link>
      </div>

      <div className="w-full max-w-[420px] animate-fade-in relative z-10">
        <div className="card glass p-8 border-dark-border shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2 text-white">
              Forgot Password?
            </h1>
            <p className="text-dark-muted">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-dark-muted ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                disabled={loading}
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-success/10 text-success border border-success/20" : "bg-error/10 text-error border border-error/20"}`}
              >
                {message.type === "success" ? "✅" : "⚠️"} {message.text}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center py-4"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="text-center pt-4">
              <Link
                href="/login"
                className="text-dark-muted hover:text-white transition-colors text-sm font-semibold"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
