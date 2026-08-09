import type { Metadata } from "next";
import { ImmersiveWorksSection } from "@/components/works/ImmersiveWorksSection";
import { getImmersiveVisuals } from "@/data/immersiveProjects";
import { getSeoContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeoContent();
  return {
    title: seo.worksTitle,
    description: seo.worksDescription,
    openGraph: seo.ogImage
      ? { title: seo.worksTitle, description: seo.worksDescription, images: [{ url: seo.ogImage }] }
      : { title: seo.worksTitle, description: seo.worksDescription },
  };
}

export default function WorksPage() {
  const visuals = getImmersiveVisuals();

  return (
    <div className="pt-16">
      <ImmersiveWorksSection visuals={visuals} />
    </div>
  );
}
