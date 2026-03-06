"use client";
import { UserProfile, userOps } from "@/lib/firestore";
import { useAuthStore } from "@/store/authStore";
import { Zap, ShieldCheck, Info } from "lucide-react";
import { useState } from "react";

interface Props {
  profile: UserProfile;
}

export function SubscriptionStatus({ profile }: Props) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const isCustomer = profile.role === "customer";
  const isHelper = profile.role === "helper";

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (confirm("Proceed to upgrade to Premium for Rs.3,000/month?")) {
        await userOps.update(user.uid, {
          subscriptionType: "premium",
          isPremiumActive: true,
        });
        alert("Welcome to Premium! Your benefits are now active.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (profile.subscriptionType === "premium") {
    return (
      <div className="card glass p-5 border-none flex items-center justify-between mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-success/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center text-success shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm font-bold text-white tracking-tight uppercase">
                Premium Member
              </div>
              <span className="w-1 h-1 rounded-full bg-success animate-pulse" />
            </div>
            <div className="text-xs text-dark-muted font-medium">
              Unlimited rides & VIP support active.
            </div>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-success/20 border border-success/30 text-success text-[10px] font-black tracking-widest uppercase relative z-10 shadow-glow-success">
          PRO
        </div>
      </div>
    );
  }

  return (
    <div className="card glass p-8 border-none mb-10 relative overflow-hidden group transition-all duration-500 hover:shadow-glow-primary/5">
      {/* Abstract Background Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-[60px]" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        <div className="flex-1 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(255,45,45,0.2)]">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-display font-black text-2xl text-white tracking-tight uppercase">
                  Your Active Plan
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-primary/20 text-[9px] font-bold text-primary tracking-tighter uppercase">
                  Standard Trial
                </span>
              </div>
              <p className="text-sm text-dark-muted font-medium">
                {isCustomer
                  ? "Experience the fastest roadside assistance in Pakistan."
                  : "Enjoy zero platform commission on your first 10 jobs."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between px-1">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Usage Balance
              </span>
              <span className="text-sm font-mono font-bold text-primary">
                {profile.freeRidesRemaining}{" "}
                <span className="opacity-40">/ 10</span>
              </span>
            </div>
            <div className="h-2.5 bg-dark-bg/50 rounded-full overflow-hidden border border-white/5 p-[2px]">
              <div
                className="h-full bg-gradient-brand rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,45,45,0.4)]"
                style={{ width: `${(profile.freeRidesRemaining / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary px-10 py-4 text-sm font-black tracking-widest uppercase shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group/btn"
          >
            <span className="relative z-10">
              {loading ? "Processing..." : "Go Premium"}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </button>
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-dark-muted uppercase tracking-tighter">
            <Info className="w-3 h-3" />
            <span>
              {isCustomer
                ? "Monthly Rs.3,000 billed after 10 rides"
                : "20% commission applies after trial"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
