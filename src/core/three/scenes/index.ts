import { createAboutSceneModule } from "./aboutScene";
import { createHomeSceneModule } from "./homeScene";
import { createWorksSceneModule } from "./worksScene";
import type { SceneId, SceneModule } from "../types";

const factories: Record<SceneId, () => SceneModule> = {
  home: createHomeSceneModule,
  works: createWorksSceneModule,
  about: createAboutSceneModule,
};

export function getSceneModule(id: SceneId) {
  return factories[id]();
}
