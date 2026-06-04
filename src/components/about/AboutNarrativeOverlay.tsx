"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PinIcon } from "@/components/icons/ContactIcons";
import { WorkImage } from "@/components/WorkImage";
import { useLocale } from "@/context/LocaleContext";
import type { SiteLocaleContent } from "@/data/siteLocales";
import { zoneFocusOpacity } from "@/lib/aboutZones";

type Props = {
  scroll: number;
};

function AboutSkillBars({ skills }: { skills: SiteLocaleContent["skills"] }) {
  const iconMap: Record<string, string> = {
    Blender: "B",
    Photoshop: "Ps",
    "Adobe After Effects 2025": "Ae",
    "Adobe Premiere Pro": "Pr",
  };

  return (
    <ul className="space-y-5 max-w-xl">
      {skills.map((skill) => (
        <li key={skill.name}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-semibold text-accent">
                {iconMap[skill.name] ?? "◆"}
              </span>
              <div>
                <p className="text-sm font-medium text-white/85">{skill.name}</p>
                <p className="text-xs text-white/35">{skill.category}</p>
              </div>
            </div>
            <span className="text-sm text-white/40 tabular-nums">{skill.level}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-accent/90" style={{ width: `${skill.level}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AboutNarrativeOverlay({ scroll }: Props) {
  const { t, siteText, site } = useLocale();
  const a = t.about;

  const zones = [
    {
      content: (
        <div className="max-w-3xl">
          <p className="text-[10px] tracking-[0.45em] text-white/30 uppercase mb-8">About · 01</p>
          <h1 className="font-display-tight text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.03em]">
            {a.heroLine1}
            <br />
            <span className="text-white/45">
              {a.heroLine2Prefix}
              <span className="italic text-white/75">{a.heroLine2}</span>
            </span>
          </h1>
          <p className="mt-8 text-sm text-white/35 max-w-md leading-relaxed">{siteText.headline}</p>
        </div>
      ),
    },
    {
      content: (
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl w-full">
          <div className="relative aspect-[3/4] max-w-sm overflow-hidden border border-white/10 bg-[#0a0a0a]">
            <WorkImage src={site.profilePath} alt={siteText.name} fill priority className="object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <p className="font-display-tight text-2xl md:text-3xl text-white tracking-tight">{siteText.name}</p>
              <p className="text-sm text-white/50 mt-1">
                {siteText.title} · {siteText.tagline}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-8">
            <div>
              <p className="text-[10px] tracking-[0.35em] text-accent uppercase mb-5">{a.whoLabel}</p>
              <p className="text-lg text-white/55 leading-[1.9]">{a.who1}</p>
              <p className="text-lg text-white/55 leading-[1.9] mt-5">{a.who2}</p>
            </div>

            <div className="space-y-2 border-t border-white/5 pt-6">
              {a.roles.map((role) => (
                <p key={role} className="text-xl text-white/40 font-display-tight">
                  {role}
                </p>
              ))}
            </div>

            <div className="border-t border-white/5 pt-6">
              <p className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-4">{a.projectsLabel}</p>
              <ul className="space-y-3">
                {siteText.featuredWorks.map((work) => (
                  <li key={work.slug}>
                    <Link
                      href={`/works/${work.slug}`}
                      className="group block pointer-events-auto"
                      data-cursor="hover"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-[10px] tabular-nums tracking-widest text-white/30">{work.year}</span>
                        <span className="text-lg text-white/70 group-hover:text-accent transition-colors duration-300">
                          {work.title}
                        </span>
                      </div>
                      <p className="text-sm text-white/35 mt-1 pl-9">{work.meta}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-3 border-t border-white/5 pt-6">
              <PinIcon className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] tracking-[0.25em] text-white/50 uppercase">{site.location.base}</p>
                <p className="text-sm text-white/40 mt-1">{a.experienceMeta}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="max-w-5xl w-full grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-8">{a.doLabel}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {a.capabilities.map((cap, i) => (
                <div
                  key={cap.title}
                  className="p-6 border border-white/8 bg-white/[0.02] hover:border-accent/30 transition-colors duration-500"
                >
                  <p className="font-display-tight text-xl text-white">{cap.title}</p>
                  <p className="text-sm text-white/40 mt-2">{cap.desc}</p>
                  <span className="inline-block mt-4 text-[10px] text-white/20 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-8">Skills</p>
            <AboutSkillBars skills={siteText.skills} />
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="max-w-4xl">
          <p className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-8">{a.philosophyLabel}</p>
          <p className="text-2xl md:text-4xl leading-[1.45] text-white/55 font-display-tight tracking-[-0.02em]">
            {a.philosophyLead}
          </p>
          <ul className="mt-12 space-y-6 border-l border-white/10 pl-8">
            {siteText.philosophy.map((line, i) => (
              <li key={i} className="text-base md:text-lg text-white/40 leading-[1.85]">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      content: (
        <div className="max-w-3xl">
          <p className="text-[10px] tracking-[0.35em] text-accent uppercase mb-6">Contact · 05</p>
          <h2 className="font-display-tight text-3xl md:text-5xl tracking-[-0.03em] text-white/90 leading-tight">
            {a.cta}
          </h2>
          <p className="mt-6 text-sm text-white/40">{site.email}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-20 pointer-events-none flex items-center px-8 md:px-16 lg:px-24">
      {zones.map((zone, index) => {
        const opacity = zoneFocusOpacity(scroll, index);
        if (opacity < 0.02) return null;
        return (
          <motion.div
            key={index}
            className="absolute inset-x-8 md:inset-x-16 lg:inset-x-24 top-1/2 -translate-y-1/2"
            animate={{ opacity, y: (1 - opacity) * 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {zone.content}
          </motion.div>
        );
      })}
    </div>
  );
}
