import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Providers, SiteChrome } from "@/components/effects/Providers";
import { getHomeContent, getModulesContent, getSeoContent, getSiteContent } from "@/lib/cms";
import type { ModulesContent } from "@/lib/cms-types";
import "./globals.css";

export const dynamic = "force-dynamic";

const EMPTY_MODULES: ModulesContent = {
  home: [],
  works: [],
  workDetail: [],
  about: [],
  contact: [],
};

function safeGetModules(): ModulesContent {
  try {
    return getModulesContent();
  } catch {
    return EMPTY_MODULES;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteContent();
  let seo;
  try {
    seo = getSeoContent();
  } catch {
    seo = null;
  }

  const title = seo?.siteTitle || `${site.name} · ${site.title}`;
  const description = seo?.siteDescription || `${site.headline} — ${site.tagline}`;
  const ogImage = seo?.ogImage || undefined;

  return {
    title: {
      default: title,
      template: `%s · ${site.name}`,
    },
    description,
    keywords: seo?.keywords,
    ...(seo?.favicon ? { icons: { icon: seo.favicon } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "zh_CN",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSiteContent();
  const home = getHomeContent();
  const modules = safeGetModules();

  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter+Tight:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700;900&family=ZCOOL+QingKe+HuangYou&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased relative">
        <Providers site={site} home={home} modules={modules}>
          <SiteChrome header={<SiteHeader />} footer={<SiteFooter />}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
