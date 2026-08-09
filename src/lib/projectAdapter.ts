import type { MediaBlock, ProjectSection } from "@/data/projects";
import type { WorkCatalogEntry } from "@/lib/cms-types";
import type {
  CmsGalleryItem,
  CmsProject,
  CmsProjectSection,
  ProjectsContent,
} from "@/lib/project-types";

const NOW = new Date().toISOString();

export function generateProjectId(slug?: string): string {
  const base = slug?.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || "project";
  return `project-${base}-${Date.now().toString(36)}`;
}

export function generateMediaId(): string {
  return `media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function generateSectionId(): string {
  return `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function workBase(slug: string): string {
  return `/works/${slug}`;
}

export function workCatalogToProject(work: WorkCatalogEntry, order = 1): CmsProject {
  const base = workBase(work.slug);
  const ts = NOW;

  const gallery: CmsGalleryItem[] = [
    {
      id: generateMediaId(),
      url: work.cover,
      type: "image",
      title: "封面",
      alt: work.title,
      order: 0,
      isCover: true,
    },
    ...work.gallery.map((g, i) => ({
      id: generateMediaId(),
      url: `${base}/${g.file}`,
      type: "image" as const,
      title: g.caption ?? g.alt,
      alt: g.alt,
      order: i + 1,
      isCover: false,
    })),
  ];

  const sections: CmsProjectSection[] = work.sections
    .flatMap((s, i) => {
      const textBlock: CmsProjectSection = {
        id: s.id,
        type: "text",
        title: s.title,
        content: s.body,
        order: i * 2 + 1,
        enabled: true,
      };
      const imageMedia = s.media?.find(
        (m): m is Extract<MediaBlock, { type: "image" }> => m.type === "image",
      );
      if (imageMedia) {
        return [
          textBlock,
          {
            id: `${s.id}-img`,
            type: "image" as const,
            title: s.title,
            image: imageMedia.src,
            order: i * 2 + 2,
            enabled: true,
          },
        ];
      }
      return [textBlock];
    });

  return {
    id: `project-${work.slug}`,
    slug: work.slug,
    title: work.title,
    subtitle: work.subtitle,
    category: work.meta.category,
    tags: work.tags,
    year: work.year,
    role: work.role,
    tools: work.tools,
    coverImage: work.cover,
    summary: work.summary,
    description: work.summary,
    sections,
    gallery,
    videos: [],
    featured: work.featured,
    published: true,
    pinned: false,
    order,
    seo: {
      title: `${work.title} · 郑荣成`,
      description: work.summary,
      ogImage: work.cover,
    },
    createdAt: ts,
    updatedAt: ts,
    tagline: work.tagline,
    hueOffset: work.hueOffset,
    speed: work.speed,
    stagePosters: work.stagePosters,
    externalUrl: work.externalUrl,
    meta: work.meta,
  };
}

export function projectToWorkCatalog(project: CmsProject): WorkCatalogEntry {
  const base = workBase(project.slug);

  const legacyGallery = project.gallery
    .filter((g) => g.type === "image" && !g.isCover)
    .sort((a, b) => a.order - b.order)
    .map((g) => {
      const isAbsolute = g.url.startsWith("/uploads/") || g.url.startsWith("http");
      const file = isAbsolute
        ? g.url
        : g.url.replace(`${base}/`, "").replace(/^\/works\/[^/]+\//, "");
      return {
        file: file.includes("/") && !isAbsolute ? file.split("/").pop()! : file,
        alt: g.alt,
        caption: g.title,
      };
    });

  const galleryImages = project.gallery
    .filter((g) => g.type === "image")
    .sort((a, b) => a.order - b.order);

  const stagePosters =
    project.stagePosters && project.stagePosters.length > 0
      ? project.stagePosters
      : galleryImages.map((g) => ({
          file: g.url.startsWith("/uploads/") || g.url.startsWith("http") ? g.url : g.url.replace(`${base}/`, ""),
          alt: g.alt,
        }));

  const legacySections: ProjectSection[] = project.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)
    .reduce<ProjectSection[]>((acc, section) => {
      if (section.type === "text") {
        acc.push({
          id: section.id,
          title: section.title,
          body: section.content ?? "",
          media: [],
        });
      } else if (section.type === "image" && section.image) {
        const last = acc[acc.length - 1];
        const block = { type: "image" as const, src: section.image, alt: section.title };
        if (last && !last.body) {
          last.media = [...(last.media ?? []), block];
        } else {
          acc.push({ id: section.id, title: section.title, body: "", media: [block] });
        }
      } else if (section.type === "video" && section.videoUrl) {
        const last = acc[acc.length - 1];
        const block = {
          type: "video" as const,
          src: section.videoUrl,
          alt: section.title,
        } as MediaBlock;
        if (last) {
          last.media = [...(last.media ?? []), block];
        } else {
          acc.push({ id: section.id, title: section.title, body: "", media: [block] });
        }
      }
      return acc;
    }, []);

  return {
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    summary: project.summary,
    tagline: project.tagline ?? project.subtitle,
    year: project.year,
    role: project.role,
    tools: project.tools,
    tags: project.tags,
    cover: project.coverImage,
    gallery: legacyGallery,
    stagePosters,
    meta: project.meta ?? {
      category: project.category,
      durationWeeks: 4,
      solo: true,
      ggacUrl: project.externalUrl ?? "",
    },
    sections:
      legacySections.length > 0
        ? legacySections
        : [
            {
              id: "overview",
              title: "项目概述",
              body: project.description || project.summary,
              media: project.coverImage
                ? [{ type: "image", src: project.coverImage, alt: project.title }]
                : [],
            },
          ],
    hueOffset: project.hueOffset ?? 0,
    speed: project.speed ?? 1,
    externalUrl: project.externalUrl,
    featured: project.featured,
  };
}

export function migrateWorksToProjects(works: WorkCatalogEntry[]): ProjectsContent {
  return { projects: works.map((w, i) => workCatalogToProject(w, i + 1)) };
}

export function sortProjects(projects: CmsProject[]): CmsProject[] {
  return [...projects].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.order - b.order;
  });
}

export function getPublishedProjects(content: ProjectsContent): CmsProject[] {
  return sortProjects(content.projects.filter((p) => p.published));
}

export function getFeaturedPublishedProjects(content: ProjectsContent): CmsProject[] {
  return getPublishedProjects(content).filter((p) => p.featured);
}
