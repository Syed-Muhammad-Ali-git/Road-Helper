"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/lib/firebase/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
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
      if (role !== "admin") {
        setError(t("auth.accessDenied"));
        return;
      }
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || t("auth.loginFailed"));
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-bg text-[var(--text)] bg-grid noise-overlay">
      <div className="flex-1 flex flex-col justify-center items-center p-[5%] relative z-10">
        <div className="absolute top-8 left-8">
          <Link
            href="/login"
            className="flex items-center gap-2 text-dark-muted hover:text-[var(--text)] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("admin.backToUserLogin")}
          </Link>
        </div>

        <div className="w-full max-w-[420px] animate-fade-in shadow-glow-primary p-8 rounded-3xl bg-dark-surface border border-primary/20">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-3xl mx-auto mb-6 shadow-glow-primary">
              🔐
            </div>
            <h2 className="font-display text-3xl font-bold mb-2 text-[var(--text)]">
              {t("admin.portal")}
            </h2>
            <p className="text-dark-muted">
              {t("admin.secureAccess")}
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
                {t("admin.adminEmail")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-[var(--text)]"
                placeholder="admin@roadhelper.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-text-secondary px-1">
                {t("auth.password")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field text-[var(--text)]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-4 mt-4 shadow-glow-primary"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t("admin.enterDashboard")
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-dark-muted">
            {t("admin.newAdmin")}{" "}
            <Link
              href="/admin/register"
              className="text-primary hover:underline"
            >
              {t("admin.registerHere")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
