import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { getHomePreview } from "@/data/projects";
import { getSeoContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeoContent();
  return {
    title: seo.homeTitle,
    description: seo.homeDescription,
    openGraph: seo.ogImage
      ? { title: seo.homeTitle, description: seo.homeDescription, images: [{ url: seo.ogImage }] }
      : { title: seo.homeTitle, description: seo.homeDescription },
  };
}

export default function Page() {
  const previews = getHomePreview();
  return <HomePage previews={previews} />;
}
