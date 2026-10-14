"use client";

import { useEffect, useRef } from "react";

/*
 * Hero background: a stack of hairlines carrying a live signal (think pulsar plot,
 * Joy Division), drawn with hidden-line removal so crests occlude the
 * lines behind. A scan pulse sweeps the stack and the cursor lifts the lines.
 * One full-screen fragment shader, no geometry or postprocessing.
 *
 * It renders only while on screen and the tab is visible, steps its own
 * resolution down if frames run long, draws a single still frame under
 * reduced motion, and falls back to a plain gradient without WebGL2.
 */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uScroll;
out vec4 outColor;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

const float N = 54.0;
float ridge(float x, float fi, float cx, float wide, float amp) {
  float n = noise(vec2(x * 3.1 + 7.0, fi * 0.3 - uTime * 0.33)) + 0.5 * noise(vec2(x * 7.3, fi * 0.5 - uTime * 0.5));
  float env = 0.1 + exp(-pow((x - cx) / wide, 2.0));      // a central swell, a murmur elsewhere
  return amp * env * pow(max(n - 0.12, 0.0), 1.5);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  float por = 1.0 - smoothstep(0.75, 1.1, asp);
  float px = 1.0 / uRes.y;

  // desktop: the swell sits right of the headline; phones: a band across the top
  float cx = mix(0.76, 0.5, por);
  float wide = mix(0.24, 0.42, por);
  float y0 = mix(0.4, 0.56, por), y1 = mix(0.9, 0.93, por);
  float amp = mix(0.085, 0.06, por);

  vec3 indigo = vec3(0.388, 0.400, 0.945);
  vec3 lilac  = vec3(0.769, 0.710, 0.992);
  vec3 cyan   = vec3(0.133, 0.827, 0.933);
  vec3 bg = vec3(0.016, 0.016, 0.039);
  vec3 col = bg;
  float x = uv.x;
  float scan = fract(uTime * 0.045);                      // a pulse that sweeps the stack now and then
  float hov = uHover * exp(-pow((x - uMouse.x) / 0.1, 2.0));

  for (float i = 0.0; i < N; i += 1.0) {                  // back (top) to front (bottom)
    float t = i / (N - 1.0);
    float base = mix(y1, y0, t);
    if (abs(base - uv.y) > amp * 2.2 + 0.02) continue;
    float lift = 0.07 * hov * exp(-pow((base - uMouse.y) / 0.16, 2.0));   // the cursor lifts the lines under it
    float yl = base + ridge(x, i, cx, wide, amp * mix(0.7, 1.3, 1.0 - t)) + lift;
    float yl2 = base + ridge(x + 0.002, i, cx, wide, amp * mix(0.7, 1.3, 1.0 - t)) + lift;
    float slope = (yl2 - yl) / (0.002 * asp);
    if (uv.y < yl) col = bg;                              // hides whatever is behind this crest
    float cov = 1.0 - smoothstep(0.0, px * 1.15, abs(uv.y - yl) / sqrt(1.0 + slope * slope));
    float peak = smoothstep(0.0, amp * 0.9, yl - base);
    vec3 lc = mix(indigo, lilac, peak);
    lc = mix(lc, cyan, exp(-pow((t - scan) / 0.035, 2.0)) * 0.8);
    float a = (0.28 + 0.72 * peak) * mix(0.55, 1.0, 1.0 - t);
    col = mix(col, lc, cov * a);
  }

  // keep the left and the foot quiet so the type reads
  float quiet = mix(smoothstep(0.3, 0.72, uv.x) * 0.92 + 0.08, 1.0, por);
  float foot = mix(smoothstep(0.34, 0.56, uv.y) * smoothstep(0.97, 0.86, uv.y), 1.0, por);
  col = mix(bg, col, quiet * foot);

  float vig = smoothstep(1.4, 0.3, length((uv - 0.5) * vec2(asp * 0.8, 1.0)));
  col *= mix(0.7, 1.0, vig);
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * 0.028;   // grain
  outColor = vec4(col, 1.0);
}`;

export default function HeroField({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) { canvas.style.display = "none"; return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = "none"; return; }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = "none"; return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one oversized triangle
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse"), uHover = U("uHover"), uScroll = U("uScroll");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let quality = 1; // 1 -> 0.5; only ever steps down
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      const w = Math.max(2, Math.floor(canvas.clientWidth * dpr)), h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
    };

    const mouse = { x: 0.7, y: 0.45, tx: 0.7, ty: 0.45, hover: 0, thover: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      mouse.tx = x; mouse.ty = y;
      mouse.thover = x >= 0 && x <= 1 && y >= 0 && y <= 1 ? 1 : 0;
    };
    const onLeave = () => { mouse.thover = 0; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let raf = 0, last = performance.now(), start = last, slow = 0, frames = 0, running = false;
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.07; mouse.y += (mouse.ty - mouse.y) * 0.07; mouse.hover += (mouse.thover - mouse.hover) * 0.06;
      const scroll = Math.min(1, window.scrollY / window.innerHeight);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 12 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, reduced ? 0 : mouse.hover);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      // step resolution down if frames run long (weak GPU / busy main thread)
      const dt = now - last; last = now; frames++;
      if (frames > 10) { slow = dt > 24 ? slow + 1 : Math.max(0, slow - 1); if (slow > 24 && quality > 0.5) { quality = Math.max(0.5, quality - 0.25); slow = 0; resize(); } }
      draw(now);
    };
    const sync = () => {
      const should = activeRef.current && document.visibilityState === "visible" && !reduced;
      if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
      else if (!should && running) { running = false; cancelAnimationFrame(raf); }
    };
    const tick = setInterval(sync, 250); // cheap poll keeps this in step with the active prop and tab visibility
    const ro = new ResizeObserver(() => { resize(); if (!running) draw(performance.now()); });
    ro.observe(canvas);
    resize(); draw(performance.now()); sync();

    return () => {
      running = false; cancelAnimationFrame(raf); clearInterval(tick); ro.disconnect();
      window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", background: "#04040a" }} />;
}
