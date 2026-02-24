"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { userOps } from "@/lib/firestore";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile, setProfile } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMsg("");
    try {
      await userOps.update(user.uid, { name, phone });
      setProfile({ ...profile!, name, phone });
      setMsg("Profile updated successfully!");
    } catch (err) {
      setMsg("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-white bg-grid noise-overlay">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in relative z-10">
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <h1 className="font-display text-3xl font-bold">Helper Profile</h1>
          <Link
            href="/helper/dashboard"
            className="btn-ghost px-4 py-2 text-sm"
          >
            Dashboard
          </Link>
        </div>

        <div className="card glass p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {msg && (
              <div
                className={`p-4 rounded-xl text-sm font-semibold border ${msg.includes("success") ? "bg-success/10 border-success/20 text-success" : "bg-error/10 border-error/20 text-error"}`}
              >
                {msg}
              </div>
            )}

            <div className="flex items-center gap-6 pb-6 border-b border-dark-border">
              <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-3xl shadow-glow-primary border-4 border-dark-surface">
                {name ? name.charAt(0) : "👨‍🔧"}
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-white">{name}</h3>
                <div className="text-dark-muted font-mono text-sm">
                  Helper ID: {user?.uid.slice(0, 8)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="section-label">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-dark-muted px-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-dark-muted px-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-dark-muted px-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="input-field opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto px-8"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
