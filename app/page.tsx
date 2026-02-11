"use client";

import React, { useState, useEffect, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import LandingHomeClient from "@/components/landing/LandingHomeClient";

const Home = () => {
  // Initialize splash state based on localStorage (client-side only)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const splashKey = "rh_splash_seen";
      const splashSeen = localStorage.getItem(splashKey);
      return splashSeen !== "true"; // Show if not seen before
    }
    return true; // Default to show on server
  });
  const [splashCompleted, setSplashCompleted] = useState(false);

  const handleSplashComplete = useCallback(() => {
    const splashKey = "rh_splash_seen";
    localStorage.setItem(splashKey, "true");
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
        <SplashScreen onComplete={handleSplashComplete} duration={5000} />
      )}
      {!showSplash && <LandingHomeClient />}
    </>
  );
};

export default Home;
