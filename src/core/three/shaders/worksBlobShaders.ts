export const worksBlobVertexShader = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uExplode;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec3 pos = position;

  float wave1 = sin(pos.x * 3.5 + uTime * uSpeed) * 0.18;
  float wave2 = cos(pos.y * 4.0 + uTime * uSpeed * 0.7) * 0.14;
  float wave3 = sin(pos.z * 2.8 + uTime * uSpeed * 1.1) * 0.12;
  vDisplacement = wave1 + wave2 + wave3;
  pos += normal * vDisplacement * (1.0 + uExplode * 2.5);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const worksBlobFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uSecondary;
uniform float uExplode;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);
  vec3 base = mix(uColor, uSecondary, vUv.y + vDisplacement * 0.5);
  vec3 glow = base + fresnel * (0.55 + uExplode * 0.4);
  float alpha = 0.72 + fresnel * 0.28 + uExplode * 0.15;
  gl_FragColor = vec4(glow, alpha);
}
`;
