"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, loading } = useAuthStore();

  const [role, setRole] = useState<UserRole>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const t = useTranslation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, password, name, phone, role);
      // Redirect to login as requested by user
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push(
        role === "helper" ? "/helper/dashboard" : "/customer/dashboard",
      );
    } catch (err: any) {
      setError(err.message || "Failed to login with Google");
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-bg text-[var(--text)] bg-grid noise-overlay">
      {/* Brand Panel - Synced with LoginPage */}
      <div className="hidden lg:flex w-[40%] bg-dark-surface border-r border-dark-border flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-brand opacity-10 blur-[100px]" />

        <div className="relative z-10 text-white">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-xl shadow-glow-primary">
              🚗
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              RoadHelper
            </span>
          </Link>
          <h1 className="font-display text-4xl font-bold mb-6 text-balance leading-tight">
            {t("auth.welcomeTitle")}{" "}
            <span className="gradient-text">{t("auth.welcomeHighlight")}</span>.
          </h1>
          <p className="text-dark-muted max-w-sm text-lg">
            {t("auth.welcomeSubtitle")}
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
                {t("auth.trustingUsers")}
              </span>
              <span className="text-dark-muted">
                {t("auth.trustingSubtitle")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-[5%] relative z-10 overflow-y-auto">
        <div className="absolute top-8 left-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-dark-muted hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth.backToHome")}
          </Link>
        </div>

        <div className="w-full max-w-[420px] animate-fade-in py-8 mt-12">
          <div className="text-center mb-6">
            <h2 className="font-display text-3xl font-bold mb-2 text-white">
              {t("auth.createAccount")}
            </h2>
            <div className="flex flex-col gap-1 items-center">
              <p className="text-dark-muted">
                {t("auth.haveAccount")}{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-hover font-semibold transition-colors"
                >
                  {t("auth.login")}
                </Link>
              </p>
              <Link
                href="/admin/register"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-bold hover:bg-primary/20 transition-all mt-2"
              >
                🛡️ Admin Portal
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-dark-border bg-dark-surface hover:bg-dark-card transition-all text-white font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("auth.loginWithGoogle")}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-dark-bg px-2 text-dark-muted font-medium tracking-wider">
                  Registration Details
                </span>
              </div>
            </div>

            <div className="flex p-1 bg-dark-surface rounded-xl border border-dark-border mb-4">
              {(["customer", "helper"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all capitalize ${role === r ? "bg-primary text-white shadow-glow-primary" : "text-dark-muted hover:text-white"}`}
                >
                  {t(`auth.${r}`)}
                </button>
              ))}
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dark-text-secondary px-1">
                  {t("auth.fullName")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-white"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dark-text-secondary px-1">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-white"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dark-text-secondary px-1">
                  {t("auth.phoneNumber")}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field text-white"
                  placeholder="+92 300 0000000"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dark-text-secondary px-1">
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field text-white"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-4 mt-6 shadow-glow-primary"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t("auth.createAccount")
                )}
              </button>

              <p className="text-xs text-center text-dark-muted mt-4">
                {t("auth.legalAgreement")}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
