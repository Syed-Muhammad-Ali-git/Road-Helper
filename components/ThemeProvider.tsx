"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useLangStore } from "@/store/langStore";
import { applyLangToDocument } from "@/lib/i18n";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const { lang } = useLangStore();

  useEffect(() => {
    // Apply theme class to html element
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Apply language and direction
    applyLangToDocument(lang);
  }, [lang]);

  return <>{children}</>;
}
