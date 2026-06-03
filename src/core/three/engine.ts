import * as THREE from "three";
import type { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { clearScene } from "./dispose";
import type { SceneModule, SceneState } from "./types";

type UpdateFn = (elapsed: number) => void;

export class ThreeEngine {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 40);
  readonly renderer: THREE.WebGLRenderer;
  readonly clock = new THREE.Clock();

  private container: HTMLElement | null = null;
  private frameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private updateFn: UpdateFn | null = null;
  private activeModule: SceneModule | null = null;
  private stateRef: { current: SceneState } = { current: {} };
  private pointer = { x: 0, y: 0 };
  private composer: EffectComposer | null = null;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";

    if (typeof window !== "undefined") {
      window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    }
  }

  private onPointerMove = (event: PointerEvent) => {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  bindState(stateRef: { current: SceneState }) {
    this.stateRef = stateRef;
  }

  setComposer(composer: EffectComposer | null) {
    if (this.composer) {
      this.composer.dispose();
    }
    this.composer = composer;
    if (composer && this.container) {
      const width = Math.max(this.container.clientWidth, 1);
      const height = Math.max(this.container.clientHeight, 1);
      composer.setSize(width, height);
    }
  }

  mount(container: HTMLElement) {
    if (this.container === container && container.contains(this.renderer.domElement)) {
      this.resize();
      return;
    }

    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }

    this.container = container;
    container.appendChild(this.renderer.domElement);

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }

  loadModule(module: SceneModule) {
    this.stop();
    this.clear();
    this.activeModule = module;
    module.mount(this);
    this.updateFn = (elapsed) => {
      const state = {
        ...this.stateRef.current,
        pointer: this.stateRef.current.pointer ?? this.pointer,
      };
      module.update(this, state, elapsed);
    };
  }

  start() {
    if (this.frameId !== null) return;
    this.clock.start();
    this.animate();
  }

  stop() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  clear() {
    this.setComposer(null);
    this.activeModule?.unmount(this);
    this.activeModule = null;
    this.updateFn = null;
    clearScene(this.scene);
  }

  dispose() {
    this.stop();
    this.clear();
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
    if (typeof window !== "undefined") {
      window.removeEventListener("pointermove", this.onPointerMove);
    }
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);
    const elapsed = this.clock.getElapsedTime();
    this.updateFn?.(elapsed);
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private resize = () => {
    if (!this.container) return;
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.composer?.setSize(width, height);
  };
}

let engineInstance: ThreeEngine | null = null;

export function getThreeEngine() {
  if (typeof window === "undefined") {
    throw new Error("ThreeEngine is browser-only");
  }
  if (!engineInstance) {
    engineInstance = new ThreeEngine();
  }
  return engineInstance;
}

export function disposeThreeEngine() {
  engineInstance?.dispose();
  engineInstance = null;
}
