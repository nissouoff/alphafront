"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "simple" | "dark" | "blue";

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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("simple");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
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
        };
      case "blue":
        return {
          bg: "bg-blue-950",
          card: "bg-blue-900/50 border-blue-700",
          text: "text-blue-100",
          textMuted: "text-blue-300",
          input: "bg-blue-800/50 border-blue-600 text-white placeholder-blue-300",
          border: "border-blue-700",
        };
      default:
        return {
          bg: "bg-zinc-50",
          card: "bg-white border-zinc-200",
          text: "text-zinc-900",
          textMuted: "text-zinc-500",
          input: "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400",
          border: "border-zinc-200",
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
