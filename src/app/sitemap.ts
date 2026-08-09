import type { MetadataRoute } from "next";
import { getPublishedProjectsList, getSeoContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const seo = getSeoContent();
  if (!seo.sitemapEnabled) return [];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const projects = getPublishedProjectsList();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/works`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/works/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}
