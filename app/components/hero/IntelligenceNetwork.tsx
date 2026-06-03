"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Constants ──────────────────────────────────────────── */
const NODE_COUNT = 750;
const CONNECT_DIST = 3.8;
const MAX_CONNECTIONS = 3;

/* ─── Build sparse connection lines ─────────────────────── */
function buildLines(pos: Float32Array, count: number) {
  const lines: number[] = [];
  const cols: number[] = [];

  for (let i = 0; i < count; i++) {
    const ax = pos[i * 3], ay = pos[i * 3 + 1], az = pos[i * 3 + 2];
    let c = 0;
    for (let j = i + 1; j < count && c < MAX_CONNECTIONS; j++) {
      const dx = ax - pos[j * 3], dy = ay - pos[j * 3 + 1], dz = az - pos[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < CONNECT_DIST * CONNECT_DIST) {
        lines.push(ax, ay, az, pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        // Fade by distance
        const fade = 1 - Math.sqrt(d) / CONNECT_DIST;
        cols.push(fade, fade, fade, fade, fade, fade);
        c++;
      }
    }
  }
  return {
    positions: new Float32Array(lines),
    colors: new Float32Array(cols),
  };
}

/* ─── Node particles ─────────────────────────────────────── */
export function NodeCloud({ mouseRef }: { mouseRef: React.MutableRefObject<[number, number]> }) {
  const groupRef = useRef<THREE.Group>(null);
  const t = useRef(0);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    const col = new Float32Array(NODE_COUNT * 3);
    const siz = new Float32Array(NODE_COUNT);

    for (let i = 0; i < NODE_COUNT; i++) {
      // Spherical distribution, denser toward center
      const r = Math.pow(Math.random(), 0.6) * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Color: bright white, indigo, violet, cyan — keep saturated for bloom
      const t2 = Math.random();
      if (t2 < 0.45) {
        col[i * 3] = 1.0; col[i * 3 + 1] = 1.0; col[i * 3 + 2] = 1.0;   // white
      } else if (t2 < 0.65) {
        col[i * 3] = 0.45; col[i * 3 + 1] = 0.40; col[i * 3 + 2] = 1.0;  // indigo
      } else if (t2 < 0.8) {
        col[i * 3] = 0.65; col[i * 3 + 1] = 0.20; col[i * 3 + 2] = 1.0;  // violet
      } else {
        col[i * 3] = 0.05; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 1.0;  // cyan
      }

      siz[i] = Math.random() * 3.0 + 0.4;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, []);

  const lines = useMemo(() => buildLines(positions, NODE_COUNT), [positions]);

  useFrame((_, delta) => {
    t.current += delta * 0.12;
    if (!groupRef.current) return;
    const [mx, my] = mouseRef.current;
    groupRef.current.rotation.y = t.current * 0.04 + mx * 0.25;
    groupRef.current.rotation.x = my * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Connection mesh */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lines.colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.055}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Node points */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}


/* ─── Camera controller ──────────────────────────────────── */
export function CameraRig({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<[number, number]>;
}) {
  const { camera } = useThree();
  const pos = useRef({ x: 0, y: 0, z: 30 });

  useFrame((_, delta) => {
    const [mx, my] = mouseRef.current;
    const tx = mx * 5;
    const ty = -my * 2.5;

    pos.current.x += (tx - pos.current.x) * delta * 1.8;
    pos.current.y += (ty - pos.current.y) * delta * 1.8;

    camera.position.set(pos.current.x, pos.current.y, pos.current.z);
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}
