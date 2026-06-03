import * as THREE from "three";

export function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  const materials = Array.isArray(material) ? material : [material];
  for (const mat of materials) {
    for (const key of Object.keys(mat)) {
      const value = (mat as unknown as Record<string, unknown>)[key];
      if (value instanceof THREE.Texture) value.dispose();
    }
    mat.dispose();
  }
}

export function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (child.material) disposeMaterial(child.material);
    }
    if (child instanceof THREE.Points) {
      child.geometry?.dispose();
      if (child.material) disposeMaterial(child.material);
    }
  });
}

export function clearScene(scene: THREE.Scene) {
  for (let i = scene.children.length - 1; i >= 0; i -= 1) {
    const child = scene.children[i];
    scene.remove(child);
    disposeObject3D(child);
  }
  scene.fog = null;
  scene.background = null;
}
