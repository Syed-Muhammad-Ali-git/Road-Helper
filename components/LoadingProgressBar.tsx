"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppTheme } from "@/app/context/ThemeContext";

interface LoadingProgressBarProps {
  isVisible?: boolean;
  duration?: number;
  message?: string;
}

export const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({
  isVisible = false,
  duration = 3000,
  message = "Loading...",
}) => {
  const [progress, setProgress] = useState(0);
  const { theme } = useAppTheme();

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    let currentProgress = 0;
    const increment = Math.random() * 30 + 10;
    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress > 90) {
        currentProgress = 90;
      }
      setProgress(currentProgress);
    }, 300);

    const completeTimer = setTimeout(() => {
      setProgress(100);
    }, duration * 0.8);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, [isVisible, duration]);

  const isDark = theme === "dark";

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        className="fixed top-0 left-0 right-0 z-[9998] h-1"
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="h-full bg-gradient-to-r from-brand-red via-brand-yellow to-brand-red"
        />
      </motion.div>

      {/* Loading Toast */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[9998] px-6 py-3 rounded-lg backdrop-blur-md ${
            isDark
              ? "bg-black/50 border border-white/10"
              : "bg-white/50 border border-black/10"
          }`}
        >
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </>
  );
};

export default LoadingProgressBar;
