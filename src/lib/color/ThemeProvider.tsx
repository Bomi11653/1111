"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyThemeToDocument, generateTheme, type GeneratedTheme } from "./generateTheme";
import { setActiveTheme, THEME_FALLBACK } from "./themeStore";

type ThemeContextValue = {
  theme: GeneratedTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function fallbackTheme(): GeneratedTheme {
  return {
    id: "fallback",
    hue: 230,
    primary: THEME_FALLBACK.primary,
    secondary: THEME_FALLBACK.secondary,
    primaryDim: "#6574e8",
    glow: "rgba(124, 140, 255, 0.22)",
    bgAccent: "#0a0b14",
    primaryRgb: THEME_FALLBACK.primaryRgb,
    secondaryRgb: THEME_FALLBACK.secondaryRgb,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<GeneratedTheme>(fallbackTheme);

  useEffect(() => {
    const next = generateTheme();
    setTheme(next);
    setActiveTheme(next);
    applyThemeToDocument(next);
  }, []);

  const value = useMemo(() => ({ theme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx.theme;
}

export function useThemeOptional() {
  return useContext(ThemeContext)?.theme ?? null;
}
