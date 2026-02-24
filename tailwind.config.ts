import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF2D2D",
          hover: "#E02020",
          glow: "rgba(255,45,45,0.25)",
        },
        secondary: "#FF6B35",
        accent: "#FFB347",
        dark: {
          bg: "#080A0E",
          surface: "#0D1117",
          card: "#111720",
          border: "rgba(255,255,255,0.07)",
          text: "#F0F4FF",
          muted: "#6B7A99",
        },
        light: {
          bg: "#F5F7FF",
          surface: "#FFFFFF",
          card: "#FFFFFF",
          border: "rgba(0,0,0,0.08)",
          text: "#0A0F1E",
          muted: "#6B7A9A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #FF2D2D 0%, #FF6B35 50%, #FFB347 100%)",
        "gradient-brand-subtle":
          "linear-gradient(135deg, rgba(255,45,45,0.1) 0%, rgba(255,107,53,0.05) 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 10s linear infinite",
        blink: "blink 1.5s ease-in-out infinite",
        "slide-up": "slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "loader-fill": "loaderFill 2s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,45,45,0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(255,45,45,0.6)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(40px) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        loaderFill: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
      },
      boxShadow: {
        "glow-primary": "0 0 40px rgba(255,45,45,0.25)",
        "glow-primary-lg": "0 0 80px rgba(255,45,45,0.4)",
        card: "0 4px 24px rgba(0,0,0,0.12)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.25)",
        "card-dark": "0 4px 24px rgba(0,0,0,0.4)",
        "card-dark-hover": "0 20px 60px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
