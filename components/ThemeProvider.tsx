"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useLangStore } from "@/store/langStore";
import { applyLangToDocument } from "@/lib/i18n";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const { lang } = useLangStore();

  useEffect(() => {
    // Apply theme
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(theme);
    // Apply lang/dir
    applyLangToDocument(lang);
  }, [theme, lang]);

  return <>{children}</>;
}
