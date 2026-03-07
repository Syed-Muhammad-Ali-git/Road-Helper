"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { requestOps, type HelpRequest } from "@/lib/firestore";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/lib/firebase/hooks/useTranslation";
import Link from "next/link";
import dynamic from "next/dynamic";
const MapPreview = dynamic(
  () => import("@/components/map/MapPreview").then((mod) => mod.MapPreview),
  { ssr: false },
);

function ActiveJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reqId = searchParams.get("id");
  const t = useTranslation();

  const { user } = useAuthStore();
  const [req, setReq] = useState<HelpRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reqId) return;
    const unsub = requestOps.subscribeToRequest(reqId, (data) => {
      setReq(data);
      setLoading(false);
      if (data?.status === "completed") {
        setTimeout(() => router.push("/helper/dashboard"), 3000);
      }
    });
    return () => unsub();
  }, [reqId, router]);

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
      </div>
    );
  if (!req)
    return <div className="text-center py-20 text-[var(--text)]">{t("helper.jobNotFound")}</div>;

  const updateStatus = async (status: "en-route" | "arrived" | "completed") => {
    if (status === "completed") {
      await requestOps.complete(req.id!, req.customerId, user!.uid);
    } else {
      await requestOps.update(req.id!, { status });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 relative z-10"
    >
      <div className="space-y-6">
        <div className="card glass p-8 border-t-4 border-t-secondary">
          <div className="flex justify-between items-start mb-6">
            <h1 className="font-display text-3xl font-bold text-[var(--text)]">{t("helper.missionControl")}</h1>
            <div
              className={`badge-warning px-3 py-1 text-xs font-bold capitalize`}
            >
              {req.status.replace("-", " ")}
            </div>
          </div>

          <div className="bg-dark-surface p-4 rounded-xl border border-dark-border space-y-4 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 blur-[20px] bg-white w-32 h-32" />
            <div>
              <div className="text-xs text-dark-muted font-semibold uppercase tracking-wider">
                {t("dashboard.customer")}
              </div>
              <div className="font-bold text-[var(--text)] text-xl">
                {req.customerName}
              </div>
              <a
                href={`tel:${req.customerPhone}`}
                className="text-primary font-mono font-bold mt-1 inline-flex items-center gap-1 hover:underline"
              >
                📞 {req.customerPhone}
              </a>
            </div>
            <div className="pt-4 border-t border-dark-border">
              <div className="text-xs text-dark-muted font-semibold uppercase tracking-wider mb-1">
                Location
              </div>
              <div className="text-sm text-white/90">
                {req.location.address}
              </div>
            </div>
            {req.notes && (
              <div className="pt-4 border-t border-dark-border">
                <div className="text-xs text-dark-muted font-semibold uppercase tracking-wider mb-1">
                  Notes
                </div>
                <div className="text-sm italic text-warning">{req.notes}</div>
              </div>
            )}
            <div className="pt-4 border-t border-dark-border flex justify-between">
              <span className="text-dark-muted text-sm font-semibold">
                Agreed Price
              </span>
              <span className="font-mono text-xl text-success font-bold">
                Rs.{req.price}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => updateStatus("en-route")}
              disabled={req.status !== "accepted"}
              className={`w-full p-4 rounded-xl font-bold transition-all ${req.status === "accepted" ? "bg-info/20 text-info border border-info/50 hover:bg-info/30" : "bg-dark-surface text-dark-muted border border-dark-border cursor-not-allowed"}`}
            >
              1. Mark En Route
            </button>
            <button
              onClick={() => updateStatus("arrived")}
              disabled={req.status !== "en-route"}
              className={`w-full p-4 rounded-xl font-bold transition-all ${req.status === "en-route" ? "bg-warning/20 text-warning border border-warning/50 hover:bg-warning/30" : "bg-dark-surface text-dark-muted border border-dark-border cursor-not-allowed"}`}
            >
              2. Arrived at Location
            </button>
            <button
              onClick={() => updateStatus("completed")}
              disabled={req.status !== "arrived"}
              className={`w-full p-4 rounded-xl font-bold transition-all ${req.status === "arrived" ? "bg-success/20 text-success border border-success/50 hover:bg-success/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]" : "bg-dark-surface text-dark-muted border border-dark-border cursor-not-allowed"}`}
            >
              3. Complete Job
            </button>
          </div>
        </div>
      </div>

      {/* Map visual */}
      <div className="card glass relative overflow-hidden min-h-[400px] flex items-center justify-center border-dark-border p-6 rounded-[2rem]">
        <div className="absolute inset-0 bg-dark-bg opacity-70 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        {req.status === "completed" ? (
          <div className="relative z-10 text-center animate-slide-up">
            <div className="w-24 h-24 bg-success/20 border-4 border-success text-success rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
              ✓
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2">
              Job Done!
            </h2>
            <p className="text-dark-muted">
              Earnings added to your wallet. Redirecting...
            </p>
          </div>
        ) : (
          <MapPreview
            customerLoc={req.location}
            helperLoc={req.helperLoc}
            zoom={14}
          />
        )}
      </div>
    </motion.div>
  );
}

export default function ActiveJobPage() {
  const t = useTranslation();
  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-[var(--text)] bg-grid noise-overlay">
      <Suspense fallback={<div className="text-center py-20">{t("loader.loading")}</div>}>
        <ActiveJobContent />
      </Suspense>
    </div>
  );
}
