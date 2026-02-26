"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";

export default function AdminRegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuthStore();
  const t = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, password, name, phone, "admin");
      router.push("/admin/login");
    } catch (err: any) {
      setError(err.message || "Failed to register admin");
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-bg text-[var(--text)] bg-grid noise-overlay">
      <div className="flex-1 flex flex-col justify-center items-center p-[5%] relative z-10">
        <div className="absolute top-8 left-8">
          <Link
            href="/admin/login"
            className="flex items-center gap-2 text-dark-muted hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Login
          </Link>
        </div>

        <div className="w-full max-w-[420px] animate-fade-in shadow-glow-primary p-8 rounded-3xl bg-dark-surface border border-primary/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-3xl mx-auto mb-6 shadow-glow-primary">
              🛡️
            </div>
            <h2 className="font-display text-3xl font-bold mb-2 text-white">
              Admin Registration
            </h2>
            <p className="text-dark-muted">
              Create a new administrator account
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-text-secondary px-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field text-white"
                placeholder="Admin Name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-text-secondary px-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-white"
                placeholder="admin@roadhelper.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-text-secondary px-1">
                Phone Number
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
                Secret Password
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
                "Create Admin Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
