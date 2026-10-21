import type * as T from "three";

type Three = typeof T;

/*
 * The hero keyboard: a real modelled 65% board ("Mechanical Keyboard" by
 * YarikLegendary, CC BY 4.0, via Sketchfab), prepared offline so every keycap
 * is its own node (`key_<label>`), the board is oriented (+X right, +Y up,
 * +Z toward the viewer), centred, scaled and meshopt-compressed.
 *
 * Re-skinned as a backlit board waking up: dark anodised case and near-black
 * caps, with the light carried by the switches and the legends (the legends are
 * their own glyph meshes, so they shine through like real shine-through caps).
 * Before the light pass only the first key glows; the pass crosses the board,
 * catching every edge, and the backlight comes on behind it. Each typed key
 * presses, its legend lights and a ring of light runs out through its
 * neighbours (an RGB board's "splash"); when the word is complete a shockwave
 * crosses the whole board. All of it is a function of scroll progress, so it
 * scrubs both ways.
 */

export type KeyboardModel = {
  group: T.Group;
  /** world-space centre of the key for letter index k (or of the board) */
  keyPos: (k: number, out: T.Vector3) => T.Vector3;
  /** index of the last letter typed at this progress, or -1 */
  lastTyped: (prog: number) => number;
  /** prog: scroll progress; wake: 0..1 through the opening light pass; time: seconds; bloom: 0..1 how much real bloom the lens adds */
  update: (prog: number, wake: number, time: number, bloom: number) => void;
  size: T.Vector3;
  dispose: () => void;
};

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// Shader pieces. Everything works in world space on the board's plane (xz).
const VW = "varying vec3 vW;";
const W = "vW = (modelMatrix * vec4(transformed, 1.0)).xyz;";
const SWEEP_PARS = "uniform float uWakeX, uSweep, uProg, uIgnite;\nuniform vec2 uIgniteAt;\nvarying vec3 vW;";
// the light pass: a band of light crossing the board that catches the edges; and the ignition
// shockwave, which lights the caps as it runs out from the last key
const SWEEP = `{
  float rim = pow(1.0 - saturate(dot(geometryNormal, geometryViewDir)), 2.0);
  float band = exp(-pow((vW.x - uWakeX) / 0.2, 2.0));
  totalEmissiveRadiance += vec3(0.7, 0.62, 1.0) * uSweep * band * (0.22 + 1.0 * rim);
  float ia = uProg - uIgnite;
  if (ia > 0.0 && ia < 0.09) totalEmissiveRadiance += vec3(0.62, 0.5, 1.0) * 0.45 * (1.0 - ia / 0.09) * exp(-pow((distance(vW.xz, uIgniteAt) - ia * 95.0) / 0.28, 2.0)) * (0.3 + rim);
}`;
const BACKLIGHT = (nk: number) => `
uniform float uProg, uWakeX, uBase, uBreath, uIgnite;
uniform vec4 uKeyW[${nk}];
varying vec3 vW;
// the steady light: the backlight switched on behind the light pass, each typed key's own
// switch, and the first key breathing alone in the dark before the pass
float steady() {
  float l = uBase * (1.0 - smoothstep(uWakeX - 0.8, uWakeX, vW.x));
  vec2 d0 = vW.xz - uKeyW[0].xz;
  l += uBreath * exp(-dot(d0, d0) / 0.025);
  for (int k = 0; k < ${nk}; k++) {
    float age = uProg - uKeyW[k].w;
    vec2 d = vW.xz - uKeyW[k].xz;
    if (age > 0.0) l += 0.8 * smoothstep(0.0, 0.02, age) * exp(-dot(d, d) / 0.03);
  }
  return l;
}
// the moving light: the pass's bright front, a splash ring out of every press, and the
// ignition shockwave from the last key across the whole board
float ripple() {
  float l = 2.2 * exp(-pow((vW.x - uWakeX) / 0.2, 2.0));
  for (int k = 0; k < ${nk}; k++) {
    float age = uProg - uKeyW[k].w;
    if (age > 0.0 && age < 0.05) l += 1.4 * (1.0 - age / 0.05) * exp(-pow((distance(vW.xz, uKeyW[k].xz) - age * 42.0) / 0.26, 2.0));
  }
  float ia = uProg - uIgnite;
  if (ia > 0.0 && ia < 0.09) l += 3.0 * (1.0 - ia / 0.09) * exp(-pow((distance(vW.xz, uKeyW[${nk - 1}].xz) - ia * 95.0) / 0.3, 2.0));
  return l;
}`;

