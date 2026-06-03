"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { getThreeEngine } from "@/core/three/engine";
import { getSceneModule } from "@/core/three/scenes";
import type { SceneId, SceneState } from "@/core/three/types";

type ThreeEngineContextValue = {
  activate: (id: SceneId, container: HTMLElement, stateRef: RefObject<SceneState>) => void;
  deactivate: (id: SceneId) => void;
};

const ThreeEngineContext = createContext<ThreeEngineContextValue | null>(null);

export function ThreeEngineProvider({ children }: { children: React.ReactNode }) {
  const activeIdRef = useRef<SceneId | null>(null);

  const activate = useCallback(
    (id: SceneId, container: HTMLElement, stateRef: RefObject<SceneState>) => {
      const engine = getThreeEngine();
      activeIdRef.current = id;
      engine.bindState(stateRef);
      engine.mount(container);
      engine.loadModule(getSceneModule(id));
      engine.start();
    },
    [],
  );

  const deactivate = useCallback((id: SceneId) => {
    if (activeIdRef.current !== id) return;
    const engine = getThreeEngine();
    engine.stop();
    engine.clear();
    activeIdRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      try {
        const engine = getThreeEngine();
        engine.stop();
        engine.clear();
      } catch {
        // SSR / already disposed
      }
    };
  }, []);

  const value = useMemo(() => ({ activate, deactivate }), [activate, deactivate]);

  return <ThreeEngineContext.Provider value={value}>{children}</ThreeEngineContext.Provider>;
}

export function useThreeEngineContext() {
  const ctx = useContext(ThreeEngineContext);
  if (!ctx) {
    throw new Error("useThreeEngineContext must be used within ThreeEngineProvider");
  }
  return ctx;
}

export function usePageThreeScene(
  sceneId: SceneId,
  containerRef: RefObject<HTMLElement | null>,
  stateRef: RefObject<SceneState>,
) {
  const { activate, deactivate } = useThreeEngineContext();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    activate(sceneId, container, stateRef);
    return () => deactivate(sceneId);
  }, [activate, containerRef, deactivate, sceneId, stateRef]);
}
