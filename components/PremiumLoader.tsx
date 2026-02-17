"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAppTheme } from "@/app/context/ThemeContext";
import type { LoaderProps } from "@/types/firebase";

const PremiumLoader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "brand",
  fullScreen = false,
  message,
}) => {
  const { isDark } = useAppTheme();

  const sizeClasses = useMemo(() => {
    const sizes = {
      sm: { container: "w-8 h-8", inner: "w-6 h-6", text: "text-xs" },
      md: { container: "w-16 h-16", inner: "w-12 h-12", text: "text-sm" },
      lg: { container: "w-24 h-24", inner: "w-20 h-20", text: "text-base" },
      xl: { container: "w-32 h-32", inner: "w-28 h-28", text: "text-lg" },
    };
    return sizes[size];
  }, [size]);

  const loaderContent = useMemo(() => {
    if (variant === "brand") {
      return (
        <div
          className="relative"
          style={{
            width:
              sizeClasses.container.split(" ")[0].replace("w-", "") + "rem",
            height:
              sizeClasses.container.split(" ")[1].replace("h-", "") + "rem",
          }}
        >
          {/* Outer rotating ring */}
          <motion.div
            className={`absolute inset-0 rounded-full border-4 border-t-transparent ${
              isDark
                ? "border-brand-red/80 border-b-brand-yellow/60"
                : "border-brand-red border-b-brand-gold"
            }`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Middle counter-rotating ring */}
          <motion.div
            className={`absolute inset-2 rounded-full border-4 border-b-transparent ${
              isDark
                ? "border-brand-yellow/40 border-t-brand-red/40"
                : "border-brand-gold/60 border-t-brand-red/60"
            }`}
            animate={{ rotate: -360 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner pulsing core */}
          <motion.div
            className={`absolute inset-4 rounded-full bg-gradient-to-br ${
              isDark
                ? "from-brand-red/20 to-brand-yellow/20"
                : "from-brand-red/10 to-brand-gold/10"
            } flex items-center justify-center`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span
              className={`font-bold ${
                size === "sm"
                  ? "text-xs"
                  : size === "md"
                    ? "text-lg"
                    : size === "lg"
                      ? "text-2xl"
                      : "text-3xl"
              } ${isDark ? "text-brand-yellow" : "text-brand-red"}`}
            >
              R
            </span>
          </motion.div>

          {/* Orbiting particles */}
          {size !== "sm" && (
            <>
              <motion.div
                className={`absolute w-2 h-2 rounded-full ${
                  isDark ? "bg-brand-yellow" : "bg-brand-red"
                }`}
                style={{
                  top: "50%",
                  left: "50%",
                  marginTop: "-4px",
                  marginLeft: "-4px",
                }}
                animate={{
                  x: [0, 30, 0, -30, 0],
                  y: [0, -30, 0, 30, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className={`absolute w-1.5 h-1.5 rounded-full ${
                  isDark ? "bg-brand-red" : "bg-brand-gold"
                }`}
                style={{
                  top: "50%",
                  left: "50%",
                  marginTop: "-3px",
                  marginLeft: "-3px",
                }}
                animate={{
                  x: [0, -25, 0, 25, 0],
                  y: [0, 25, 0, -25, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </>
          )}
        </div>
      );
    }

    if (variant === "spinner") {
      return (
        <motion.div
          className={`${sizeClasses.container} rounded-full border-4 border-t-transparent ${
            isDark ? "border-brand-red" : "border-brand-red/80"
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      );
    }

    if (variant === "dots") {
      return (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`${size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"} rounded-full ${
                isDark ? "bg-brand-red" : "bg-brand-red/80"
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      );
    }

    if (variant === "pulse") {
      return (
        <motion.div
          className={`${sizeClasses.container} rounded-full ${
            isDark ? "bg-brand-red" : "bg-brand-red/80"
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      );
    }

    return null;
  }, [variant, sizeClasses, isDark, size]);

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-4"
    >
      {loaderContent}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${sizeClasses.text} ${
            isDark ? "text-gray-300" : "text-gray-700"
          } font-medium`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-[99999] flex items-center justify-center ${
          isDark ? "bg-black/40" : "bg-white/60"
        } backdrop-blur-md`}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default PremiumLoader;
