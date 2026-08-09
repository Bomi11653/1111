"use client";

import gsap from "gsap";
import { useCallback, useLayoutEffect, useRef } from "react";
import { usePageTransitionOptional } from "@/context/PageTransitionContext";
import { useLocale } from "@/context/LocaleContext";
import { DURATION, EASE_PREMIUM } from "@/lib/motion";
import { scrollToElement } from "@/lib/smoothScroll";

const NAV_META: Record<string, string> = {
  modeling: "02 — Works",
  about: "03 — About",
};

const DEFAULT_HOVER_BOOST = 0;

function intensityToBoost(intensity: number) {
  const normalized = (intensity - 0.9) / 0.7;
  return Math.min(Math.max(normalized * 0.55, 0.35), 0.62);
}

type Props = {
  onHoverBoost?: (boost: number) => void;
};

export function MenuArt({ onHoverBoost }: Props) {
  const { t, locale } = useLocale();
  const transition = usePageTransitionOptional();
  const items = t.heroNav.items;
  const activeId = transition?.activeNavId ?? null;
  const isTransitioning = transition?.isTransitioning ?? false;
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const runNav = useCallback(
    (
      itemId: string,
      target: { type: "scroll"; targetId: string } | { type: "route"; href: string },
      label: string,
    ) => {
      if (transition?.isTransitioning) return;

      if (transition?.startNavReveal) {
        transition.startNavReveal(
          {
            label,
            meta: NAV_META[itemId] ?? "Navigate",
            navId: itemId,
          },
          target,
        );
        return;
      }

      if (target.type === "scroll") scrollToElement(target.targetId);
      else window.location.assign(target.href);
    },
    [transition],
  );

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !navRef.current) return undefined;

    const cleanups: (() => void)[] = [];

    gsap.fromTo(
      ".menu-art__item",
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.14,
        duration: 1.1,
        ease: "power4.out",
        delay: 0.15,
      },
    );

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const inner = el.querySelector<HTMLElement>(".menu-art__inner");
      if (!inner) return;

    const item = items[i];
    if (!item) return;

    const boost = intensityToBoost(item.intensity);

      const onEnter = () => {
        gsap.to(inner, { y: "-50%", duration: 0.6, ease: EASE_PREMIUM });
        onHoverBoost?.(boost);
      };

      const onLeave = () => {
        gsap.to(inner, { y: "0%", duration: 0.6, ease: EASE_PREMIUM });
        onHoverBoost?.(DEFAULT_HOVER_BOOST);
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("focusin", onEnter);
      el.addEventListener("focusout", onLeave);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("focusin", onEnter);
        el.removeEventListener("focusout", onLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      gsap.killTweensOf(".menu-art__item");
      gsap.killTweensOf(".menu-art__inner");
    };
  }, [items, onHoverBoost, locale]);

  const renderItem = (
    item: (typeof items)[number],
    index: number,
    interactive: boolean,
    onClick?: () => void,
  ) => {
    const primaryTitle = locale === "zh" ? item.titleCN : item.titleEN;
    const secondaryTitle = locale === "zh" ? item.titleEN : item.titleCN;
    const isActive = activeId === item.id;
    const isDimmed = isTransitioning && activeId !== null && !isActive;

    const rowClass = [
      "menu-art__item",
      "work-item",
      interactive ? "menu-art__item--interactive" : "menu-art__item--static",
      isActive ? "menu-art__item--active" : "",
      isDimmed ? "menu-art__item--dimmed" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const inner = (
      <div
        ref={(el) => {
          itemRefs.current[index] = el;
        }}
        className={rowClass}
        data-cursor={interactive ? "hover" : undefined}
      >
        <div className="menu-art__inner">
          <span className="menu-art__cn font-display-tight">{primaryTitle}</span>
          <span className="menu-art__en font-display-tight">{secondaryTitle}</span>
        </div>
      </div>
    );

    if (!interactive) {
      return (
        <div key={item.id} className="menu-art__row">
          {inner}
        </div>
      );
    }

    return (
      <div key={item.id} className="menu-art__row">
        <button type="button" className="menu-art__trigger" onClick={onClick}>
          {inner}
        </button>
      </div>
    );
  };

  return (
    <nav
      ref={navRef}
      className={`menu-art ${isTransitioning ? "menu-art--transition" : ""}`}
      aria-label={t.heroNav.label}
    >
      {items.map((item, index) => {
        if (item.action === "link") {
          return renderItem(item, index, true, () => {
            const label = locale === "zh" ? item.titleCN : item.titleEN;
            runNav(item.id, { type: "route", href: item.href! }, label);
          });
        }

        return renderItem(item, index, false);
      })}
    </nav>
  );
}
