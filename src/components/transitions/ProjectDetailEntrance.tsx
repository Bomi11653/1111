"use client";

import { motion } from "framer-motion";
import { usePageTransitionOptional } from "@/context/PageTransitionContext";

export function ProjectDetailEntrance({ children }: { children: React.ReactNode }) {
  const transition = usePageTransitionOptional();
  const isRevealing = transition?.isTransitioning ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: isRevealing ? 0.35 : 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
