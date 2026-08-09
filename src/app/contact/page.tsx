import type { Metadata } from "next";
import { ContactChannelGrid, ContactGreeting } from "@/components/ContactChannelGrid";
import { getSeoContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeoContent();
  return {
    title: seo.contactTitle,
    description: seo.contactDescription,
    openGraph: seo.ogImage
      ? { title: seo.contactTitle, description: seo.contactDescription, images: [{ url: seo.ogImage }] }
      : { title: seo.contactTitle, description: seo.contactDescription },
  };
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 pt-24">
      <ContactGreeting />
      <ContactChannelGrid />
    </div>
  );
}
