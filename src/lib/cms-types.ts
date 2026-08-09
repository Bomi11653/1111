import type { MediaBlock, ProjectSection } from "@/data/projects";

export type SiteSkill = {
  name: string;
  level: number;
  category: string;
};

export type SiteContent = {
  name: string;
  nameEn: string;
  title: string;
  tagline: string;
  headline: string;
  email: string;
  location: { base: string; city: string };
  resumeFilename: string;
  resumePath: string;
  social: {
    bilibili: { label: string; url: string };
    ggac: { label: string; url: string };
  };
  experience: { years: number; company: string; summary: string };
  philosophy: string[];
  skills: SiteSkill[];
};

export type HomeHero = {
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  subtitleEn: string;
  headlineZh: string;
  headlineEn: string;
  taglineZh: string;
  taglineEn: string;
  ctaTextZh: string;
  ctaTextEn: string;
  ctaHref: string;
  backgroundImage?: string;
  backgroundVideoUrl?: string;
};

export type HomeTimelineEntry = {
  year: string;
  zh: string;
  en: string;
};

export type HomeContent = {
  hero: HomeHero;
  timeline: HomeTimelineEntry[];
  featuredSlugs: string[];
};

export type WorkCatalogEntry = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  tagline: string;
  year: string;
  role: string;
  tools: string[];
  tags: string[];
  cover: string;
  gallery: { file: string; alt: string; caption?: string }[];
  stagePosters: { file: string; alt: string }[];
  meta: {
    category: string;
    durationWeeks: number;
    solo: boolean;
    ggacUrl: string;
  };
  sections: ProjectSection[];
  hueOffset: number;
  speed: number;
  externalUrl?: string;
  featured: boolean;
};

export type WorksContent = {
  works: WorkCatalogEntry[];
};

export type ModulePageKey = "home" | "works" | "workDetail" | "about" | "contact";

export type ModuleConfig = {
  id: string;
  page: ModulePageKey;
  key: string;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
};

export type ModulesContent = {
  home: ModuleConfig[];
  works: ModuleConfig[];
  workDetail: ModuleConfig[];
  about: ModuleConfig[];
  contact: ModuleConfig[];
};

export type SeoContent = {
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
  keywords: string[];
  homeTitle: string;
  homeDescription: string;
  worksTitle: string;
  worksDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  contactTitle: string;
  contactDescription: string;
  favicon: string;
  robotsAllow: boolean;
  sitemapEnabled: boolean;
};

export type BackupEntry = {
  name: string;
  sourceFile: CmsFile;
  createdAt: string;
  size: number;
};

export type HealthIssue = {
  level: "warning" | "error";
  category: string;
  message: string;
  link?: string;
};

export type HealthReport = {
  issues: HealthIssue[];
  stats: {
    totalProjects: number;
    publishedCount: number;
    draftCount: number;
    missingCover: number;
    missingAlt: number;
    brokenImages: number;
    emptyLinks: number;
    lastUpdated: string | null;
  };
};

export type CmsFile =
  | "site.json"
  | "home.json"
  | "works.json"
  | "modules.json"
  | "projects.json"
  | "seo.json";

export type { MediaBlock };
