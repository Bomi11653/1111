import * as THREE from "three";

const PALETTE_BASES = [
  { id: "blue", hue: 220 },
  { id: "violet", hue: 262 },
  { id: "cyan", hue: 195 },
  { id: "indigo", hue: 238 },
] as const;

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

export function colorsFromHue(hue: number, primaryOffset = 0) {
  const h = clampHue(hue + primaryOffset);
  return {
    primary: hslToHex(h, 48, 62),
    secondary: hslToHex(h + 20, 42, 56),
    primaryRgb: hslToRgb(h, 48, 58),
    secondaryRgb: hslToRgb(h + 20, 42, 52),
  };
}

export function generateTheme(): GeneratedTheme {
  const base = PALETTE_BASES[Math.floor(Math.random() * PALETTE_BASES.length)];
  const jitter = (Math.random() - 0.5) * 16;
  const hue = clampHue(base.hue + jitter);
  const colors = colorsFromHue(hue);

  return {
    id: base.id,
    hue,
    primary: colors.primary,
    secondary: colors.secondary,
    primaryDim: hslToHex(hue, 44, 52),
    glow: hslaString(hue, 52, 58, 0.22),
    bgAccent: hslToHex(hue, 28, 11),
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
