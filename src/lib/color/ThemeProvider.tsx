"use client";

import {
  createContext,
  useContext,
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

function createInitialTheme(): GeneratedTheme {
  if (typeof window === "undefined") return fallbackTheme();
  const next = generateTheme();
  setActiveTheme(next);
  applyThemeToDocument(next);
  return next;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useState<GeneratedTheme>(createInitialTheme);
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
