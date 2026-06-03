import * as THREE from "three";
import { getThemePrimaryHex, getThemeSecondaryHex } from "@/lib/color/themeStore";
import { disposeObject3D } from "../dispose";
import type { ThreeEngine } from "../engine";
import {
  worksBlobFragmentShader,
  worksBlobVertexShader,
} from "../shaders/worksBlobShaders";
import type { SceneModule, SceneState } from "../types";

export function createWorksSceneModule(): SceneModule {
  let root: THREE.Group | null = null;
  let mesh: THREE.Mesh | null = null;
  let material: THREE.ShaderMaterial | null = null;
  let lightA: THREE.PointLight | null = null;
  let lightB: THREE.PointLight | null = null;
  const currentColor = new THREE.Color(getThemePrimaryHex());
  const currentSecondary = new THREE.Color(getThemeSecondaryHex());
  let currentSpeed = 1.05;
  let explode = 0;

  return {
    id: "works",

    mount(engine) {
      root = new THREE.Group();
      engine.camera.fov = 45;
      engine.camera.near = 0.1;
      engine.camera.far = 20;
      engine.camera.position.set(0, 0, 3.2);
      engine.camera.lookAt(0, 0, 0);
      engine.scene.background = null;

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: currentColor.clone() },
          uSecondary: { value: currentSecondary.clone() },
          uSpeed: { value: currentSpeed },
          uExplode: { value: 0 },
        },
        vertexShader: worksBlobVertexShader,
        fragmentShader: worksBlobFragmentShader,
        transparent: true,
        depthWrite: false,
      });

      mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 64), material);
      root.add(mesh);

      root.add(new THREE.AmbientLight(0xffffff, 0.32));
      lightA = new THREE.PointLight(getThemePrimaryHex(), 0.95, 20);
      lightA.position.set(4, 4, 4);
      lightB = new THREE.PointLight(getThemeSecondaryHex(), 0.48, 20);
      lightB.position.set(-3, -2, 2);
      root.add(lightA, lightB);
      engine.scene.add(root);
    },

    update(_engine, state: SceneState, elapsed) {
      if (!mesh || !material) return;

      const targetColor = state.activeColor ?? getThemePrimaryHex();
      const targetSecondary = state.activeSecondary ?? getThemeSecondaryHex();
      const targetSpeed = state.activeSpeed ?? 1.05;
      const targetExplode = state.explode ?? 0;

      currentColor.lerp(new THREE.Color(targetColor), 0.045);
      currentSecondary.lerp(new THREE.Color(targetSecondary), 0.045);
      currentSpeed += (targetSpeed - currentSpeed) * 0.05;
      explode += (targetExplode - explode) * 0.12;

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uColor.value.copy(currentColor);
      material.uniforms.uSecondary.value.copy(currentSecondary);
      material.uniforms.uSpeed.value = currentSpeed;
      material.uniforms.uExplode.value = explode;

      if (lightA) {
        lightA.color.set(targetColor);
        lightA.intensity = 0.95 + explode * 0.55;
      }
      if (lightB) lightB.color.set(targetSecondary);

      mesh.rotation.y = elapsed * (0.08 + explode * 0.2);
      mesh.rotation.x = Math.sin(elapsed * 0.15) * 0.12;
      mesh.scale.setScalar(1 + explode * 0.35);
    },

    unmount(engine) {
      if (root) {
        engine.scene.remove(root);
        disposeObject3D(root);
      }
      root = null;
      mesh = null;
      material = null;
      lightA = null;
      lightB = null;
    },
  };
}
