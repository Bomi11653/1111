import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/data/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.title}`,
    template: `%s · ${site.name}`,
  },
  description: `${site.headline} — ${site.tagline}`,
  openGraph: {
    title: `${site.name} · ${site.title}`,
    description: site.headline,
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${outfit.variable} ${syne.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased relative">
        <div className="relative z-10 flex flex-col min-h-full">
          <SiteHeader />
          <main className="flex-1 pt-16">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
