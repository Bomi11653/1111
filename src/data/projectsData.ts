import type { GalleryItem, Project } from "@/data/projects";
import { getHomeContent, getProjectBySlugFromStore, getPublishedProjectsList } from "@/lib/cms";
import { projectToWorkCatalog } from "@/lib/projectAdapter";
import {
  getWorkBySlug,
  getWorkBySlugForPreview,
  toFeaturedProject,
  toGalleryItem,
} from "@/data/worksCatalog";

export function getGalleryItems(): GalleryItem[] {
  return getPublishedProjectsList().map((p) => toGalleryItem(projectToWorkCatalog(p)));
}

export function getFeaturedProjects(): Project[] {
  return getPublishedProjectsList()
    .filter((p) => p.featured)
    .map((p) => toFeaturedProject(projectToWorkCatalog(p)));
}

export function getProjectBySlug(slug: string, options?: { preview?: boolean }): Project | undefined {
  const entry = options?.preview ? getWorkBySlugForPreview(slug) : getWorkBySlug(slug);
  return entry ? toFeaturedProject(entry) : undefined;
}

export function getFeaturedGallery(): GalleryItem[] {
  return getGalleryItems().filter((g) => g.featured);
}

export function getProjectGalleryImages(slug: string, preview = false) {
  const project = getProjectBySlugFromStore(slug);
  if (!project) return [];
  if (!preview && !project.published) return [];
  return project.gallery
    .filter((g) => g.type === "image")
    .sort((a, b) => a.order - b.order)
    .map((g) => ({ url: g.url, alt: g.alt, title: g.title }));
}

export function getHomePreview(): GalleryItem[] {
  const home = getHomeContent();
  const allPublished = getPublishedProjectsList();
  const fromSlugs = home.featuredSlugs
    .map((slug) => allPublished.find((p) => p.slug === slug && p.featured))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => toGalleryItem(projectToWorkCatalog(p)));

  if (fromSlugs.length > 0) return fromSlugs;
  return getFeaturedGallery();
}
