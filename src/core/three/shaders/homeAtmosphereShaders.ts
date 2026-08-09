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
uniform float uHoverBoost;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec3 uFlowColor;
varying vec2 vUv;

float mouseNoise(vec2 uv) {
  return sin(uv.x * 8.0 + uTime * 0.5 + uMouse.x * 3.0)
       * cos(uv.y * 8.0 + uTime * 0.4 + uMouse.y * 3.0);
}

void main() {
  vec2 uv = vUv;
  float n = mouseNoise(uv);

  float mask = smoothstep(0.82, 1.0, n) * uIntensity;

  vec2 toMouse = uMouse - uv;
  float mouseDist = length(toMouse);
  float mouseRipple = exp(-mouseDist * 3.2) * (0.08 + uHoverBoost * 0.14);
  float mouseWake = sin(mouseDist * 14.0 - uTime * 1.8) * mouseRipple * 0.35;
  mask += mouseRipple + mouseWake;

  mask = clamp(mask, 0.0, 0.24 + uHoverBoost * 0.06);

  vec3 blackBase = vec3(0.01, 0.01, 0.015);
  vec3 flow = uFlowColor * mask;

  gl_FragColor = vec4(blackBase + flow * (1.0 + uScroll * 0.04), 1.0);
}
`;
