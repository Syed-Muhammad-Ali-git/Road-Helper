"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GlobalLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    const t = setInterval(() => {
      const p = Math.min(
        100,
        Math.round(((Date.now() - start) / duration) * 100),
      );
      setProgress(p);
      if (p >= 100) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark border border-white/10 rounded-3xl p-8 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-brand-red/10 via-white/5 to-transparent"
            animate={{ x: ["-50%", "50%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl p-2">
              <Image
                src="/assets/images/logo.png"
                alt="RoadHelper"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-manrope font-black text-xl tracking-tight">
                Road<span className="text-brand-red">Helper</span>
              </div>
              <div className="text-gray-400 text-sm font-medium">
                Preparing your live experience…
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-brand-red to-brand-dark-red rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs font-bold text-gray-500">
              <span>Loading</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
