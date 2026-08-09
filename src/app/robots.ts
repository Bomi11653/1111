import type { MetadataRoute } from "next";
import { getSeoContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const seo = getSeoContent();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  if (!seo.robotsAllow) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: seo.sitemapEnabled ? `${baseUrl}/sitemap.xml` : undefined,
  };
}
