"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AboutNarrativeOverlay } from "@/components/about/AboutNarrativeOverlay";
import { Button } from "@/components/ui/Button";
import { usePageThreeScene } from "@/context/ThreeEngineContext";
import { useLocale } from "@/context/LocaleContext";
import type { SceneState } from "@/core/three/types";
import { getActiveZoneIndex } from "@/lib/aboutZones";
import { site } from "@/data/site";

export function AboutPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneStateRef = useRef<SceneState>({ scroll: 0, reveal: 0, pointer: { x: 0, y: 0 } });
  const revealFrameRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [scroll, setScroll] = useState(0);
  const [reveal, setReveal] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const { t } = useLocale();
  const a = t.about;

  usePageThreeScene("about", canvasRef, sceneStateRef);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    sceneStateRef.current.scroll = v;
    setScroll(v);
  });

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const r = Math.min(1, (now - start) / 2200);
      sceneStateRef.current.reveal = r;
      setReveal(r);
      if (r < 1) {
        revealFrameRef.current = requestAnimationFrame(tick);
      } else {
        setIntroVisible(false);
      }
    };
    revealFrameRef.current = requestAnimationFrame(tick);
    const fallback = window.setTimeout(() => setIntroVisible(false), 2600);

    return () => {
      if (revealFrameRef.current) cancelAnimationFrame(revealFrameRef.current);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      sceneStateRef.current.pointer = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const zoneIndex = getActiveZoneIndex(scroll);
  const showCta = scroll > 0.78;

  return (
    <div className="relative about-spatial -mt-16">
      <div ref={canvasRef} className="fixed inset-x-0 top-16 bottom-0 z-0 bg-[#050505]" />

      {introVisible && (
        <div
          className="fixed inset-0 z-40 bg-black pointer-events-none transition-opacity duration-700"
          style={{ opacity: Math.max(0, 1 - reveal * 1.05) }}
          aria-hidden
        />
      )}

      <AboutNarrativeOverlay scroll={scroll} />

      <div className="fixed top-24 left-6 md:left-12 z-30 pointer-events-none select-none">
        <p className="text-[10px] tracking-[0.45em] text-white/35 uppercase">{a.zoneLabel}</p>
        <p className="font-display-tight text-xl md:text-2xl text-white/75 mt-2 tracking-tight">
          {a.zoneNames[zoneIndex]}
        </p>
        <p className="text-[10px] text-white/25 mt-3 tabular-nums">
          {String(zoneIndex + 1).padStart(2, "0")} / {String(a.zoneNames.length).padStart(2, "0")}
        </p>
      </div>

      <div className="fixed top-24 right-6 md:right-12 z-30 pointer-events-none hidden md:block">
        <div className="flex flex-col gap-3 items-end">
          {a.zoneNames.map((name, i) => (
            <span
              key={name}
              className={`text-[10px] tracking-[0.25em] uppercase transition-all duration-500 ${
                i === zoneIndex ? "text-accent opacity-100" : "text-white/20 opacity-60"
              }`}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        animate={{ opacity: scroll < 0.88 ? 0.55 : 0, y: scroll < 0.88 ? 0 : 12 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase text-center">{a.scrollHint}</p>
        <div className="mx-auto mt-3 h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>

      <motion.div
        className="fixed bottom-8 left-6 md:bottom-12 md:left-12 z-30 flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showCta ? 1 : 0, y: showCta ? 0 : 16 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Button href="/contact" variant="primary">
          {a.ctaButton}
        </Button>
      </motion.div>

      <div className="fixed bottom-8 right-6 md:bottom-12 md:right-12 z-30">
        <Link
          href="/contact"
          className={`text-[11px] tracking-[0.3em] uppercase text-white/30 hover:text-accent transition-all duration-500 ${
            showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          data-cursor="hover"
        >
          {site.email}
        </Link>
      </div>

      <div ref={containerRef} className="relative h-[480vh] w-full touch-pan-y" aria-hidden />
    </div>
  );
}
