"use client";

import { motion } from "framer-motion";
import { Box } from "@mantine/core";

export default function PremiumLoader() {
  return (
    <Box className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-black/90 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          className="absolute w-24 h-24 border-4 border-brand-red/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Spinning Ring */}
        <motion.div
          className="w-24 h-24 border-4 border-t-brand-red border-r-brand-red border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner Pulse */}
        <motion.div
          className="absolute w-12 h-12 bg-brand-red rounded-full"
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </Box>
  );
}
