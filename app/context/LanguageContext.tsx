"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import en from "@/dictionaries/en.json";
import ur from "@/dictionaries/ur.json";
import roman from "@/dictionaries/roman.json";

export type Language = "en" | "ur" | "roman";
type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: Dictionary;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const applyLanguageToDOM = (lang: Language) => {
  if (typeof window === "undefined") return;

  const htmlElement = document.documentElement;
  htmlElement.dir = lang === "ur" ? "rtl" : "ltr";
  htmlElement.lang = lang;

  if (lang === "ur") {
    htmlElement.classList.add("rtl");
    htmlElement.classList.remove("ltr");
  } else {
    htmlElement.classList.add("ltr");
    htmlElement.classList.remove("rtl");
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Lazy initialization to avoid setState in useEffect
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("rh_lang") || "en") as Language;
  });

  const [dict, setDict] = useState<Dictionary>(() => {
    if (typeof window === "undefined") return en;
    const savedLang = (localStorage.getItem("rh_lang") || "en") as Language;
    return savedLang === "ur" ? ur : savedLang === "roman" ? roman : en;
  });

  const [mounted, setMounted] = useState(false);

  // Apply language to DOM on mount
  useEffect(() => {
    applyLanguageToDOM(language);
    setMounted(true);
  }, [language]);

  // Update when language changes
  useEffect(() => {
    if (!mounted) return;
    applyLanguageToDOM(language);
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setDict(lang === "ur" ? ur : lang === "roman" ? roman : en);
    localStorage.setItem("rh_lang", lang);
    applyLanguageToDOM(lang);
  }, []);

  const isRTL = language === "ur";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dict, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
