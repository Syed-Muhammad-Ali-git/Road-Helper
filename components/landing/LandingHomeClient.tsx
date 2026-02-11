"use client";

import React from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingHomeClient() {
  return (
    <main className="min-h-screen font-satoshi transition-colors duration-300">
      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturesSection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
