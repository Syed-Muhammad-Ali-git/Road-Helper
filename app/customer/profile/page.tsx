"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { userOps } from "@/lib/firestore";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile, setProfile } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      if (profile.vehicle) setVehicle(profile.vehicle);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMsg("");
    try {
      await userOps.update(user.uid, { name, phone, vehicle });
      setProfile({ ...profile!, name, phone, vehicle });
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
          <h1 className="font-display text-3xl font-bold">Your Profile</h1>
          <Link
            href={`/${profile?.role}/dashboard`}
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

            {profile?.role === "customer" && (
              <div className="space-y-4 pt-4 border-t border-dark-border">
                <h2 className="section-label">Vehicle Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-dark-muted px-1">
                      Make (e.g., Honda)
                    </label>
                    <input
                      type="text"
                      value={vehicle.make}
                      onChange={(e) =>
                        setVehicle({ ...vehicle, make: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-dark-muted px-1">
                      Model (e.g., Civic)
                    </label>
                    <input
                      type="text"
                      value={vehicle.model}
                      onChange={(e) =>
                        setVehicle({ ...vehicle, model: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-dark-muted px-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={vehicle.year}
                      onChange={(e) =>
                        setVehicle({ ...vehicle, year: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-dark-muted px-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={vehicle.color}
                      onChange={(e) =>
                        setVehicle({ ...vehicle, color: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

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
