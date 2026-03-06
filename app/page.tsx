"use client";
import { useState, useEffect } from "react";
import { Loader } from "@/components/ui/Loader";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { useTranslation } from "@/lib/firebase/hooks/useTranslation";
import { useScrollReveal } from "@/lib/firebase/hooks/useScrollReveal";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
const MapPreview = dynamic(
  () => import("@/components/map/MapPreview").then((mod) => mod.MapPreview),
  { ssr: false },
);

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(false);
  const t = useTranslation();
  const [currentPos, setCurrentPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem("rh-loaded")) {
      setShowLoader(true);
      sessionStorage.setItem("rh-loaded", "true");
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsLocating(false);
        },
        () => setIsLocating(false),
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  const featuresRef = useScrollReveal();
  const howRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <>
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
      <Navbar />

      <main className="flex flex-col min-h-screen">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-grid noise-overlay">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-[5%] grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="max-w-2xl animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {t("hero.badge")}
              </div>

              <h1 className="font-display font-extrabold text-[40px] md:text-[64px] leading-[1.1] tracking-[-2px] mb-6 text-white text-balance">
                {t("hero.title")} <br />
                <span className="gradient-text">
                  {t("hero.titleHighlight")}
                </span>
              </h1>

              <p className="font-body text-[18px] text-dark-muted max-w-[480px] mb-10 leading-relaxed">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-14">
                <Link
                  href="/customer/request-help"
                  className="btn-primary text-base px-8 py-4"
                >
                  {t("hero.ctaPrimary")}
                </Link>
                <a href="tel:0000000" className="btn-ghost text-base px-8 py-4">
                  {t("hero.ctaSecondary")}
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: "Avg ETA", value: "15 Min" },
                  { label: "Active Helpers", value: "5K+" },
                  { label: "Cities Covered", value: "25+" },
                  { label: "Rating", value: "4.9/5" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display font-bold text-2xl text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-dark-muted uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Preview Card */}
            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="card glass aspect-square md:aspect-[4/3] relative overflow-hidden flex items-center justify-center border-dark-border group">
                <MapPreview
                  customerLoc={
                    currentPos
                      ? { lat: currentPos.lat, lng: currentPos.lng }
                      : undefined
                  }
                  zoom={12}
                />

                {/* Overlay for finding state */}
                {(isLocating || !currentPos) && (
                  <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center bg-dark-bg/20 backdrop-blur-[2px]">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping absolute -inset-4" />
                      <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-glow-primary text-2xl">
                        🚗
                      </div>
                    </div>
                    <div className="card glass px-6 py-3 flex items-center gap-4 border-primary/20">
                      <div>
                        <div className="text-sm font-bold text-white mb-0.5 whitespace-nowrap">
                          {currentPos
                            ? "Locating nearest helper..."
                            : "Accessing location..."}
                        </div>
                        <div className="text-[10px] text-dark-muted font-mono tracking-tighter uppercase">
                          ETA: ~12 mins
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section
          id="features"
          className="py-24 px-[5%] relative z-10 bg-dark-bg"
          ref={featuresRef}
        >
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="section-label">Why Choose Us</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Premium Roadside Assistance
              </h2>
              <p className="text-dark-muted max-w-2xl mx-auto">
                We provide the fastest and most reliable service when you are
                stranded. From towing to a simple tire change, our professionals
                are on standby.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🚀",
                  title: "Lightning Fast ETA",
                  desc: "Our smart routing connects you to the nearest helper instantly.",
                },
                {
                  icon: "🛡️",
                  title: "Verified Professionals",
                  desc: "Every helper passes a strict background check and skill assessment.",
                },
                {
                  icon: "💳",
                  title: "Transparent Pricing",
                  desc: "Know the estimated cost upfront. No hidden fees, ever.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="card p-8 group hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {f.title}
                  </h3>
                  <p className="text-dark-muted leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section
          id="how"
          className="py-24 px-[5%] relative z-10"
          style={{
            background:
              "linear-gradient(to bottom, var(--dark-bg), var(--dark-surface))",
          }}
          ref={howRef}
        >
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="section-label">How It Works</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                Three Steps to Safety
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-dark-border" />

              {[
                {
                  step: "01",
                  title: "Request Help",
                  desc: "Choose your required service and confirm your exact location.",
                },
                {
                  step: "02",
                  title: "Helper En Route",
                  desc: "Track your assigned professional arriving in real-time.",
                },
                {
                  step: "03",
                  title: "Back on Road",
                  desc: "Get your vehicle fixed safely and securely pay via app.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="relative z-10 text-center flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-full card glass mb-6 flex items-center justify-center font-display font-bold text-2xl text-primary border-primary/30 shadow-glow-primary">
                    {s.step}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {s.title}
                  </h3>
                  <p className="text-dark-muted max-w-[280px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-[5%] relative z-10" ref={ctaRef}>
          <div className="container mx-auto">
            <div className="card glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border-primary/20 shadow-glow-primary-lg">
              <div className="absolute inset-0 bg-gradient-brand opacity-10" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Drive with Confidence?
                </h2>
                <p className="text-lg text-dark-text-secondary mb-10">
                  Join thousands of drivers who trust Road Helper for their
                  peace of mind.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/register"
                    className="btn-primary px-8 py-4 text-base"
                  >
                    Create Free Account
                  </Link>
                  <Link href="/login" className="btn-ghost px-8 py-4 text-base">
                    Login to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-dark-border bg-dark-bg pt-16 pb-8 px-[5%] relative z-10">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-gradient-brand flex items-center justify-center text-sm">
                  🚗
                </div>
                <span className="font-display font-bold text-white">
                  RoadHelper
                </span>
              </div>
              <p className="text-sm text-dark-muted">
                Pakistan's #1 roadside assistance platform. Always there when
                you need us.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li>Towing</li>
                <li>Flat Tire</li>
                <li>Battery Jump</li>
                <li>Fuel Delivery</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Partners</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-dark-border text-sm text-dark-muted">
            &copy; {new Date().getFullYear()} Road Helper. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
}
