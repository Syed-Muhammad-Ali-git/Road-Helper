"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconActivity,
  IconChartBar,
  IconMapPin,
  IconShieldCheck,
} from "@tabler/icons-react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function IntroOverlay() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const seenKey = "rh_intro_seen_v1";

  const stats = useMemo(
    () => [
      { icon: IconMapPin, label: "Live tracking", value: "Real-time" },
      { icon: IconShieldCheck, label: "Verified helpers", value: "Trusted" },
      { icon: IconActivity, label: "Fast dispatch", value: "< 2 min" },
      { icon: IconChartBar, label: "Uptime", value: "99.9%" },
    ],
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(seenKey);
    if (seen) return;

    const start = Date.now();
    const duration = 5000;
    const t = setInterval(() => {
      const raw = ((Date.now() - start) / duration) * 100;
      const p = clamp(Math.round(raw), 0, 100);
      setProgress(p);
      setVisible(true);
      if (p >= 100) {
        clearInterval(t);
        window.localStorage.setItem(seenKey, "1");
        setTimeout(() => setVisible(false), 250);
      }
    }, 25);

    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-brand-black text-white flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ scale: 0.98, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="w-full max-w-2xl glass-dark border border-white/10 rounded-[36px] p-8 md:p-10 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-brand-red/10 via-white/5 to-transparent"
              animate={{ x: ["-60%", "60%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10">
              <div className="text-gray-400 text-xs font-black uppercase tracking-[0.3em]">
                RoadHelper Systems
              </div>
              <div className="font-manrope font-black text-3xl md:text-4xl mt-2">
                Initializing <span className="text-brand-red">Live Rescue</span>
              </div>
              <div className="text-gray-400 mt-3">
                We’re preparing dispatch, tracking, and verification layers for
                a premium experience.
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <s.icon size={18} className="text-brand-red" />
                    <div className="text-white font-black mt-2">{s.value}</div>
                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-brand-red to-brand-dark-red rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs font-black text-gray-500">
                  <span>Boot sequence</span>
                  <span>{progress}%</span>
                </div>

                <button
                  className="mt-5 w-full md:w-auto px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-black"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem(seenKey, "1");
                    }
                    setVisible(false);
                  }}
                >
                  Skip intro
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