export async function loadKeyboard(
  THREE: Three,
  url: string,
  opts: { word: string; keyAt: (k: number) => number; ignite: number; env: T.Texture; phone: boolean },
): Promise<KeyboardModel> {
  const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/libs/meshopt_decoder.module.js"),
  ]);
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(url);
  const group = new THREE.Group();
  group.add(gltf.scene);
  group.updateMatrixWorld(true);

  const letters = opts.word.toUpperCase().split("");
  const uniq = [...new Set(letters)];
  const NK = letters.length, NU = uniq.length;
  // uniforms shared by every patched material (same objects, so one write updates all)
  const U = {
    uProg: { value: 0 },
    uWakeX: { value: -1e3 },
    uSweep: { value: 0 },
    uBase: { value: 0.16 },
    uBreath: { value: 0 },
    uIgnite: { value: opts.ignite },
    uIgniteAt: { value: new THREE.Vector2() },
    uKeyW: { value: Array.from({ length: NK }, () => new THREE.Vector4()) },
    uPress: { value: new Float32Array(NU) },
    uLit: { value: new Float32Array(NU) },
    uTravel: { value: 0 },
  };
  const patch = (
    m: T.Material,
    key: string,
    o: { vPars?: string; vMain?: string; vProject?: string; fPars?: string; fEmissive?: string; fLight?: string },
    own: Record<string, { value: unknown }> = {},
  ) => {
    m.customProgramCacheKey = () => key; // the closures below all stringify the same, so name each variant
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, U, own);
      s.vertexShader = s.vertexShader
        .replace("#include <common>", `#include <common>\n${o.vPars ?? ""}`)
        .replace("#include <begin_vertex>", `#include <begin_vertex>\n${o.vMain ?? ""}`);
      if (o.vProject) s.vertexShader = s.vertexShader.replace("#include <project_vertex>", o.vProject);
      s.fragmentShader = s.fragmentShader
        .replace("#include <common>", `#include <common>\n${o.fPars ?? ""}`)
        .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>\n${o.fEmissive ?? ""}`)
        .replace("#include <aomap_fragment>", `#include <aomap_fragment>\n${o.fLight ?? ""}`);
    };
  };

  const env = { envMap: opts.env, envMapIntensity: 0.9 };
  const caseMat = new THREE.MeshPhysicalMaterial({ color: 0x1b1b25, metalness: 0.9, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.2, ...env });
  // PBT caps: a plain standard material (cheap to shade, which matters when the caps fill the screen)
  const capMat = new THREE.MeshStandardMaterial({ color: 0x1a1a23, roughness: 0.5, metalness: 0, ...env });
  const sweep = { vPars: VW, vMain: W, fPars: SWEEP_PARS, fLight: SWEEP };
  patch(caseMat, "kb-case", sweep);
  patch(capMat, "kb-cap", sweep);
  // switches stay dark; their LEDs glow softly so light pools in the gaps between the caps (only a
  // steady, clamped glow: seen through the gaps from a low angle, anything brighter reads as blobs)
  const switchMat = new THREE.MeshStandardMaterial({ color: 0x0b0b12, roughness: 0.7, ...env });
  const ledMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1 });
  patch(ledMat, "kb-led", { vPars: VW, vMain: W, fPars: BACKLIGHT(NK), fEmissive: "totalEmissiveRadiance = vec3(0.68, 0.52, 1.0) * 0.6 * min(steady(), 1.4);" });
  // legends: shine-through glyphs that ride down with their keys and light from below
  const legendMat = new THREE.MeshStandardMaterial({ color: 0x2b2b38, roughness: 0.42, metalness: 0.1, ...env });
  patch(legendMat, "kb-legend", {
    vPars: `${VW}\nattribute float aKey;\nuniform float uPress[${NU}], uLit[${NU}], uTravel;\nvarying float vLit;`,
    vProject: `vec4 wpos = modelMatrix * vec4(transformed, 1.0);
      vLit = 0.0;
      if (aKey > -0.5) { int ki = int(aKey + 0.5); wpos.y -= uTravel * uPress[ki]; vLit = uLit[ki]; }
      vW = wpos.xyz;
      vec4 mvPosition = viewMatrix * wpos;
      gl_Position = projectionMatrix * mvPosition;`,
    fPars: `${BACKLIGHT(NK)}\nvarying float vLit;`,
    fEmissive: "totalEmissiveRadiance = vec3(0.78, 0.72, 1.0) * (0.55 * steady() + 0.7 * ripple() + vLit);",
  });
  const knobMat = new THREE.MeshPhysicalMaterial({ color: 0xb8b4cc, metalness: 1, roughness: 0.16, clearcoat: 1, ...env });
  const mats: T.Material[] = [caseMat, capMat, switchMat, ledMat, legendMat, knobMat];

  const keys: Record<string, T.Object3D> = {};
  const legends: T.Mesh[] = [];
  const box = new THREE.Box3();
  gltf.scene.traverse((o) => {
    const mesh = o as T.Mesh;
    if (mesh.isMesh) {
      const old = mesh.material as T.Material;
      const n = old.name;
      // the case material also covers the legend glyphs, which sit above the plate
      const isCase = n === "Nylon_12_with_Formlabs_Fuse_1_3D_Printer_1";
      const isLegend = isCase && box.setFromObject(mesh).min.y > 0.3;
      // only the case casts the floor shadow; the caps sit on the case and gain little from it
      mesh.castShadow = !opts.phone && isCase && !isLegend;
      mesh.receiveShadow = !opts.phone;
      mesh.material =
        isLegend ? legendMat
        : isCase ? caseMat
        : n === "Nylon_12_with_Formlabs_Fuse_1_3D_Printer" ? capMat
        : n === "PEEK" ? switchMat
        : n.startsWith("LED_") ? ledMat
        : n.startsWith("Steel") ? knobMat
        : old;
      if (mesh.material !== old) old.dispose();
      if (isLegend) legends.push(mesh);
    }
    const m = o.name.match(/^key_([A-Z])$/);
    if (m) keys[m[1]] = o;
    if (o.name === "key_space") keys[" "] = o;
  });

  // which typed key each legend vertex belongs to (by footprint), so it can press and light with it
  const foot = uniq.map((L) => (keys[L] ? new THREE.Box3().setFromObject(keys[L]).expandByScalar(0.02) : null));
  const p = new THREE.Vector3();
  for (const mesh of legends) {
    const pos = mesh.geometry.getAttribute("position");
    const aKey = new Float32Array(pos.count).fill(-1);
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      const u = foot.findIndex((b) => b && p.x >= b.min.x && p.x <= b.max.x && p.z >= b.min.z && p.z <= b.max.z);
      aKey[i] = u;
    }
    mesh.geometry.setAttribute("aKey", new THREE.BufferAttribute(aKey, 1));
  }
  // how far a full press moves a key, in world units (the press below is 7 model units)
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
  if (keys.R) {
    keys.R.getWorldPosition(tmp);
    keys.R.position.y += 7; keys.R.updateMatrixWorld(true);
    keys.R.getWorldPosition(tmp2);
    keys.R.position.y -= 7; keys.R.updateMatrixWorld(true);
    U.uTravel.value = Math.abs(tmp.y - tmp2.y);
  }

  // the typed caps: each gets its own material so it can light independently; the light
  // leaks from under the cap, so the glow sits on the skirt rather than the whole cap
  type Lit = { node: T.Object3D; mat: T.MeshStandardMaterial; halo: T.Sprite; y: number; down: number; on: number; k: number; u: number };
  // a soft additive halo over each lit key (a stand-in for bloom when the lens pass is off)
  const haloCv = document.createElement("canvas");
  haloCv.width = haloCv.height = 128;
  const hg = haloCv.getContext("2d")!;
  const rg = hg.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, "rgba(255,255,255,1)"); rg.addColorStop(0.35, "rgba(255,255,255,0.35)"); rg.addColorStop(1, "rgba(255,255,255,0)");
  hg.fillStyle = rg; hg.fillRect(0, 0, 128, 128);
  const haloTex = new THREE.CanvasTexture(haloCv);
  const haloMats: T.SpriteMaterial[] = [];
  const lit = new Map<string, Lit>();
  uniq.forEach((L, u) => {
    const node = keys[L];
    if (!node) return;
    const mat = capMat.clone();
    mat.emissive = new THREE.Color(0xa898ff);
    mat.emissiveIntensity = 0;
    let gy0 = 0, gy1 = 1;
    node.traverse((c) => { const g = (c as T.Mesh).geometry; if (g) { g.computeBoundingBox(); gy0 = g.boundingBox!.min.y; gy1 = g.boundingBox!.max.y; } });
    // model space: up is -y, so the skirt is at the max y
    patch(mat, "kb-cap-lit", {
      vPars: `${VW}\nvarying float vKY;\nuniform vec2 uKY;`,
      vMain: `${W}\nvKY = (position.y - uKY.x) / (uKY.y - uKY.x);`,
      fPars: `${SWEEP_PARS}\nvarying float vKY;`,
      fEmissive: "totalEmissiveRadiance *= 0.1 + 0.9 * smoothstep(0.35, 1.0, vKY);",
      fLight: SWEEP,
    }, { uKY: { value: new THREE.Vector2(gy0, gy1) } });
    mats.push(mat);
    node.traverse((c) => { if ((c as T.Mesh).isMesh) (c as T.Mesh).material = mat; });
    const hm = new THREE.SpriteMaterial({ map: haloTex, color: 0xb9a8ff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 });
    haloMats.push(hm);
    const halo = new THREE.Sprite(hm);
    halo.scale.setScalar(0.75);
    group.add(halo);
    // the spacebar is six keys wide; it glows at half strength so it doesn't drown the letters
    lit.set(L, { node, mat, halo, y: node.position.y, down: 0, on: 0, k: L === " " ? 0.45 : 1, u });
  });

  // a small lilac light that hangs low over the key being pressed and spills onto its neighbours
  const glow = new THREE.PointLight(0xc4b5fd, 0, 2.4, 2);
  group.add(glow);

  const size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());

  const lastTyped = (prog: number) => {
    let last = -1;
    letters.forEach((_, i) => { if (prog >= opts.keyAt(i)) last = i; });
    return last;
  };

  const keyPos = (k: number, out: T.Vector3) => {
    const node = keys[letters[Math.max(0, Math.min(letters.length - 1, k))]];
    return node ? node.getWorldPosition(out) : group.getWorldPosition(out);
  };

  const update = (prog: number, wake: number, time: number, bloom: number) => {
    for (const e of lit.values()) { e.down = 0; e.on = 0; }
    letters.forEach((L, i) => {
      const e = lit.get(L);
      if (!e) return;
      const t0 = opts.keyAt(i);
      e.down = Math.max(e.down, ease((prog - t0) / 0.016) * (1 - ease((prog - t0 - 0.02) / 0.05)));
      e.on = Math.max(e.on, ease((prog - t0) / 0.02));
    });
    // a beat when the word is complete: every lit key pulses once together
    const pulse = Math.exp(-(((prog - opts.ignite) / 0.02) ** 2));
    // before the pass the first key breathes alone in the dark
    const breath = (1 - ease(wake / 0.35)) * (0.6 + 0.4 * Math.sin(time * 2.1));
    U.uBreath.value = 2.6 * breath;
    const first = lit.get(letters[0]);
    for (const e of lit.values()) {
      const b = e === first ? breath : 0;
      // model space: up is -y, so pressing a key adds to y (about 4 mm of travel)
      e.node.position.y = e.y + 7 * e.down;
      e.mat.emissiveIntensity = 1.6 * e.k * (e.on * (0.35 + 1.0 * e.down + 0.9 * pulse) + 0.8 * b);
      U.uPress.value[e.u] = e.down;
      U.uLit.value[e.u] = e.k * e.on * (1.1 + 2.4 * e.down + 2.0 * pulse);
      e.node.getWorldPosition(tmp);
      group.worldToLocal(tmp);
      e.halo.position.set(tmp.x, tmp.y + 0.12, tmp.z);
      (e.halo.material as T.SpriteMaterial).opacity = (0.7 - 0.55 * bloom) * e.k * e.on * (0.22 + 0.5 * e.down + 0.45 * pulse) + 0.35 * b;
    }
    letters.forEach((_, i) => { keyPos(i, tmp); U.uKeyW.value[i].set(tmp.x, tmp.y, tmp.z, opts.keyAt(i)); });
    U.uIgniteAt.value.set(tmp.x, tmp.z); // the last key
    U.uProg.value = prog;
    // the light pass runs from just off the left end of the board to just off the right
    group.getWorldPosition(tmp);
    U.uWakeX.value = tmp.x - size.x / 2 - 1 + (size.x + 2) * wake;
    U.uSweep.value = Math.sin(Math.PI * Math.min(1, Math.max(0, wake)));
    const last = lastTyped(prog);
    if (last >= 0) {
      const e = lit.get(letters[last])!;
      e.node.getWorldPosition(tmp);
      group.worldToLocal(tmp);
      glow.position.set(tmp.x, tmp.y + 0.6, tmp.z + 0.1);
      glow.intensity = e.k * (0.9 * e.down + 0.15 + 0.5 * pulse);
    } else glow.intensity = 0;
  };

  return {
    group,
    keyPos,
    lastTyped,
    update,
    size,
    dispose: () => {
      mats.forEach((m) => m.dispose());
      haloMats.forEach((m) => m.dispose());
      haloTex.dispose();
      gltf.scene.traverse((o) => { const mesh = o as T.Mesh; if (mesh.isMesh) mesh.geometry.dispose(); });
    },
  };
}
