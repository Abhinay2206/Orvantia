"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

/*
 * Page transition in the site's own language: the floor of modules from the hero.
 * Clicking a link to another page raises a field of dark tiles in a wave from the
 * point you clicked until it covers the screen; the next page opens with the same
 * tiles sinking away in a wave from its centre. A flag in sessionStorage (read by an
 * inline script in <head>, before first paint) makes the next page start covered,
 * so there is never a flash between the two.
 */
const TILES = 160; // 16 x 10 landscape, 8 x 20 portrait (see .page-curtain in globals.css)
const CURTAIN_KEY = "orv-nav"; // also read by the inline script in app/layout.tsx

const gridOf = (el: HTMLElement) => {
  const cols = getComputedStyle(el).gridTemplateColumns.split(" ").length;
  return [Math.ceil(TILES / cols), cols] as [number, number];
};

export default function PageCurtain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tiles = Array.from(el.children) as HTMLElement[];
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Arrived through the curtain: open it.
    const open = () => {
      try { sessionStorage.removeItem(CURTAIN_KEY); } catch { /* storage blocked */ }
      if (!root.classList.contains("orv-curtain")) return;
      gsap.set(tiles, { scale: 1 });
      root.classList.remove("orv-curtain");
      gsap.to(tiles, { scale: 0, duration: 0.55, ease: "power3.in", stagger: { grid: gridOf(el), from: "center", amount: 0.45 } });
    };
    // let the new page paint its first frame under the tiles, then lift them
    const raf = requestAnimationFrame(() => requestAnimationFrame(open));

    // Back/forward from the cache restores the page as it was left - covered. Uncover it.
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) { gsap.set(tiles, { scale: 0 }); root.classList.remove("orv-curtain"); } };

    const onClick = (e: MouseEvent) => {
      if (reduced || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target && a.target !== "_self" || a.hasAttribute("download") || a.dataset.noCurtain !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page (hash links scroll)
      e.preventDefault();
      try { sessionStorage.setItem(CURTAIN_KEY, "1"); } catch { /* storage blocked: still transitions, just opens plain */ }
      const r = el.getBoundingClientRect();
      const [rows, cols] = gridOf(el);
      const from = Math.min(TILES - 1, Math.floor((e.clientY / r.height) * rows) * cols + Math.floor((e.clientX / r.width) * cols));
      gsap.killTweensOf(tiles);
      gsap.to(tiles, {
        scale: 1, duration: 0.45, ease: "power3.out", stagger: { grid: [rows, cols], from, amount: 0.4 },
        onComplete: () => location.assign(url.href),
      });
    };
    document.addEventListener("click", onClick);
    addEventListener("pageshow", onShow);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("click", onClick); removeEventListener("pageshow", onShow); };
  }, []);

  return (
    <div ref={ref} className="page-curtain" aria-hidden>
      {Array.from({ length: TILES }, (_, i) => <i key={i} />)}
    </div>
  );
}
