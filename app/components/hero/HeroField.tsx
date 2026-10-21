"use client";

import { useEffect, useRef } from "react";
import type * as T from "three";
import { loadKeyboard, type KeyboardModel } from "./KeyboardModel";

/*
 * Hero background: "the floor that runs itself".
 *
 * It opens as one continuous shot of a real modelled keyboard: a low macro on
 * the keys with shallow focus, then a crane up to a straight top-down product
 * view while the page scroll types R-U-N-S, space, I-T-S-E-L-F (each key presses and
 * lights lilac from within), then a pull-back into the hero framing as the
 * floor powers up in a ripple around the board.
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
const LILAC = [0.552, 0.462, 0.982];

// The keyboard shot, in hero-runway scroll progress (0 = top of the hero, 1 = end of its pinned run).
// The keys type the promise; the hero headline then completes the sentence ("Software that runs itself.")
export const WORD = "RUNS ITSELF";
// when each key goes down (the space is the spacebar): a typist's rhythm - a breath before
// the space, the second word quicker, and a held beat before the last key
const KEY_T = [0.09, 0.124, 0.157, 0.19, 0.238, 0.282, 0.312, 0.341, 0.369, 0.398, 0.452];
export const keyAt = (k: number) => KEY_T[k];
export const IGNITE = 0.49;                         // the finished word ignites: a shockwave crosses the board
export const PULL: [number, number] = [0.6, 0.94];  // camera pulls back from the keys to the hero framing
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const band = (a: number, b: number, x: number) => ease((x - a) / (b - a));
// Monotone cubic (Fritsch-Carlson) through (xs, ys): never overshoots, arrives at the last point at rest.
export const monotone = (xs: number[], ys: number[]) => {
  const n = xs.length, d: number[] = [], m: number[] = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  m[n - 1] = 0;
  for (let i = 0; i < n - 1; i++) {
    const a0 = m[i] / d[i], b0 = m[i + 1] / d[i], hh = a0 * a0 + b0 * b0;
    if (hh > 9) { const t = 3 / Math.sqrt(hh); m[i] = t * a0 * d[i]; m[i + 1] = t * b0 * d[i]; }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const hx = xs[i + 1] - xs[i], t = (x - xs[i]) / hx, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * hx * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * hx * m[i + 1];
  };
};

// The lens pass (see build): depth of field gathered over a golden-angle disc, read from a mip
// level that fills the gaps between taps; a soft glow from the blurred mips above a threshold;
// a short horizontal (anamorphic) streak from the brightest lights; then the usual tone mapping.
const LENS = (taps: number) => `
#include <packing>
uniform sampler2D tColor, tDepth;
uniform vec2 uRes;
uniform float uNear, uFar, uFocus, uAperture, uMaxCoc, uGlow, uStreak;
varying vec2 vUv;
float dist(vec2 uv) { return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, uNear, uFar); }
float coc(float d) { return min(uMaxCoc, uAperture * abs(d - uFocus) / max(d, 0.001)); }
void main() {
  vec3 col = textureLod(tColor, vUv, 0.0).rgb;
  float c0 = coc(dist(vUv));
  if (c0 > 0.6) {
    float lod = log2(max(1.0, c0 / ${Math.sqrt(taps).toFixed(2)}));
    vec3 acc = col;
    float wsum = 1.0;
    for (int i = 0; i < ${taps}; i++) {
      float fi = float(i) + 0.5;
      float r = sqrt(fi / ${taps}.0) * c0;
      float a = fi * 2.39996323;
      vec2 uv = vUv + vec2(cos(a), sin(a)) * r / uRes;
      float w = clamp(coc(dist(uv)) - r + 1.5, 0.0, 1.0); // a sample counts only if its own blur reaches here
      acc += textureLod(tColor, uv, lod).rgb * w;
      wsum += w;
    }
    col = acc / wsum;
  }
  vec3 g = max(textureLod(tColor, vUv, 3.0).rgb - 0.8, 0.0) * 0.5
         + max(textureLod(tColor, vUv, 5.0).rgb - 0.5, 0.0) * 0.9
         + max(textureLod(tColor, vUv, 6.5).rgb - 0.3, 0.0) * 1.3;
  // dense taps from a very soft mip, closer together than its texels, fading with distance:
  // a continuous streak (sparse taps would stamp separate ghost copies of each light)
  vec3 st = vec3(0.0);
  for (int i = 1; i <= 10; i++) {
    float fi = float(i);
    vec2 o = vec2(fi * 0.016, 0.0);
    st += (max(textureLod(tColor, vUv + o, 5.5).rgb - 0.45, 0.0) + max(textureLod(tColor, vUv - o, 5.5).rgb - 0.45, 0.0)) * (1.0 - fi / 11.0);
  }
  col += g * uGlow + st * (uStreak / 5.0) * vec3(0.62, 0.58, 1.0);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export default function HeroField({ active, start, onProgress }: { active: boolean; start: boolean; onProgress?: (p: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ active, start, onProgress });
  state.current.active = active;
  state.current.start = start;
  state.current.onProgress = onProgress;

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
  live: { active: boolean; start: boolean; onProgress?: (p: number) => void },
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
  // The keyboard's own studio: a large soft overhead box, a cool rim from behind,
  // and its own reflections (a white softbox top-left, an indigo strip, a lilac kicker).
  const kbEnvScene = new THREE.Scene();
  const kbEnvGeo: T.BufferGeometry[] = [], kbEnvMat: T.Material[] = [];
  const kbRoom = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x020204, side: THREE.BackSide }));
  kbEnvScene.add(kbRoom); kbEnvGeo.push(kbRoom.geometry); kbEnvMat.push(kbRoom.material as T.Material);
  for (const [w, hgt, hex, pow, pos] of [[10, 6, 0xf3f0ff, 2.6, [-6, 10, 6]], [16, 1, 0x6366f1, 0.9, [11, 2.5, -4]], [6, 0.6, 0xc4b5fd, 1.6, [2, 1, 10]]] as [number, number, number, number, [number, number, number]][]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, hgt), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(pow), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); kbEnvScene.add(m); kbEnvGeo.push(m.geometry); kbEnvMat.push(m.material as T.Material);
  }
  const kbEnv = pmrem.fromScene(kbEnvScene, 0.025).texture;
  const kbRim = new THREE.DirectionalLight(0xd9d2ff, 0);
  scene.add(kbRim, kbRim.target);
  // Each task in flight carries a real light, so it spills colour onto the tiles around it.
  const taskLights = Array.from({ length: phone ? 1 : 2 }, () => {
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
    roughness: 0.58,
    metalness: 0.12,
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
        vec3 glowCol = vHue > 1.5 ? vec3(${LILAC}) : mix(vec3(${INDIGO}), vec3(${CYAN}), vHue);
        totalEmissiveRadiance += glowCol * vGlow * (0.12 + 1.9 * vTop);`,
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
  // The keyboard rests on the floor. While it is on stage the floor is down; as
  // the camera pulls away the floor powers up in a ripple outward from the board,
  // the board lowers into the floor, and the tiles close over where it stood.
  let disposed = false;
  let kb: KeyboardModel | null = null;
  const kbAt = phone ? new THREE.Vector3(0, -0.27, -3) : new THREE.Vector3(4.5, -0.27, 0);
  const KB_SIZE = { x: 7.2, z: 2.46 }; // the prepared model's footprint, in world units
  const under = new Uint8Array(N);
  const waveAt = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    if (Math.abs(px[i] - kbAt.x) < KB_SIZE.x / 2 + 0.5 && Math.abs(pz[i] - kbAt.z) < KB_SIZE.z / 2 + 0.5) under[i] = 1;
    waveAt[i] = PULL[0] + 0.03 + Math.hypot(px[i] - kbAt.x, pz[i] - kbAt.z) * 0.007;
  }
  // Nothing is drawn until every shader the shot needs is compiled - in the background where the
  // browser can (KHR_parallel_shader_compile) - so neither the loader nor the shot ever stalls on a
  // compile: the scene for both targets (the lens renders it into its own buffer, the hero straight
  // to the screen), the floor that only appears at the pull-back, and the lens itself.
  let ready = false;
  const warm = async () => {
    try {
      mesh.visible = true;
      if (lensOn) {
        renderer.setRenderTarget(rt);
        const intoLens = renderer.compileAsync(scene, camera);
        renderer.setRenderTarget(null);
        await intoLens;
        await renderer.compileAsync(lensScene, lensCam);
      }
      mesh.visible = true;
      await renderer.compileAsync(scene, camera);
    } catch { /* they compile on first draw instead */ }
    if (disposed) return;
    ready = true;
    if (!running) { if (reduced) step(0); render(); }
  };
  loadKeyboard(THREE, "/models/keyboard.glb", { word: WORD, keyAt, ignite: IGNITE, env: kbEnv, phone })
    .then((m) => {
      if (disposed) { m.dispose(); return; }
      kb = m;
      m.group.position.copy(kbAt);
      scene.add(m.group);
    })
    .catch(() => { /* the hero still works without the keyboard */ })
    .finally(() => { if (!disposed) warm(); });
  // Dust in the key light: a few hundred faint motes drifting around the board,
  // only during the keyboard shot. Additive points, so they cost next to nothing.
  const MOTES = phone ? 90 : 220;
  const motePos = new Float32Array(MOTES * 3), moteSeed = new Float32Array(MOTES);
  for (let i = 0; i < MOTES; i++) {
    motePos[i * 3] = kbAt.x + (Math.random() - 0.5) * 9;
    motePos[i * 3 + 1] = kbAt.y + 0.3 + Math.random() * 3.2;
    motePos[i * 3 + 2] = kbAt.z + (Math.random() - 0.5) * 6;
    moteSeed[i] = Math.random() * Math.PI * 2;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3).setUsage(THREE.DynamicDrawUsage));
  const moteCv = document.createElement("canvas");
  moteCv.width = moteCv.height = 64;
  const mg = moteCv.getContext("2d")!;
  const mgr = mg.createRadialGradient(32, 32, 0, 32, 32, 32);
  mgr.addColorStop(0, "rgba(255,255,255,1)"); mgr.addColorStop(0.4, "rgba(255,255,255,0.35)"); mgr.addColorStop(1, "rgba(255,255,255,0)");
  mg.fillStyle = mgr; mg.fillRect(0, 0, 64, 64);
  const moteTex = new THREE.CanvasTexture(moteCv);
  const moteMat = new THREE.PointsMaterial({ map: moteTex, color: 0xd9d0ff, size: phone ? 0.05 : 0.035, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
  const motes = new THREE.Points(moteGeo, moteMat);
  motes.frustumCulled = false;
  scene.add(motes);

  // where the first typed key (R) sits; the opening shot starts on it
  const oAt = new THREE.Vector3(kbAt.x - 1.41, kbAt.y + 0.48, kbAt.z - 0.41);

  // The floor assembles as a wave from the far right corner.
  const ox = px[COLS - 1], oz = pz[0];
  for (let i = 0; i < N; i++) delay[i] = 0.1 + Math.hypot(px[i] - ox, (pz[i] - oz) * 1.15) * 0.045 + Math.random() * 0.08;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
  const look = new THREE.Vector3(), tmpD = new THREE.Vector3();
  // ── The lens: depth of field whose focus follows the typing, a soft bloom and an anamorphic
  // streak, in one extra full-screen pass. Only during the keyboard shot, only where half-float
  // targets render, and it is the first thing dropped when frames run long.
  let lensOn = !reduced && renderer.capabilities.isWebGL2 && (renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float"));
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, depthTexture: new THREE.DepthTexture(1, 1) });
  const lens = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: rt.texture }, tDepth: { value: rt.depthTexture }, uRes: { value: new THREE.Vector2(1, 1) },
      uNear: { value: camera.near }, uFar: { value: camera.far }, uFocus: { value: 5 }, uAperture: { value: 0 }, uMaxCoc: { value: 20 }, uGlow: { value: 0 }, uStreak: { value: 0 },
    },
    vertexShader: "varying vec2 vUv;\nvoid main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: LENS(phone ? 10 : 14),
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lens);
  quad.frustumCulled = false;
  const lensScene = new THREE.Scene();
  lensScene.add(quad);
  const lensCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const bufSize = new THREE.Vector2();
  const syncLens = () => { renderer.getDrawingBufferSize(bufSize); rt.setSize(bufSize.x, bufSize.y); lens.uniforms.uRes.value.copy(bufSize); };
  let lensAmt = 0, focus = 5;
  const focusP = new THREE.Vector3(), fwd = new THREE.Vector3();
  const frame = () => {
    const w = host.clientWidth || 1, hh = host.clientHeight || 1;
    renderer.setSize(w, hh, false);
    syncLens();
    camera.aspect = w / hh;
    buildShot();
    camera.fov = camera.aspect < 0.9 ? 40 : 30; // phones: a wider lens so the floor reads as a floor, not a close-up
    // phones: slide the frame so the floor sits in the top half, above the type
    if (camera.aspect < 0.9) camera.setViewOffset(w, hh, 0, hh * 0.24, w, hh); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  // ── The shot. One camera path through hand-placed waypoints (centripetal
  // Catmull-Rom), keyed to scroll progress through a monotone cubic so the camera
  // never stops between waypoints and eases to rest on the hero framing.
  const STAMPS = [0, 0.13, 0.27, 0.4, 0.58, 0.76, PULL[1]];
  type Shot = { pos: T.CatmullRomCurve3; look: T.CatmullRomCurve3; u: (p: number) => number };
  let shot: Shot | null = null;
  let shotTime = 0; // drives the slight breathing of the frame while the shot holds
  let push = 0;     // a slow dolly-in while the board wakes
  const buildShot = () => {
    const portrait = camera.aspect < 0.9;
    const C = kbAt, O = oAt;
    const at = (b: T.Vector3, x: number, y: number, z: number) => new THREE.Vector3(b.x + x, b.y + y, b.z + z);
    const restP = portrait ? new THREE.Vector3(0, 8, 9.5) : new THREE.Vector3(-2.5, 6.2, 14.5);
    const restL = portrait ? new THREE.Vector3(0, -0.3, -4.2) : new THREE.Vector3(4, -0.4, 0);
    const pos = portrait
      ? [at(O, -1.2, 2.2, 2.9), at(O, -1.2, 2.6, 3.0), at(C, -1.2, 6.5, 7.0), at(C, -0.5, 10.5, 6.2), at(C, -0.5, 9.8, 5.6), at(C, 0, 11, 9.5), restP]
      : [at(O, -2.3, 1.7, 3.2), at(O, -1.9, 2.0, 3.2), at(C, -2.6, 4.6, 5.2), at(C, 0, 9.0, 3.0), at(C, 0.25, 8.2, 2.5), at(C, -3.5, 9.5, 9.5), restP];
    const look = portrait
      ? [at(O, 0.25, -0.05, -0.15), at(O, -0.5, -0.05, -0.1), at(C, -0.6, 0, 0.1), at(C, -0.5, 0, 0.1), at(C, -0.5, 0, 0.08), new THREE.Vector3().lerpVectors(C, restL, 0.6), restL]
      : [at(O, 0.1, -0.05, -0.2), at(O, -0.35, -0.05, -0.1), at(C, -0.4, 0, 0.1), at(C, 0, 0, 0.2), at(C, 0.05, 0, 0.18), new THREE.Vector3().lerpVectors(C, restL, 0.6), restL];
    shot = {
      pos: new THREE.CatmullRomCurve3(pos, false, "centripetal"),
      look: new THREE.CatmullRomCurve3(look, false, "centripetal"),
      u: monotone(STAMPS, STAMPS.map((_, i) => i / (STAMPS.length - 1))),
    };
  };
  // shotProg: where we are in the keyboard shot (1 = done, resting hero framing)
  const placeCamera = (scroll: number, crane = 0, shotProg = 1) => {
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
      key.intensity = 2.8;
    }
    camera.position.x -= crane * 2.5;
    camera.position.y += crane * 5.5;
    camera.position.z += crane * 4;
    const macro = 1 - band(PULL[0], PULL[1], shotProg);
    if (shot && shotProg < PULL[1]) {
      const u = shot.u(shotProg);
      shot.pos.getPoint(u, camera.position);
      shot.look.getPoint(u, look);
      // a living frame: the camera breathes very slightly while the shot holds
      camera.position.x += Math.sin(shotTime * 0.31) * 0.05 * macro;
      camera.position.y += Math.sin(shotTime * 0.23 + 1) * 0.035 * macro;
      // and opens on a slow push-in while the board wakes
      if (push > 0) camera.position.addScaledVector(tmpD.subVectors(look, camera.position).normalize(), -1.2 * push);
    }
    camera.lookAt(look);
    // a slight Dutch angle on the opening macro, levelling out as the camera cranes up
    if (shot && shotProg < PULL[1]) camera.rotateZ(0.075 * (1 - band(0.02, 0.32, shotProg)));
    camera.updateMatrixWorld();
    if (portrait) {
      // phones: the resting floor sits in the top half above the type; the keyboard shot is centred
      const w = host.clientWidth || 1, hh = host.clientHeight || 1;
      camera.setViewOffset(w, hh, 0, hh * 0.24 * (1 - macro), w, hh);
      camera.updateProjectionMatrix();
    }
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
      if (inView && clearOfType && !under[i]) { visible.push(i); allowed[i] = 1; }
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
  const tmpV = new THREE.Vector3();
  let clock = 0, introAt = -1, nextSpawn = 0.3, raf = 0, running = false, last = 0;
  let slow = 0, frames = 0, scroll = 0, prog = reduced ? 1 : 0, lastKey = -1, lastProg = prog, woke = false;
  const cue = (name: string) => dispatchEvent(new CustomEvent("orv:cue", { detail: { name } }));

  const step = (dt: number) => {
    const f = dt * 60;
    clock += dt;
    if (introAt < 0 && live.start && ready) introAt = clock;
    const intro = introAt < 0 ? -1 : clock - introAt;

    // progress through the hero's pinned run, and how far past it we have scrolled
    const runway = host.closest("section")?.getBoundingClientRect();
    const vh = innerHeight || 1;
    // the shot follows the scroll with a little inertia, like a camera on a dolly
    const want = reduced || !runway ? 1 : Math.min(1, Math.max(0, -runway.top / Math.max(1, runway.height - vh)));
    prog += (want - prog) * (dt > 0 ? 1 - Math.exp(-dt * 1.4) : 1); // heavy: the shot trails the scroll and settles
    if (Math.abs(want - prog) < 1e-4) prog = want;
    if (ready) live.onProgress?.(prog); // the page's type follows this same, heavier progress
    shotTime += dt;
    scroll = runway ? Math.min(1, Math.max(0, (vh - runway.bottom) / vh)) : 0;
    const macro = 1 - band(PULL[0], PULL[1], prog);
    // the opening runs on the clock, not the scroll: the first key breathes in the dark, then a
    // light pass crosses the board and the backlight comes on behind it, on a slow push-in
    const wake = reduced ? 1 : ease((intro - 0.8) / 1.9);
    if (!woke && intro >= 0.8) { woke = true; cue("wake"); }
    push = reduced ? 0 : 1 - ease(Math.max(0, intro) / 4.5);
    placeCamera(scroll, 0, prog);
    // the keyboard types with the scroll; its studio light fades as the camera pulls away
    kb?.update(prog, wake, clock, lensOn ? macro : 0);
    // tell the page each key that goes down (with where it is on screen, so its letter can lift
    // off it into the headline) and how many are typed; cue the sound at the big moments
    if (kb) {
      const k = kb.lastTyped(prog);
      if (k !== lastKey) {
        for (let j = lastKey + 1; j <= k; j++) {
          kb.keyPos(j, tmpV).project(camera);
          dispatchEvent(new CustomEvent("orv:key", { detail: { k: j, space: WORD[j] === " ", x: ((tmpV.x + 1) / 2) * host.clientWidth, y: ((1 - tmpV.y) / 2) * host.clientHeight } }));
        }
        lastKey = k;
        dispatchEvent(new CustomEvent("orv:typed", { detail: { n: k + 1 } }));
      }
    }
    if (lastProg < IGNITE && prog >= IGNITE) cue("ignite");
    if (lastProg < PULL[0] && prog >= PULL[0]) cue("pull");
    lastProg = prog;
    const sunk = band(PULL[0] + 0.08, PULL[0] + 0.24, prog);
    if (kb) { kb.group.position.y = kbAt.y - 1.6 * sunk; kb.group.visible = sunk < 0.999; }
    kbRim.position.set(kbAt.x + 6, kbAt.y + 1.8, kbAt.z - 7);
    kbRim.target.position.copy(kbAt);
    kbRim.intensity = 0.55 * macro;
    // the shadow-casting spot moves from the keyboard set-up to the hero's raking light
    key.position.lerp(tmpV.set(kbAt.x - 3, kbAt.y + 9, kbAt.z + 5), macro);
    key.target.position.lerp(kbAt, macro);
    key.intensity += ((phone ? 4 : 1.7) - key.intensity) * macro;
    // lights up from darkness as the loader lifts: exposure rises while the key light sweeps across the board
    const lightUp = reduced ? 1 : ease((intro - 0.3) / 2.6);
    renderer.toneMappingExposure = 1.05 * (0.32 + 0.68 * lightUp);
    if (lightUp < 1) key.target.position.x += (1 - lightUp) * -3.5 * macro;
    moteMat.opacity = 0.55 * macro * lightUp;
    motes.visible = moteMat.opacity > 0.01;
    if (motes.visible) {
      for (let i = 0; i < MOTES; i++) {
        const sd = moteSeed[i];
        motePos[i * 3] += Math.sin(clock * 0.21 + sd) * 0.0016 * f;
        motePos[i * 3 + 1] += (Math.sin(clock * 0.17 + sd * 1.7) * 0.0012 + 0.0004) * f;
        if (motePos[i * 3 + 1] > kbAt.y + 3.6) motePos[i * 3 + 1] = kbAt.y + 0.3;
      }
      (moteGeo.getAttribute("position") as T.BufferAttribute).needsUpdate = true;
    }
    key.angle = 0.4 + 0.15 * macro;
    // the lens: focus is pulled to the key about to go down (a beat early, like a focus puller),
    // then onto the whole board once the word is complete; the aperture closes as the camera rises,
    // and the pass is gone early in the pull-back, before the floor comes up
    lensAmt = lensOn ? 1 - band(PULL[0] + 0.02, PULL[0] + 0.16, prog) : 0;
    if (lensAmt > 0.001) {
      if (kb) kb.keyPos(Math.max(0, kb.lastTyped(prog + 0.018)), focusP); else focusP.copy(oAt);
      focusP.lerp(kbAt, band(IGNITE - 0.02, IGNITE + 0.06, prog));
      camera.getWorldDirection(fwd);
      const fd = tmpV.copy(focusP).sub(camera.position).dot(fwd);
      focus += (fd - focus) * (dt > 0 ? 1 - Math.exp(-dt * 5) : 1);
      const u = lens.uniforms;
      u.uFocus.value = focus;
      u.uAperture.value = bufSize.y * (0.0065 + 0.0105 * (1 - band(0.12, 0.34, prog))) * lensAmt;
      u.uMaxCoc.value = bufSize.y * 0.022;
      u.uGlow.value = 0.9 * lensAmt;
      u.uStreak.value = 0.22 * lensAmt;
    }
    // the close shot fills the whole screen with lit surfaces; render it a little softer to keep 60fps
    const ratio = macro > 0.5 || lensAmt > 0.001 ? Math.min(dpr, phone ? 1.25 : 1.3) : dpr;
    if (renderer.getPixelRatio() !== ratio) { renderer.setPixelRatio(ratio); renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false); syncLens(); }

    if (cursor.on) {
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) { cursor.x += (hit.x - cursor.x) * 0.2 * f; cursor.z += (hit.z - cursor.z) * 0.2 * f; }
    }
    cursor.amt += ((cursor.on && !reduced ? 1 : 0) - cursor.amt) * Math.min(1, 0.06 * f);
    lamp.position.set(cursor.x, 2.4, cursor.z);
    lamp.intensity = 18 * cursor.amt;

    // Routes advance; each tile they cross lifts and lights, the last one lands cyan.
    if (intro > 1.4 && !reduced && prog > PULL[1] - 0.08) {
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
      let scrubbed = false;
      if (!reduced) {
        // the floor powers up in a ripple from the keyboard, exactly in step with the scroll
        const rise = under[i] ? band(PULL[0] + 0.22, PULL[0] + 0.32, prog) : band(waveAt[i], waveAt[i] + 0.07, prog);
        if (rise < 1) { target = -1.4 + (target + 1.4) * rise; scrubbed = true; }
        const wave = Math.exp(-(((prog - waveAt[i] - 0.04) / 0.022) ** 2));
        if (wave > 0.02) { glow[i] = Math.max(glow[i], 0.16 * wave); hue[i] = 2; }
      }

      if (scrubbed) { h[i] = target; v[i] = 0; }
      else {
        v[i] += (target - h[i]) * 0.085 * f;
        v[i] *= damp;
        h[i] += v[i] * f;
      }

      dummy.position.set(px[i], h[i], pz[i]);
      dummy.rotation.set(dz * near * 0.09, 0, -dx * near * 0.09); // lifted tiles lean away from the cursor
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.visible = reduced || prog >= PULL[0] + 0.03; // all tiles are under the floor before the wave
    mesh.instanceMatrix.needsUpdate = true;
    glowAttr.needsUpdate = true;
    hueAttr.needsUpdate = true;
  };

  const render = () => {
    if (!ready) return;
    if (lensAmt > 0.001) {
      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(lensScene, lensCam);
    } else renderer.render(scene, camera);
  };

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
        if (lensAmt > 0.001) lensOn = false; // the lens pass goes first
        else if (dpr > 1) { dpr = Math.max(1, dpr - 0.25); renderer.setPixelRatio(dpr); frame() }
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
    placeCamera(scroll, 0, prog);
    if (!running) { if (reduced) step(0); render(); }
  });
  ro.observe(host);

  if (reduced) { for (let i = 0; i < N; i++) h[i] = 0; step(0); }
  placeCamera(0, 0, prog);
  render();
  sync();

  return () => {
    disposed = true;
    running = false;
    cancelAnimationFrame(raf);
    clearInterval(poll);
    ro.disconnect();
    removeEventListener("pointermove", onMove);
    removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointerleave", onLeave);
    kb?.dispose();
    rt.depthTexture?.dispose(); rt.dispose(); lens.dispose(); quad.geometry.dispose();
    moteGeo.dispose(); moteMat.dispose(); moteTex.dispose();
    [geo, floorGeo, ...envGeo, ...kbEnvGeo].forEach((g) => g.dispose());
    [mat, floorMat, ...envMat, ...kbEnvMat].forEach((m) => m.dispose());
    envTex.dispose();
    kbEnv.dispose();
    pmrem.dispose();
    mesh.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
