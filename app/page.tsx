"use client";

import React, { useState, useEffect } from "react";
import LandingHomeClient from "@/components/landing/LandingHomeClient";
import SplashScreen from "@/components/SplashScreen";

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("splashSeen");
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("splashSeen", "true");
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} duration={5000} />}
      {!showSplash && <LandingHomeClient />}
    </>
  );
};

export default Home;
