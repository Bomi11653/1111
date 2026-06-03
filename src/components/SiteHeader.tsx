"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, site } from "@/data/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-foreground hover:text-accent transition-colors"
          onClick={() => setOpen(false)}
        >
          {site.name}
          <span className="text-muted text-xs ml-2 hidden sm:inline">ENV ART</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="主导航">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition-colors ${
                  active ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="md:hidden text-foreground p-2"
          aria-expanded={open}
          aria-label="打开菜单"
          onClick={() => setOpen(!open)}
        >
          <span className="block w-6 h-0.5 bg-current mb-1.5" />
          <span className="block w-6 h-0.5 bg-current mb-1.5" />
          <span className="block w-4 h-0.5 bg-current ml-auto" />
        </button>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4"
          aria-label="移动端导航"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
