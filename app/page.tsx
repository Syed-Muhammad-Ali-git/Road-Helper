"use client";

import React, { useState, useEffect, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import LandingHomeClient from "@/components/landing/LandingHomeClient";

const Home = () => {
  // Lazy initialization to avoid hydration mismatch
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return false;

    const splashKey = "rh_splash_seen";
    const sessionKey = "rh_session_started";
    const splashSeen = localStorage.getItem(splashKey);
    const sessionStarted = sessionStorage.getItem(sessionKey);

    const shouldShow =
      splashSeen !== "true" ||
      (splashSeen === "true" &&
        sessionStarted !== "true" &&
        window.location.pathname === "/");

    if (shouldShow) {
      sessionStorage.setItem(sessionKey, "true");
    }

    return shouldShow;
  });

  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSplashComplete = useCallback(() => {
    const splashKey = "rh_splash_seen";
    const sessionKey = "rh_session_started";
    localStorage.setItem(splashKey, "true");
    sessionStorage.setItem(sessionKey, "true");
    setShowSplash(false);
  }, []);

  // During hydration, show landing page (same as server render)
  if (!isHydrated) {
    return <LandingHomeClient />;
  }

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} duration={2000} />
      )}
      {!showSplash && <LandingHomeClient />}
    </>
  );
};

export default Home;
