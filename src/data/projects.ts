export type MediaBlock =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; src: string; poster?: string; caption?: string; external?: boolean }
  | { type: "embed"; url: string; caption?: string };

export type ProjectSection = {
  id: string;
  title: string;
  body: string;
  media?: MediaBlock[];
};

export type GalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  tags: string[];
  year: string;
  externalUrl?: string;
  mediaType?: "image" | "video";
  featured: boolean;
  slug?: string;
};

export type ProjectMeta = {
  category: string;
  durationWeeks: number;
  solo: boolean;
  ggacUrl: string;
};

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
  tools: string[];
  summary: string;
  cover: string;
  meta: ProjectMeta;
  sections: ProjectSection[];
};

export {
  galleryItems,
  featuredProjects,
  getGalleryItems,
  getFeaturedProjects,
  getProjectBySlug,
  getFeaturedGallery,
  getHomePreview,
} from "@/data/projectsData";
