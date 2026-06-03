"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { WorkImage } from "@/components/WorkImage";
import { useLocale } from "@/context/LocaleContext";
import type { GalleryItem } from "@/data/projects";
import { DURATION, EASE_OUT } from "@/lib/motion";

type Props = {
  items: GalleryItem[];
  onHoverChange?: (hovered: boolean) => void;
};

export function ImmersiveFeaturedCard({ items, onHoverChange }: Props) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const { t } = useLocale();
  const item = items[active] ?? items[0];

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length) return;
      setActive(index);
    },
    [items.length],
  );

  const goPrev = () => goTo(active === 0 ? items.length - 1 : active - 1);
  const goNext = () => goTo(active === items.length - 1 ? 0 : active + 1);

  if (!item) return null;

  return (
    <div className="mx-auto max-w-5xl px-2">
      <div className="mb-12 text-center">
        <p className="section-label mb-4">{t.showcase.label}</p>
        <h2 className="font-serif text-3xl md:text-4xl text-foreground tracking-tight">
          {t.showcase.title}
        </h2>
      </div>

      <div
        className="glass-card ds-card relative aspect-[16/10] md:aspect-[2/1] overflow-hidden group"
        onMouseEnter={() => {
          setHovered(true);
          onHoverChange?.(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
          onHoverChange?.(false);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.hover, ease: EASE_OUT }}
          >
            <WorkImage
              src={item.cover}
              alt={item.title}
              fill
              priority={active === 0}
              className="transition-transform duration-[900ms] group-hover:scale-[1.03] [transition-timing-function:var(--ease-premium)]"
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            backgroundColor: hovered ? "rgba(5, 5, 7, 0.62)" : "rgba(5, 5, 7, 0.28)",
            backdropFilter: hovered ? "blur(6px)" : "blur(0px)",
            transitionTimingFunction: "var(--ease-premium)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${item.id}`}
            className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: DURATION.hover, ease: EASE_OUT }}
          >
            <p className="section-label mb-2 !tracking-[0.3em]">{item.year}</p>
            <h3 className="font-serif text-3xl md:text-5xl text-foreground tracking-tight">
              {item.title}
            </h3>
            <p className="body-text mt-3 max-w-lg">{item.subtitle}</p>

            <motion.div
              className="flex flex-wrap gap-3 mt-8 pointer-events-auto"
              initial={false}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
              transition={{ duration: DURATION.hover, ease: EASE_OUT }}
            >
              {item.slug && (
                <Link
                  href={`/works/${item.slug}`}
                  className="ds-chip"
                  data-cursor="hover"
                >
                  {t.showcase.viewDetail}
                </Link>
              )}
              {item.externalUrl && (
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ds-chip ds-chip--primary"
                  data-cursor="hover"
                >
                  {t.showcase.openExternal} ↗
                </a>
              )}
              <Link href="/works" className="ds-chip ds-chip--ghost" data-cursor="hover">
                {t.showcase.viewAll} →
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {item.mediaType === "video" && (
          <span className="absolute top-6 right-6 text-[9px] tracking-widest bg-foreground/90 text-background px-2.5 py-1 uppercase pointer-events-none">
            Film
          </span>
        )}

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="ds-icon-btn absolute left-4 top-1/2 -translate-y-1/2 z-10"
              aria-label="上一个作品"
              data-cursor="hover"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="ds-icon-btn absolute right-4 top-1/2 -translate-y-1/2 z-10"
              aria-label="下一个作品"
              data-cursor="hover"
            >
              ›
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3">
            {items.map((work, i) => (
              <button
                key={work.id}
                type="button"
                aria-label={`切换到 ${work.title}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
                className="group relative flex flex-col items-center gap-2 px-3 py-2 cursor-pointer"
                data-cursor="hover"
              >
                <span
                  className={`block h-[2px] rounded-full transition-all duration-500 ${
                    i === active ? "w-12 bg-primary" : "w-8 bg-border group-hover:bg-muted"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-premium)" }}
                />
                <span
                  className={`text-[10px] tracking-wider transition-colors duration-500 ${
                    i === active ? "text-primary" : "text-muted group-hover:text-foreground"
                  }`}
                >
                  {work.title}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}
