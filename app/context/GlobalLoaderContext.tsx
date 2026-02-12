"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalLoaderContextType {
  isLoading: boolean;
  progress: number;
  message?: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setProgress: (value: number) => void;
  setMessage: (msg: string) => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(
  undefined,
);

export const GlobalLoaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | undefined>();

  const startLoading = useCallback((msg?: string) => {
    setIsLoading(true);
    setMessage(msg);
    setProgress(0);
  }, []);

  const stopLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      setMessage(undefined);
    }, 300);
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
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9998 bg-black/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      {children}
    </GlobalLoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error("useGlobalLoader must be used within GlobalLoaderProvider");
  }
  return context;
};
