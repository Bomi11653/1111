import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import {
  getThemePrimaryRgb,
  getThemeSecondaryRgb,
} from "@/lib/color/themeStore";
import { disposeObject3D } from "../dispose";
import type { ThreeEngine } from "../engine";
import {
  homeAtmosphereFragmentShader,
  homeAtmosphereVertexShader,
} from "../shaders/homeAtmosphereShaders";
import type { SceneModule, SceneState } from "../types";

export function createHomeSceneModule(): SceneModule {
  let root: THREE.Group | null = null;
  let material: THREE.ShaderMaterial | null = null;
  let composer: EffectComposer | null = null;
  const smoothPointer = { x: 0, y: 0 };
  const smoothMouse = { x: 0.5, y: 0.5 };
  const smoothColor = new THREE.Vector3(...getThemePrimaryRgb());
  const smoothSecondary = new THREE.Vector3(...getThemeSecondaryRgb());
  let smoothIntensity = 0.38;
  let smoothScroll = 0;
  let smoothCameraZ = 2.65;

  return {
    id: "home",

    mount(engine) {
      root = new THREE.Group();
      engine.camera.fov = 50;
      engine.camera.near = 0.1;
      engine.camera.far = 20;
      engine.camera.position.set(0, 0, 2.65);
      engine.scene.background = null;

      const primary = getThemePrimaryRgb();
      const secondary = getThemeSecondaryRgb();

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.38 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uScroll: { value: 0 },
          uColor: { value: new THREE.Vector3(...primary) },
          uSecondary: { value: new THREE.Vector3(...secondary) },
        },
        vertexShader: homeAtmosphereVertexShader,
        fragmentShader: homeAtmosphereFragmentShader,
        transparent: true,
        depthWrite: false,
      });

      const plane = new THREE.Mesh(new THREE.PlaneGeometry(14, 10, 1, 1), material);
      root.add(plane);
      engine.scene.add(root);
      engine.scene.userData.shader = material;

      const enableBloom = typeof window !== "undefined" && window.innerWidth >= 768;
      if (enableBloom && engine.renderer) {
        composer = new EffectComposer(engine.renderer);
        composer.addPass(new RenderPass(engine.scene, engine.camera));
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.32, 0.75, 0.14));
        engine.setComposer(composer);
      }
    },

    update(_engine, state: SceneState, elapsed) {
      if (!material) return;

      const pointer = state.pointer ?? { x: 0, y: 0 };
      const mouseUV = state.mouseUV ?? { x: 0.5, y: 0.5 };
      const baseIntensity = state.intensity ?? 0.38;
      const hoverBoost = state.hoverBoost ?? 0;
      const targetIntensity = Math.min(baseIntensity + hoverBoost, 0.82);
      const targetScroll = THREE.MathUtils.clamp(state.scroll ?? 0, 0, 1);
      const targetCameraZ = state.cameraZ ?? 2.65;

      const [tr, tg, tb] = getThemePrimaryRgb();
      const [sr, sg, sb] = getThemeSecondaryRgb();

      smoothPointer.x = THREE.MathUtils.lerp(smoothPointer.x, pointer.x * 0.28, 0.045);
      smoothPointer.y = THREE.MathUtils.lerp(smoothPointer.y, pointer.y * 0.2, 0.045);
      smoothMouse.x = THREE.MathUtils.lerp(smoothMouse.x, mouseUV.x, 0.08);
      smoothMouse.y = THREE.MathUtils.lerp(smoothMouse.y, mouseUV.y, 0.08);
      smoothIntensity = THREE.MathUtils.lerp(smoothIntensity, targetIntensity, 0.055);
      smoothScroll = THREE.MathUtils.lerp(smoothScroll, targetScroll, 0.05);
      smoothCameraZ = THREE.MathUtils.lerp(smoothCameraZ, targetCameraZ, 0.045);
      smoothColor.lerp(new THREE.Vector3(tr, tg, tb), 0.04);
      smoothSecondary.lerp(new THREE.Vector3(sr, sg, sb), 0.04);

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uIntensity.value = smoothIntensity;
      material.uniforms.uPointer.value.set(smoothPointer.x, smoothPointer.y);
      material.uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y);
      material.uniforms.uScroll.value = smoothScroll;
      material.uniforms.uColor.value.copy(smoothColor);
      material.uniforms.uSecondary.value.copy(smoothSecondary);

      _engine.camera.position.z = smoothCameraZ;
      _engine.camera.position.x = THREE.MathUtils.lerp(_engine.camera.position.x, smoothPointer.x * 0.08, 0.04);
      _engine.camera.position.y = THREE.MathUtils.lerp(_engine.camera.position.y, smoothPointer.y * 0.06, 0.04);
      _engine.camera.lookAt(0, 0, 0);
    },

    unmount(engine) {
      engine.setComposer(null);
      composer = null;
      delete engine.scene.userData.shader;
      if (root) {
        engine.scene.remove(root);
        disposeObject3D(root);
      }
      root = null;
      material = null;
    },
  };
}
