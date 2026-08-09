import type { GalleryItem, Project } from "@/data/projects";
import type { WorkCatalogEntry } from "@/lib/cms-types";
import {
  getFeaturedWorks,
  getPublishedWorks,
  getWorkBySlug,
  getWorkBySlugForPreview,
} from "@/lib/cms";

export type { WorkCatalogEntry };

export { getWorkBySlug, getWorkBySlugForPreview, getFeaturedWorks, getPublishedWorks };

export function toGalleryItem(entry: WorkCatalogEntry): GalleryItem {
  return {
    id: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    cover: entry.cover,
    tags: entry.tags,
    year: entry.year,
    externalUrl: entry.externalUrl,
    featured: entry.featured,
    slug: entry.slug,
  };
}

export function toFeaturedProject(entry: WorkCatalogEntry): Project {
  return {
    slug: entry.slug,
    title: entry.title,
    role: entry.role,
    year: entry.year,
    tools: entry.tools,
    summary: entry.summary,
    cover: entry.cover,
    meta: entry.meta,
    sections: entry.sections,
  };
}

/** @deprecated 请使用 projectsData.getGalleryItems */
export function getGalleryItems(): GalleryItem[] {
  return getPublishedWorks().map(toGalleryItem);
}

/** @deprecated 请使用 projectsData.getFeaturedProjects */
export function getFeaturedProjects(): Project[] {
  return getFeaturedWorks().map(toFeaturedProject);
}
