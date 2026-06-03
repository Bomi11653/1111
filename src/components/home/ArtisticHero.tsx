"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { PinIcon } from "@/components/icons/ContactIcons";
import { useLocale } from "@/context/LocaleContext";
import { DURATION, EASE_PREMIUM } from "@/lib/motion";
import { site } from "@/data/site";

export function ArtisticHero() {
  const { siteText, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const displayName = locale === "zh" ? siteText.name : site.nameEn;
  const roleLine =
    locale === "zh"
      ? `${siteText.title} / ${siteText.tagline}`
      : "Game Environment Artist / 3D Environment Art";

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(".hero-watermark", { opacity: 0.05 });
      gsap.set(".hero-line", { y: 80, opacity: 0 });
      gsap.set(".hero-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".hero-scroll-hint", { opacity: 0, y: 8 });
      gsap.set(".hero-base", { opacity: 0, y: 12 });

      const tl = gsap.timeline({ defaults: { ease: EASE_PREMIUM } });

      tl.to(".hero-line", {
        y: 0,
        opacity: 1,
        duration: DURATION.hero,
        stagger: 0.15,
      })
        .to(".hero-line-muted", { opacity: 0.6, duration: 1 }, "-=0.7")
        .to(".hero-line-soft", { opacity: 0.45, duration: 1 }, "-=0.85")
        .to(".hero-rule", { scaleX: 1, duration: 1.1 }, "-=0.55")
        .to(".hero-watermark", { opacity: 0.06, duration: 2 }, 0)
        .to(".hero-base", { opacity: 1, y: 0, duration: 0.95 }, "-=0.4")
        .to(".hero-scroll-hint", { opacity: 0.4, y: 0, duration: 0.85 }, "-=0.25");
    }, sectionRef);

    const onMove = (event: MouseEvent) => {
      if (!contentRef.current) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      gsap.to(contentRef.current, {
        x,
        y,
        duration: 1.15,
        ease: EASE_PREMIUM,
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="art-hero relative min-h-screen w-full overflow-hidden bg-transparent text-white"
    >
      <div className="art-hero__grain absolute inset-0 pointer-events-none z-[1]" aria-hidden />
      <div className="art-hero__grid absolute inset-0 pointer-events-none opacity-[0.04] z-[1]" aria-hidden />

      <div
        className="hero-watermark font-art-display absolute -top-[2vw] -left-[2vw] text-[18vw] font-black leading-[0.85] tracking-tighter select-none pointer-events-none z-[2] text-primary/10"
        aria-hidden
      >
        ZHENG
      </div>
      <div
        className="hero-watermark font-art-display absolute -bottom-[4vw] -right-[2vw] text-[14vw] font-black leading-none tracking-tighter select-none pointer-events-none z-[2] text-primary/10"
        aria-hidden
      >
        SCENE
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-4rem)] px-8 md:px-16 lg:px-24 pt-16 pb-28 will-change-transform"
      >
        <p className="hero-line section-label mb-10">01 — 03 · {siteText.title}</p>

        <h1 className="hero-line hero-title font-display-tight text-glow text-white">
          {displayName}
        </h1>

        <p className="hero-line hero-line-muted mt-8 text-base md:text-lg max-w-md text-white/55 tracking-wide body-text !text-white/55">
          {roleLine}
        </p>

        <p className="hero-line hero-line-soft mt-5 text-sm max-w-sm body-text !text-white/40">
          {siteText.headline}
        </p>

        <div className="hero-rule h-px bg-primary/25 mt-12 w-[120px]" />
      </div>

      <div className="hero-base absolute bottom-10 left-8 md:left-12 z-20 flex items-end gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-white/75 uppercase">
            {site.location.base}
          </p>
          <div className="mt-3 flex items-start gap-2">
            <PinIcon className="text-primary mt-0.5 shrink-0" />
            <p
              className="text-sm text-white/45 tracking-[0.15em]"
              style={{ writingMode: "vertical-rl" }}
            >
              {site.location.city.replace(" ", "")}
            </p>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-[0.35em] text-white/40 uppercase flex flex-col items-center gap-2">
        <span className="animate-bounce-subtle">↓</span>
        <span>Scroll</span>
      </div>
    </section>
  );
}
