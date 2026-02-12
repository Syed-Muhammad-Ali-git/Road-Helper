/**
 * Theme utilities for proper color handling and consistency
 */

type Theme = "light" | "dark";

export const THEME_COLORS = {
  light: {
    background: "#ffffff",
    foreground: "#0a0a0a",
    surface: "#f5f5f5",
    border: "#e5e5e5",
    text: "#0a0a0a",
    textSecondary: "#666666",
  },
  dark: {
    background: "#0a0a0a",
    foreground: "#ededed",
    surface: "#1a1a1a",
    border: "#333333",
    text: "#ededed",
    textSecondary: "#999999",
  },
};

export const SEMANTIC_COLORS = {
  success: { light: "#10b981", dark: "#34d399" },
  error: { light: "#ef4444", dark: "#f87171" },
  warning: { light: "#f59e0b", dark: "#fbbf24" },
  info: { light: "#3b82f6", dark: "#60a5fa" },
  brand: { light: "#dc2626", dark: "#ef4444" },
};

/**
 * Get theme-specific color
 */
export function getThemeColor(
  theme: Theme,
  colorType: keyof typeof THEME_COLORS.light,
): string {
  return THEME_COLORS[theme][colorType];
}

/**
 * Get semantic color based on theme
 */
export function getSemanticColor(
  type: keyof typeof SEMANTIC_COLORS,
  theme: Theme,
): string {
  return SEMANTIC_COLORS[type][theme];
}

/**
 * Apply theme CSS variables to document root
 */
export function applyThemeVariables(theme: Theme): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const colors = THEME_COLORS[theme];

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Apply semantic colors
  Object.entries(SEMANTIC_COLORS).forEach(([key, colorObj]) => {
    root.style.setProperty(
      `--color-semantic-${key}`,
      colorObj[theme],
    );
  });
}

/**
 * Get contrast color (opposite theme)
 */
export function getContrastTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}

/**
 * Check if background is dark (for text color determination)
 */
export function isDarkBackground(theme: Theme): boolean {
  return theme === "dark";
}
