import React from "react";
import IntroOverlay from "@/components/landing/IntroOverlay";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingHomeClient() {
  return (
    <main className="min-h-screen bg-brand-black text-white font-satoshi">
      <LandingNavbar />
      <IntroOverlay />
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturesSection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
