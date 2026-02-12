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
  const [language, setLanguageState] = useState<Language>("en");
  const [dict, setDict] = useState<Dictionary>(en);
  const [mounted, setMounted] = useState(false);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = (localStorage.getItem("rh_lang") || "en") as Language;
    setLanguageState(savedLang);
    setDict(savedLang === "ur" ? ur : savedLang === "roman" ? roman : en);
    applyLanguageToDOM(savedLang);
    setMounted(true);
  }, []);

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
