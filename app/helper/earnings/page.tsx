"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { requestOps, type HelpRequest } from "@/lib/firestore";
import Link from "next/link";

export default function HelperEarnings() {
  const { user } = useAuthStore();
  const [data, setData] = useState<{
    total: number;
    thisMonth: number;
    history: HelpRequest[];
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    requestOps.getHelperEarnings(user.uid).then((res) => setData(res));
  }, [user]);

  if (!data)
    return (
      <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg flex justify-center">
        <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-white bg-grid noise-overlay">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Earnings Report</h1>
          <Link
            href="/helper/dashboard"
            className="btn-ghost px-4 py-2 text-sm"
          >
            ← Back
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card glass p-8 border-t-4 border-t-success relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-[40px] bg-success w-32 h-32" />
            <div className="text-dark-muted font-bold text-sm uppercase tracking-wider mb-2">
              Total Earnings
            </div>
            <div className="font-display text-5xl font-bold text-white">
              Rs.{data.total}{" "}
              <span className="text-lg text-dark-muted font-body font-normal tracking-wide">
                PKR
              </span>
            </div>
          </div>
          <div className="card glass p-8 border-t-4 border-t-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-[40px] bg-primary w-32 h-32" />
            <div className="text-dark-muted font-bold text-sm uppercase tracking-wider mb-2">
              This Month
            </div>
            <div className="font-display text-5xl font-bold text-white">
              Rs.{data.thisMonth}
            </div>
          </div>
        </div>

        <div className="card glass p-8">
          <h2 className="section-label mb-6">
            Recent Payouts / Completed Jobs
          </h2>
          {data.history.length === 0 ? (
            <div className="text-center py-10 text-dark-muted border-dashed border-2 border-dark-border rounded-xl">
              No completed jobs yet. Keep hustling!
            </div>
          ) : (
            <div className="space-y-4">
              {data.history
                .sort(
                  (a, b) =>
                    (b.completedAt?.seconds || 0) -
                    (a.completedAt?.seconds || 0),
                )
                .map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4 bg-dark-surface rounded-xl border border-dark-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-dark-card flex items-center justify-center shadow-glow-primary border border-dark-border text-lg">
                        💰
                      </div>
                      <div>
                        <div className="font-bold text-white capitalize">
                          {req.service.replace("-", " ")}
                        </div>
                        <div className="text-xs text-dark-muted">
                          {new Date(
                            req.createdAt?.seconds * 1000,
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl text-success font-bold">
                        +Rs.{req.price}
                      </div>
                      <div className="text-xs text-dark-muted font-semibold">
                        Paid
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
