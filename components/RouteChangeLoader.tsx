"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppTheme } from "@/app/context/ThemeContext";

const RouteChangeLoaderContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isDark } = useAppTheme();

  useEffect(() => {
    setIsLoading(true);

    const contentLoadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(contentLoadTimer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="route-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-[99999] flex items-center justify-center ${
            isDark ? "bg-black/40" : "bg-white/60"
          } backdrop-blur-md`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Branded loader ring */}
            <motion.div
              className="relative w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            >
              <div
                className={`absolute inset-0 rounded-full border-4 border-t-transparent ${
                  isDark ? "border-brand-red/80 border-b-brand-yellow/60" : "border-brand-red border-b-brand-gold"
                }`}
              />
              <motion.div
                className={`absolute inset-2 rounded-full border-4 border-b-transparent ${
                  isDark ? "border-brand-yellow/40 border-t-brand-red/40" : "border-brand-gold/60 border-t-brand-red/60"
                }`}
                animate={{ rotate: -360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              <div
                className={`absolute inset-4 rounded-full bg-linear-to-br ${
                  isDark ? "from-brand-red/20 to-brand-yellow/20" : "from-brand-red/10 to-brand-gold/10"
                } flex items-center justify-center`}
              >
                <span
                  className={`font-bold text-lg ${
                    isDark ? "text-brand-yellow" : "text-brand-red"
                  }`}
                >
                  R
                </span>
              </div>
            </motion.div>

            {/* Top progress bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-1 w-32 rounded-full bg-linear-to-r from-brand-red via-brand-yellow to-brand-red overflow-hidden"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 bg-white/40"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const RouteChangeLoader = () => {
  return (
    <Suspense fallback={null}>
      <RouteChangeLoaderContent />
    </Suspense>
  );
};

export default RouteChangeLoader;
