"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import type { GalleryItem } from "@/data/projects";
import { WorkImage } from "@/components/WorkImage";

type Props = {
  items: GalleryItem[];
  introTitle: string;
  introBody: string;
};

const panelTransition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const };

export function HorizontalAccordion({ items, introTitle, introBody }: Props) {
  const [active, setActive] = useState<number | "intro">("intro");
  const { t } = useLocale();

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[640px] gap-1 overflow-x-auto lg:overflow-hidden snap-x snap-mandatory lg:snap-none rounded-sm">
      {/* 左侧介绍面板 */}
      <motion.div
        className="relative flex-shrink-0 overflow-hidden bg-surface border border-border/40 snap-center min-h-[280px] lg:min-h-0 lg:min-w-[200px]"
        animate={{ flexGrow: active === "intro" ? 2.2 : 1, flexShrink: 1, flexBasis: 0 }}
        transition={panelTransition}
        onMouseEnter={() => setActive("intro")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background" />
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8 lg:p-10">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-accent uppercase mb-4">
              {t.showcase.label}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">
              {introTitle}
            </h2>
            <p className="text-muted text-sm mt-4 leading-relaxed max-w-xs">{introBody}</p>
          </div>
          <Link
            href="/works"
            className="text-xs tracking-[0.2em] uppercase text-accent hover:text-foreground transition-colors"
            data-cursor="hover"
          >
            {t.showcase.viewAll} →
          </Link>
        </div>
      </motion.div>

      {items.map((item, index) => {
        const isActive = active === index;
        const num = String(index + 1).padStart(2, "0");

        return (
          <motion.div
            key={item.id}
            className="relative overflow-hidden cursor-pointer border border-border/30 snap-center min-h-[360px] lg:min-h-0 min-w-[80px] lg:min-w-[56px]"
            animate={{ flexGrow: isActive ? 2.5 : 0.55, flexShrink: 1, flexBasis: 0 }}
            transition={panelTransition}
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActive(index);
              }
            }}
            aria-expanded={isActive}
            aria-label={item.title}
          >
            <WorkImage src={item.cover} alt={item.title} fill className="scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background/70" />

            <div className="absolute top-0 left-0 right-0 p-4 md:p-6">
              <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground/90 tabular-nums">
                {num}
              </span>
              <div
                className={`mt-2 transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-70 lg:opacity-100"
                }`}
              >
                <p className="text-[10px] tracking-[0.25em] text-accent uppercase">{item.year}</p>
                <h3 className="font-serif text-sm md:text-base lg:text-lg text-foreground mt-1">
                  {item.title}
                </h3>
              </div>
            </div>

            {item.mediaType === "video" && (
              <span className="absolute top-4 right-4 text-[9px] tracking-widest bg-foreground text-background px-2 py-1 rotate-12 uppercase">
                Film
              </span>
            )}

            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 md:p-6 space-y-3"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-muted text-xs md:text-sm leading-relaxed line-clamp-2">
                {item.subtitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.slug && (
                  <Link
                    href={`/works/${item.slug}`}
                    className="text-[10px] tracking-widest uppercase border border-border/60 px-3 py-1.5 hover:border-accent/60 hover:text-accent transition-colors"
                    data-cursor="hover"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t.showcase.viewDetail}
                  </Link>
                )}
                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] tracking-widest uppercase border border-accent/40 text-accent px-3 py-1.5 hover:bg-accent/10 transition-colors"
                    data-cursor="hover"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t.showcase.openExternal} ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
