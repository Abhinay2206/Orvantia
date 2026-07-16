"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Full-screen, mouse-reactive flowing aurora (domain-warped fbm).
   Rendered in clip space so it ignores the camera and always fills the view. */

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

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = (uv - 0.5);
    p.x *= uAspect;
    vec2 m = uMouse * 0.18;
    float t = uTime * 0.035;

    // Domain-warped flow
    float n1 = fbm(p * 1.7 + vec2(t, -t) + m);
    float n2 = fbm(p * 2.5 - vec2(t * 0.7) + n1 * 1.2 - m);
    float glow = smoothstep(0.2, 0.95, n1 * n2);

    vec3 base   = vec3(0.015, 0.015, 0.039);
    vec3 indigo = vec3(0.22, 0.24, 0.62);
    vec3 violet = vec3(0.42, 0.16, 0.66);
    vec3 cyan   = vec3(0.08, 0.55, 0.66);

    vec3 col = base;
    col = mix(col, indigo, smoothstep(0.32, 0.88, n1) * 0.7);
    col = mix(col, violet, smoothstep(0.55, 0.98, n2) * 0.55);
    col = mix(col, cyan,   glow * 0.4);

    // Keep the frame dark toward the edges
    float vig = smoothstep(1.15, 0.15, length(p));
    col *= mix(0.42, 1.0, vig);

    // subtle grain
    float g = hash(uv * uTime * 0.0006) * 0.02;
    col += g - 0.01;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function AuroraField({ mouseRef }: { mouseRef: React.MutableRefObject<[number, number]> }) {
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
