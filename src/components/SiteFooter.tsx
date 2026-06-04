"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { site } from "@/data/site";

export function SiteFooter() {
  const pathname = usePathname();
  const { t, siteText } = useLocale();
  const year = new Date().getFullYear();

  if (pathname === "/about") return null;

  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted">
        <p>
          © {year} {siteText.name} · {siteText.title}
        </p>
        <div className="flex gap-6">
          <Link href="/works" className="hover:text-accent transition-colors">
            {t.ui.worksLink}
          </Link>
          <a href={`mailto:${site.email}`} className="hover:text-accent transition-colors">
            {t.ui.emailLink}
          </a>
        </div>
      </div>
    </footer>
  );
}
