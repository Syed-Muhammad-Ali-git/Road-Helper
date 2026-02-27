"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import { useLangStore } from "@/store/langStore";
import { useTranslation } from "@/hooks/useTranslation";
import { LANGUAGES } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { Menu, X, User } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { lang, setLang } = useLangStore();
  const t = useTranslation();
  const pathname = usePathname();
  const { user, role } = useAuthStore();
  const { toggleSidebar } = useUiStore();

  const isDashboard =
    (pathname.startsWith("/customer") ||
      pathname.startsWith("/helper") ||
      pathname.startsWith("/admin")) &&
    !pathname.includes("/login") &&
    !pathname.includes("/register") &&
    pathname !== "/forgot-password";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 start-0 end-0 z-50 h-[68px] flex items-center justify-between transition-all duration-300 ${
        scrolled && !isDashboard
          ? "glass border-b"
          : isDashboard
            ? "bg-dark-surface border-b border-dark-border"
            : "bg-transparent border-transparent"
      } ${isDashboard ? "lg:ps-64" : ""} px-[5%]`}
    >
      {/* Left: Logo & Mobile Toggle */}
      <div className="flex items-center gap-4">
        {isDashboard && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-dark-bg border border-dark-border text-white hover:border-primary/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(255,45,45,0.4)]"
            style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B35)" }}
          >
            🚗
          </div>
          <span className="font-display font-extrabold text-[17px] text-white">
            RoadHelper
          </span>
        </Link>
      </div>

      {/* Center: Desktop Nav (Non-Dashboard) */}
      {!isDashboard && (
        <ul className="hidden md:flex items-center gap-8 list-none">
          {[
            { href: "#features", label: t("nav.features") },
            { href: "#how", label: t("nav.howItWorks") },
            { href: "/about", label: t("nav.about") },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium relative group transition-colors duration-200 text-dark-muted"
              >
                <span className="group-hover:text-white transition-colors">
                  {link.label}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language & Theme (Always visible on Desktop) */}
        <div className="hidden sm:flex items-center gap-3 mr-2">
          <div className="flex items-center gap-1 p-1 rounded-full bg-dark-surface border border-dark-border">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                  lang === code
                    ? "bg-primary text-white shadow-glow-primary"
                    : "text-dark-muted hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-dark-surface border border-dark-border text-white hover:border-primary transition-all"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Dashboard Area / Auth Buttons */}
        {user ? (
          <div className="flex items-center gap-3 bg-dark-bg/40 p-1.5 pr-4 rounded-2xl border border-dark-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-extrabold text-white uppercase tracking-tighter opacity-60">
                {role} Account
              </span>
              <span className="text-xs font-bold text-white capitalize">
                {user.email?.split("@")[0]}
              </span>
            </div>
            <Link
              href={
                role === "admin"
                  ? "/admin/dashboard"
                  : role === "helper"
                    ? "/helper/dashboard"
                    : "/customer/dashboard"
              }
              className="hidden md:flex ml-2 text-xs font-bold text-primary hover:text-white transition-colors"
            >
              Go to Panel →
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="btn-ghost hidden sm:flex text-xs h-9 px-4"
            >
              {t("nav.login")}
            </Link>
            <Link href="/register" className="btn-primary text-xs h-9 px-5">
              🚨 {t("nav.getHelp")}
            </Link>
          </div>
        )}

        {/* Mobile Main Menu Toggle */}
        {!isDashboard && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-dark-surface border border-dark-border text-white transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {!isDashboard && mobileMenuOpen && (
        <div className="fixed inset-0 top-[68px] z-40 bg-dark-bg/95 backdrop-blur-xl md:hidden flex flex-col p-6 animate-fade-in">
          <ul className="flex flex-col gap-6 list-none mb-8">
            {[
              { href: "#features", label: t("nav.features") },
              { href: "#how", label: t("nav.howItWorks") },
              { href: "/about", label: t("nav.about") },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white py-2 border-b border-white/5 block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-surface border border-dark-border">
              <span className="text-sm font-bold text-white">Appearance</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-dark-bg border border-dark-border"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
            </div>
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ghost w-full justify-center py-4"
              >
                {t("nav.login")}
              </Link>
            )}
            <Link
              href={user ? "/dashboard" : "/register"}
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full justify-center py-4 shadow-glow-primary"
            >
              {user ? "Dashboard" : t("nav.register")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
