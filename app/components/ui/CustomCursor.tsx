"use client";

import { useEffect, useRef } from "react";

/*
 * Cursor: a focus reticle. A dot marks the pointer, four corner brackets trail
 * it like a camera finder, and when the pointer meets something clickable the
 * brackets lock onto it - they glide out and snap around the element's own
 * box, as if the interface were focusing on it. Over a video the reticle
 * closes into a disc that says "Play"; over a text field it becomes a caret.
 * At rest a small mono tag names the section you are in.
 * One rAF loop writes transforms directly. Not rendered on touch devices.
 */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const SECTIONS: Record<string, string> = {
  hero: "Orvantia", why: "Why we exist", film: "Brand film", about: "01 · What we fix", "case-study": "02 · FactoryFlow",
  services: "03 · What we build", products: "04 · Products", process: "05 · Process", team: "06 · Team", faq: "07 · Questions", contact: "08 · Contact",
};

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const dot = dotRef.current, frame = frameRef.current, label = labelRef.current, tag = tagRef.current;
    if (!fine.matches || !dot || !frame || !label || !tag) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const m = { x: -100, y: -100 };
    // frame: centre + size, eased toward a target box
    const f = { x: -100, y: -100, w: 30, h: 30, r: 3 };
    const t = { x: -100, y: -100, w: 30, h: 30, r: 3, mode: "idle" as "idle" | "lock" | "disc" | "caret", vis: 0, press: 0 };
    const v = { vis: 0, disc: 0, caret: 0, press: 0, tag: 0 };
    let target: HTMLElement | null = null, started = false, raf = 0, section = "", idleSince = performance.now();

    const onMove = (e: MouseEvent) => {
      m.x = e.clientX; m.y = e.clientY; t.vis = 1; idleSince = performance.now();
      if (!started) { f.x = m.x; f.y = m.y; started = true; }
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const sec = el?.closest?.("section[id]");
      section = sec ? SECTIONS[sec.id] ?? "" : "";
      const txt = el?.closest?.("[data-cursor-text]") as HTMLElement | null;
      const field = el?.closest?.("input, textarea, [contenteditable='true']") as HTMLElement | null;
      // a small control inside a big clickable row (e.g. the round arrow) gets its own lock
      const hot = (el?.closest?.("[data-cursor-lock]") ?? el?.closest?.("a, button, summary, select, label, [data-cursor-hover]")) as HTMLElement | null;
      target = null;
      if (txt) { t.mode = "disc"; label.textContent = txt.getAttribute("data-cursor-text") || ""; }
      else if (field) t.mode = "caret";
      else if (hot) {
        const r = hot.getBoundingClientRect();
        // very large hit areas (cards, rows) get a modest disc-sized lock instead of a full-bleed frame
        if (r.width > 520 || r.height > 140) t.mode = "idle"; else { t.mode = "lock"; target = hot; }
      } else t.mode = "idle";
    };
    const onDown = () => { t.press = 1; };
    const onUp = () => { t.press = 0; };
    const onLeave = () => { t.vis = 0; };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const k = reduced ? 1 : 0.2;

      // where the frame wants to be
      if (t.mode === "lock" && target) {
        const r = target.getBoundingClientRect(), pad = 7;
        // pulled slightly toward the pointer so it feels magnetic, not mechanical
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        t.x = cx + (m.x - cx) * 0.05; t.y = cy + (m.y - cy) * 0.05;
        t.w = r.width + pad * 2; t.h = r.height + pad * 2;
        const br = getComputedStyle(target).borderTopLeftRadius;
        t.r = br.includes("%") ? Math.min(r.width, r.height) / 2 + pad : Math.min(parseFloat(br) || 0, 40) + pad * 0.6;
      } else if (t.mode === "disc") { t.x = m.x; t.y = m.y; t.w = 86; t.h = 86; t.r = 43; }
      else if (t.mode === "caret") { t.x = m.x; t.y = m.y; t.w = 2; t.h = 26; t.r = 1; }
      else { t.x = m.x; t.y = m.y; t.w = 30; t.h = 30; t.r = 3; }
      const idleRate = t.mode === "lock" ? 0.24 : k;
      f.x = lerp(f.x, t.x, idleRate); f.y = lerp(f.y, t.y, idleRate);
      f.w = lerp(f.w, t.w, 0.22); f.h = lerp(f.h, t.h, 0.22); f.r = lerp(f.r, t.r, 0.22);
      v.vis = lerp(v.vis, t.vis, 0.18);
      v.disc = lerp(v.disc, t.mode === "disc" ? 1 : 0, 0.2);
      v.caret = lerp(v.caret, t.mode === "caret" ? 1 : 0, 0.25);
      v.press = lerp(v.press, t.press, 0.25);
      const locked = t.mode === "lock" ? 1 : 0;

      const s = 1 - v.press * 0.12;
      frame.style.opacity = String(v.vis);
      frame.style.width = `${f.w}px`; frame.style.height = `${f.h}px`; frame.style.borderRadius = `${f.r}px`;
      frame.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) translate(-50%, -50%) scale(${s})`;
      frame.dataset.mode = t.mode;
      frame.style.setProperty("--disc", String(v.disc));
      frame.style.setProperty("--caret", String(v.caret));
      label.style.opacity = String(v.disc > 0.7 ? (v.disc - 0.7) / 0.3 : 0);

      // dot: exactly under the pointer; hides when the frame has taken over
      dot.style.opacity = String(v.vis * (1 - v.disc) * (1 - v.caret) * (1 - locked * 0.65));
      dot.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) translate(-50%, -50%) scale(${1 + v.press * 0.4})`;

      // section tag: appears when the pointer rests, slips away as soon as it moves
      const resting = now - idleSince > 500 && t.mode === "idle" && !!section;
      v.tag = lerp(v.tag, resting ? 1 : 0, 0.14);
      if (resting && tag.textContent !== section) tag.textContent = section;
      tag.style.opacity = String(v.tag * v.vis);
      tag.style.transform = `translate3d(${m.x + 20}px, ${m.y + 18 + (1 - v.tag) * 6}px, 0)`;
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={frameRef} className="cur-frame" aria-hidden>
        <i /><i /><i /><i />
        <span ref={labelRef} className="cur-label" />
      </div>
      <div ref={dotRef} className="cur-dot" aria-hidden />
      <div ref={tagRef} className="cur-tag" aria-hidden />
    </>
  );
}
