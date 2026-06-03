export const homeAtmosphereVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const homeAtmosphereFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform vec2 uPointer;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec3 uColor;
uniform vec3 uSecondary;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.05;
    a *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = vUv;

  float dist = distance(uv, uMouse);
  float ripple = sin(dist * 20.0 - uTime * 2.4) * 0.012 * uIntensity;
  float rippleGlow = exp(-dist * 3.8) * 0.08 * uIntensity;

  vec2 p = uv + uPointer * 0.028;
  p += normalize(uv - uMouse + 0.001) * ripple * 1.6;

  float breathe = sin(uTime * 0.32) * 0.04;
  float n = fbm(p * 3.0 + uTime * 0.08);
  float wave = sin(p.y * 8.0 + uTime * 0.28) * 0.08;
  float strength = clamp((n * 0.48 + wave + breathe + rippleGlow) * uIntensity, 0.0, 0.85);

  float scrollLift = uScroll * 0.12;
  vec3 base = vec3(0.02, 0.02, 0.035);
  vec3 glow = uColor;
  vec3 secondary = uSecondary;

  vec3 color = mix(base, mix(glow, secondary, uv.x * 0.32), strength + scrollLift * 0.35);
  color += glow * rippleGlow * 0.45;
  color += glow * smoothstep(0.55, 0.92, strength) * 0.16;

  gl_FragColor = vec4(color, 0.9);
}
`;
