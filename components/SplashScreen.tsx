"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: duration - 1000 }}
      className="fixed inset-0 z-50 bg-brand-black flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 via-brand-black to-brand-charcoal" />

      {/* Animated shapes */}
      <motion.div
        className="absolute w-96 h-96 bg-brand-red/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Logo Container */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl"
        >
          <Image
            src="/assets/images/logo.png"
            alt="RoadHelper"
            width={80}
            height={80}
            priority
            className="w-16 h-16 object-contain"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h1 className="font-manrope font-black text-4xl tracking-tight">
            Road<span className="text-brand-red">Helper</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-2">
            Your Trusted Roadside Companion
          </p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex gap-2 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              className="w-2 h-2 bg-brand-red rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
