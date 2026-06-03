"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { WorkImage } from "@/components/WorkImage";
import type { ImmersiveVisual } from "@/data/immersiveProjects";
import { EASE_OUT } from "@/lib/motion";

type Props = {
  project: ImmersiveVisual;
  engaged: boolean;
};

export function WorksPosterStage({ project, engaged }: Props) {
  const posters = project.stagePosters;
  const [index, setIndex] = useState(0);
  const lastMove = useRef(0);

  useEffect(() => {
    setIndex(0);
  }, [project.slug]);

  const onPointerMove = useCallback(() => {
    if (!engaged || posters.length <= 1) return;
    const now = Date.now();
    if (now - lastMove.current < 900) return;
    lastMove.current = now;
    setIndex((i) => (i + 1) % posters.length);
  }, [engaged, posters.length]);

  useEffect(() => {
    if (!engaged || posters.length <= 1) return undefined;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [engaged, posters.length, onPointerMove]);

  const src = posters[index];
  const hasPoster = Boolean(src);

  return (
    <div className="works-poster-stage relative h-full w-full min-h-[320px] lg:min-h-0 overflow-hidden bg-[#0a0a0a]">
      <AnimatePresence mode="wait">
        {hasPoster && (
          <motion.div
            key={`${project.slug}-${src}`}
            className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-6 xl:pr-12 py-10 lg:py-14 lg:pl-[32%]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: engaged ? 1 : 0.28, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.75, ease: EASE_OUT }}
          >
            <div className="works-poster-stage__frame relative h-full w-full max-w-[min(100%,420px)] flex items-center justify-center">
              <WorkImage
                src={src!}
                alt={project.title}
                className="!relative !inset-auto !h-auto !w-auto max-h-[min(78vh,920px)] max-w-full object-contain object-center drop-shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasPoster && (
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-16 opacity-20">
          <p className="text-xs tracking-[0.3em] text-white/40 uppercase">Poster</p>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none works-poster-stage__fade-l" aria-hidden />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0a]/85 via-transparent to-[#0a0a0a]/40" />

      <AnimatePresence>
        {engaged && hasPoster && (
          <motion.div
            key="meta"
            className="absolute bottom-10 right-8 xl:right-12 z-10 pointer-events-none text-right max-w-[240px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <p className="text-[10px] tracking-[0.35em] text-white/40 uppercase">{project.year}</p>
            <p className="font-display-tight text-xl md:text-2xl text-white/90 mt-1 tracking-tight">
              {project.title}
            </p>
            <p className="text-xs text-white/45 mt-2 leading-relaxed">{project.tagline}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
