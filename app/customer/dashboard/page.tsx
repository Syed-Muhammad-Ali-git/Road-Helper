"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@mantine/core";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { HelpRequest, requestOps } from "@/lib/firestore";
import Link from "next/link";

export default function CustomerDashboard() {
  const { user, profile, loading: authLoading } = useAuthStore();
  const t = useTranslation();
  const [activeRequest, setActiveRequest] = useState<HelpRequest | null>(null);
  const [history, setHistory] = useState<HelpRequest[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsub = requestOps.subscribeToCustomerRequests(user.uid, (reqs) => {
      const active = reqs.find((r) =>
        ["pending", "accepted", "en-route", "arrived"].includes(r.status),
      );
      setActiveRequest(active || null);
      setHistory(reqs.filter((r) => r.id !== active?.id).slice(0, 3));
      setDataLoading(false);
    });

    return () => unsub();
  }, [user]);

  const loading = authLoading || dataLoading;

  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-white bg-grid noise-overlay">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8 relative z-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {loading ? (
              <div className="space-y-2">
                <Skeleton
                  height={40}
                  width={300}
                  radius="md"
                  bg="rgba(255,255,255,0.05)"
                />
                <Skeleton
                  height={20}
                  width={250}
                  radius="md"
                  bg="rgba(255,255,255,0.05)"
                />
              </div>
            ) : (
              <>
                <h1 className="font-display text-3xl font-bold mb-2">
                  {t("dashboard.welcome")},{" "}
                  <span className="text-primary">
                    {profile?.name || "Driver"}
                  </span>{" "}
                  👋
                </h1>
                <p className="text-dark-muted">
                  Manage your active requests and view your history.
                </p>
              </>
            )}
          </div>
          <Link
            href="/customer/profile"
            className="btn-ghost px-4 py-2 border border-dark-border hover:border-primary/50"
          >
            Edit Profile
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="section-label">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: "towing", label: "Towing", icon: "🚙" },
              { id: "tire-change", label: "Flat Tire", icon: "🛞" },
              { id: "fuel-delivery", label: "Out of Fuel", icon: "⛽" },
              { id: "battery-jump", label: "Dead Battery", icon: "🔋" },
            ].map((svc, i) => (
              <motion.div
                key={svc.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/customer/request-help?type=${svc.id}`}
                  className="card glass p-6 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-3xl mb-4 group-hover:shadow-glow-primary transition-all">
                    {svc.icon}
                  </div>
                  <span className="font-semibold text-white">{svc.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Active Request Card */}
          <div className="md:col-span-2">
            <h2 className="section-label mb-4">Current Status</h2>
            {loading ? (
              <Skeleton height={200} radius="xl" bg="rgba(255,255,255,0.05)" />
            ) : activeRequest ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card glass p-6 border-l-4 border-l-primary relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 blur-[40px] bg-primary w-32 h-32" />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-xl mb-1 capitalize text-white">
                      {activeRequest.service.replace("-", " ")}
                    </h3>
                    <div className="text-sm text-dark-muted">
                      Requested today
                    </div>
                  </div>
                  <span
                    className={`badge-${activeRequest.status === "completed" ? "success" : activeRequest.status === "cancelled" ? "error" : "warning"} px-3 py-1 font-bold text-sm tracking-wide capitalize`}
                  >
                    {activeRequest.status.replace("-", " ")}
                  </span>
                </div>

                {activeRequest.helperName && (
                  <div className="flex items-center gap-4 bg-dark-surface p-4 rounded-xl mb-6 border border-dark-border">
                    <div className="w-12 h-12 rounded-full bg-dark-bg flex items-center justify-center font-bold text-lg border border-dark-border">
                      {activeRequest.helperName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm text-dark-muted font-medium">
                        Assigned Helper
                      </div>
                      <div className="font-bold text-white tracking-wide">
                        {activeRequest.helperName}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Link
                    href={`/customer/request-status?id=${activeRequest.id}`}
                    className="btn-primary py-2.5 px-6 shadow-glow-primary"
                  >
                    Track Live
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="card glass p-8 flex flex-col items-center justify-center border-dashed border-2 border-dark-border py-16 text-center">
                <div className="text-4xl mb-4 opacity-50">🛤️</div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  No Active Requests
                </h3>
                <p className="text-dark-muted mb-6 max-w-sm">
                  You're all safe right now! Use the quick actions above if you
                  need roadside assistance.
                </p>
              </div>
            )}
          </div>

          {/* Recent History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-label mb-0">Recent History</h2>
              <Link
                href="/customer/history"
                className="text-xs text-primary hover:text-primary-hover font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      height={80}
                      radius="lg"
                      bg="rgba(255,255,255,0.05)"
                    />
                  ))
              ) : history.length > 0 ? (
                history.map((req, i) => (
                  <motion.div
                    key={req.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="card glass p-4 group hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold capitalize text-white text-sm">
                        {req.service.replace("-", " ")}
                      </span>
                      <span className="text-xs font-semibold text-dark-muted">
                        {new Date(
                          req.createdAt?.seconds * 1000,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`badge-${req.status === "completed" ? "success" : "error"} text-[10px]`}
                      >
                        {req.status}
                      </span>
                      <span className="font-mono text-dark-muted font-bold">
                        ${req.price || "--"}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="card glass p-6 text-center border-dashed text-dark-muted border-dark-border">
                  No history found.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
