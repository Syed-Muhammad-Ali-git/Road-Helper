"use client";
import { useEffect, useState } from "react";
import { useLangStore } from "@/store/langStore";
import { useTranslation } from "@/hooks/useTranslation";

interface LoaderProps {
  onComplete?: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const { lang } = useLangStore();
  const t = useTranslation();

  useEffect(() => {
    // Simulate loading phases
    const steps = [15, 35, 58, 72, 88, 95, 100];
    let i = 0;
    const timer = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(timer);
        setPhase("done");
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 600);
      }
    }, 180);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 transition-all duration-700 ${
        phase === "done"
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      style={{ background: "var(--bg)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20 animate-pulse"
          style={{
            background: "radial-gradient(circle, #FF2D2D 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative flex items-center gap-3 z-10 animate-fade-up">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl animate-pulse-glow"
          style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B35)" }}
        >
          🚗
        </div>
        <div>
          <div className="font-display font-extrabold text-2xl text-white tracking-tight">
            RoadHelper
          </div>
          <div className="text-xs text-gray-500 tracking-widest uppercase mt-0.5">
            {lang === "ur"
              ? "تیار ہو رہا ہے..."
              : lang === "rm"
                ? "Tayyar ho raha hai..."
                : t("loader.text")}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-72 flex flex-col gap-3">
        <div
          className="w-full h-[3px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full relative"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #FF2D2D, #FF6B35, #FFB347)",
              boxShadow: "0 0 12px #FF2D2D",
              transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* Moving dot */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{
                background: "#FFB347",
                boxShadow: "0 0 10px #FFB347",
                transform: "translate(50%, -50%)",
              }}
            />
          </div>
        </div>
        <div
          className="flex justify-between items-center text-xs"
          style={{ color: "#4A5568" }}
        >
          <span className="tracking-widest font-mono">
            {Math.round(progress)}%
          </span>
          <span className="tracking-widest">
            {progress < 40
              ? "⚡ Connecting..."
              : progress < 80
                ? "🗺️ Loading maps..."
                : "✅ Almost ready..."}
          </span>
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2 z-10">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-blink"
            style={{
              background:
                i === 0
                  ? "#FF2D2D"
                  : i === 1
                    ? "#FF6B35"
                    : i === 2
                      ? "#FFB347"
                      : "#6B7A99",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
