"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { usePageTransition } from "@/context/PageTransitionContext";
import { immersiveVisuals, type ImmersiveVisual } from "@/data/immersiveProjects";
import { getProjectColorsFromThemeHue } from "@/lib/color/projectColors";
import { useTheme } from "@/lib/color/ThemeProvider";
import { WorksPosterStage } from "./WorksPosterStage";

export function ImmersiveWorksSection() {
  const { startNavReveal, isTransitioning } = usePageTransition();
  const theme = useTheme();
  const [active, setActive] = useState<ImmersiveVisual>(immersiveVisuals[0]);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const displaySlug = hoveredSlug ?? active.slug;
  const displayProject = immersiveVisuals.find((p) => p.slug === displaySlug) ?? active;
  const isEngaged = hoveredSlug !== null || active.slug === displayProject.slug;

  const handleEnter = (project: ImmersiveVisual) => {
    if (isTransitioning) return;

    startNavReveal(
      {
        label: project.title,
        meta: `${project.year} — ${project.subtitle}`,
        navId: project.slug,
      },
      { type: "route", href: `/works/${project.slug}` },
    );
  };

  return (
    <section className="immersive-works relative min-h-[85vh] lg:min-h-screen flex flex-col lg:flex-row bg-[#0a0a0a] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 lg:left-1/2 opacity-70 lg:opacity-100">
        <WorksPosterStage project={displayProject} engaged={isEngaged} />
      </div>

      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 lg:py-24">
        <p className="text-[10px] tracking-[0.4em] text-white/35 uppercase mb-10">Works</p>

        <ul className="space-y-2 md:space-y-4">
          {immersiveVisuals.map((project) => {
            const isActive = active.slug === project.slug;
            const isHovered = hoveredSlug === project.slug;
            const accent = getProjectColorsFromThemeHue(theme.hue, project.hueOffset).color;

            return (
              <li key={project.slug}>
                <button
                  type="button"
                  className="group block w-full text-left py-3 md:py-4 border-b border-white/5 disabled:opacity-50"
                  disabled={isTransitioning}
                  onMouseEnter={() => {
                    setHoveredSlug(project.slug);
                    setActive(project);
                  }}
                  onMouseLeave={() => setHoveredSlug(null)}
                  onFocus={() => {
                    setHoveredSlug(project.slug);
                    setActive(project);
                  }}
                  onBlur={() => setHoveredSlug(null)}
                  onClick={() => handleEnter(project)}
                  data-cursor="hover"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-[10px] tabular-nums tracking-widest transition-colors duration-500"
                      style={{
                        color: isActive || isHovered ? accent : "rgba(255,255,255,0.25)",
                        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      {project.year}
                    </span>
                    <motion.span
                      className="font-display-tight text-2xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] transition-all duration-500 block"
                      style={{
                        opacity: isActive || isHovered ? 1 : 0.35,
                        color: isActive || isHovered ? "#fff" : "rgba(255,255,255,0.5)",
                        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                      animate={{ x: isHovered ? 12 : 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {project.title}
                    </motion.span>
                  </div>
                  <p
                    className="mt-2 text-sm pl-10 md:pl-14 transition-all duration-500 overflow-hidden"
                    style={{
                      opacity: isActive || isHovered ? 0.55 : 0,
                      maxHeight: isActive || isHovered ? 40 : 0,
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    {project.subtitle} · 点击进入 →
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative z-10 hidden lg:block w-1/2 shrink-0" aria-hidden />
    </section>
  );
}
