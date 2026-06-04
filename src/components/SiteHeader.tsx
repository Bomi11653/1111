"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { TopBarMusicBox } from "@/components/TopBarMusicBox";
import { useLocale } from "@/context/LocaleContext";

const navHrefs = ["/", "/works", "/about", "/contact"] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, siteText } = useLocale();
  const isHome = pathname === "/";

  const labels = [t.nav.home, t.nav.works, t.nav.about, t.nav.contact];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink = (href: string, label: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={`text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${
        active ? "text-accent" : "text-muted hover:text-foreground"
      }`}
      onClick={() => setOpen(false)}
      data-cursor="hover"
    >
      <span className="text-muted/50 mr-1">_</span>
      {label}
    </Link>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "border-b border-border/40 bg-background/75 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
          data-cursor="hover"
        >
          <span className="text-base font-bold tracking-[0.15em] text-foreground">
            ZRC
          </span>
          <span className="hidden sm:block text-sm text-muted tracking-wide">
            {siteText.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10" aria-label={t.ui.mainNav}>
          {navHrefs.map((href, i) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return navLink(href, labels[i], active);
          })}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <TopBarMusicBox />
          <LanguageToggle className="hidden md:inline-flex" />
          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-expanded={open}
            aria-label={t.ui.openMenu}
            onClick={() => setOpen(!open)}
          >
            <span className="block w-6 h-px bg-foreground" />
            <span className="block w-4 h-px bg-foreground ml-auto" />
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-6 py-6 flex flex-col gap-5"
          aria-label={t.ui.mobileNav}
        >
          <LanguageToggle />
          {navHrefs.map((href, i) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return navLink(href, labels[i], active);
          })}
        </nav>
      )}
    </header>
  );
}
