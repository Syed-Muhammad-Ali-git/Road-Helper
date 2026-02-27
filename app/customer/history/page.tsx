"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { requestOps, type HelpRequest } from "@/lib/firestore";
import Link from "next/link";

export default function CustomerHistory() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    requestOps.getCustomerHistory(user.uid).then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-white bg-grid noise-overlay">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative z-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Request History</h1>
          <Link
            href="/customer/dashboard"
            className="btn-ghost px-4 py-2 text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="card glass p-16 text-center border-dashed border-2 border-dark-border py-24">
            <h3 className="font-bold text-xl mb-2 text-white">
              No history yet
            </h3>
            <p className="text-dark-muted max-w-sm mx-auto">
              Your completed or cancelled requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((req) => (
              <div
                key={req.id}
                className="card glass p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center text-xl shadow-glow-primary">
                    {req.service === "towing"
                      ? "🚙"
                      : req.service === "tire-change"
                        ? "🛞"
                        : "🔧"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white capitalize text-lg tracking-tight mb-1">
                      {req.service.replace("-", " ")}
                    </h3>
                    <div className="text-xs text-dark-muted font-medium">
                      {new Date(req.createdAt?.seconds * 1000).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div
                      className={`badge-${req.status === "completed" ? "success" : "error"} mb-1`}
                    >
                      {req.status}
                    </div>
                    <div className="font-mono text-white text-lg font-bold">
                      Rs.{req.price || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
