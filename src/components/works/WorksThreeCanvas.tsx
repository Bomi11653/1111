"use client";

import { useMemo, useRef } from "react";
import { usePageTransitionOptional } from "@/context/PageTransitionContext";
import { usePageThreeScene } from "@/context/ThreeEngineContext";
import type { SceneState } from "@/core/three/types";
import type { ImmersiveVisual } from "@/data/immersiveProjects";
import { getProjectColorsFromThemeHue } from "@/lib/color/projectColors";
import { useTheme } from "@/lib/color/ThemeProvider";

type Props = {
  active: ImmersiveVisual;
};

export function WorksThreeCanvas({ active }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneState>({});
  const transition = usePageTransitionOptional();
  const theme = useTheme();

  const colors = useMemo(
    () => getProjectColorsFromThemeHue(theme.hue, active.hueOffset),
    [theme.hue, active.hueOffset],
  );

  stateRef.current = {
    activeColor: colors.color,
    activeSecondary: colors.secondaryColor,
    activeSpeed: active.speed,
    explode: transition?.explode ?? 0,
  };

  usePageThreeScene("works", containerRef, stateRef);

  return (
    <div ref={containerRef} className="works-scene relative h-full w-full min-h-[320px] lg:min-h-0" />
  );
}
