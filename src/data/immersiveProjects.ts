import type { Locale } from "@/data/i18n";
import { getFeaturedWorks, getWorkBySlug, type WorkCatalogEntry } from "@/data/worksCatalog";

/** Works page list + right-side poster preview */
export type ImmersiveVisual = {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  year: string;
  cover: string;
  hueOffset: number;
  speed: number;
  stagePosters: string[];
};

function stagePosterUrls(entry: WorkCatalogEntry): string[] {
  const base = entry.cover.replace(/cover\.jpg$/, "");
  return entry.stagePosters.map((p) => `${base}${p.file}`);
}

function toVisual(entry: WorkCatalogEntry): ImmersiveVisual {
  return {
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    tagline: entry.tagline,
    year: entry.year,
    cover: entry.cover,
    hueOffset: entry.hueOffset,
    speed: entry.speed,
    stagePosters: stagePosterUrls(entry),
  };
}

export function getImmersiveVisuals(locale: Locale = "zh"): ImmersiveVisual[] {
  return getFeaturedWorks(locale).map(toVisual);
}

export function getImmersiveVisual(slug: string, locale: Locale = "zh"): ImmersiveVisual | undefined {
  const entry = getWorkBySlug(slug, locale);
  return entry ? toVisual(entry) : undefined;
}

/** @deprecated Use getImmersiveVisuals(locale) */
export const immersiveVisuals: ImmersiveVisual[] = getImmersiveVisuals("zh");
