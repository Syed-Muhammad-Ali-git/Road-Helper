"use client";

import React, { useState, useEffect, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import LandingHomeClient from "@/components/landing/LandingHomeClient";

const Home = () => {
  // Initialize splash state based on localStorage (client-side only)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const splashKey = "rh_splash_seen";
      const sessionKey = "rh_session_started";

      const splashSeen = localStorage.getItem(splashKey);
      const sessionStarted = sessionStorage.getItem(sessionKey);

      // Show splash if:
      // 1. It's the very first visit (splashSeen is null or not 'true')
      // 2. Or, it's a hard refresh on the home page (splashSeen is 'true', but sessionStarted is null, and current path is '/')
      const shouldShow =
        splashSeen !== "true" ||
        (splashSeen === "true" &&
          sessionStarted !== "true" &&
          window.location.pathname === "/");

      // If showing splash due to a refresh or first visit, immediately mark session as started
      // This prevents re-showing on soft navigations *within* the same browser session after the splash has played.
      if (shouldShow) {
        sessionStorage.setItem(sessionKey, "true");
      }
      return shouldShow;
    }
    return true; // Default to show on server
  });
  const [splashCompleted, setSplashCompleted] = useState(false);

  const handleSplashComplete = useCallback(() => {
    const splashKey = "rh_splash_seen";
    const sessionKey = "rh_session_started";
    localStorage.setItem(splashKey, "true");
    sessionStorage.setItem(sessionKey, "true"); // Ensure session is marked as started
    setShowSplash(false);
    setSplashCompleted(true);
  }, []);

  // Show nothing while deciding what to render
  if (showSplash === null) {
    return null;
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
