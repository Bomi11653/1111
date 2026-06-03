"use client";

import { motion } from "framer-motion";
import { PinIcon } from "@/components/icons/ContactIcons";
import { WorkImage } from "@/components/WorkImage";
import { useLocale } from "@/context/LocaleContext";
import { site } from "@/data/site";
import { zoneFocusOpacity } from "@/lib/aboutZones";

type Props = {
  scroll: number;
};

export function AboutNarrativeOverlay({ scroll }: Props) {
  const { t } = useLocale();
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
        </div>
      ),
    },
    {
      content: (
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl w-full">
          <div className="relative aspect-[3/4] max-w-sm overflow-hidden border border-white/10">
            <WorkImage src="/about/profile.jpg" alt={site.name} fill />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
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
            <div className="flex items-start gap-3">
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
        <div className="max-w-5xl w-full">
          <p className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-8">{a.doLabel}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {a.capabilities.map((cap, i) => (
              <div
                key={cap.title}
                className="p-8 border border-white/8 bg-white/[0.02] hover:border-accent/30 transition-colors duration-500"
              >
                <p className="font-display-tight text-xl text-white">{cap.title}</p>
                <p className="text-sm text-white/40 mt-2">{cap.desc}</p>
                <span className="inline-block mt-5 text-[10px] text-white/20 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
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
            {site.philosophy.map((line, i) => (
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
