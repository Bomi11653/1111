"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { scrollToElement } from "@/lib/smoothScroll";

const sections = [
  { id: "hero", label: "01" },
  { id: "portfolio-section", label: "02" },
  { id: "about-section", label: "03" },
  { id: "contact", label: "04" },
];

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { threshold: 0.35 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    scrollToElement(id);
  };

  return (
    <aside
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4"
      aria-label="页面进度"
    >
      <div className="relative h-32 w-px bg-border/60">
        <motion.div
          className="absolute top-0 left-0 w-full origin-top bg-accent"
          style={{ scaleY, height: "100%" }}
        />
      </div>
      {sections.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => scrollTo(s.id)}
          className={`text-[10px] tracking-widest transition-colors duration-300 ${
            active === i ? "text-accent" : "text-muted hover:text-foreground"
          }`}
          aria-label={`跳转到第 ${s.label} 节`}
          data-cursor="hover"
        >
          {s.label}
        </button>
      ))}
    </aside>
  );
}

export function VerticalSocial() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.4]);

  return (
    <motion.aside
      style={{ opacity }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-6"
      aria-label="社交链接"
    >
      <span
        className="text-[10px] tracking-[0.35em] text-muted uppercase"
        style={{ writingMode: "vertical-rl" }}
      >
        ENV · ART · 3D
      </span>
      <div className="h-16 w-px bg-border/60" />
      <a
        href="https://space.bilibili.com/279855573"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] tracking-widest text-muted hover:text-accent transition-colors"
        style={{ writingMode: "vertical-rl" }}
        data-cursor="hover"
      >
        BILIBILI
      </a>
    </motion.aside>
  );
}
