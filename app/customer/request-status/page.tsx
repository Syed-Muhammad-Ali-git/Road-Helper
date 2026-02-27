"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestOps, type HelpRequest } from "@/lib/firestore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { MapPreview } from "@/components/map/MapPreview";

function StatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reqId = searchParams.get("id");

  const [req, setReq] = useState<HelpRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (!reqId) return;
    const unsub = requestOps.subscribeToRequest(reqId, (data) => {
      if (data) setReq(data);
      setLoading(false);
      if (data?.status === "completed" && !data.rating) {
        setShowRating(true);
      }
    });
    return () => unsub();
  }, [reqId]);

  if (loading)
    return (
      <div className="py-32 flex justify-center">
        <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
      </div>
    );
  if (!req)
    return (
      <div className="text-center py-20 text-white">
        Request not found.{" "}
        <Link href="/customer/dashboard" className="text-primary underline">
          Go Home
        </Link>
      </div>
    );

  const handleCancel = async () => {
    if (confirm("Cancel this request?")) {
      await requestOps.cancel(req.id!);
      router.push("/customer/dashboard");
    }
  };

  const handleRate = async () => {
    if (rating === 0) return;
    await requestOps.rate(req.id!, rating, review, req.helperId!);
    setShowRating(false);
    router.push("/customer/dashboard");
  };

  const stepIndex = [
    "pending",
    "accepted",
    "en-route",
    "arrived",
    "completed",
  ].indexOf(req.status);

  return (
    <div className="max-w-4xl mx-auto relative z-10 animate-fade-in grid md:grid-cols-2 gap-8">
      {/* Tracker Column */}
      <div className="card glass p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark-border">
          <h1 className="font-display text-2xl font-bold">Request Status</h1>
          <div className="text-xs font-mono text-dark-muted py-1 px-2 bg-dark-surface rounded">
            ID: {req.id?.slice(0, 8)}
          </div>
        </div>

        <div className="space-y-8 relative">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-dark-border z-0" />
          <div
            className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-1000 z-0"
            style={{ height: `${Math.max(0, stepIndex) * 25}%` }}
          />

          {[
            {
              id: "pending",
              title: "Finding Helper",
              sub: "Searching area...",
            },
            {
              id: "accepted",
              title: "Helper Accepted",
              sub: "Preparing to dispatch",
            },
            { id: "en-route", title: "On the Way", sub: "Helper is en route" },
            {
              id: "arrived",
              title: "Arrived",
              sub: "Helper is at your location",
            },
            {
              id: "completed",
              title: "Job Complete",
              sub: "Payment processed",
            },
          ].map((s, i) => {
            const isPast = stepIndex >= i;
            const isCurrent = stepIndex === i;
            return (
              <div
                key={s.id}
                className={`flex gap-6 relative z-10 ${isPast ? "opacity-100" : "opacity-40"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${isPast ? "bg-primary border-primary text-white shadow-glow-primary" : "bg-dark-surface border-dark-border"}`}
                >
                  {isPast ? "✓" : i + 1}
                </div>
                <div>
                  <div
                    className={`font-bold ${isCurrent ? "text-primary" : "text-white"}`}
                  >
                    {s.title}
                  </div>
                  <div className="text-sm text-dark-muted">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {req.status === "pending" || req.status === "accepted" ? (
          <button
            onClick={handleCancel}
            className="mt-8 w-full p-3 rounded-xl border border-error/50 text-error hover:bg-error/10 font-bold transition-colors"
          >
            Cancel Request
          </button>
        ) : null}
      </div>

      {/* Helper Info & Map Column */}
      <div className="space-y-6">
        <div className="card glass p-2 overflow-hidden aspect-video rounded-3xl relative">
          <MapPreview
            customerLoc={req.location}
            helperLoc={req.helperLoc}
            zoom={req.status === "pending" ? 12 : 14}
          />
        </div>

        {req.helperId ? (
          <div className="card glass p-6 border-l-4 border-l-secondary">
            <h3 className="section-label mb-4">Assigned Professional</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center text-2xl shadow-glow-primary">
                👨‍🔧
              </div>
              <div>
                <div className="font-bold text-xl text-white block mb-1">
                  {req.helperName}
                </div>
                <div className="text-dark-muted text-sm font-medium pt-1">
                  Distance: <span className="text-white">Est. 5 miles</span>
                </div>
              </div>
            </div>

            {req.price && (
              <div className="mt-4 pt-4 border-t border-dark-border flex justify-between items-center">
                <span className="text-dark-muted font-medium">
                  Agreed Price
                </span>
                <span className="text-xl font-bold font-mono text-primary">
                  Rs.{req.price}
                </span>
              </div>
            )}
          </div>
        ) : req.status === "cancelled" ? (
          <div className="card glass p-6 border border-error/30 text-center">
            <div className="text-error font-bold mb-2">Request Cancelled</div>
            <Link href="/customer/request-help" className="btn-primary">
              Request Again
            </Link>
          </div>
        ) : (
          <div className="card glass p-6 text-center text-dark-muted">
            <div className="w-8 h-8 rounded-full border-[3px] border-dark-muted border-t-transparent animate-spin mx-auto mb-3" />
            Waiting for a helper to accept...
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card glass max-w-sm w-full p-8 text-center animate-slide-up bg-dark-surface">
            <div className="text-5xl mb-4">🌟</div>
            <h2 className="font-display text-2xl font-bold mb-2 text-white">
              Rate Your Experience
            </h2>
            <p className="text-dark-muted text-sm mb-6">
              How was the service provided by {req.helperName}?
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-all hover:scale-110 ${rating >= star ? "text-accent drop-shadow-[0_0_10px_rgba(255,179,71,0.5)]" : "text-dark-muted/30 grayscale"}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Leave a review... (Optional)"
              className="input-field mb-6 min-h-[80px] text-center resize-none"
            />

            <button
              onClick={handleRate}
              disabled={rating === 0}
              className="btn-primary w-full justify-center"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RequestStatusPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-white bg-grid noise-overlay">
      <Suspense fallback={<div>Loading...</div>}>
        <StatusContent />
      </Suspense>
    </div>
  );
}
