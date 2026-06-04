"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { ArtisticHero } from "@/components/home/ArtisticHero";
import { HomeAmbientLayer } from "@/components/home/HomeAmbientLayer";
import { ScrollProgress, VerticalSocial } from "@/components/effects/ScrollProgress";
import { SplitReveal } from "@/components/effects/SplitReveal";
import { ImmersiveFeaturedCard } from "@/components/ImmersiveFeaturedCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/context/LocaleContext";
import type { SceneState } from "@/core/three/types";
import { getHomePreview } from "@/data/projects";
import { site } from "@/data/site";
import { useHomeNarrative } from "@/hooks/useHomeNarrative";
import { DURATION, EASE_OUT } from "@/lib/motion";

const timelineYears = ["2025", "2025"] as const;

function RevealBlock({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: DURATION.reveal, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function HomePage() {
  const { t, locale } = useLocale();
  const previews = useMemo(() => getHomePreview(locale), [locale]);
  const timeline = useMemo(
    () => [t.ui.timelineArk, t.ui.timelineIce],
    [t.ui.timelineArk, t.ui.timelineIce],
  );
  const pageRef = useRef<HTMLDivElement>(null);
  const sceneStateRef = useRef<SceneState>({
    scroll: 0,
    intensity: 1,
    cameraZ: 2.65,
    hoverBoost: 0,
    mouseUV: { x: 0.5, y: 0.5 },
  });

  const narrative = useHomeNarrative(sceneStateRef, pageRef);

  return (
    <div ref={pageRef} className="relative home-narrative">
      <HomeAmbientLayer stateRef={sceneStateRef} />

      <div className="relative z-10">
        <ScrollProgress />
        <VerticalSocial />

        <ArtisticHero onMenuHoverBoost={narrative.setHoverBoost} />

        <section
          id="portfolio-section"
          className="relative py-28 md:py-36 border-t border-border/30 scroll-story-section"
        >
          <RevealBlock>
            <ImmersiveFeaturedCard items={previews} onHoverChange={narrative.setHover} />
          </RevealBlock>
        </section>

        <section
          id="about-section"
          className="relative py-28 md:py-36 border-t border-border/30 scroll-story-section"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <RevealBlock>
              <p className="section-label mb-5 text-center">{t.intro.label}</p>
              <SplitReveal
                as="h2"
                text={t.intro.title}
                className="font-serif text-3xl md:text-5xl leading-[1.25] text-center text-foreground"
              />
            </RevealBlock>

            <RevealBlock delay={0.14} className="mt-16 space-y-0">
              {timeline.map((entry, i) => (
                <div
                  key={`${timelineYears[i]}-${i}`}
                  className={`flex gap-8 md:gap-12 py-9 ${
                    i < timeline.length - 1 ? "border-b border-border/40" : ""
                  }`}
                >
                  <span className="font-serif text-2xl md:text-3xl text-primary/75 tabular-nums shrink-0 w-16">
                    {timelineYears[i]}
                  </span>
                  <p className="body-text !text-base md:!text-lg pt-1">{entry}</p>
                </div>
              ))}
            </RevealBlock>

            <RevealBlock delay={0.22} className="mt-14 space-y-8 text-center">
              <p className="body-text !text-base md:!text-lg max-w-xl mx-auto">{t.intro.body1}</p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm text-primary hover:gap-4 transition-all duration-500"
                style={{ transitionTimingFunction: "var(--ease-premium)" }}
                data-cursor="hover"
              >
                {t.intro.moreAbout} <span>→</span>
              </Link>
            </RevealBlock>
          </div>
        </section>

        <section id="contact" className="py-28 md:py-36 border-t border-border/30 scroll-story-section">
          <RevealBlock className="mx-auto max-w-3xl px-6 lg:px-12 text-center">
            <p className="section-label mb-4">{t.contact.label}</p>
            <SplitReveal as="h2" text={t.contact.title} className="font-serif text-4xl md:text-5xl" />
            <p className="body-text mt-8 max-w-lg mx-auto">{t.contact.body}</p>
            <div className="mt-8">
              <a
                href={`mailto:${site.email}`}
                className="text-primary hover:underline text-sm"
                data-cursor="hover"
              >
                {site.email}
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Button href="/contact" variant="primary">
                {t.contact.goContact}
              </Button>
            </div>
          </RevealBlock>
        </section>
      </div>
    </div>
  );
}
