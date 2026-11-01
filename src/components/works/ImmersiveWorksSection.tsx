"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { usePageTransition } from "@/context/PageTransitionContext";
import { useLocale } from "@/context/LocaleContext";
import type { ImmersiveVisual } from "@/data/immersiveProjects";
import { getProjectColorsFromThemeHue } from "@/lib/color/projectColors";
import { isModuleEnabled } from "@/lib/moduleUtils";
import { useTheme } from "@/lib/color/ThemeProvider";
import { WorksPosterStage } from "./WorksPosterStage";

export function ImmersiveWorksSection({ visuals }: { visuals: ImmersiveVisual[] }) {
  const { modules } = useLocale();
  const { startNavReveal, isTransitioning } = usePageTransition();
  const theme = useTheme();
  const showList = isModuleEnabled(modules.works, "works-list");
  const showTagFilter = isModuleEnabled(modules.works, "tag-filter");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    visuals.forEach((v) => {
      const parts = v.subtitle.split("·").map((s) => s.trim());
      parts.forEach((p) => tags.add(p));
    });
    return ["全部", ...Array.from(tags)];
  }, [visuals]);

  const [activeTag, setActiveTag] = useState("全部");
  const filteredVisuals = useMemo(() => {
    if (!showTagFilter || activeTag === "全部") return visuals;
    return visuals.filter((v) => v.subtitle.includes(activeTag));
  }, [visuals, activeTag, showTagFilter]);

  const [active, setActive] = useState<ImmersiveVisual>(visuals[0]);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const listVisuals = filteredVisuals.length > 0 ? filteredVisuals : visuals;
  const displaySlug = hoveredSlug ?? active?.slug;
  const displayProject = listVisuals.find((p) => p.slug === displaySlug) ?? listVisuals[0] ?? active;
  const isEngaged = hoveredSlug !== null || active?.slug === displayProject?.slug;

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

  if (!showList || visuals.length === 0) {
    return (
      <section className="immersive-works relative min-h-[50vh] flex items-center justify-center bg-[#0a0a0a] text-white">
        <p className="text-white/35 text-sm">{showList ? "作品整理中" : "作品列表模块已隐藏"}</p>
      </section>
    );
  }

  return (
    <section className="immersive-works relative min-h-[85vh] lg:min-h-screen flex flex-col lg:flex-row bg-[#0a0a0a] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 lg:left-1/2 opacity-70 lg:opacity-100">
        {displayProject ? (
          <WorksPosterStage key={displayProject.slug} project={displayProject} engaged={isEngaged} />
        ) : null}
      </div>

      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 lg:py-24">
        <p className="text-[10px] tracking-[0.4em] text-white/35 uppercase mb-10">Works</p>

        {showTagFilter ? (
          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border transition-colors ${
                  activeTag === tag
                    ? "border-accent/60 text-accent bg-accent/10"
                    : "border-white/10 text-white/40 hover:border-white/25"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        ) : null}

        <ul className="space-y-2 md:space-y-4">
          {listVisuals.map((project) => {
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
