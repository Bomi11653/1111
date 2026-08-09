/** 客户端安全的项目 CMS 类型（不含 fs） */

export type ProjectSectionType = "text" | "image" | "video";

export type CmsProjectSection = {
  id: string;
  type: ProjectSectionType;
  title: string;
  content?: string;
  image?: string;
  videoUrl?: string;
  order: number;
  enabled: boolean;
};

export type CmsGalleryItem = {
  id: string;
  url: string;
  type: "image" | "video";
  title: string;
  alt: string;
  order: number;
  isCover: boolean;
};

export type CmsProjectVideo = {
  id: string;
  url: string;
  title: string;
  order: number;
};

export type CmsProjectSeo = {
  title: string;
  description: string;
  ogImage: string;
};

export type CmsProject = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  year: string;
  role: string;
  tools: string[];
  coverImage: string;
  summary: string;
  description: string;
  sections: CmsProjectSection[];
  gallery: CmsGalleryItem[];
  videos: CmsProjectVideo[];
  featured: boolean;
  published: boolean;
  pinned: boolean;
  order: number;
  seo: CmsProjectSeo;
  createdAt: string;
  updatedAt: string;
  /** 兼容旧前台沉浸式作品页 */
  tagline?: string;
  hueOffset?: number;
  speed?: number;
  stagePosters?: { file: string; alt: string }[];
  externalUrl?: string;
  meta?: {
    category: string;
    durationWeeks: number;
    solo: boolean;
    ggacUrl: string;
  };
};

export type ProjectsContent = {
  projects: CmsProject[];
};

export const EMPTY_PROJECTS: ProjectsContent = { projects: [] };
