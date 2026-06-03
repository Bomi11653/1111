import { getFeaturedWorks, getWorkBySlug } from "@/data/worksCatalog";

const baseFor = (slug: string) =>
  slug === "blender-ark" ? "/works/blender-ark" : "/works/bing-suo-han-chuan";

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

function toVisual(slug: string): ImmersiveVisual {
  const entry = getWorkBySlug(slug)!;
  const base = baseFor(slug);
  return {
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    tagline: entry.tagline,
    summary: entry.summary,
    year: entry.year,
    cover: entry.cover,
    stagePosters: entry.stagePosters.map((p) => `${base}/${p.file}`),
    hueOffset: entry.hueOffset,
    speed: entry.speed,
  };
}

export const immersiveVisuals: ImmersiveVisual[] = getFeaturedWorks().map((w) => toVisual(w.slug));

export function getImmersiveVisual(slug: string): ImmersiveVisual | undefined {
  const entry = getWorkBySlug(slug);
  return entry ? toVisual(slug) : undefined;
}
