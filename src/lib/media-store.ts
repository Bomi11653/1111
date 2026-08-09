import "server-only";

import { existsSync, readFileSync, unlinkSync } from "fs";
import path from "path";
import { getHomeContent, getProjectsContent } from "@/lib/cms";
import type { SeoContent } from "@/lib/cms-types";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

export function publicUrlToUploadPath(url: string): string | null {
  if (!url.startsWith("/uploads/")) return null;
  const relative = url.slice("/uploads/".length);
  const full = path.resolve(UPLOADS_ROOT, relative);
  const relativeToRoot = path.relative(UPLOADS_ROOT, full);
  if (
    !relative ||
    relativeToRoot.startsWith("..") ||
    path.isAbsolute(relativeToRoot)
  ) {
    return null;
  }
  return full;
}

export function isManagedUploadUrl(url: string): boolean {
  return publicUrlToUploadPath(url) !== null;
}

export function findMediaUsage(url: string): string[] {
  const used: string[] = [];

  for (const p of getProjectsContent().projects) {
    if (p.coverImage === url) used.push(`项目封面 · ${p.title}`);
    if (p.gallery.some((g) => g.url === url)) used.push(`项目画廊 · ${p.title}`);
    if (p.seo.ogImage === url) used.push(`项目 SEO · ${p.title}`);
    if (p.sections.some((s) => s.image === url)) used.push(`项目章节 · ${p.title}`);
  }

  const home = getHomeContent();
  if (home.hero.backgroundImage === url) used.push("首页 Hero 背景图");

  try {
    const seoPath = path.join(process.cwd(), "content", "seo.json");
    if (existsSync(seoPath)) {
      const seo = JSON.parse(readFileSync(seoPath, "utf-8")) as SeoContent;
      if (seo.ogImage === url) used.push("全站 SEO 分享图");
    }
  } catch {
    // ignore
  }

  return used;
}

export function deleteUploadFile(
  url: string,
  force = false,
): { ok: true } | { ok: false; error: string; usedIn?: string[] } {
  if (url.startsWith("/works/")) {
    return { ok: false, error: "内置 /works 资源不可通过后台删除" };
  }

  const filePath = publicUrlToUploadPath(url);
  if (!filePath) {
    return { ok: false, error: "仅支持删除 /uploads 下的资源" };
  }

  if (!existsSync(filePath)) {
    return { ok: false, error: "文件不存在" };
  }

  const usedIn = findMediaUsage(url);
  if (usedIn.length > 0 && !force) {
    return { ok: false, error: "资源正在被使用", usedIn };
  }

  unlinkSync(filePath);
  return { ok: true };
}
