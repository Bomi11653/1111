"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return !reduced && !coarse;
}

export function CustomCursor() {
  const [enabled] = useState(canUseCustomCursor);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 28, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 400, damping: 28, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return undefined;

    document.body.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor='hover']"));
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          opacity: visible ? 0.85 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <div className="h-full w-full rounded-full border border-accent/70 bg-accent/5" />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-1 w-1 rounded-full bg-accent"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0 : 1 }}
      />
    </>
  );
}
