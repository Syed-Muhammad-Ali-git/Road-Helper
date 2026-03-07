"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HelpRequest, UserProfile } from "@/lib/firestore";
import { useTranslation } from "@/lib/firebase/hooks/useTranslation";
import Link from "next/link";
import dynamic from "next/dynamic";
const MapPreview = dynamic(
  () => import("@/components/map/MapPreview").then((mod) => mod.MapPreview),
  { ssr: false },
);
import { onSnapshot } from "firebase/firestore";

export default function AdminDashboard() {
  const t = useTranslation();
  const [stats, setStats] = useState({
    users: 0,
    helpers: 0,
    requestsToday: 0,
    totalCommissions: 0,
  });
  const [recentReqs, setRecentReqs] = useState<HelpRequest[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Users
      const userSnap = await getDocs(
        query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50)),
      );
      const usersList = userSnap.docs.map((d) => d.data() as UserProfile);
      setRecentUsers(usersList.slice(0, 10));

      const helpersCount = usersList.filter((u) => u.role === "helper").length;

      // Requests
      const reqSnap = await getDocs(
        query(
          collection(db, "requests"),
          orderBy("createdAt", "desc"),
          limit(50),
        ),
      );
      const reqsList = reqSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as HelpRequest,
      );

      // Commissions
      const commSnap = await getDocs(
        query(
          collection(db, "commissions"),
          orderBy("createdAt", "desc"),
          limit(50),
        ),
      );
      const commList = commSnap.docs.map((d) => d.data());
      setCommissions(commList);
      const totalEarned = commList.reduce((acc, c) => acc + (c.amount || 0), 0);

      setStats({
        users: usersList.length,
        helpers: helpersCount,
        requestsToday: reqsList.length,
        totalCommissions: totalEarned,
      });

      setLoading(false);
    }
    fetchData();

    // Listen for live requests for the map
    const unsub = onSnapshot(
      query(
        collection(db, "requests"),
        where("status", "not-in", ["completed", "cancelled"]),
      ),
      (snap) => {
        const docs = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as HelpRequest,
        );
        setRecentReqs(docs);
      },
    );

    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center bg-dark-bg">
        <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-[var(--text)] bg-grid noise-overlay">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto space-y-8 relative z-10"
      >
        <div className="flex items-center justify-between border-b border-dark-border pb-6">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">
              {t("admin.dashboardTitle")}
            </h1>
            <p className="text-dark-muted">{t("admin.platformOverview")}</p>
          </div>
          <Link href="/" className="btn-ghost">
            {t("admin.logOut")}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card glass p-6 border-l-4 border-l-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-[40px] bg-primary w-24 h-24" />
            <div className="text-sm font-semibold text-dark-muted mb-1 uppercase tracking-wider">
              Total Users (Recent)
            </div>
            <div className="font-display text-4xl font-bold text-white">
              {stats.users}
            </div>
          </div>
          <div className="card glass p-6 border-l-4 border-l-secondary relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-[40px] bg-secondary w-24 h-24" />
            <div className="text-sm font-semibold text-dark-muted mb-1 uppercase tracking-wider">
              Helpers (Recent)
            </div>
            <div className="font-display text-4xl font-bold text-white">
              {stats.helpers}
            </div>
          </div>
          <div className="card glass p-6 border-l-4 border-l-success relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-[40px] bg-success w-24 h-24" />
            <div className="text-sm font-semibold text-dark-muted mb-1 uppercase tracking-wider">
              Total Revenue (PKR)
            </div>
            <div className="font-display text-4xl font-bold text-white">
              Rs.{(stats as any).totalCommissions || 0}
            </div>
          </div>
        </div>

        {/* Real-time Tracking Map */}
        <div className="space-y-4">
          <h2 className="section-label mb-2 text-primary">
            Live Platform Pulse
          </h2>
          <div className="card glass p-2 h-[450px] relative overflow-hidden rounded-3xl border-primary/20 shadow-glow-primary">
            <MapPreview
              customerLoc={recentReqs[0]?.location}
              helperLoc={
                (recentReqs as any).find((r: any) => r.helperLoc)?.helperLoc
              }
              zoom={11}
            />
            <div className="absolute bottom-6 right-6 z-20">
              <div className="card glass px-4 py-2 flex items-center gap-3 border-success/30 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-bold text-white">
                  Monitoring {recentReqs.length} Active Missions
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Requests */}
          <div className="space-y-4">
            <h2 className="section-label mb-2">{t("admin.recentRequests")}</h2>
            <div className="card glass rounded-xl overflow-hidden border-dark-border">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-dark-surface/50 border-b border-dark-border text-dark-muted">
                    <tr>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Customer
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Service
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {recentReqs.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-dark-surface/30 transition-colors"
                      >
                        <td className="p-4 font-medium text-white">
                          {req.customerName}
                        </td>
                        <td className="p-4 text-dark-text-secondary capitalize">
                          {req.service.replace("-", " ")}
                        </td>
                        <td className="p-4">
                          <span
                            className={`badge-${req.status === "completed" ? "success" : req.status === "cancelled" ? "error" : "warning"} text-[10px]`}
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentReqs.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-4 text-center text-dark-muted"
                        >
                          {t("admin.noRequestsFound")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="space-y-4">
            <h2 className="section-label mb-2">{t("admin.recentUsers")}</h2>
            <div className="card glass rounded-xl overflow-hidden border-dark-border">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-dark-surface/50 border-b border-dark-border text-dark-muted">
                    <tr>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Name
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Email
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {recentUsers.map((u, idx) => (
                      <tr
                        key={`${u.uid}-${idx}`}
                        className="hover:bg-dark-surface/30 transition-colors"
                      >
                        <td className="p-4 font-medium text-white">
                          {u.name || "Unnamed"}
                        </td>
                        <td className="p-4 text-dark-text-secondary">
                          {u.email}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-dark-surface border border-dark-border rounded text-xs text-dark-muted uppercase font-bold">
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-4 text-center text-dark-muted"
                        >
                          {t("admin.noUsersFound")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
