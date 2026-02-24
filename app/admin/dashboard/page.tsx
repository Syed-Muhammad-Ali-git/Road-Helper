"use client";
import { useState, useEffect } from "react";
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
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    helpers: 0,
    requestsToday: 0,
  });
  const [recentReqs, setRecentReqs] = useState<HelpRequest[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Users
      const userSnap = await getDocs(
        query(collection(db, "users"), orderBy("createdAt", "desc"), limit(10)),
      );
      const usersList = userSnap.docs.map((d) => d.data() as UserProfile);
      setRecentUsers(usersList);

      const helpersCount = usersList.filter((u) => u.role === "helper").length;

      // Requests
      const reqSnap = await getDocs(
        query(
          collection(db, "requests"),
          orderBy("createdAt", "desc"),
          limit(10),
        ),
      );
      const reqsList = reqSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as HelpRequest,
      );
      setRecentReqs(reqsList);

      // Very rough stats for demo
      setStats({
        users: usersList.length,
        helpers: helpersCount,
        requestsToday: reqsList.length, // Mocking today's requests
      });

      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center bg-dark-bg">
        <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-white bg-grid noise-overlay">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
        <div className="flex items-center justify-between border-b border-dark-border pb-6">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">
              Admin Dashboard
            </h1>
            <p className="text-dark-muted">Platform overview and management.</p>
          </div>
          <Link href="/" className="btn-ghost">
            Log Out
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
          <div className="card glass p-6 border-l-4 border-l-accent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-[40px] bg-accent w-24 h-24" />
            <div className="text-sm font-semibold text-dark-muted mb-1 uppercase tracking-wider">
              Requests (Recent)
            </div>
            <div className="font-display text-4xl font-bold text-white">
              {stats.requestsToday}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Requests */}
          <div className="space-y-4">
            <h2 className="section-label mb-2">Recent Requests</h2>
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
                          No requests found.
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
            <h2 className="section-label mb-2">Recent Users</h2>
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
                    {recentUsers.map((u) => (
                      <tr
                        key={u.uid}
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
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
