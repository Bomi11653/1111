import "server-only";

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import type {
  CmsFile,
  HomeContent,
  ModulesContent,
  SeoContent,
  SiteContent,
  WorkCatalogEntry,
  WorksContent,
} from "@/lib/cms-types";
import type { CmsProject, ProjectsContent } from "@/lib/project-types";
import { backupContentFile } from "@/lib/cms-backup";
import {
  generateProjectId,
  migrateWorksToProjects,
  projectToWorkCatalog,
  sortProjects,
  workCatalogToProject,
} from "@/lib/projectAdapter";

function defaultSeoFromSite(): SeoContent {
  const site = getSiteContent();
  return {
    siteTitle: `${site.name} · ${site.title}`,
    siteDescription: `${site.headline} — ${site.tagline}`,
    ogImage: "",
    keywords: [site.tagline, site.title],
    homeTitle: site.name,
    homeDescription: `${site.headline} — ${site.tagline}`,
    worksTitle: "作品",
    worksDescription: `${site.name} 的游戏场景与视觉设计项目`,
    aboutTitle: "关于我",
    aboutDescription: `了解 ${site.name} 的背景与创作理念`,
    contactTitle: "联系",
    contactDescription: `与 ${site.name} 取得联系，讨论合作机会`,
    favicon: "",
    robotsAllow: true,
    sitemapEnabled: true,
  };
}

