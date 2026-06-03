export const identityVertexShader = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uReveal;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDisplacement;
varying float vFresnel;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.1;
    a *= 0.48;
  }
  return v;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  vec3 n = normalize(normal);

  float breathe = sin(uTime * 0.55) * 0.06;
  float nVal = fbm(pos * 1.35 + uTime * uSpeed * 0.22);
  float wave =
    sin(pos.x * 3.2 + uTime * uSpeed) * 0.14 +
    cos(pos.y * 3.8 + uTime * uSpeed * 0.75) * 0.11 +
    sin(pos.z * 2.6 + uTime * uSpeed * 1.05) * 0.09;

  vDisplacement = nVal * 0.42 + wave + breathe;
  pos += n * vDisplacement * (0.35 + uReveal * 0.65);

  vec3 worldNormal = normalize(normalMatrix * n);
  vNormal = worldNormal;
  vFresnel = pow(1.0 - abs(dot(worldNormal, vec3(0.0, 0.0, 1.0))), 2.4);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const identityFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uSecondary;
uniform float uTime;
uniform float uReveal;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDisplacement;
varying float vFresnel;

void main() {
  vec3 base = mix(uColor, uSecondary, vUv.y + vDisplacement * 0.35);
  float pulse = 0.5 + 0.5 * sin(uTime * 0.8);
  vec3 core = base * (0.65 + pulse * 0.12);
  vec3 rim = mix(uSecondary, vec3(1.0), 0.35) * vFresnel * 1.35;
  vec3 glow = core + rim + vDisplacement * 0.18;
  float alpha = (0.55 + vFresnel * 0.45) * uReveal;
  gl_FragColor = vec4(glow, alpha);
}
`;
