"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useMantineColorScheme } from "@mantine/core";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyThemeToDOM = (newTheme: Theme) => {
  if (typeof window === "undefined") return;

  const htmlElement = document.documentElement;
  const bodyElement = document.body;

  // Set data attribute for CSS selectors
  htmlElement.setAttribute("data-theme", newTheme);

  // Remove all theme classes first
  htmlElement.classList.remove("light", "dark");
  bodyElement.classList.remove("light", "dark");

  // Add the correct theme class
  htmlElement.classList.add(newTheme);
  bodyElement.classList.add(newTheme);

  // Ensure Tailwind dark mode works
  if (newTheme === "dark") {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { setColorScheme } = useMantineColorScheme();

  // Lazy initialization to avoid setState in useEffect
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("rh_theme") || "dark") as Theme;
  });

  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setColorScheme(theme);
    applyThemeToDOM(theme);
    setMounted(true);
  }, [theme, setColorScheme]);

  // Update theme when it changes
  useEffect(() => {
    if (!mounted) return;
    applyThemeToDOM(theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    setColorScheme(newTheme);
    localStorage.setItem("rh_theme", newTheme);
    applyThemeToDOM(newTheme);
  }, [theme, setColorScheme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      setColorScheme(newTheme);
      localStorage.setItem("rh_theme", newTheme);
      applyThemeToDOM(newTheme);
    },
    [setColorScheme],
  );

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};
