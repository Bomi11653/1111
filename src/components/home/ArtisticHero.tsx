"use client";

import gsap from "gsap";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { PinIcon } from "@/components/icons/ContactIcons";
import { MenuArt } from "@/components/home/MenuArt";
import { useLocale } from "@/context/LocaleContext";
import { DURATION, EASE_PREMIUM } from "@/lib/motion";

type Props = {
  onMenuHoverBoost?: (boost: number) => void;
};

export function ArtisticHero({ onMenuHoverBoost }: Props) {
  const { t, siteText, site } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(".hero-watermark", { opacity: 0.04 });
      gsap.set(".hero-scroll-hint", { opacity: 0, y: 8 });
      gsap.set(".hero-base", { opacity: 0, y: 12 });

      const tl = gsap.timeline({ defaults: { ease: EASE_PREMIUM } });

      tl.to(".hero-watermark", { opacity: 0.1, duration: 2 }, 0)
        .to(".hero-base", { opacity: 1, y: 0, duration: 0.95 }, "-=0.4")
        .to(".hero-scroll-hint", { opacity: 0.4, y: 0, duration: 0.85 }, "-=0.25");
    }, sectionRef);

    const onMove = (event: MouseEvent) => {
      if (!contentRef.current) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 5;
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="art-hero relative min-h-screen w-full overflow-hidden bg-transparent text-white"
    >
      <div className="art-hero__grain absolute inset-0 pointer-events-none z-[1]" aria-hidden />
      <div className="art-hero__grid absolute inset-0 pointer-events-none opacity-[0.04] z-[1]" aria-hidden />

      <div
        className="hero-watermark hero-watermark--tl font-art-display pointer-events-none absolute z-[2] select-none text-primary/20"
        aria-hidden
      >
        ZHENG
      </div>
      <div
        className="hero-watermark hero-watermark--br font-art-display pointer-events-none absolute z-[2] select-none text-primary/20"
        aria-hidden
      >
        SCENE
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-4rem)] px-8 md:px-16 lg:px-24 pt-16 pb-28 will-change-transform"
      >
        <MenuArt onHoverBoost={onMenuHoverBoost} />
      </div>

      <div className="hero-base absolute bottom-10 left-8 md:left-12 z-20 flex flex-col items-center text-center gap-2">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-white/75 uppercase">
          {site.location.base}
        </p>
        <PinIcon className="text-primary shrink-0" />
        <p className="text-sm text-white/45 tracking-[0.15em]">
          {siteText.locationCity}
        </p>
      </div>

      <Link
        href="/contact"
        className="hero-base absolute bottom-10 right-8 md:right-12 z-20 hidden md:inline-flex items-center gap-2 text-sm text-emerald-400/90 transition-all duration-300 hover:gap-3 hover:text-emerald-300"
        data-cursor="hover"
      >
        <span>→</span>
        {t.heroNav.contactCta}
      </Link>

      <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-[0.35em] text-white/40 uppercase flex flex-col items-center gap-2">
        <span className="animate-bounce-subtle">↓</span>
        <span>Scroll</span>
      </div>
    </section>
  );
}
