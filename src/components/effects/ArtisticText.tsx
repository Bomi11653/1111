"use client";

import { motion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  variant?: "watermark" | "stroke" | "gradient";
};

export function ArtisticText({ text, className = "", variant = "watermark" }: Props) {
  if (variant === "gradient") {
    return (
      <motion.span
        className={`font-display font-art-gradient select-none pointer-events-none ${className}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        {text}
      </motion.span>
    );
  }

  if (variant === "stroke") {
    return (
      <motion.span
        className={`font-art-stroke art-stroke-animate select-none ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        aria-hidden
      >
        {text}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={`font-art-watermark art-stroke-animate select-none pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      {text}
    </motion.span>
  );
}
