import type { ThreeEngine } from "./engine";

export type SceneId = "home" | "works" | "about";

export type SceneState = {
  scroll?: number;
  reveal?: number;
  intensity?: number;
  hoverBoost?: number;
  cameraZ?: number;
  mouseUV?: { x: number; y: number };
  explode?: number;
  pointer?: { x: number; y: number };
  activeColor?: string;
  activeSecondary?: string;
  activeSpeed?: number;
};

export type SceneModule = {
  id: SceneId;
  mount: (engine: ThreeEngine) => void;
  update: (engine: ThreeEngine, state: SceneState, elapsed: number) => void;
  unmount: (engine: ThreeEngine) => void;
};
