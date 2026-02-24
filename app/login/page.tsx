"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuthStore();
  const t = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login(email, password);
      const role = result.profile?.role;
      if (role === "helper") {
        router.push("/helper/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-bg text-white bg-grid noise-overlay">
      {/* Brand Panel */}
      <div className="hidden lg:flex w-[40%] bg-dark-surface border-r border-dark-border flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-brand opacity-10 blur-[100px]" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-xl shadow-glow-primary">
              🚗
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              RoadHelper
            </span>
          </Link>
          <h1 className="font-display text-4xl font-bold mb-6 text-balance leading-tight">
            Welcome back to your{" "}
            <span className="gradient-text">Safe Journey</span>.
          </h1>
          <p className="text-dark-muted max-w-sm text-lg">
            Login to request help instantly or manage your active rescue
            missions.
          </p>
        </div>

        <div className="relative z-10 card glass p-6 border-dark-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-dark-surface bg-dark-card flex items-center justify-center text-xs"
                >
                  U{i}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="text-white font-bold block">
                5K+ active users
              </span>
              <span className="text-dark-muted">Trusting our service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-[5%] relative z-10">
        <div className="w-full max-w-[420px] animate-fade-in">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold mb-2">
              {t("auth.login")}
            </h2>
            <p className="text-dark-muted">
              {t("auth.noAccount")}{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary-hover font-semibold transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-text-secondary px-1">
                {t("auth.email")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="hello@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-medium text-dark-text-secondary">
                  {t("auth.password")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:text-primary-hover"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-4 mt-4"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t("auth.login")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
