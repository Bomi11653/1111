import { colorsFromHue } from "./generateTheme";
import { getActiveTheme, THEME_FALLBACK } from "./themeStore";

export function getProjectColors(hueOffset = 0) {
  const theme = getActiveTheme();
  const baseHue = theme?.hue ?? 230;
  const colors = colorsFromHue(baseHue, hueOffset);
  return {
    color: colors.primary,
    secondaryColor: colors.secondary,
    primaryRgb: colors.primaryRgb,
    secondaryRgb: colors.secondaryRgb,
  };
}

export function getProjectColorsFromThemeHue(themeHue: number, hueOffset = 0) {
  const colors = colorsFromHue(themeHue, hueOffset);
  return {
    color: colors.primary,
    secondaryColor: colors.secondary,
  };
}

export function getDefaultThemeColors() {
  return {
    color: THEME_FALLBACK.primary,
    secondaryColor: THEME_FALLBACK.secondary,
  };
}
