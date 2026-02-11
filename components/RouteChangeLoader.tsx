"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const RouteChangeLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    let endTimer: NodeJS.Timeout | null = null;

    const handleStartLoading = () => {
      setIsLoading(true);
      setProgress(10);

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 25;
        });
      }, 100);
    };

    const handleCompleteLoading = () => {
      if (progressInterval) clearInterval(progressInterval);
      setProgress(100);

      endTimer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    };

    // Listen for route changes
    const handleRouteChange = () => {
      handleCompleteLoading();
    };

    // This is a client-side approach - we'll use a simple observer
    // In production, you might use next/router events or other solutions
    window.addEventListener("beforeunload", handleStartLoading);

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (endTimer) clearTimeout(endTimer);
      window.removeEventListener("beforeunload", handleStartLoading);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9997] h-1 bg-gray-800"
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
          />
        </motion.div>
      )}
    </>
  );
};

export default RouteChangeLoader;
