"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { DURATION, EASE_OUT } from "@/lib/motion";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  once?: boolean;
};

export function SplitReveal({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <Tag ref={ref as never} className={`split-reveal overflow-hidden ${className}`}>
      <span className="inline-flex flex-wrap">
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
            initial={{ y: "120%", opacity: 0, rotateX: 40 }}
            animate={
              inView
                ? { y: "0%", opacity: 1, rotateX: 0 }
                : { y: "120%", opacity: 0, rotateX: 40 }
            }
            transition={{
              duration: DURATION.reveal,
              delay: delay + i * 0.04,
              ease: EASE_OUT,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </Tag>
  );
}
