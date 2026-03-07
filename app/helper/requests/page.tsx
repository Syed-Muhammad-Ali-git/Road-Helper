"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { requestOps, type HelpRequest } from "@/lib/firestore";
import { useTranslation } from "@/lib/firebase/hooks/useTranslation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HelperRequestsBoard() {
  const { user, profile } = useAuthStore();
  const router = useRouter();
  const t = useTranslation();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = requestOps.subscribeToPendingRequests((data) => {
      setRequests(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAccept = async (req: HelpRequest) => {
    if (!user || !profile) return;
    const priceStr = prompt("Enter agreed estimated price (Rs.):", "1500");
    const price = parseInt(priceStr || "0", 10);
    if (!price || price <= 0) return;

    if (confirm(`Accept this ${req.service} request for Rs.${price}?`)) {
      await requestOps.accept(
        req.id!,
        user.uid,
        profile.name || "Helper",
        price,
      );
      router.push(`/helper/active-job?id=${req.id}`);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-[var(--text)] bg-grid noise-overlay">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto space-y-8 relative z-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">
              {t("helper.liveRequests")} 📡
            </h1>
            <p className="text-dark-muted text-sm">
              {t("helper.acceptJobsDesc")}
            </p>
          </div>
          <Link href="/helper/dashboard" className="btn-ghost text-sm">
            ← {t("common.back")}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="card glass py-24 text-center border-dashed border-2 border-dark-border">
            <div className="text-4xl mb-4 opacity-50 radar-spin">📡</div>
            <h3 className="font-bold mb-2 text-[var(--text)]">{t("helper.noPendingRequests")}</h3>
            <p className="text-dark-muted max-w-sm mx-auto">
              {t("helper.broadcasting")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="card glass p-6 border-l-4 border-l-primary hover:border-primary/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center text-xl shadow-glow-primary shrink-0">
                    {req.service === "towing"
                      ? "🚙"
                      : req.service === "tire-change"
                        ? "🛞"
                        : "🔧"}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg capitalize mb-1">
                      {req.service.replace("-", " ")}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-dark-muted mb-2">
                      <span className="font-semibold text-white/80">
                        {req.customerName}
                      </span>
                      <span>•</span>
                      <span>📍 {req.location.address}</span>
                    </div>
                    {req.notes && (
                      <div className="text-xs text-dark-muted italic bg-dark-surface px-3 py-2 rounded-lg inline-block border border-dark-border">
                        "{req.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="text-xs text-dark-muted font-semibold tracking-wider">
                    {new Date(
                      req.createdAt?.seconds * 1000,
                    ).toLocaleTimeString()}
                  </div>
                  <button
                    onClick={() => handleAccept(req)}
                    className="btn-primary py-2 px-6"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
