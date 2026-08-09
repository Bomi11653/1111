import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { getSeoContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeoContent();
  return {
    title: seo.aboutTitle,
    description: seo.aboutDescription,
    openGraph: seo.ogImage
      ? { title: seo.aboutTitle, description: seo.aboutDescription, images: [{ url: seo.ogImage }] }
      : { title: seo.aboutTitle, description: seo.aboutDescription },
  };
}

export default function AboutPage() {
  return <AboutPageContent />;
}
