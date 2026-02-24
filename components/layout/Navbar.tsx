"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useThemeStore } from "@/store/themeStore";
import { useLangStore } from "@/store/langStore";
import { useTranslation } from "@/hooks/useTranslation";
import { LANGUAGES } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore"; // existing

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { lang, setLang } = useLangStore();
  const t = useTranslation();
  const { user, role } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-[68px] px-[5%] flex items-center justify-between transition-all duration-300 ${
        scrolled ? "glass border-b" : "bg-transparent border-transparent"
      }`}
      style={{
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(255,45,45,0.4)]"
          style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B35)" }}
        >
          🚗
        </div>
        <span
          className="font-display font-extrabold text-[17px]"
          style={{ color: "var(--text)" }}
        >
          RoadHelper
        </span>
      </Link>

      {/* Nav Links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {[
          { href: "#features", label: t("nav.features") },
          { href: "#how", label: t("nav.howItWorks") },
          { href: "/about", label: t("nav.about") },
        ].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-medium relative group transition-colors duration-200"
              style={{ color: "var(--muted)" }}
            >
              <span className="group-hover:text-[var(--text)] transition-colors">
                {link.label}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-full"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                lang === code ? "text-white" : ""
              }`}
              style={
                lang === code
                  ? {
                      background: "linear-gradient(135deg, #FF2D2D, #FF6B35)",
                      boxShadow: "0 2px 12px rgba(255,45,45,0.35)",
                      color: "white",
                    }
                  : { color: "var(--muted)" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 hover:border-primary hover:shadow-[0_0_16px_rgba(255,45,45,0.25)]"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {/* Auth Buttons */}
        {user ? (
          <Link
            href={
              role === "helper" ? "/helper/dashboard" : "/customer/dashboard"
            }
            className="btn-primary text-sm"
          >
            Dashboard →
          </Link>
        ) : (
          <>
            <Link href="/login" className="btn-ghost text-sm hidden sm:flex">
              {t("nav.login")}
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              🚨 {t("nav.getHelp")}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
