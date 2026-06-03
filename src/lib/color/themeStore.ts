import type { GeneratedTheme } from "./generateTheme";

let activeTheme: GeneratedTheme | null = null;

export function setActiveTheme(theme: GeneratedTheme) {
  activeTheme = theme;
}

export function getActiveTheme(): GeneratedTheme | null {
  return activeTheme;
}

/** Shader / 场景 fallback（首次 hydrate 前） */
export const THEME_FALLBACK = {
  primary: "#7c8cff",
  secondary: "#a88bff",
  primaryRgb: [0.49, 0.55, 1.0] as [number, number, number],
  secondaryRgb: [0.66, 0.55, 1.0] as [number, number, number],
};

export function getThemePrimaryHex() {
  return activeTheme?.primary ?? THEME_FALLBACK.primary;
}

export function getThemeSecondaryHex() {
  return activeTheme?.secondary ?? THEME_FALLBACK.secondary;
}

export function getThemePrimaryRgb(): [number, number, number] {
  return activeTheme?.primaryRgb ?? THEME_FALLBACK.primaryRgb;
}

export function getThemeSecondaryRgb(): [number, number, number] {
  return activeTheme?.secondaryRgb ?? THEME_FALLBACK.secondaryRgb;
}
