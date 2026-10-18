"use client";

import { useEffect, useRef } from "react";
import type * as T from "three";

/*
 * Hero background: "the floor that runs itself".
 *
 * A dark surface of rounded modules, lit like a product shot - soft brand-coloured
 * softboxes reflect off every bevel. Work routes itself across it: a lit task
 * travels tile to tile along an L-shaped path and lands with a small cyan
 * "done" pulse, several at once, with nobody touching anything. The cursor
 * lifts the tiles under it on a spring, a click sends a ripple, and on load
 * the floor assembles itself in a wave that follows the headline reveal.
 *
 * Real 3D (three.js, one instanced mesh), loaded lazily after first paint.
 * Renders only while on screen and the tab is visible, steps its resolution
 * down on slow frames, drops shadows and tiles on phones, draws one settled
 * frame under reduced motion, and leaves the plain dark section if WebGL fails.
 */

type Three = typeof T;

// Brand colours in linear space (the shader works in linear light).
const INDIGO = [0.125, 0.133, 0.879];
const CYAN = [0.016, 0.651, 0.855];

export default function HeroField({ active, start }: { active: boolean; start: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ active, start });
  state.current.active = active;
  state.current.start = start;

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let cancelled = false;
    let teardown = () => {};
    (async () => {
      try {
        const THREE = await import("three");
        const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
        if (cancelled) return;
        teardown = build(THREE, RoundedBoxGeometry, host, state.current);
      } catch {
        /* no WebGL: the section keeps its plain dark background */
      }
    })();
    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return <div ref={ref} aria-hidden style={{ position: "absolute", inset: 0 }} />;
}

