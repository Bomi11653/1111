import type { Locale } from "@/data/i18n";
import type { GalleryItem, Project } from "@/data/projects";
import {
  getFeaturedWorks,
  getWorkBySlug,
  toFeaturedProject,
  toGalleryItem,
} from "@/data/worksCatalog";

export function getGalleryItems(locale: Locale = "zh"): GalleryItem[] {
  return getFeaturedWorks(locale).map(toGalleryItem);
}

export function getFeaturedProjects(locale: Locale = "zh"): Project[] {
  return getFeaturedWorks(locale).map(toFeaturedProject);
}

export function getProjectBySlug(slug: string, locale: Locale = "zh"): Project | undefined {
  const entry = getWorkBySlug(slug, locale);
  return entry ? toFeaturedProject(entry) : undefined;
}

export function getFeaturedGallery(locale: Locale = "zh"): GalleryItem[] {
  return getGalleryItems(locale).filter((g) => g.featured);
}

export function getHomePreview(locale: Locale = "zh"): GalleryItem[] {
  return getFeaturedGallery(locale);
}

/** @deprecated Use getGalleryItems(locale) */
export const galleryItems = getGalleryItems("zh");

/** @deprecated Use getFeaturedProjects(locale) */
export const featuredProjects = getFeaturedProjects("zh");