export type {
  CmsFile,
  HomeContent,
  HomeHero,
  HomeTimelineEntry,
  MediaBlock,
  ModuleConfig,
  ModulePageKey,
  ModulesContent,
  SeoContent,
  SiteContent,
  SiteSkill,
  WorkCatalogEntry,
  WorksContent,
} from "@/lib/cms-types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function ensureContentDir() {
  if (!existsSync(CONTENT_DIR)) {
    mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: CmsFile): T {
  ensureContentDir();
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeJsonFile<T>(filename: CmsFile, data: T): void {
  ensureContentDir();
  backupContentFile(filename);
  const filePath = path.join(CONTENT_DIR, filename);
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export function getSiteContent(): SiteContent {
  return readJsonFile<SiteContent>("site.json");
}

export function getHomeContent(): HomeContent {
  return readJsonFile<HomeContent>("home.json");
}

export function getModulesContent(): ModulesContent {
  return readJsonFile<ModulesContent>("modules.json");
}

/** @deprecated 仅用于首次从 works.json 迁移，不再对外写入 */
function readLegacyWorksFile(): WorkCatalogEntry[] {
  const filePath = path.join(CONTENT_DIR, "works.json");
  if (!existsSync(filePath)) return [];
  try {
    const data = JSON.parse(readFileSync(filePath, "utf-8")) as WorksContent;
    return data.works ?? [];
  } catch {
    return [];
  }
}

function deprecationHeaders(): HeadersInit {
  return {
    Deprecation: "true",
    Link: '</api/cms/projects>; rel="successor-version"',
  };
}

export { deprecationHeaders as worksApiDeprecationHeaders };

function seoFileExists(): boolean {
  return existsSync(path.join(CONTENT_DIR, "seo.json"));
}

export function getSeoContent(): SeoContent {
  ensureContentDir();
  if (!seoFileExists()) {
    const defaults = defaultSeoFromSite();
    saveSeoContent(defaults);
    return defaults;
  }
  return readJsonFile<SeoContent>("seo.json");
}

export function saveSeoContent(data: SeoContent): void {
  writeJsonFile("seo.json", data);
}

function projectsFileExists(): boolean {
  return existsSync(path.join(CONTENT_DIR, "projects.json"));
}

export function getProjectsContent(): ProjectsContent {
  ensureContentDir();
  if (!projectsFileExists()) {
    const migrated = migrateWorksToProjects(readLegacyWorksFile());
    saveProjectsContent(migrated);
    return migrated;
  }
  return readJsonFile<ProjectsContent>("projects.json");
}

export function saveProjectsContent(data: ProjectsContent): void {
  writeJsonFile("projects.json", data);
}

export function getAllProjects(): CmsProject[] {
  return sortProjects(getProjectsContent().projects);
}

export function getPublishedProjectsList(): CmsProject[] {
  return sortProjects(getProjectsContent().projects.filter((p) => p.published));
}

export function getProjectById(id: string): CmsProject | undefined {
  return getProjectsContent().projects.find((p) => p.id === id);
}

export function getProjectBySlugFromStore(slug: string): CmsProject | undefined {
  return getProjectsContent().projects.find((p) => p.slug === slug);
}

export function createProject(input: Omit<CmsProject, "id" | "createdAt" | "updatedAt"> & { id?: string }): CmsProject {
  const content = getProjectsContent();
  if (content.projects.some((p) => p.slug === input.slug)) {
    throw new Error("slug 已存在");
  }
  const now = new Date().toISOString();
  const project: CmsProject = {
    ...input,
    id: input.id ?? generateProjectId(input.slug),
    createdAt: now,
    updatedAt: now,
  };
  content.projects.push(project);
  saveProjectsContent(content);
  return project;
}

export function updateProjectById(id: string, patch: Partial<CmsProject>): CmsProject {
  const content = getProjectsContent();
  const index = content.projects.findIndex((p) => p.id === id);
  if (index < 0) throw new Error("项目不存在");
  const next = {
    ...content.projects[index],
    ...patch,
    id: content.projects[index].id,
    updatedAt: new Date().toISOString(),
  };
  content.projects[index] = next;
  saveProjectsContent(content);
  return next;
}

export function deleteProjectById(id: string): boolean {
  const content = getProjectsContent();
  const next = content.projects.filter((p) => p.id !== id);
  if (next.length === content.projects.length) return false;
  saveProjectsContent({ projects: next });
  return true;
}

export function reorderProjectsList(items: { id: string; order: number }[]): ProjectsContent {
  const content = getProjectsContent();
  const orderMap = new Map(items.map((i) => [i.id, i.order]));
  content.projects = content.projects.map((p) =>
    orderMap.has(p.id) ? { ...p, order: orderMap.get(p.id)!, updatedAt: new Date().toISOString() } : p,
  );
  saveProjectsContent(content);
  return content;
}

export function addProjectMedia(projectId: string, item: CmsProject["gallery"][number]): CmsProject {
  const project = getProjectById(projectId);
  if (!project) throw new Error("项目不存在");
  return updateProjectById(projectId, {
    gallery: [...project.gallery, item],
  });
}

export function deleteProjectMedia(projectId: string, mediaId: string): CmsProject {
  const project = getProjectById(projectId);
  if (!project) throw new Error("项目不存在");
  const removed = project.gallery.find((g) => g.id === mediaId);
  if (!removed) throw new Error("媒体不存在");
  const gallery = project.gallery.filter((g) => g.id !== mediaId);
  let coverImage = project.coverImage;
  if (removed.isCover && gallery.length > 0) {
    const nextCover = gallery.sort((a, b) => a.order - b.order)[0];
    gallery[0] = { ...nextCover, isCover: true };
    coverImage = nextCover.url;
  }
  return updateProjectById(projectId, { gallery, coverImage });
}

export function reorderProjectMedia(
  projectId: string,
  items: { id: string; order: number }[],
): CmsProject {
  const project = getProjectById(projectId);
  if (!project) throw new Error("项目不存在");
  const orderMap = new Map(items.map((i) => [i.id, i.order]));
  const gallery = project.gallery.map((g) =>
    orderMap.has(g.id) ? { ...g, order: orderMap.get(g.id)! } : g,
  );
  return updateProjectById(projectId, { gallery });
}

export function setProjectCoverImage(projectId: string, mediaId: string): CmsProject {
  const project = getProjectById(projectId);
  if (!project) throw new Error("项目不存在");
  const target = project.gallery.find((g) => g.id === mediaId);
  if (!target) throw new Error("媒体不存在");
  const gallery = project.gallery.map((g) => ({
    ...g,
    isCover: g.id === mediaId,
  }));
  return updateProjectById(projectId, {
    gallery,
    coverImage: target.url,
    seo: { ...project.seo, ogImage: target.url },
  });
}

export function duplicateProject(id: string): CmsProject {
  const source = getProjectById(id);
  if (!source) throw new Error("项目不存在");
  const now = new Date().toISOString();
  const copy: CmsProject = {
    ...JSON.parse(JSON.stringify(source)),
    id: generateProjectId(`${source.slug}-copy`),
    slug: `${source.slug}-copy-${Date.now().toString(36)}`,
    title: `${source.title}（副本）`,
    published: false,
    featured: false,
    createdAt: now,
    updatedAt: now,
  };
  const content = getProjectsContent();
  content.projects.push(copy);
  saveProjectsContent(content);
  return copy;
}

export function getWorkBySlug(slug: string): WorkCatalogEntry | undefined {
  const project = getProjectBySlugFromStore(slug);
  if (!project?.published) return undefined;
  return projectToWorkCatalog(project);
}

export function getWorkBySlugForPreview(slug: string): WorkCatalogEntry | undefined {
  const project = getProjectBySlugFromStore(slug);
  return project ? projectToWorkCatalog(project) : undefined;
}

export function getPublishedWorks(): WorkCatalogEntry[] {
  return getPublishedProjectsList().map(projectToWorkCatalog);
}

export function getFeaturedWorks(): WorkCatalogEntry[] {
  return getPublishedProjectsList()
    .filter((p) => p.featured)
    .map(projectToWorkCatalog);
}

/** @deprecated 请使用 projects API；写入 projects.json */
export function upsertWorkFromCatalog(entry: WorkCatalogEntry): CmsProject {
  const existing = getProjectBySlugFromStore(entry.slug);
  const maxOrder = getProjectsContent().projects.reduce((m, p) => Math.max(m, p.order), 0);
  const converted = workCatalogToProject(entry, existing?.order ?? maxOrder + 1);

  if (existing) {
    return updateProjectById(existing.id, {
      ...converted,
      id: existing.id,
      createdAt: existing.createdAt,
      gallery: existing.gallery.length > 0 ? existing.gallery : converted.gallery,
      published: existing.published,
      featured: entry.featured,
      pinned: existing.pinned,
      seo: existing.seo.title ? existing.seo : converted.seo,
    });
  }

  return createProject({ ...converted, published: true });
}

/** @deprecated 请使用 deleteProjectById */
export function deleteWorkBySlug(slug: string): boolean {
  const project = getProjectBySlugFromStore(slug);
  if (!project) return false;
  return deleteProjectById(project.id);
}

export function getWorksCatalogContent(): WorksContent {
  return { works: getAllProjects().map(projectToWorkCatalog) };
}

export function saveSiteContent(data: SiteContent): void {
  writeJsonFile("site.json", data);
}

export function saveHomeContent(data: HomeContent): void {
  writeJsonFile("home.json", data);
}

export function saveModulesContent(data: ModulesContent): void {
  writeJsonFile("modules.json", data);
}
