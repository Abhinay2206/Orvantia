"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, ORV_EASE } from "@/lib/motion";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";
import RollText from "../ui/RollText";

const SITE_URL = "https://abhinay.vercel.app/";

const TAGS = ["3D / WebGL", "Kinetic Typography", "Real-time Particle Systems", "Cinematic Motion"];

/* ─── Miniature node network (original, inspired by the live site) ─── */
function NodeNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodes = [
    { x: 40, y: 60 }, { x: 70, y: 35 }, { x: 95, y: 70 }, { x: 55, y: 95 },
    { x: 230, y: 40 }, { x: 260, y: 68 }, { x: 245, y: 100 },
    { x: 300, y: 150 }, { x: 330, y: 178 }, { x: 310, y: 205 }, { x: 275, y: 190 },
  ];
  const edges: [number, number][] = [[0, 1], [1, 2], [0, 3], [2, 3], [4, 5], [5, 6], [4, 6], [7, 8], [8, 9], [9, 10], [7, 10]];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const lines = gsap.utils.toArray<SVGLineElement>(".net-edge", svg);
    if (!lines.length) return;
    gsap.set(lines, { drawSVG: "0%" });
    const st = ScrollTrigger.create({
      trigger: svg,
      start: "top 85%",
      once: true,
      onEnter: () => gsap.to(lines, { drawSVG: "100%", duration: 0.8, ease: ORV_EASE, stagger: 0.05 }),
    });
    return () => st.kill();
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 360 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.85 }} aria-hidden>
      {edges.map(([a, b], i) => (
        <line key={i} className="net-edge" x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="rgba(212,255,80,0.22)" strokeWidth="1" />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={i % 4 === 0 ? 3.4 : 2.2}
          fill={i % 4 === 0 ? "rgba(212,255,80,0.85)" : "rgba(148,163,184,0.55)"}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* ─── Illustrative mini-recreation, framed like a browser window ───── */
function PreviewFrame() {
  return (
    <div
      className="frosted"
      style={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Browser chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(248,113,113,0.6)" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(251,191,36,0.6)" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(34,197,94,0.6)" }} />
        <div style={{ marginLeft: 12, flex: 1, maxWidth: 320, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 12px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.05em", overflow: "hidden", whiteSpace: "nowrap" }}>
          abhinay.vercel.app
        </div>
      </div>

      {/* Illustrative scene - not a screenshot, our own rendering of the live site's motifs */}
      <div style={{ position: "relative", aspectRatio: "4/3", background: "#050505", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(212,255,80,0.06), transparent 60%)" }} />
        <NodeNetwork />

        {/* Top labels */}
        <div style={{ position: "absolute", top: 16, left: 18, fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: "0.08em", color: "rgba(226,232,240,0.4)" }}>
          ~/ABHINAY · PORTFOLIO V3
        </div>
        <div style={{ position: "absolute", top: 16, right: 18, fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.1em", color: "rgba(212,255,80,0.7)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#d4ff50", boxShadow: "0 0 6px #d4ff50" }} />
          SYSTEM ONLINE — HYDERABAD
        </div>

        {/* Kinetic outline wordmark */}
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font)",
              fontWeight: 800,
              fontSize: "clamp(38px, 8vw, 58px)",
              letterSpacing: "-0.02em",
              color: "transparent",
              WebkitTextStroke: "1.4px rgba(226,232,240,0.85)",
              textTransform: "uppercase",
            }}
          >
            Abhinay
          </span>
        </div>

        {/* Bottom copy + CTA row (real site copy) */}
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <p style={{ fontFamily: "var(--font)", fontSize: 10.5, lineHeight: 1.5, color: "rgba(226,232,240,0.55)", maxWidth: 190 }}>
            &ldquo;I build intelligent systems and cinematic web experiences.&rdquo;
          </p>
          <span style={{ fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: "0.1em", padding: "6px 12px", borderRadius: 100, background: "rgba(212,255,80,0.92)", color: "#0a0a0a", whiteSpace: "nowrap" }}>
            SELECTED WORK ↓
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  const previewRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { clipPath: "inset(14% 12% 14% 12% round 28px)", scale: 1.06 },
        {
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "center 55%", scrub: 0.8 },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <Section
      id="showcase"
      style={{ position: "relative", zIndex: 10 }}
      glow="radial-gradient(ellipse 60% 50% at 10% 20%, rgba(212,255,80,0.05), transparent 60%)"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
          gap: "clamp(32px, 5vw, 64px)",
          alignItems: "center",
        }}
      >
        {/* Copy */}
        <div style={{ maxWidth: 520 }}>
          <Reveal>
            <Eyebrow num="05" label="Showcase" color="rgba(212,255,80,0.85)" />
          </Reveal>
          <div style={{ marginTop: 24 }}>
            <SplitHeadline
              text="We also build the internet's *most cinematic pages."
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            />
          </div>
          <Reveal delay={0.15}>
            <p style={{ marginTop: 20, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text-2)", maxWidth: "50ch" }}>
              Beyond business software, we design and build premium, WebGL-driven
              portfolios and landing pages - the kind that feel less like a website
              and more like a scene. This one is built by our founder, live in
              production.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TAGS.map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "8px 15px",
                    borderRadius: 100,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    color: "var(--text-2)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <div style={{ marginTop: 32 }}>
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="btn-primary"
                style={{ background: "linear-gradient(135deg, rgba(212,255,80,0.95), rgba(163,230,53,0.9))", color: "#0a0a0a" }}
              >
                <RollText>Visit abhinay.vercel.app ↗</RollText>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Preview - opens up from a smaller window as it scrolls in */}
        <a
          ref={previewRef}
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit abhinay.vercel.app"
          data-cursor-text="VISIT ↗"
          style={{ display: "block", textDecoration: "none", color: "inherit" }}
        >
          <PreviewFrame />
        </a>
      </div>
    </Section>
  );
}
