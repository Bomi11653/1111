import "server-only";

import { existsSync } from "fs";
import path from "path";
import {
  getAllProjects,
  getHomeContent,
  getProjectsContent,
  getSeoContent,
  getSiteContent,
} from "@/lib/cms";

import type { HealthIssue, HealthReport } from "@/lib/cms-types";

function isBrokenImagePath(url: string): boolean {
  if (!url || url === "/works/placeholder.svg") return false;
  if (url.startsWith("http")) return false;
  if (url.startsWith("/works/")) {
    const rel = url.replace(/^\//, "");
    return !existsSync(path.join(process.cwd(), "public", rel));
  }
  if (url.startsWith("/uploads/")) {
    const rel = url.replace(/^\//, "");
    return !existsSync(path.join(process.cwd(), "public", rel));
  }
  return false;
}

export function runHealthCheck(): HealthReport {
  const projects = getAllProjects();
  const issues: HealthIssue[] = [];
  let missingCover = 0;
  let missingAlt = 0;
  let brokenImages = 0;
  let emptyLinks = 0;

  for (const p of projects) {
    if (!p.coverImage || p.coverImage === "/works/placeholder.svg") {
      missingCover++;
      issues.push({
        level: "warning",
        category: "封面",
        message: `「${p.title}」缺少封面图`,
        link: `/admin/projects/${p.id}/edit`,
      });
    }

    if (p.published && !p.seo.description?.trim()) {
      issues.push({
        level: "warning",
        category: "SEO",
        message: `「${p.title}」缺少 SEO 描述`,
        link: `/admin/projects/${p.id}/edit`,
      });
    }

    for (const g of p.gallery) {
      if (!g.alt?.trim()) {
        missingAlt++;
        issues.push({
          level: "warning",
          category: "无障碍",
          message: `「${p.title}」画廊图片缺少 alt：${g.title || g.url}`,
          link: `/admin/projects/${p.id}/edit`,
        });
      }
      if (isBrokenImagePath(g.url)) {
        brokenImages++;
        issues.push({
          level: "error",
          category: "图片",
          message: `「${p.title}」图片路径失效：${g.url}`,
          link: `/admin/projects/${p.id}/edit`,
        });
      }
    }

    if (isBrokenImagePath(p.coverImage)) {
      brokenImages++;
      issues.push({
        level: "error",
        category: "图片",
        message: `「${p.title}」封面路径失效：${p.coverImage}`,
        link: `/admin/projects/${p.id}/edit`,
      });
    }

    if (p.externalUrl === "" || p.meta?.ggacUrl === "") {
      const hasEmptyGgac = p.meta?.ggacUrl === "";
      if (hasEmptyGgac && p.published) {
        emptyLinks++;
        issues.push({
          level: "warning",
          category: "链接",
          message: `「${p.title}」GGAC 链接为空`,
          link: `/admin/projects/${p.id}/edit`,
        });
      }
    }
  }

  let seo;
  try {
    seo = getSeoContent();
    if (!seo.siteDescription?.trim()) {
      issues.push({ level: "warning", category: "SEO", message: "全站缺少默认描述", link: "/admin/seo" });
    }
    if (!seo.worksDescription?.trim()) {
      issues.push({ level: "warning", category: "SEO", message: "作品页缺少 SEO 描述", link: "/admin/seo" });
    }
    if (!seo.aboutDescription?.trim()) {
      issues.push({ level: "warning", category: "SEO", message: "关于页缺少 SEO 描述", link: "/admin/seo" });
    }
    if (!seo.contactDescription?.trim()) {
      issues.push({ level: "warning", category: "SEO", message: "联系页缺少 SEO 描述", link: "/admin/seo" });
    }
  } catch {
    issues.push({ level: "error", category: "SEO", message: "无法读取 SEO 配置", link: "/admin/seo" });
  }

  const home = getHomeContent();
  if (home.hero.backgroundImage && isBrokenImagePath(home.hero.backgroundImage)) {
    brokenImages++;
    issues.push({
      level: "error",
      category: "图片",
      message: `首页 Hero 背景图路径失效：${home.hero.backgroundImage}`,
      link: "/admin/home",
    });
  }

  const site = getSiteContent();
  if (!site.email?.trim()) {
    issues.push({ level: "warning", category: "联系", message: "站点邮箱未设置", link: "/admin/contact" });
  }

  const timestamps = getProjectsContent().projects.map((p) => p.updatedAt).filter(Boolean);
  const lastUpdated = timestamps.length
    ? timestamps.sort((a, b) => b.localeCompare(a))[0]
    : null;

  return {
    issues: issues.slice(0, 50),
    stats: {
      totalProjects: projects.length,
      publishedCount: projects.filter((p) => p.published).length,
      draftCount: projects.filter((p) => !p.published).length,
      missingCover,
      missingAlt,
      brokenImages,
      emptyLinks,
      lastUpdated,
    },
  };
}
