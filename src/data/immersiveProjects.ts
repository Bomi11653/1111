import { getPublishedWorks, getWorkBySlug, getWorkBySlugForPreview } from "@/data/worksCatalog";
import type { WorkCatalogEntry } from "@/lib/cms-types";

/** 作品页列表 + 右侧海报预览 */
export type ImmersiveVisual = {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  summary: string;
  year: string;
  cover: string;
  /** 作品页右侧竖版海报 URL */
  stagePosters: string[];
  hueOffset: number;
  speed: number;
};

function workBase(slug: string): string {
  return `/works/${slug}`;
}

function resolvePosterUrl(slug: string, file: string): string {
  if (file.startsWith("/") || file.startsWith("http")) return file;
  return `${workBase(slug)}/${file}`;
}

function toVisual(entry: WorkCatalogEntry): ImmersiveVisual {
  return {
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    tagline: entry.tagline,
    summary: entry.summary,
    year: entry.year,
    cover: entry.cover,
    stagePosters: entry.stagePosters.map((p) => resolvePosterUrl(entry.slug, p.file)),
    hueOffset: entry.hueOffset,
    speed: entry.speed,
  };
}

export function getImmersiveVisuals(): ImmersiveVisual[] {
  return getPublishedWorks().map(toVisual);
}

export function getImmersiveVisual(
  slug: string,
  options?: { preview?: boolean },
): ImmersiveVisual | undefined {
  const entry = options?.preview ? getWorkBySlugForPreview(slug) : getWorkBySlug(slug);
  return entry ? toVisual(entry) : undefined;
}
