import * as THREE from "three";
import type { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { clearScene } from "./dispose";
import type { SceneModule, SceneState } from "./types";

type UpdateFn = (elapsed: number) => void;

export class ThreeEngine {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 40);
  readonly renderer: THREE.WebGLRenderer | null;
  readonly clock = new THREE.Clock();
  readonly webglAvailable: boolean;

  private container: HTMLElement | null = null;
  private frameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private updateFn: UpdateFn | null = null;
  private activeModule: SceneModule | null = null;
  private stateRef: { current: SceneState } = { current: {} };
  private pointer = { x: 0, y: 0 };
  private composer: EffectComposer | null = null;

  constructor() {
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(1);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    } catch (error) {
      console.warn("[ThreeEngine] WebGL unavailable:", error);
    }

    this.renderer = renderer;
    this.webglAvailable = renderer !== null;

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
    if (!this.renderer) return;

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
    if (!this.renderer) return;

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
    if (!this.renderer || this.frameId !== null) return;
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
    this.renderer?.dispose();
    if (typeof window !== "undefined") {
      window.removeEventListener("pointermove", this.onPointerMove);
    }
  }

  private animate = () => {
    if (!this.renderer) return;

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
    if (!this.container || !this.renderer) return;
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    const dprCap = width < 768 ? 1.5 : 1.75;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.composer?.setSize(width, height);
  };
}

let engineInstance: ThreeEngine | null = null;

export function getThreeEngine(): ThreeEngine | null {
  if (typeof window === "undefined") return null;
  if (!engineInstance) {
    engineInstance = new ThreeEngine();
    if (!engineInstance.webglAvailable) {
      engineInstance.dispose();
      engineInstance = null;
      return null;
    }
  }
  return engineInstance;
}

export function disposeThreeEngine() {
  engineInstance?.dispose();
  engineInstance = null;
}
