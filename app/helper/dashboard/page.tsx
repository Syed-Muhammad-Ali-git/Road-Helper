"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { requestOps, type HelpRequest } from "@/lib/firestore";
import { useTranslation } from "@/hooks/useTranslation";

export default function HelperDashboard() {
  const { user, profile } = useAuthStore();
  const t = useTranslation();
  const [activeJob, setActiveJob] = useState<HelpRequest | null>(null);
  const [stats, setStats] = useState({ totalEarnings: 0, jobsCompleted: 0 });

  useEffect(() => {
    if (!user) return;
    const unsub = requestOps.subscribeToHelperRequests(
      user.uid,
      ["accepted", "en-route", "arrived"],
      (reqs) => {
        setActiveJob(reqs[0] || null);
      },
    );

    // Fetch stats
    requestOps.getHelperEarnings(user.uid).then((d) => {
      setStats({ totalEarnings: d.total, jobsCompleted: d.history.length });
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-white bg-grid noise-overlay">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">
              {t("dashboard.welcome")},{" "}
              <span className="text-secondary">{profile?.name || "Pro"}</span>{" "}
              👋
            </h1>
            <p className="text-dark-muted">
              Ready to save the day? See your stats and new requests.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-success/10 border border-success/30 text-success rounded-full text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Online & Ready
            </div>
            <Link href="/helper/profile" className="btn-ghost px-4 py-2">
              Profile
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card glass p-6 border-dark-border">
            <div className="text-sm font-semibold text-dark-muted mb-2">
              Total Earnings
            </div>
            <div className="font-display text-3xl font-bold text-white">
              ${stats.totalEarnings}
            </div>
          </div>
          <div className="card glass p-6 border-dark-border">
            <div className="text-sm font-semibold text-dark-muted mb-2">
              Jobs Done
            </div>
            <div className="font-display text-3xl font-bold text-white">
              {stats.jobsCompleted}
            </div>
          </div>
          <div className="card glass p-6 border-dark-border">
            <div className="text-sm font-semibold text-dark-muted mb-2">
              Rating
            </div>
            <div className="font-display text-3xl font-bold text-accent flex items-center gap-1">
              {profile?.rating || 0} <span className="text-xl">★</span>
            </div>
          </div>
          <Link
            href="/helper/requests"
            className="card glass p-6 border-primary/30 flex flex-col justify-center items-center group hover:bg-primary/10 transition-colors cursor-pointer bg-primary/5"
          >
            <div className="text-2xl mb-2">🚨</div>
            <div className="font-bold text-white text-sm">Find Requests</div>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Active Job Card */}
          <div className="md:col-span-2">
            <h2 className="section-label mb-4">Active Mission</h2>
            {activeJob ? (
              <div className="card glass p-6 border-l-4 border-l-secondary relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 blur-[40px] bg-secondary w-32 h-32" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-xl mb-1 capitalize text-white">
                      {activeJob.service.replace("-", " ")}
                    </h3>
                    <div className="text-sm text-dark-muted flex items-center gap-1">
                      📍 {activeJob.location.address}
                    </div>
                  </div>
                  <span
                    className={`badge-warning px-3 py-1 font-bold text-sm tracking-wide capitalize`}
                  >
                    {activeJob.status.replace("-", " ")}
                  </span>
                </div>

                <div className="bg-dark-surface p-4 rounded-xl border border-dark-border mb-6">
                  <div className="text-xs text-dark-muted font-semibold mb-1 uppercase tracking-wider">
                    Customer
                  </div>
                  <div className="font-bold text-lg text-white">
                    {activeJob.customerName}
                  </div>
                  <div className="text-sm text-primary font-mono mt-1">
                    {activeJob.customerPhone}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Link
                    href={`/helper/active-job?id=${activeJob.id}`}
                    className="btn-primary py-2.5 px-6"
                    style={{
                      background: "linear-gradient(135deg, #FF6B35, #FFB347)",
                    }}
                  >
                    Go to Job Dashboard →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card glass p-8 flex flex-col items-center justify-center border-dashed border-2 border-dark-border py-16 text-center">
                <div className="text-4xl mb-4 opacity-50">☕</div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  No Active Jobs
                </h3>
                <p className="text-dark-muted mb-6 max-w-sm">
                  Take a break, or head over to the Requests board to find
                  someone in need.
                </p>
                <Link href="/helper/requests" className="btn-ghost">
                  View Requests board
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="section-label mb-4">My Dashboard</h2>
            <Link
              href="/helper/earnings"
              className="card glass p-4 flex items-center gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-dark-surface flex items-center justify-center text-xl">
                💰
              </div>
              <div>
                <div className="font-bold text-white text-sm">
                  Earnings Report
                </div>
                <div className="text-xs text-dark-muted">
                  View payouts and history
                </div>
              </div>
            </Link>
            <Link
              href="/helper/profile"
              className="card glass p-4 flex items-center gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-dark-surface flex items-center justify-center text-xl">
                🛡️
              </div>
              <div>
                <div className="font-bold text-white text-sm">
                  Account Settings
                </div>
                <div className="text-xs text-dark-muted">
                  Manage profile & vehicle
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