function build(
  THREE: Three,
  RoundedBoxGeometry: typeof import("three/examples/jsm/geometries/RoundedBoxGeometry.js").RoundedBoxGeometry,
  host: HTMLDivElement,
  live: { active: boolean; start: boolean },
) {
  // No WebGL: leave the plain dark section rather than let three.js throw.
  const probe = document.createElement("canvas");
  if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return () => {};

  const phone = host.clientWidth < 760 || matchMedia("(pointer: coarse)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  let dpr = Math.min(devicePixelRatio || 1, phone ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x04040a, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !phone;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04040a);
  scene.fog = new THREE.Fog(0x04040a, 16, 38);

  // Studio environment: brand-coloured softboxes that every bevel reflects.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  const envGeo: T.BufferGeometry[] = [];
  const envMat: T.Material[] = [];
  const room = new THREE.BoxGeometry(30, 30, 30);
  const roomMat = new THREE.MeshBasicMaterial({ color: 0x030306, side: THREE.BackSide });
  env.add(new THREE.Mesh(room, roomMat));
  envGeo.push(room);
  envMat.push(roomMat);
  const softbox = (w: number, h: number, hex: number, power: number, pos: [number, number, number]) => {
    const g = new THREE.PlaneGeometry(w, h);
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(power), side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(...pos);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
    envGeo.push(g);
    envMat.push(m);
  };
  softbox(12, 3, 0xc4b5fd, 1.8, [10, 5, -9]); // lilac key, low and behind on the right
  softbox(14, 1.2, 0x6366f1, 1.6, [-12, 3, -2]); // indigo strip from the left
  softbox(5, 0.8, 0x22d3ee, 1.4, [8, 1.2, 9]); // cyan kicker, low and in front
  const envTex = pmrem.fromScene(env, 0.035).texture;
  scene.environment = envTex;

  // One raking spot from the right: it pools on that side and lets the left fall to black.
  const key = new THREE.SpotLight(0xdcd4ff, 2.8, 0, 0.4, 1, 0);
  key.position.set(19, 9, -7);
  key.target.position.set(6.5, 0, -3.5);
  key.castShadow = !phone;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 4;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x7c6cff, 0.35);
  rim.position.set(-6, 4, -12);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0x6366f1, 0x04040a, 0.06));
  // A small lilac lamp that follows the cursor and reveals the modules under it.
  const lamp = new THREE.PointLight(0xd4cbff, 0, 9, 2);
  lamp.position.set(0, 2.4, 0);
  scene.add(lamp);
  // Each task in flight carries a real light, so it spills colour onto the tiles around it.
  const taskLights = Array.from({ length: phone ? 1 : 3 }, () => {
    const l = new THREE.PointLight(0x6366f1, 0, 4.5, 2);
    scene.add(l);
    return { l, busy: false };
  });

  const floorGeo = new THREE.PlaneGeometry(200, 200);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x030307, roughness: 1 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.27;
  floor.receiveShadow = !phone;
  scene.add(floor);

  // The modules.
  const COLS = phone ? 22 : 30;
  const ROWS = phone ? 30 : 24;
  const N = COLS * ROWS;
  const geo = new RoundedBoxGeometry(0.88, 0.5, 0.88, 4, 0.12);
  const glow = new Float32Array(N);
  const hue = new Float32Array(N);
  const glowAttr = new THREE.InstancedBufferAttribute(glow, 1).setUsage(THREE.DynamicDrawUsage);
  const hueAttr = new THREE.InstancedBufferAttribute(hue, 1).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute("aGlow", glowAttr);
  geo.setAttribute("aHue", hueAttr);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x08080f,
    roughness: 0.62,
    metalness: 0.1,
    clearcoat: 0.4,
    clearcoatRoughness: 0.42,
  });
  // A lit task glows on the top face of its tile, indigo in transit, cyan when done.
  mat.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aGlow;\nattribute float aHue;\nvarying float vGlow;\nvarying float vHue;\nvarying float vTop;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvGlow = aGlow;\nvHue = aHue;\nvTop = smoothstep(0.5, 0.95, normal.y);");
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vGlow;\nvarying float vHue;\nvarying float vTop;")
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += mix(vec3(${INDIGO}), vec3(${CYAN}), vHue) * vGlow * (0.12 + 1.9 * vTop);`,
      );
  };
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = mesh.receiveShadow = !phone;
  mesh.frustumCulled = false;
  scene.add(mesh);

  // Per-tile state.
  const px = new Float32Array(N), pz = new Float32Array(N);
  const h = new Float32Array(N), v = new Float32Array(N);
  const lift = new Float32Array(N), delay = new Float32Array(N), phase = new Float32Array(N);
  const tint = new THREE.Color();
  for (let r = 0, i = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++, i++) {
      px[i] = c - (COLS - 1) / 2;
      pz[i] = r - (ROWS - 1) / 2;
      h[i] = reduced ? 0 : -3;
      phase[i] = Math.random() * Math.PI * 2;
      const k = 0.85 + Math.random() * 0.3; // a little variation in each module's finish
      mesh.setColorAt(i, tint.setRGB(k, k, k * 1.04));
    }
  }
  // The floor assembles as a wave from the far right corner.
  const ox = px[COLS - 1], oz = pz[0];
  for (let i = 0; i < N; i++) delay[i] = 0.1 + Math.hypot(px[i] - ox, (pz[i] - oz) * 1.15) * 0.045 + Math.random() * 0.08;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
  const look = new THREE.Vector3();
  const frame = () => {
    const w = host.clientWidth || 1, hh = host.clientHeight || 1;
    renderer.setSize(w, hh, false);
    camera.aspect = w / hh;
    camera.fov = camera.aspect < 0.9 ? 40 : 30; // phones: a wider lens so the floor reads as a floor, not a close-up
    // phones: slide the frame so the floor sits in the top half, above the type
    if (camera.aspect < 0.9) camera.setViewOffset(w, hh, 0, hh * 0.24, w, hh); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  // crane: 1 = start of the entrance (camera high and far back), 0 = resting framing
  const placeCamera = (scroll: number, crane = 0) => {
    const portrait = camera.aspect < 0.9;
    if (portrait) {
      camera.position.set(0, 8 + scroll * 3, 9.5 - scroll * 2);
      look.set(0, -0.3, -4.2);
      key.position.set(7, 8, -9);
      key.target.position.set(0.8, 0, -4.5);
      key.intensity = 8;
    } else {
      camera.position.set(-2.5, 6.2 + scroll * 3, 14.5 - scroll * 2);
      look.set(4, -0.4, 0);
      key.position.set(19, 9, -7);
      key.target.position.set(6.5, 0, -3.5);
    }
    camera.position.x -= crane * 2.5;
    camera.position.y += crane * 5.5;
    camera.position.z += crane * 4;
    camera.lookAt(look);
    camera.updateMatrixWorld();
  };
  frame();
  placeCamera(0);

  // Pointer: a ray onto the tile tops.
  const ndc = new THREE.Vector2(9, 9);
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.25);
  const hit = new THREE.Vector3();
  const cursor = { x: 0, z: 0, on: false, amt: 0 };
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    cursor.on = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    ndc.set(x * 2 - 1, -(y * 2 - 1));
  };
  const ripples: { x: number; z: number; t: number }[] = [];
  const onDown = (e: PointerEvent) => {
    if (!cursor.on || (e.target as Element)?.closest?.("a,button,input,textarea,select")) return;
    if (ripples.length < 4) ripples.push({ x: cursor.x, z: cursor.z, t: clock });
  };
  const onLeave = () => { cursor.on = false; };
  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  // Tasks: L-shaped routes through the visible part of the floor.
  const visible: number[] = [];
  const allowed = new Uint8Array(N);
  const pickVisible = () => {
    visible.length = 0;
    allowed.fill(0);
    const p = new THREE.Vector3();
    const portrait = camera.aspect < 0.9;
    for (let i = 0; i < N; i++) {
      p.set(px[i], 0.25, pz[i]).project(camera);
      const inView = Math.abs(p.x) < 0.92 && p.y > -0.85 && p.y < 0.75;
      const clearOfType = portrait ? p.y > 0.25 : p.x > -0.05; // keep the busiest light away from the headline
      if (inView && clearOfType) { visible.push(i); allowed[i] = 1; }
    }
  };
  pickVisible();
  type Route = { cells: number[]; head: number; speed: number; done: number; light: number };
  const routes: Route[] = [];
  const spawn = () => {
    if (!visible.length) return;
    const s = visible[(Math.random() * visible.length) | 0];
    let c = s % COLS, r = (s / COLS) | 0;
    const cells = [s];
    const dc = Math.random() < 0.5 ? -1 : 1, dr = Math.random() < 0.5 ? -1 : 1;
    const legs: [number, number, number][] = Math.random() < 0.5
      ? [[dc, 0, 3 + ((Math.random() * 6) | 0)], [0, dr, 2 + ((Math.random() * 5) | 0)]]
      : [[0, dr, 2 + ((Math.random() * 5) | 0)], [dc, 0, 3 + ((Math.random() * 6) | 0)]];
    for (const [ddc, ddr, n] of legs) {
      for (let k = 0; k < n; k++) {
        const nc = c + ddc, nr = r + ddr;
        if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS || !allowed[nr * COLS + nc]) break;
        c = nc; r = nr;
        cells.push(r * COLS + c);
      }
    }
    if (cells.length < 4) return;
    const light = taskLights.findIndex((t) => !t.busy);
    if (light >= 0) taskLights[light].busy = true;
    routes.push({ cells, head: 0, speed: 7 + Math.random() * 3, done: 0, light });
  };

  const dummy = new THREE.Object3D();
  let clock = 0, introAt = -1, nextSpawn = 0.3, raf = 0, running = false, last = 0;
  let slow = 0, frames = 0, scroll = 0;

  const step = (dt: number) => {
    const f = dt * 60;
    clock += dt;
    if (introAt < 0 && live.start) introAt = clock;
    const intro = introAt < 0 ? -1 : clock - introAt;

    scroll = Math.min(1, scrollY / (innerHeight || 1));
    const c = Math.min(1, Math.max(0, intro) / 2.8);
    placeCamera(scroll, reduced ? 0 : Math.pow(1 - c, 3)); // a slow crane down as the floor assembles

    if (cursor.on) {
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) { cursor.x += (hit.x - cursor.x) * 0.2 * f; cursor.z += (hit.z - cursor.z) * 0.2 * f; }
    }
    cursor.amt += ((cursor.on && !reduced ? 1 : 0) - cursor.amt) * Math.min(1, 0.06 * f);
    lamp.position.set(cursor.x, 2.4, cursor.z);
    lamp.intensity = 18 * cursor.amt;

    // Routes advance; each tile they cross lifts and lights, the last one lands cyan.
    if (intro > 1.4 && !reduced) {
      nextSpawn -= dt;
      if (nextSpawn <= 0 && routes.length < (phone ? 3 : 5)) { spawn(); nextSpawn = 0.55 + Math.random() * 0.9; }
    }
    for (let k = routes.length - 1; k >= 0; k--) {
      const rt = routes[k];
      const prev = Math.floor(rt.head);
      rt.head += rt.speed * dt;
      const now = Math.min(rt.cells.length - 1, Math.floor(rt.head));
      for (let j = Math.max(0, prev); j <= now; j++) {
        const i = rt.cells[j];
        const end = j === rt.cells.length - 1;
        lift[i] = Math.max(lift[i], end ? 0.55 : 0.26);
        glow[i] = Math.max(glow[i], end ? 2.4 : 1.15);
        hue[i] = end ? 1 : 0.15 * (j / rt.cells.length);
        if (end && !rt.done) {
          rt.done = 1;
          if (ripples.length < 6) ripples.push({ x: px[i], z: pz[i], t: clock - 0.05 });
        }
      }
      if (rt.light >= 0) {
        const L = taskLights[rt.light].l;
        const at = Math.min(rt.cells.length - 1, rt.head);
        const a = rt.cells[Math.floor(at)], b = rt.cells[Math.min(rt.cells.length - 1, Math.floor(at) + 1)];
        const t = at - Math.floor(at);
        L.position.set(px[a] + (px[b] - px[a]) * t, 0.95, pz[a] + (pz[b] - pz[a]) * t);
        if (!rt.done) { L.color.setRGB(INDIGO[0], INDIGO[1], INDIGO[2]); L.intensity = 6; }
        else { L.color.setRGB(CYAN[0], CYAN[1], CYAN[2]); L.intensity = 14 * Math.max(0, 1 - (rt.head - rt.cells.length) / 6); }
      }
      if (rt.done && rt.head > rt.cells.length + 6) {
        if (rt.light >= 0) { taskLights[rt.light].busy = false; taskLights[rt.light].l.intensity = 0; }
        routes.splice(k, 1);
      }
    }

    const decayGlow = Math.pow(0.955, f), decayLift = Math.pow(0.9, f), damp = Math.pow(0.8, f);
    for (let k = ripples.length - 1; k >= 0; k--) if (clock - ripples[k].t > 1.6) ripples.splice(k, 1);

    for (let i = 0; i < N; i++) {
      let target = 0;
      if (intro < delay[i]) target = -3;
      else target = reduced ? 0 : 0.03 * Math.sin(clock * 0.7 + phase[i]); // the floor breathes, barely

      const dx = px[i] - cursor.x, dz = pz[i] - cursor.z;
      const d2 = dx * dx + dz * dz;
      const near = cursor.amt * Math.exp(-d2 / 1.8);
      target += near * 0.42;
      for (const rp of ripples) {
        const age = clock - rp.t;
        const d = Math.hypot(px[i] - rp.x, pz[i] - rp.z) - age * 7;
        target += Math.exp(-d * d * 1.4) * 0.32 * (1 - age / 1.6);
      }
      target += lift[i];
      lift[i] *= decayLift;
      glow[i] = glow[i] * decayGlow + near * 0.02;

      v[i] += (target - h[i]) * 0.085 * f;
      v[i] *= damp;
      h[i] += v[i] * f;

      dummy.position.set(px[i], h[i], pz[i]);
      dummy.rotation.set(dz * near * 0.09, 0, -dx * near * 0.09); // lifted tiles lean away from the cursor
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    glowAttr.needsUpdate = true;
    hueAttr.needsUpdate = true;
  };

  const render = () => renderer.render(scene, camera);

  const loop = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    // Long frames: step resolution down, then drop shadows.
    if (++frames > 30) {
      slow = dt > 0.024 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 40) {
        slow = 0;
        if (dpr > 1) { dpr = Math.max(1, dpr - 0.25); renderer.setPixelRatio(dpr); frame(); }
        else if (renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; key.castShadow = false; mat.needsUpdate = true; }
      }
    }
    step(dt);
    render();
  };
  const sync = () => {
    const go = live.active && document.visibilityState === "visible" && !reduced;
    if (go && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!go && running) { running = false; cancelAnimationFrame(raf); }
  };
  const poll = setInterval(sync, 250);
  const ro = new ResizeObserver(() => {
    frame();
    placeCamera(scroll);
    pickVisible();
    if (!running) { if (reduced) step(0); render(); }
  });
  ro.observe(host);

  if (reduced) { for (let i = 0; i < N; i++) h[i] = 0; step(0); }
  render();
  sync();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    clearInterval(poll);
    ro.disconnect();
    removeEventListener("pointermove", onMove);
    removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointerleave", onLeave);
    [geo, floorGeo, ...envGeo].forEach((g) => g.dispose());
    [mat, floorMat, ...envMat].forEach((m) => m.dispose());
    envTex.dispose();
    pmrem.dispose();
    mesh.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
