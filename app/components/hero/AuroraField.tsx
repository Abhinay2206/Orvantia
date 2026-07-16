"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Deep-space nebula with star field, volumetric light rays, and mouse reactivity.
   Rendered in clip space so it always fills the viewport regardless of camera. */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;

  // Better hash for star field
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  // Star field layer
  float stars(vec2 uv, float density) {
    vec2 cell = floor(uv * density);
    vec2 frac = fract(uv * density);

    float star = 0.0;
    float rnd = hash(cell);

    if (rnd > 0.96) {
      vec2 center = vec2(hash(cell + 0.1), hash2(cell + 0.2));
      float d = length(frac - center);
      float brightness = hash(cell + 0.5);
      float twinkle = sin(uTime * (1.0 + brightness * 3.0) + rnd * 6.28) * 0.3 + 0.7;
      star = smoothstep(0.04, 0.0, d) * brightness * twinkle;
    }
    return star;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5);
    p.x *= uAspect;
    vec2 m = uMouse * 0.12;
    float t = uTime * 0.025;

    // Deep space base — nearly black
    vec3 base = vec3(0.008, 0.008, 0.025);

    // Domain-warped nebula clouds — more concentrated
    float n1 = fbm(p * 1.4 + vec2(t, -t * 0.7) + m * 0.8);
    float n2 = fbm(p * 2.0 - vec2(t * 0.5) + n1 * 1.5 - m * 0.6);
    float n3 = fbm(p * 3.0 + vec2(-t * 0.3, t * 0.4) + n2 * 0.8);

    // Nebula color channels
    vec3 indigo = vec3(0.18, 0.20, 0.55);
    vec3 violet = vec3(0.35, 0.12, 0.55);
    vec3 cyan   = vec3(0.06, 0.42, 0.55);
    vec3 deep   = vec3(0.10, 0.04, 0.28);

    vec3 col = base;
    col = mix(col, deep,   smoothstep(0.25, 0.75, n1) * 0.5);
    col = mix(col, indigo, smoothstep(0.35, 0.9, n1) * 0.45);
    col = mix(col, violet, smoothstep(0.55, 0.98, n2) * 0.4);
    col = mix(col, cyan,   smoothstep(0.6, 1.0, n1 * n2) * 0.35);

    // Volumetric light rays from center
    vec2 rayCenter = vec2(0.0, -0.1) + m * 0.3;
    float rayDist = length(p - rayCenter);
    float rayAngle = atan(p.y - rayCenter.y, p.x - rayCenter.x);
    float rays = smoothstep(0.4, 0.0, rayDist) *
                 (sin(rayAngle * 8.0 + t * 2.0) * 0.3 + 0.7) *
                 smoothstep(0.0, 0.15, rayDist);
    col += vec3(0.25, 0.28, 0.65) * rays * 0.2;

    // Central glow — emanating from where the AI core sits
    float centerGlow = exp(-rayDist * rayDist * 3.5);
    col += vec3(0.22, 0.24, 0.6) * centerGlow * 0.3;

    // Star field — multiple layers at different densities
    float starLayer1 = stars(uv + m * 0.02, 80.0);
    float starLayer2 = stars(uv * 1.3 + m * 0.01 + 0.5, 120.0);
    float starLayer3 = stars(uv * 0.7 - m * 0.015 + 0.3, 50.0);
    float allStars = starLayer1 + starLayer2 * 0.6 + starLayer3 * 0.4;
    col += vec3(0.9, 0.92, 1.0) * allStars * 0.8;

    // Heavy vignette — dark at edges
    float vig = smoothstep(1.3, 0.1, length(p));
    col *= mix(0.25, 1.0, vig);

    // Top and bottom fade to near-black
    float vertFade = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.75, uv.y);
    col *= mix(0.3, 1.0, vertFade);

    // Subtle grain
    float g = hash(uv * uTime * 0.0004) * 0.018;
    col += g - 0.009;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

export default function DeepSpaceField({ mouseRef }: { mouseRef: React.MutableRefObject<[number, number]> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uAspect.value = size.width / size.height;
    const [mx, my] = mouseRef.current;
    target.current.set(mx, -my);
    uniforms.uMouse.value.lerp(target.current, 0.04);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
