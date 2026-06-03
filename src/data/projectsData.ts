import type { GalleryItem, Project } from "@/data/projects";
import {
  getFeaturedWorks,
  getWorkBySlug,
  toFeaturedProject,
  toGalleryItem,
} from "@/data/worksCatalog";

export const galleryItems: GalleryItem[] = getFeaturedWorks().map(toGalleryItem);

export const featuredProjects: Project[] = getFeaturedWorks().map(toFeaturedProject);

export function getProjectBySlug(slug: string): Project | undefined {
  const entry = getWorkBySlug(slug);
  return entry ? toFeaturedProject(entry) : undefined;
}

export function getFeaturedGallery(): GalleryItem[] {
  return galleryItems.filter((g) => g.featured);
}

export function getHomePreview(): GalleryItem[] {
  return getFeaturedGallery();
}
