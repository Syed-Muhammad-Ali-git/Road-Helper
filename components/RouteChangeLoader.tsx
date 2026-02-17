"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import PremiumLoader from "./PremiumLoader";

const RouteChangeLoaderContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Start loading immediately when route changes
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 0);

    // Hide loader after content loads
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <PremiumLoader size="md" variant="brand" fullScreen={true} />
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
