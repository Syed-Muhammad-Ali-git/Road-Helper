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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { setColorScheme } = useMantineColorScheme();
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("rh_theme") as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      setColorScheme(savedTheme);
    }
    setMounted(true);
  }, [setColorScheme]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-theme", theme);
    htmlElement.classList.remove("light", "dark");
    htmlElement.classList.add(theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    setColorScheme(newTheme);
    localStorage.setItem("rh_theme", newTheme);
  }, [theme, setColorScheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setColorScheme(newTheme);
    localStorage.setItem("rh_theme", newTheme);
  }, [setColorScheme]);

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
