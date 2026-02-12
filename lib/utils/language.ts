/**
 * Utility functions for applying and syncing language throughout the app
 */

import type { Language } from "@/app/context/LanguageContext";

export const LANGUAGE_CONFIG: Record<Language, { name: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", dir: "ltr" },
  ur: { name: "اردو", dir: "rtl" },
  roman: { name: "Roman English", dir: "ltr" },
};

/**
 * Apply language settings to DOM and document
 */
export function applyLanguageGlobally(lang: Language): void {
  if (typeof window === "undefined") return;

  const htmlElement = document.documentElement;
  const config = LANGUAGE_CONFIG[lang];

  // Set direction
  htmlElement.dir = config.dir;
  htmlElement.lang = lang;
  htmlElement.setAttribute("data-lang", lang);

  // Update classes for styling
  htmlElement.classList.remove("en", "ur", "roman");
  htmlElement.classList.add(lang);

  if (config.dir === "rtl") {
    htmlElement.classList.add("rtl");
    htmlElement.classList.remove("ltr");
  } else {
    htmlElement.classList.add("ltr");
    htmlElement.classList.remove("rtl");
  }

  // Store in localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("rh_lang", lang);
  }
}

/**
 * Get appropriate icon or content based on language
 */
export function getLanguageSpecificContent(
  content: Record<Language, string>,
  currentLanguage: Language,
): string {
  return content[currentLanguage] || content.en;
}

/**
 * Get translated text with fallback
 */
export function translateWithFallback(
  key: string,
  dict: any,
  fallback: string = key,
): string {
  try {
    const keys = key.split(".");
    let value: any = dict;
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === "string" ? value : fallback;
  } catch {
    return fallback;
  }
}
