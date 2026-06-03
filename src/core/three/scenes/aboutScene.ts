import {
  getThemePrimaryHex,
  getThemeSecondaryHex,
} from "@/lib/color/themeStore";
import * as THREE from "three";
import { disposeObject3D } from "../dispose";
import type { ThreeEngine } from "../engine";
import { sampleAboutCameraPath } from "@/lib/aboutZones";
import {
  identityFragmentShader,
  identityVertexShader,
} from "../shaders/identityBlobShaders";
import type { SceneModule, SceneState } from "../types";

function createParticles(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 36 - 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: "#c4b5fd",
    size: 0.03,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  return new THREE.Points(geometry, material);
}

export function createAboutSceneModule(): SceneModule {
  let root: THREE.Group | null = null;
  let blob: THREE.Mesh | null = null;
  let blobMaterial: THREE.ShaderMaterial | null = null;
  let particles: THREE.Points | null = null;
  let particleMaterial: THREE.PointsMaterial | null = null;
  const cameraPos = new THREE.Vector3(0, 1.2, 8.5);
  const cameraLook = new THREE.Vector3(0, 0.5, 0);
  const smoothPos = new THREE.Vector3(0, 1.2, 8.5);
  const smoothLook = new THREE.Vector3(0, 0.5, 0);
  const smoothPointer = { x: 0, y: 0 };

  const smoothColor = new THREE.Color(getThemePrimaryHex());
  const smoothSecondary = new THREE.Color(getThemeSecondaryHex());

  return {
    id: "about",

    mount(engine) {
      root = new THREE.Group();
      engine.camera.fov = 42;
      engine.camera.near = 0.1;
      engine.camera.far = 40;
      engine.scene.background = new THREE.Color("#050505");
      engine.scene.fog = new THREE.Fog("#050505", 5, 16);

      particles = createParticles(4200);
      particleMaterial = particles.material as THREE.PointsMaterial;
      root.add(particles);

      blobMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: 0.85 },
          uReveal: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uColor: { value: smoothColor.clone() },
          uSecondary: { value: smoothSecondary.clone() },
        },
        vertexShader: identityVertexShader,
        fragmentShader: identityFragmentShader,
        transparent: true,
        depthWrite: false,
      });

      blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 80), blobMaterial);
      root.add(blob);

      root.add(new THREE.AmbientLight(0xffffff, 0.22));
      const lightA = new THREE.PointLight(getThemePrimaryHex(), 1.05, 30);
      lightA.position.set(4, 3, 5);
      const lightB = new THREE.PointLight(getThemeSecondaryHex(), 0.65, 30);
      lightB.position.set(-4, -2, 3);
      const lightC = new THREE.PointLight(getThemeSecondaryHex(), 0.32, 30);
      lightC.position.set(0, -12, 2);
      root.add(lightA, lightB, lightC);
      engine.scene.add(root);
    },

    update(engine, state: SceneState, elapsed) {
      const scroll = THREE.MathUtils.clamp(state.scroll ?? 0, 0, 1);
      const reveal = THREE.MathUtils.clamp(state.reveal ?? 0, 0, 1);
      const pointer = state.pointer ?? { x: 0, y: 0 };

      smoothPointer.x = THREE.MathUtils.lerp(smoothPointer.x, pointer.x, 0.06);
      smoothPointer.y = THREE.MathUtils.lerp(smoothPointer.y, pointer.y, 0.06);

      const target = sampleAboutCameraPath(scroll);
      smoothPos.lerp(target.pos, 0.07);
      smoothLook.lerp(target.look, 0.07);

      engine.camera.position.set(
        smoothPos.x + smoothPointer.x * 0.45,
        smoothPos.y + smoothPointer.y * 0.28,
        smoothPos.z,
      );
      cameraLook.set(
        smoothLook.x + smoothPointer.x * 0.2,
        smoothLook.y + smoothPointer.y * 0.15,
        smoothLook.z,
      );
      engine.camera.lookAt(cameraLook);

      if (blob && blobMaterial) {
        smoothColor.lerp(new THREE.Color(getThemePrimaryHex()), 0.04);
        smoothSecondary.lerp(new THREE.Color(getThemeSecondaryHex()), 0.04);
        blobMaterial.uniforms.uColor.value.copy(smoothColor);
        blobMaterial.uniforms.uSecondary.value.copy(smoothSecondary);

        blobMaterial.uniforms.uTime.value = elapsed;
        blobMaterial.uniforms.uReveal.value = reveal;

        const targetY = THREE.MathUtils.lerp(0, -12, scroll);
        blob.position.y = THREE.MathUtils.lerp(blob.position.y, targetY, 0.06);
        blob.position.x = smoothPointer.x * 0.35;
        blob.position.z = smoothPointer.y * 0.2;
        blob.rotation.y = elapsed * 0.12 + smoothPointer.x * 0.35;
        blob.rotation.x = Math.sin(elapsed * 0.2) * 0.15 + smoothPointer.y * 0.12;
        blob.scale.setScalar(THREE.MathUtils.lerp(0.01, 1.15, reveal));
      }

      if (particles && particleMaterial) {
        particles.rotation.y += 0.00035;
        particles.rotation.x = Math.sin(elapsed * 0.08) * 0.03;
        particleMaterial.opacity = THREE.MathUtils.lerp(
          particleMaterial.opacity,
          0.22 + reveal * 0.45,
          0.04,
        );
        particleMaterial.size = THREE.MathUtils.lerp(
          particleMaterial.size,
          0.012 + reveal * 0.028,
          0.04,
        );
      }
    },

    unmount(engine) {
      if (root) {
        engine.scene.remove(root);
        disposeObject3D(root);
      }
      root = null;
      particles = null;
      particleMaterial = null;
      blob = null;
      blobMaterial = null;
    },
  };
}
