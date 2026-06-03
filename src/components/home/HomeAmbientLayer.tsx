"use client";

import { useRef, type RefObject } from "react";
import { usePageThreeScene } from "@/context/ThreeEngineContext";
import type { SceneState } from "@/core/three/types";

type Props = {
  stateRef: RefObject<SceneState>;
};

export function HomeAmbientLayer({ stateRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  usePageThreeScene("home", containerRef, stateRef);

  return (
    <div
      ref={containerRef}
      className="home-ambient fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
}
