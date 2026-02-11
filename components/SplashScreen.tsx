"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@mantine/core";

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const bootRef = useRef<NodeJS.Timeout | null>(null);

  const handleComplete = useCallback(() => {
    // Clear all timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    if (bootRef.current) clearInterval(bootRef.current);

    setIsVisible(false);
    setIsSkipped(true);
    onComplete?.();
  }, [onComplete]);

  // Progress bar logic
  useEffect(() => {
    if (!isVisible) return;

    let currentProgress = 0;

    // Fast progress increments
    progressRef.current = setInterval(() => {
      currentProgress += Math.random() * 25 + 5;
      if (currentProgress > 90) {
        currentProgress = 90;
      }
      setProgress(Math.round(currentProgress));
    }, 200);

    // Complete progress at 80% of duration
    timerRef.current = setTimeout(() => {
      setProgress(100);
      // Hide splash after reaching 100%
      setTimeout(() => {
        handleComplete();
      }, 300);
    }, duration * 0.8);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, duration, handleComplete]);

  // Boot sequence animation
  useEffect(() => {
    if (!isVisible) return;

    let currentBoot = 0;
    bootRef.current = setInterval(() => {
      currentBoot += Math.random() * 15 + 10;
      if (currentBoot > 100) {
        currentBoot = 100;
      }
      setBootProgress(Math.round(currentBoot));
    }, 150);

    return () => {
      if (bootRef.current) clearInterval(bootRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-9999 bg-linear-to-br from-brand-black via-brand-charcoal to-brand-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated background blobs */}
          <motion.div
            className="absolute w-96 h-96 bg-brand-red/5 rounded-full blur-3xl"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -50, 50, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-32 -top-32 w-80 h-80 bg-brand-yellow/5 rounded-full blur-3xl"
            animate={{
              x: [-50, 50, -50, 0],
              y: [50, -50, 50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center gap-8 max-w-2xl px-4"
          >
            {/* Logo */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <Image
                src="/assets/images/logo.png"
                alt="RoadHelper"
                width={96}
                height={96}
                priority
                className="w-20 h-20 object-contain"
              />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <h1 className="font-manrope font-black text-5xl tracking-tight text-white">
                Road<span className="text-brand-yellow">Helper</span>
              </h1>
              <p className="text-gray-400 text-lg font-medium mt-3">
                Initializing Live Rescue
              </p>
            </motion.div>

            {/* Boot sequence label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full max-w-md space-y-6"
            >
              {/* Boot sequence progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-300">
                    Boot Sequence
                  </span>
                  <span className="text-xs text-gray-500">{bootProgress}%</span>
                </div>
                <motion.div
                  className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    className="h-full bg-linear-to-r from-brand-red via-brand-yellow to-brand-red"
                    animate={{ width: `${bootProgress}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  />
                </motion.div>
              </div>

              {/* Main progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-300">
                    Initializing Systems
                  </span>
                  <span className="text-xs font-mono text-brand-yellow">
                    {progress}%
                  </span>
                </div>
                <motion.div
                  className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    className="h-full bg-linear-to-r from-brand-red via-brand-yellow to-brand-red shadow-lg shadow-brand-yellow/50"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex gap-3 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.15,
                    repeat: Infinity,
                  }}
                  className="w-2.5 h-2.5 bg-brand-yellow rounded-full"
                />
              ))}
            </motion.div>

            {/* Status text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-center text-sm text-gray-400 mt-4"
            >
              Preparing dispatch, tracking, and verification systems...
            </motion.p>

            {/* Skip button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-6"
            >
              <Button
                onClick={() => {
                  // Immediate skip: set progress to 100 and hide
                  setProgress(100);
                  setBootProgress(100);
                  setTimeout(() => handleComplete(), 100);
                }}
                variant="outline"
                color="yellow"
                size="sm"
                className="border-brand-yellow/50 text-brand-yellow hover:bg-brand-yellow/10 hover:border-brand-yellow/80 transition-all"
              >
                Skip Intro
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
