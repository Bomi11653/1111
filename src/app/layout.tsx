import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Providers } from "@/components/effects/Providers";
import { siteLocales } from "@/data/siteLocales";
import "./globals.css";

const metaSite = siteLocales.en;

export const metadata: Metadata = {
  title: {
    default: `${metaSite.name} · ${metaSite.title}`,
    template: `%s · ${metaSite.name}`,
  },
  description: `${metaSite.headline} — ${metaSite.tagline}`,
  openGraph: {
    title: `${metaSite.name} · ${metaSite.title}`,
    description: metaSite.headline,
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="h-full">
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
        <Providers>
          <div className="relative z-10 flex flex-col min-h-full">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
