"use client";

import { AnimatePresence, motion } from "framer-motion";

const easeLuxury = [0.76, 0, 0.24, 1] as const;

type Props = {
  phase: "closing" | "closed" | "opening";
  label: string;
  meta: string;
};

export function NavShutterOverlay({ phase, label, meta }: Props) {
  const isShut = phase === "closing" || phase === "closed";

  return (
    <div className="nav-shutter-root fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <motion.div
        className="nav-shutter-panel nav-shutter-panel--top"
        initial={{ y: "-100%" }}
        animate={{ y: isShut ? "0%" : "-100%" }}
        transition={{ duration: isShut ? 0.62 : 0.78, ease: easeLuxury }}
      />
      <motion.div
        className="nav-shutter-panel nav-shutter-panel--bottom"
        initial={{ y: "100%" }}
        animate={{ y: isShut ? "0%" : "100%" }}
        transition={{ duration: isShut ? 0.62 : 0.78, ease: easeLuxury }}
      />

      <AnimatePresence>
        {isShut && (
          <motion.div
            key="nav-shutter-meta"
            className="nav-shutter-meta absolute inset-0 flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: isShut ? 0.22 : 0 }}
          >
            <span className="text-[10px] tracking-[0.45em] text-white/35 uppercase">{meta}</span>
            <motion.h2
              className="font-serif text-[clamp(1.5rem,4vw,2.75rem)] tracking-[0.12em] text-white/90"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28, ease: easeLuxury }}
            >
              {label}
            </motion.h2>
            <motion.span
              className="nav-shutter-line mt-2 block h-px w-16 bg-white/25"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.38, ease: easeLuxury }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
