import * as THREE from "three";

const CAMERA_ZONES = [
  { pos: new THREE.Vector3(0, 1.2, 8.5), look: new THREE.Vector3(0, 0.5, 0) },
  { pos: new THREE.Vector3(0, -2.8, 6.2), look: new THREE.Vector3(0, -3.2, 0) },
  { pos: new THREE.Vector3(0.9, -6.8, 5.2), look: new THREE.Vector3(0, -7.2, 0) },
  { pos: new THREE.Vector3(-0.6, -10.8, 4.6), look: new THREE.Vector3(0, -11.2, 0) },
  { pos: new THREE.Vector3(0, -14.5, 4.2), look: new THREE.Vector3(0, -14.8, 0) },
] as const;

export function sampleAboutCameraPath(scroll: number) {
  const clamped = THREE.MathUtils.clamp(scroll, 0, 1);
  const segments = CAMERA_ZONES.length - 1;
  const scaled = clamped * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  const t = scaled - index;
  const eased = t * t * (3 - 2 * t);

  const from = CAMERA_ZONES[index];
  const to = CAMERA_ZONES[index + 1];

  return {
    pos: from.pos.clone().lerp(to.pos, eased),
    look: from.look.clone().lerp(to.look, eased),
  };
}

export function getActiveZoneIndex(scroll: number) {
  const segments = CAMERA_ZONES.length - 1;
  return Math.min(Math.floor(scroll * segments + 0.001), segments);
}

export function zoneFocusOpacity(scroll: number, zoneIndex: number) {
  const segments = CAMERA_ZONES.length - 1;
  const focus = scroll * segments;
  const distance = Math.abs(focus - zoneIndex);
  return THREE.MathUtils.clamp(1 - distance * 1.35, 0, 1);
}
