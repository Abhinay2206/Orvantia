"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { useModal } from "@/app/components/providers/ModalProvider";
import { Eyebrow } from "./_shared";

/* ─── Visuals - each one is the real thing, not a decoration ─── */

function Phones() {
  const shots = ["/nutritionos/food-search.png", "/nutritionos/home.png", "/nutritionos/workout-log.png"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.18fr 1fr", gap: "clamp(8px, 1.4vw, 20px)", alignItems: "center", width: "min(100%, 520px)" }}>
      {shots.map((src, i) => (
        <div key={src} style={{ aspectRatio: "780 / 1688", borderRadius: 22, padding: 4, background: "linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))", boxShadow: "0 40px 90px rgba(0,0,0,0.55)", transform: `translateY(${i === 1 ? 0 : 28}px)` }}>
          <img src={src} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 18 }} />
        </div>
      ))}
    </div>
  );
}

// Verbatim from the ContextBridge docs.
export function Terminal() {
  return (
    <div style={{ width: "min(100%, 600px)", borderRadius: 10, overflow: "hidden", background: "#0b0d12", border: "1px solid var(--border-strong)", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
      <div style={{ display: "flex", gap: 7, padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["#f87171", "#fbbf24", "#4ade80"].map((c) => <i key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
      </div>
      <pre style={{ margin: 0, padding: "clamp(18px, 2.4vw, 30px)", fontFamily: "var(--mono)", fontSize: "clamp(11px, 1.05vw, 14px)", lineHeight: 1.85, color: "#d7dae0", whiteSpace: "pre-wrap" }}>
        <span style={{ color: "#6b7280" }}>$ </span>contextbridge run -- pytest -q{"\n"}
        E1 `pytest -q` → <span style={{ color: "#4ade80" }}>PASSED</span> (exit 0, 3.4s){"\n\n"}
        <span style={{ color: "#6b7280" }}>$ </span>contextbridge work add &quot;Login endpoint&quot; \{"\n"}
        {"    "}--status completed --evidence E1{"\n"}
        Updated: state.json, HANDOFF.md{"\n\n"}
        <span style={{ color: "#4ade80" }}>● READY</span> <span style={{ color: "#6b7280" }}>· safe to resume</span>
      </pre>
    </div>
  );
}

function Agents() {
  const a = [["RX", "Medication", "#6366f1"], ["SX", "Symptoms", "#22d3ee"], ["NX", "Nutrition", "#a855f7"], ["PX", "Progress", "#fbbf24"]];
  return (
    <div style={{ position: "relative", width: "min(calc(100% - 96px), 440px)", aspectRatio: "1", margin: "0 auto" }}>
      {[0, 1, 2].map((i) => <div key={i} className="orbit" style={{ position: "absolute", inset: `${i * 14}%`, borderRadius: "50%", border: "1px solid rgba(168,85,247,0.28)", animationDuration: `${22 + i * 10}s`, animationDirection: i % 2 ? "reverse" : "normal" }}><i style={{ position: "absolute", top: -4, left: "50%", width: 8, height: 8, borderRadius: "50%", background: a[i][2] }} /></div>)}
      <div style={{ position: "absolute", inset: "36%", display: "grid", placeItems: "center", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(20px, 2.4vw, 32px)", color: "#d8b4fe" }}>one plan</div>
      {a.map(([id, n, c], i) => {
        const pos = [{ left: "50%", top: "0%" }, { left: "100%", top: "50%" }, { left: "50%", top: "100%" }, { left: "0%", top: "50%" }][i];
        return (
          <div key={id} style={{ position: "absolute", ...pos, transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: "50%", border: `1px solid ${c}66`, background: "#07070e", color: c, fontFamily: "var(--mono)", fontSize: 13 }}>{id}</span>
            <div style={{ marginTop: 8, fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)" }}>{n}</div>
          </div>
        );
      })}
    </div>
  );
}

function Camera() {
  return (
    <div style={{ position: "relative", width: "min(100%, 600px)", aspectRatio: "16 / 10", borderRadius: 10, overflow: "hidden", background: "linear-gradient(180deg,#171d23 0%,#1f262c 58%,#161b20 100%)", border: "1px solid var(--border-strong)", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
      <svg viewBox="0 0 600 375" width="100%" height="100%" aria-hidden>
        <rect x="70" y="46" width="130" height="190" fill="#222a31" /><rect x="430" y="40" width="100" height="196" fill="#1d252b" />
        <g fill="#0c1013"><circle cx="318" cy="132" r="23" /><path d="M286 168 Q318 148 350 168 L360 260 L342 262 L338 334 L322 334 L318 276 L314 334 L298 334 L294 262 L276 260 Z" /></g>
        <g className="cam-box"><rect x="262" y="96" width="112" height="252" fill="none" stroke="#4ade80" strokeWidth="2.5" /><rect x="262" y="72" width="168" height="24" fill="#4ade80" /><text x="270" y="89" fontFamily="var(--mono)" fontSize="12" fill="#052e16">PERSON 0.97 · ID 014</text></g>
        {[[18, 18, 1, 1], [582, 18, -1, 1], [18, 357, 1, -1], [582, 357, -1, -1]].map(([x, y, sx, sy], i) => <path key={i} d={`M${x} ${y + 22 * sy} V${y} H${x + 22 * sx}`} stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="1.5" />)}
        <text x="40" y="44" fontFamily="var(--mono)" fontSize="12" fill="#e5e7eb">CAM 02 · 09:41:07</text>
        <text x="500" y="44" fontFamily="var(--mono)" fontSize="12" fill="#f87171">● REC</text>
        <text x="40" y="346" fontFamily="var(--mono)" fontSize="12" fill="#4ade80">✓ Checked in · 09:41</text>
      </svg>
    </div>
  );
}

function Web() {
  return (
    <div style={{ width: "min(100%, 620px)", borderRadius: 10, overflow: "hidden", background: "#050505", border: "1px solid var(--border-strong)", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["#f87171", "#fbbf24", "#4ade80"].map((c) => <i key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
        <span style={{ marginLeft: 12, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.06em", color: "var(--text-3)" }}>abhinay.vercel.app</span>
      </div>
      <div style={{ aspectRatio: "16 / 10", display: "grid", placeItems: "center", position: "relative" }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: "clamp(56px, 8vw, 118px)", color: "transparent", WebkitTextStroke: "1.2px rgba(226,232,240,0.8)", letterSpacing: "-0.02em", fontStyle: "italic" }}>Abhinay</span>
        <span style={{ position: "absolute", left: 18, bottom: 14, fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.16em", color: "rgba(226,232,240,0.45)" }}>WEBGL · KINETIC TYPE</span>
        <span style={{ position: "absolute", right: 18, bottom: 14, fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.16em", color: "#c4b5fd" }}>SELECTED WORK ↓</span>
      </div>
    </div>
  );
}

/* ─── The five projects ─── */
type Project = {
  n: string; name: string; kind: string; accent: string; line: string; meta: string;
  href?: string; ext?: { label: string; href: string }; visual: React.ReactNode;
};
const PROJECTS: Project[] = [
  { n: "01", name: "NutritionOS", kind: "Live · Free", accent: "#5fc2ab", href: "/products/nutritionos", ext: { label: "Open the app", href: "https://nutritionos.orvantia.in/" },
    line: "A fast, private nutrition and training tracker with a food database made for Indian kitchens. Built because our own team couldn't find one that wasn't paywalled.", meta: "Next.js · PWA · MongoDB", visual: <Phones /> },
  { n: "02", name: "ContextBridge", kind: "Open source · MIT", accent: "#4ade80", href: "/products/contextbridge", ext: { label: "Visit the site", href: "https://contextbridge.orvantia.in/" },
    line: "A resume safety gate for AI coding sessions. It checkpoints the real state of a repo and tells the next session whether it is safe to edit.", meta: "Python · Git · Local-first", visual: <Terminal /> },
  { n: "03", name: "EnteraFlux", kind: "Research stage", accent: "#c084fc", href: "/products/enteraflux", ext: { label: "Follow the research", href: "https://www.enteraflux.tech/" },
    line: "An AI health companion in research - cooperating agents for medication, symptoms, nutrition and progress. Proven first, public later.", meta: "Multi-agent · Health · R&D", visual: <Agents /> },
  { n: "04", name: "Attendance by camera", kind: "In demo", accent: "#22d3ee",
    line: "Face-recognition attendance from the cameras you already have. No cards, no registers, no buddy punching.", meta: "Computer vision · Edge", visual: <Camera /> },
  { n: "05", name: "Cinematic web", kind: "Portfolio", accent: "#c4b5fd", ext: { label: "View the live site", href: "https://abhinay.vercel.app/" },
    line: "Premium, WebGL-driven portfolios and landing pages that feel like a scene, not a template. This one is our founder's, live in production.", meta: "WebGL · Motion · Three.js", visual: <Web /> },
];

/**
 * Products - one pinned horizontal gallery. Scrolling the page slides sideways
 * through the projects while the section is pinned (swipe carousel on short phones).
 */
export default function ProductsGallery() {
  const { openModal } = useModal();
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current, track = trackRef.current;
    if (!wrap || !track) return;
    const mm = gsap.matchMedia();
    // desktop, and tall phones/tablets: pinned, scrolling the page slides the gallery sideways.
    // Short phones fall back to a native swipe carousel (the cards would not fit one screen).
    mm.add("(min-width: 1024px), (max-width: 1023px) and (min-height: 620px)", () => {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const total = PROJECTS.length;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            if (countRef.current) countRef.current.textContent = String(Math.min(total, Math.floor(self.progress * (total + 1)) )).padStart(2, "0");
          },
        },
      });
      // Depth: inside each panel the visual travels a touch faster than the track and the copy
      // a touch slower, so the slide has parallax; the intro title lingers as it leaves.
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const st = (trigger: Element, start = "left right") => ({ trigger, containerAnimation: tween, start, end: "right left", scrub: 0.7 });
        track.querySelectorAll(".pg-project").forEach((panel) => {
          gsap.fromTo(panel.querySelector(".pg-visual > *"), { xPercent: 16 }, { xPercent: -16, ease: "none", scrollTrigger: st(panel) });
          gsap.fromTo(panel.querySelector(".pg-copy"), { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: st(panel) });
        });
        const intro = track.querySelector(".pg-intro");
        if (intro) gsap.to(intro.firstElementChild, { xPercent: 22, ease: "none", scrollTrigger: st(intro, "left left") });
      }
      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="products" ref={wrapRef} className="pg-wrap" style={{ position: "relative", zIndex: 10, borderTop: "1px solid var(--border)" }}>
      <div className="pg-head">
        <Eyebrow num="04" label="Products & experiments" />
        <div className="pg-count" aria-hidden><span ref={countRef}>00</span> / {String(PROJECTS.length).padStart(2, "0")}</div>
      </div>

      <div ref={trackRef} className="pg-track">
        {/* intro panel */}
        <div className="pg-panel pg-intro">
          <h2 className="serif-display" style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(52px, 9vw, 150px)", lineHeight: 0.92, letterSpacing: "-0.03em" }}>
            Things we build<br />for <span className="accent-serif">ourselves.</span>
          </h2>
          <p style={{ marginTop: 28, maxWidth: "44ch", fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text-2)" }}>
            Beyond client work we ship our own products - to fix problems we face, and to push at what&apos;s next. Keep going - it slides sideways.
          </p>
          <span className="pg-cue" aria-hidden>Scroll →</span>
        </div>

        {PROJECTS.map((p) => (
          <article key={p.n} className="pg-panel pg-project" style={{ ["--ac" as string]: p.accent }}>
            <div className="pg-copy">
              <div className="pg-kind"><span>{p.n}</span><i />{p.kind}</div>
              <h3 className="pg-name">{p.name}</h3>
              <p className="pg-line">{p.line}</p>
              <div className="pg-meta">{p.meta}</div>
              <div className="pg-links">
                {p.href ? (
                  <a href={p.href} className="btn-primary" data-cursor-hover>View project →</a>
                ) : (
                  <button type="button" className="btn-primary" data-cursor-hover onClick={() => openModal("schedule")}>Ask about it →</button>
                )}
                {p.ext && <a href={p.ext.href} target="_blank" rel="noopener noreferrer" className="pg-ext" data-cursor-hover>{p.ext.label} ↗</a>}
              </div>
            </div>
            <div className="pg-visual">{p.visual}</div>
          </article>
        ))}
      </div>

      <div className="pg-bar" aria-hidden><div ref={barRef} /></div>
    </section>
  );
}
