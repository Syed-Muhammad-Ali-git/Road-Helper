"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/lib/firestore";
import { useTranslation } from "@/hooks/useTranslation";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuthStore();

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
      if (role === "helper") {
        router.push("/helper/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-bg text-[var(--text)] bg-grid noise-overlay">
      {/* Brand Panel */}
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mb-6">
            ✨ {t("auth.joinTitle")}
          </div>
          <h1 className="font-display text-4xl font-bold mb-6 text-balance leading-tight">
            {t("auth.joinHighlight")}{" "}
            <span className="gradient-text">{t("auth.joinSubtitle")}</span>.
          </h1>
          <p className="text-dark-muted max-w-sm text-lg">
            {t("auth.joinDescription")}
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-[5%] relative z-10">
        <div className="w-full max-w-[420px] animate-fade-in py-8">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold mb-2 text-white">
              {t("auth.createAccount")}
            </h2>
            <p className="text-dark-muted">
              {t("auth.haveAccount")}{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-hover font-semibold transition-colors"
              >
                {t("auth.login")}
              </Link>
            </p>
          </div>

          <div className="flex p-1 bg-dark-surface rounded-xl border border-dark-border mb-8">
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
              className="w-full btn-primary justify-center py-4 mt-6"
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
  );
}
