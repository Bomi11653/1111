"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type RefObject } from "react";
import type { SceneState } from "@/core/three/types";
import { DURATION, EASE_PREMIUM } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export type HomeNarrativeController = {
  setHover: (hovered: boolean) => void;
};

export function useHomeNarrative(
  stateRef: RefObject<SceneState>,
  pageRef: RefObject<HTMLElement | null>,
): HomeNarrativeController {
  const hoverTween = useRef<gsap.core.Tween | null>(null);
  const hoverBoost = useRef({ value: 0 });

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrative = { intensity: 0.36, cameraZ: 2.65, scroll: 0 };
    const mouse = { x: 0.5, y: 0.5 };

    const syncState = () => {
      stateRef.current.intensity = narrative.intensity;
      stateRef.current.cameraZ = narrative.cameraZ;
      stateRef.current.scroll = narrative.scroll;
      stateRef.current.hoverBoost = hoverBoost.current.value;
      stateRef.current.mouseUV = { x: mouse.x, y: mouse.y };
      stateRef.current.pointer = {
        x: mouse.x * 2 - 1,
        y: -(mouse.y * 2 - 1),
      };
    };

    syncState();

    if (reduced) return undefined;

    const onMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      gsap.to(mouse, {
        x,
        y,
        duration: 0.42,
        ease: EASE_PREMIUM,
        overwrite: "auto",
        onUpdate: syncState,
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
        },
        onUpdate: syncState,
      });

      tl.to(narrative, { cameraZ: 2.65, intensity: 0.36, scroll: 0, duration: 0.001 })
        .to(narrative, { cameraZ: 2.38, intensity: 0.42, scroll: 0.2, duration: 0.2, ease: "none" })
        .to(narrative, { cameraZ: 1.9, intensity: 0.62, scroll: 0.48, duration: 0.28, ease: "none" })
        .to(narrative, { cameraZ: 1.72, intensity: 0.52, scroll: 0.72, duration: 0.24, ease: "none" })
        .to(narrative, { cameraZ: 1.58, intensity: 0.44, scroll: 1, duration: 0.28, ease: "none" });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      hoverTween.current?.kill();
      ctx.revert();
    };
  }, [pageRef, stateRef]);

  const setHover = (hovered: boolean) => {
    hoverTween.current?.kill();
    hoverTween.current = gsap.to(hoverBoost.current, {
      value: hovered ? 0.38 : 0,
      duration: DURATION.shader,
      ease: EASE_PREMIUM,
      onUpdate: () => {
        stateRef.current.hoverBoost = hoverBoost.current.value;
      },
    });
  };

  return { setHover };
}
