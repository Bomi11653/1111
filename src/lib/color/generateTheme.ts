import * as THREE from "three";

export type GeneratedTheme = {
  id: string;
  hue: number;
  primary: string;
  secondary: string;
  primaryDim: string;
  glow: string;
  bgAccent: string;
  primaryRgb: [number, number, number];
  secondaryRgb: [number, number, number];
};

function clampHue(h: number) {
  return ((h % 360) + 360) % 360;
}

function hslToHex(h: number, s: number, l: number) {
  const c = new THREE.Color();
  c.setHSL(clampHue(h) / 360, s / 100, l / 100);
  return `#${c.getHexString()}`;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = new THREE.Color();
  c.setHSL(clampHue(h) / 360, s / 100, l / 100);
  return [c.r, c.g, c.b];
}

function hslaString(h: number, s: number, l: number, a: number) {
  return `hsla(${Math.round(clampHue(h))}, ${s}%, ${l}%, ${a})`;
}

export function colorsFromHue(
  hue: number,
  primaryOffset = 0,
  opts?: { saturation?: number; lightness?: number },
) {
  const sat = opts?.saturation ?? 48;
  const light = opts?.lightness ?? 62;
  const h = clampHue(hue + primaryOffset);
  return {
    primary: hslToHex(h, sat, light),
    secondary: hslToHex(h + 20, Math.max(sat - 6, 30), light - 6),
    primaryRgb: hslToRgb(h, sat, light - 4),
    secondaryRgb: hslToRgb(h + 20, Math.max(sat - 6, 30), light - 10),
  };
}

export function generateTheme(): GeneratedTheme {
  const hue = Math.random() * 360;
  const colors = colorsFromHue(hue, 0, { saturation: 90, lightness: 58 });

  return {
    id: `impact-${Math.round(hue)}`,
    hue,
    primary: colors.primary,
    secondary: colors.secondary,
    primaryDim: hslToHex(hue, 85, 50),
    glow: hslaString(hue, 90, 58, 0.22),
    bgAccent: hslToHex(hue, 32, 10),
    primaryRgb: colors.primaryRgb,
    secondaryRgb: colors.secondaryRgb,
  };
}

export function applyThemeToDocument(theme: GeneratedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--accent", theme.primary);
  root.style.setProperty("--accent-dim", theme.primaryDim);
  root.style.setProperty("--accent-glow", theme.glow);
  root.style.setProperty("--bg-accent", theme.bgAccent);
  root.dataset.themeHue = String(Math.round(theme.hue));
}
