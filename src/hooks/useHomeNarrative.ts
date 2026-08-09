"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type RefObject } from "react";
import type { SceneState } from "@/core/three/types";
import { DURATION, EASE_PREMIUM } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export type HomeNarrativeController = {
  setHover: (hovered: boolean) => void;
  setHoverBoost: (boost: number) => void;
};

function setMouseFromClient(stateRef: RefObject<SceneState>, mouse: { x: number; y: number }, clientX: number, clientY: number) {
  mouse.x = clientX / window.innerWidth;
  mouse.y = 1 - clientY / window.innerHeight;
  stateRef.current.mouseUV = { x: mouse.x, y: mouse.y };
  stateRef.current.pointer = {
    x: mouse.x * 2 - 1,
    y: -(mouse.y * 2 - 1),
  };
}

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
    const narrative = { cameraZ: 2.65, scroll: 0 };
    const mouse = { x: 0.5, y: 0.5 };

    const syncState = () => {
      stateRef.current.cameraZ = narrative.cameraZ;
      stateRef.current.scroll = narrative.scroll;
      stateRef.current.intensity = 1;
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
      gsap.to(mouse, {
        x: event.clientX / window.innerWidth,
        y: 1 - event.clientY / window.innerHeight,
        duration: 0.22,
        ease: EASE_PREMIUM,
        overwrite: "auto",
        onUpdate: syncState,
      });
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      setMouseFromClient(stateRef, mouse, touch.clientX, touch.clientY);
      gsap.to(hoverBoost.current, {
        value: 0.55,
        duration: 0.35,
        ease: EASE_PREMIUM,
        overwrite: "auto",
        onUpdate: syncState,
      });
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        setMouseFromClient(stateRef, mouse, touch.clientX, touch.clientY);
      }
      gsap.to(hoverBoost.current, {
        value: 0.55,
        duration: 0.4,
        ease: EASE_PREMIUM,
        overwrite: "auto",
        onUpdate: syncState,
      });
    };

    const onTouchEnd = () => {
      gsap.to(hoverBoost.current, {
        value: 0,
        duration: 0.75,
        ease: EASE_PREMIUM,
        overwrite: "auto",
        onUpdate: syncState,
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

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

      tl.to(narrative, { cameraZ: 2.65, scroll: 0, duration: 0.001 })
        .to(narrative, { cameraZ: 2.38, scroll: 0.2, duration: 0.2, ease: "none" })
        .to(narrative, { cameraZ: 1.9, scroll: 0.48, duration: 0.28, ease: "none" })
        .to(narrative, { cameraZ: 1.72, scroll: 0.72, duration: 0.24, ease: "none" })
        .to(narrative, { cameraZ: 1.58, scroll: 1, duration: 0.28, ease: "none" });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      hoverTween.current?.kill();
      ctx.revert();
    };
  }, [pageRef, stateRef]);

  const setHoverBoost = (target: number) => {
    hoverTween.current?.kill();
    hoverTween.current = gsap.to(hoverBoost.current, {
      value: target,
      duration: DURATION.shader,
      ease: EASE_PREMIUM,
      onUpdate: () => {
        stateRef.current.hoverBoost = hoverBoost.current.value;
      },
    });
  };

  const setHover = (hovered: boolean) => {
    setHoverBoost(hovered ? 0.85 : 0);
  };

  return { setHover, setHoverBoost };
}
