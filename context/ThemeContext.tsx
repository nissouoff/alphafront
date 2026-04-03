"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "simple" | "dark" | "blue" | "orange";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getThemeClasses: () => ThemeClasses;
}

interface ThemeClasses {
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  input: string;
  border: string;
  button: string;
  buttonHover: string;
  inputBg: string;
}

interface ThemeVariables {
  "--theme-bg": string;
  "--theme-card": string;
  "--theme-text": string;
  "--theme-text-muted": string;
  "--theme-border": string;
  "--theme-button": string;
  "--theme-sidebar": string;
  "--theme-header": string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "simple";
  return (localStorage.getItem("theme") as Theme) || "simple";
};

const themeVariables: Record<Theme, ThemeVariables> = {
  simple: {
    "--theme-bg": "#fafafa",
    "--theme-card": "#ffffff",
    "--theme-text": "#18181b",
    "--theme-text-muted": "#71717a",
    "--theme-border": "#e4e4e7",
    "--theme-button": "#18181b",
    "--theme-sidebar": "#ffffff",
    "--theme-header": "#ffffff",
  },
  dark: {
    "--theme-bg": "#09090b",
    "--theme-card": "#27272a",
    "--theme-text": "#fafafa",
    "--theme-text-muted": "#a1a1aa",
    "--theme-border": "#3f3f46",
    "--theme-button": "#3f3f46",
    "--theme-sidebar": "#09090b",
    "--theme-header": "#09090b",
  },
  blue: {
    "--theme-bg": "#030f1e",
    "--theme-card": "#1e3a5f",
    "--theme-text": "#e0f2fe",
    "--theme-text-muted": "#7dd3fc",
    "--theme-border": "#1e40af",
    "--theme-button": "#2563eb",
    "--theme-sidebar": "#030f1e",
    "--theme-header": "#030f1e",
  },
  orange: {
    "--theme-bg": "#030308",
    "--theme-card": "#18181b",
    "--theme-text": "#fff7ed",
    "--theme-text-muted": "#fdba74",
    "--theme-border": "#f97316",
    "--theme-button": "#f97316",
    "--theme-sidebar": "#030308",
    "--theme-header": "#030308",
  },
};

const applyThemeVariables = (theme: Theme) => {
  const root = document.documentElement;
  const vars = themeVariables[theme];
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("simple");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = getStoredTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    applyThemeVariables(savedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      applyThemeVariables(theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const getThemeClasses = (): ThemeClasses => {
    switch (theme) {
      case "dark":
        return {
          bg: "bg-zinc-900",
          card: "bg-zinc-800 border-zinc-700",
          text: "text-zinc-100",
          textMuted: "text-zinc-400",
          input: "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400",
          border: "border-zinc-700",
          button: "bg-zinc-700",
          buttonHover: "bg-zinc-600",
          inputBg: "bg-zinc-800",
        };
      case "blue":
        return {
          bg: "bg-blue-950",
          card: "bg-blue-900/50 border-blue-700",
          text: "text-blue-100",
          textMuted: "text-blue-300",
          input: "bg-blue-800/50 border-blue-600 text-white placeholder-blue-300",
          border: "border-blue-700",
          button: "bg-blue-600",
          buttonHover: "bg-blue-500",
          inputBg: "bg-blue-900/50",
        };
      case "orange":
        return {
          bg: "bg-zinc-950",
          card: "bg-zinc-900 border-orange-500/30",
          text: "text-orange-50",
          textMuted: "text-orange-200/60",
          input: "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400",
          border: "border-orange-500/30",
          button: "bg-orange-500",
          buttonHover: "bg-orange-400",
          inputBg: "bg-zinc-800",
        };
      default:
        return {
          bg: "bg-zinc-50",
          card: "bg-white border-zinc-200",
          text: "text-zinc-900",
          textMuted: "text-zinc-500",
          input: "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400",
          border: "border-zinc-200",
          button: "bg-zinc-900",
          buttonHover: "bg-zinc-800",
          inputBg: "bg-white",
        };
    }
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "simple", setTheme, getThemeClasses }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getThemeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
