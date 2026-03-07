"use client";
import { useState, useEffect, useRef } from "react";
import { Loader } from "@/components/ui/Loader";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { useTranslation } from "@/lib/firebase/hooks/useTranslation";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import dynamic from "next/dynamic";

const MapPreview = dynamic(
  () => import("@/components/map/MapPreview").then((mod) => mod.MapPreview),
  { ssr: false },
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  hidden: {},
};

function HeroOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!orbRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(orbRef.current, {
        scale: 1.15,
        opacity: 0.35,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <div
      ref={orbRef}
      className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
    />
  );
}

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(false);
  const t = useTranslation();
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  const featuresRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const howInView = useInView(howRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!sessionStorage.getItem("rh-loaded")) {
      setShowLoader(true);
      sessionStorage.setItem("rh-loaded", "true");
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => setIsLocating(false),
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  const stats = [
    { labelKey: "home.avgEta" as const, valueKey: "home.etaValue" as const },
    { labelKey: "home.activeHelpers" as const, valueKey: "home.helpersValue" as const },
    { labelKey: "home.citiesCovered" as const, valueKey: "home.citiesValue" as const },
    { labelKey: "home.ratingLabel" as const, valueKey: "home.ratingValue" as const },
  ];

  const featuresList = [
    { icon: "🚀", titleKey: "home.lightningFast" as const, descKey: "home.lightningDesc" as const },
    { icon: "🛡️", titleKey: "home.verifiedPro" as const, descKey: "home.verifiedDesc" as const },
    { icon: "💳", titleKey: "home.transparentPricing" as const, descKey: "home.transparentDesc" as const },
  ];

  const stepsList = [
    { step: "01", titleKey: "home.step1Title" as const, descKey: "home.step1Desc" as const },
    { step: "02", titleKey: "home.step2Title" as const, descKey: "home.step2Desc" as const },
    { step: "03", titleKey: "home.step3Title" as const, descKey: "home.step3Desc" as const },
  ];

  return (
    <>
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
      <Navbar />

      <main className="flex flex-col min-h-screen">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-grid noise-overlay">
          <HeroOrb />

          <div className="container mx-auto px-[5%] grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {t("hero.badge")}
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display font-extrabold text-[40px] md:text-[64px] leading-[1.1] tracking-[-2px] mb-6 text-[var(--text)] text-balance"
              >
                {t("hero.title")} <br />
                <span className="gradient-text">{t("hero.titleHighlight")}</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="font-body text-[18px] text-dark-muted max-w-[480px] mb-10 leading-relaxed"
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mb-14">
                <Link href="/customer/request-help" className="btn-primary text-base px-8 py-4">
                  {t("hero.ctaPrimary")}
                </Link>
                <a href="tel:0000000" className="btn-ghost text-base px-8 py-4">
                  {t("hero.ctaSecondary")}
                </a>
              </motion.div>

              <motion.div
                variants={stagger}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {stats.map((stat) => (
                  <motion.div key={stat.labelKey} variants={fadeUp}>
                    <div className="font-display font-bold text-2xl text-[var(--text)] mb-1">
                      {t(stat.valueKey)}
                    </div>
                    <div className="text-xs text-dark-muted uppercase tracking-wider">
                      {t(stat.labelKey)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="card glass aspect-square md:aspect-[4/3] relative overflow-hidden flex items-center justify-center border-dark-border group">
                <MapPreview
                  customerLoc={currentPos ? { lat: currentPos.lat, lng: currentPos.lng } : undefined}
                  zoom={12}
                />
                {(isLocating || !currentPos) && (
                  <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center bg-dark-bg/20 backdrop-blur-[2px]">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="relative mb-4"
                    >
                      <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping absolute -inset-4" />
                      <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-glow-primary text-2xl">
                        🚗
                      </div>
                    </motion.div>
                    <div className="card glass px-6 py-3 flex items-center gap-4 border-primary/20">
                      <div>
                        <div className="text-sm font-bold text-[var(--text)] mb-0.5 whitespace-nowrap">
                          {currentPos ? t("home.locatingHelper") : t("home.accessingLocation")}
                        </div>
                        <div className="text-[10px] text-dark-muted font-mono tracking-tighter uppercase">
                          {t("home.etaMins")}
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section
          id="features"
          className="py-24 px-[5%] relative z-10 bg-dark-bg"
          ref={featuresRef}
        >
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp} className="section-label">
                {t("home.whyChooseUs")}
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-display text-4xl md:text-5xl font-bold text-[var(--text)] mb-4"
              >
                {t("home.premiumAssistance")}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-dark-muted max-w-2xl mx-auto">
                {t("home.premiumSubtitle")}
              </motion.p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              variants={stagger}
            >
              {featuresList.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="card p-8 group hover:-translate-y-2 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"
                    whileHover={{ scale: 1.15 }}
                  >
                    <span aria-hidden>{featuresList[i].icon}</span>
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-[var(--text)] mb-3">
                    {t(f.titleKey)}
                  </h3>
                  <p className="text-dark-muted leading-relaxed">{t(f.descKey)}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how"
          className="py-24 px-[5%] relative z-10"
          style={{ background: "linear-gradient(to bottom, var(--dark-bg), var(--dark-surface))" }}
          ref={howRef}
        >
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              animate={howInView ? "visible" : "hidden"}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp} className="section-label">
                {t("home.howItWorksTitle")}
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-display text-4xl md:text-5xl font-bold text-[var(--text)]"
              >
                {t("home.threeSteps")}
              </motion.h2>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-12 relative"
              initial="hidden"
              animate={howInView ? "visible" : "hidden"}
              variants={stagger}
            >
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-dark-border" />
              {stepsList.map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="relative z-10 text-center flex flex-col items-center"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full card glass mb-6 flex items-center justify-center font-display font-bold text-2xl text-primary border-primary/30 shadow-glow-primary"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {s.step}
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-[var(--text)] mb-3">
                    {t(s.titleKey)}
                  </h3>
                  <p className="text-dark-muted max-w-[280px]">{t(s.descKey)}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-[5%] relative z-10" ref={ctaRef}>
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              animate={ctaInView ? "visible" : "hidden"}
              variants={stagger}
              className="card glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border-primary/20 shadow-glow-primary-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="absolute inset-0 bg-gradient-brand opacity-10" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <motion.h2
                  variants={fadeUp}
                  className="font-display text-4xl md:text-5xl font-bold text-[var(--text)] mb-6"
                >
                  {t("home.ctaTitle")}
                </motion.h2>
                <motion.p variants={fadeUp} className="text-lg text-dark-text-secondary mb-10">
                  {t("home.ctaSubtitle")}
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
                  <Link href="/register" className="btn-primary px-8 py-4 text-base">
                    {t("home.createFreeAccount")}
                  </Link>
                  <Link href="/login" className="btn-ghost px-8 py-4 text-base">
                    {t("home.loginToDashboard")}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-dark-border bg-dark-bg pt-16 pb-8 px-[5%] relative z-10"
        >
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-gradient-brand flex items-center justify-center text-sm">
                  🚗
                </div>
                <span className="font-display font-bold text-[var(--text)]">RoadHelper</span>
              </div>
              <p className="text-sm text-dark-muted">{t("home.footerTagline")}</p>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] mb-4">{t("home.footerServices")}</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li>{t("home.footerTowing")}</li>
                <li>{t("home.footerFlatTire")}</li>
                <li>{t("home.footerBatteryJump")}</li>
                <li>{t("home.footerFuelDelivery")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] mb-4">{t("home.footerCompany")}</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li>{t("home.aboutUs")}</li>
                <li>{t("home.careers")}</li>
                <li>{t("home.contact")}</li>
                <li>{t("home.partners")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] mb-4">{t("home.footerLegal")}</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li>{t("home.termsOfService")}</li>
                <li>{t("home.privacyPolicy")}</li>
                <li>{t("home.refundPolicy")}</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-dark-border text-sm text-dark-muted">
            &copy; {new Date().getFullYear()} {t("home.copyright")}
          </div>
        </motion.footer>
      </main>
    </>
  );
}
