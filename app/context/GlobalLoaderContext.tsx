"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalLoaderContextType {
  isLoading: boolean;
  progress: number;
  message: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
}

const GlobalLoaderContext = createContext<
  GlobalLoaderContextType | undefined
>(undefined);

export const GlobalLoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [message, setMessageState] = useState("Loading...");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoCompleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback((msg = "Loading...") => {
    setMessageState(msg);
    setIsLoading(true);
    setProgressState(10);

    // Auto-increment progress
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgressState((prev) => {
        if (prev >= 85) return 85;
        return prev + Math.random() * 20;
      });
    }, 200);
  }, []);

  const stopLoading = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setProgressState(100);

    // Auto-hide after completion
    if (autoCompleteTimerRef.current) {
      clearTimeout(autoCompleteTimerRef.current);
    }

    autoCompleteTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgressState(0);
    }, 500);
  }, []);

  const setProgress = useCallback((value: number) => {
    setProgressState(Math.min(value, 100));
  }, []);

  const setMessage = useCallback((msg: string) => {
    setMessageState(msg);
  }, []);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (autoCompleteTimerRef.current) clearTimeout(autoCompleteTimerRef.current);
    };
  }, []);

  return (
    <GlobalLoaderContext.Provider
      value={{
        isLoading,
        progress,
        message,
        startLoading,
        stopLoading,
        setProgress,
        setMessage,
      }}
    >
      {children}

      <AnimatePresence>
        {isLoading && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9997]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            >
              <div className="bg-brand-charcoal border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                {/* Progress bar outside modal */}
                <motion.div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 rounded-t-2xl overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                    className="h-full bg-gradient-to-r from-brand-red via-brand-yellow to-brand-red"
                  />
                </motion.div>

                {/* Content */}
                <div className="flex flex-col items-center gap-4">
                  {/* Animated dots */}
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.15,
                          repeat: Infinity,
                        }}
                        className="w-3 h-3 bg-brand-red rounded-full"
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-white font-medium text-center text-sm">
                    {message}
                  </p>

                  {/* Percentage */}
                  <p className="text-gray-400 text-xs font-mono">
                    {Math.round(progress)}%
                  </p>

                  {/* Progress bar inside modal */}
                  <motion.div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 20,
                      }}
                      className="h-full bg-gradient-to-r from-brand-red via-brand-yellow to-brand-red"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </GlobalLoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error(
      "useGlobalLoader must be used within GlobalLoaderProvider"
    );
  }
  return context;
};

export default GlobalLoaderProvider;
