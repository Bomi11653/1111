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
import type { GalleryItem } from "@/data/projects";
import { useHomeNarrative } from "@/hooks/useHomeNarrative";
import { getEnabledModules, getModuleDescription, getModuleTitle } from "@/lib/moduleUtils";
import { DURATION, EASE_OUT } from "@/lib/motion";

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

export function HomePage({ previews }: { previews: GalleryItem[] }) {
  const { t, locale, site, home, modules } = useLocale();
  const timeline = home.timeline;
  const pageRef = useRef<HTMLDivElement>(null);
  const sceneStateRef = useRef<SceneState>({
    scroll: 0,
    intensity: 0.36,
    cameraZ: 2.65,
    hoverBoost: 0,
    mouseUV: { x: 0.5, y: 0.5 },
  });

  const narrative = useHomeNarrative(sceneStateRef, pageRef);
  const homeModules = useMemo(() => getEnabledModules(modules.home), [modules.home]);

  const sectionMap: Record<string, React.ReactNode> = {
    hero: <ArtisticHero key="hero" onMenuHoverBoost={narrative.setHoverBoost} />,
    "featured-works": (
      <section
        key="featured-works"
        id="portfolio-section"
        className="relative py-28 md:py-36 border-t border-border/30 scroll-story-section"
      >
        <RevealBlock>
          <div className="mx-auto max-w-3xl px-6 lg:px-12 text-center mb-10">
            <p className="section-label mb-3">
              {getModuleTitle(modules.home, "featured-works", t.nav.works)}
            </p>
            <p className="text-sm text-muted">
              {getModuleDescription(modules.home, "featured-works", "")}
            </p>
          </div>
          <ImmersiveFeaturedCard items={previews} onHoverChange={narrative.setHover} />
        </RevealBlock>
      </section>
    ),
    intro: (
      <section
        key="intro-block"
        id="about-section-intro"
        className="relative py-28 md:py-36 border-t border-border/30 scroll-story-section"
      >
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <RevealBlock>
            <p className="section-label mb-5 text-center">
              {getModuleTitle(modules.home, "intro", t.intro.label)}
            </p>
            <SplitReveal
              as="h2"
              text={t.intro.title}
              className="font-serif text-3xl md:text-5xl leading-[1.25] text-center text-foreground"
            />
            {getModuleDescription(modules.home, "intro", "") ? (
              <p className="body-text !text-base md:!text-lg max-w-xl mx-auto text-center mt-8">
                {getModuleDescription(modules.home, "intro", t.intro.body1)}
              </p>
            ) : null}
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
    ),
    timeline: (
      <section
        key="timeline-block"
        id="about-section-timeline"
        className="relative py-28 md:py-36 border-t border-border/30 scroll-story-section"
      >
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <RevealBlock>
            <p className="section-label mb-5 text-center">
              {getModuleTitle(modules.home, "timeline", "时间线")}
            </p>
            {getModuleDescription(modules.home, "timeline", "") ? (
              <p className="text-sm text-muted text-center mb-10">
                {getModuleDescription(modules.home, "timeline", "")}
              </p>
            ) : null}
          </RevealBlock>
          <RevealBlock delay={0.14} className="space-y-0">
            {timeline.map((entry, i) => (
              <div
                key={`${entry.year}-${i}`}
                className={`flex gap-8 md:gap-12 py-9 ${
                  i < timeline.length - 1 ? "border-b border-border/40" : ""
                }`}
              >
                <span className="font-serif text-2xl md:text-3xl text-primary/75 tabular-nums shrink-0 w-16">
                  {entry.year}
                </span>
                <p className="body-text !text-base md:!text-lg pt-1">
                  {locale === "zh" ? entry.zh : entry.en}
                </p>
              </div>
            ))}
          </RevealBlock>
        </div>
      </section>
    ),
    "contact-cta": (
      <section key="contact-cta" id="contact" className="py-28 md:py-36 border-t border-border/30 scroll-story-section">
        <RevealBlock className="mx-auto max-w-3xl px-6 lg:px-12 text-center">
          <p className="section-label mb-4">
            {getModuleTitle(modules.home, "contact-cta", t.contact.label)}
          </p>
          <SplitReveal
            as="h2"
            text={t.contact.title}
            className="font-serif text-4xl md:text-5xl"
          />
          <p className="body-text mt-8 max-w-lg mx-auto">
            {getModuleDescription(modules.home, "contact-cta", t.contact.body)}
          </p>
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
            <Button href={site.resumePath} variant="secondary">
              {t.contact.downloadResume}
            </Button>
          </div>
        </RevealBlock>
      </section>
    ),
  };

  const orderedSections = homeModules
    .map((mod) => sectionMap[mod.id])
    .filter(Boolean);

  return (
    <div ref={pageRef} className="relative home-narrative">
      <HomeAmbientLayer stateRef={sceneStateRef} />

      <div className="relative z-10">
        <ScrollProgress />
        <VerticalSocial />
        {orderedSections}
      </div>
    </div>
  );
}
