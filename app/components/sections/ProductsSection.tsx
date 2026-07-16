"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section, Eyebrow, SplitHeadline, Reveal, EASE } from "./_shared";

gsap.registerPlugin(ScrollTrigger);

/* ─── Architecture node graphic (SVG) ────────────────────── */
function ArchGraphic() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("line");
    gsap.fromTo(
      paths,
      { strokeDasharray: "0, 1000" },
      {
        strokeDasharray: "1000, 1000",
        ease: "none",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "left center",
          end: "right center",
          horizontal: true,
          scrub: 1,
          containerAnimation: gsap.getById("products-scroll"),
        },
      }
    );
  }, []);

  const nodes = [
    { x: 130, y: 40, r: 20, label: "Core" },
    { x: 40, y: 120, r: 13 },
    { x: 130, y: 140, r: 15 },
    { x: 220, y: 120, r: 13 },
    { x: 80, y: 200, r: 10 },
    { x: 180, y: 200, r: 10 },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [2, 4], [2, 5], [1, 4], [3, 5],
  ];
  return (
    <svg ref={svgRef} viewBox="0 0 260 240" style={{ width: "100%", height: "auto" }}>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="rgba(99,102,241,0.35)"
          strokeWidth={1}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={i === 0 ? "rgba(99,102,241,0.18)" : "rgba(34,211,238,0.12)"}
          stroke={i === 0 ? "rgba(129,140,248,0.8)" : "rgba(34,211,238,0.55)"}
          strokeWidth={1.2}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.09 }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}
    </svg>
  );
}

/* ─── Research / concept graphic (orbiting rings) ────────── */
function ResearchGraphic() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      rotate: 360,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "left right",
        end: "right left",
        horizontal: true,
        scrub: 0.5,
        containerAnimation: gsap.getById("products-scroll"),
      },
    });
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", aspectRatio: "1", maxWidth: 260, margin: "0 auto" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-spin-slow"
          style={{
            position: "absolute",
            inset: `${i * 16}%`,
            borderRadius: "50%",
            border: `1px solid rgba(168,85,247,${0.4 - i * 0.1})`,
            animationDuration: `${10 + i * 6}s`,
            animationDirection: i % 2 ? "reverse" : "normal",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -4,
              left: "50%",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i === 0 ? "#22d3ee" : i === 1 ? "#a855f7" : "#6366f1",
              boxShadow: `0 0 12px currentColor`,
            }}
          />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          inset: "38%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.4), rgba(99,102,241,0.1))",
          boxShadow: "0 0 40px rgba(168,85,247,0.4)",
        }}
      />
    </div>
  );
}

function ContinuumPanel() {
  const roadmap = [
    { q: "v1.0", t: "Core runtime & plugin API", done: true },
    { q: "v1.4", t: "Distributed orchestration", done: true },
    { q: "v2.0", t: "Self-optimizing pipelines", done: false },
    { q: "v2.x", t: "Community model registry", done: false },
  ];
  return (
    <div
      id="continuum"
      className="product-card glass-card"
      style={{ borderRadius: "var(--radius-xl)", padding: "clamp(32px, 4vw, 64px)", width: "85vw", maxWidth: 1000, flexShrink: 0, "--card-accent": "linear-gradient(90deg, #6366f1, #22d3ee)" } as React.CSSProperties}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }} className="product-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "5px 12px",
                borderRadius: 100,
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.28)",
                color: "rgba(251,191,36,0.9)",
              }}
            >
              ◆ Under Development
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--text-3)" }}>
              FLAGSHIP
            </span>
          </div>

          <h3 style={{ fontFamily: "var(--font)", fontSize: "clamp(34px, 4.6vw, 60px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1 }} className="g-text">
            Continuum OS
          </h3>
          <p style={{ marginTop: 20, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text-2)", maxWidth: "46ch" }}>
            Our engineering operating system — a composable runtime for autonomous
            pipelines, plugins, and distributed orchestration. Currently under active
            development, engineered for the next decade of software.
          </p>

          {/* Roadmap */}
          <div style={{ marginTop: 34 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 18 }}>
              Roadmap
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {roadmap.map((r, i) => (
                <Reveal key={r.q} delay={i * 0.06}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: r.done ? "#22d3ee" : "transparent",
                        border: r.done ? "none" : "1px solid var(--text-3)",
                        boxShadow: r.done ? "0 0 10px #22d3ee" : "none",
                      }}
                    />
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--indigo)", width: 44, flexShrink: 0 }}>{r.q}</span>
                    <span style={{ fontSize: 14, color: r.done ? "var(--text)" : "var(--text-2)" }}>{r.t}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 34, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="https://continuumos.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary" data-cursor-hover>
              Explore Continuum
            </a>
            <a href="https://continuumos.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-secondary" data-cursor-hover>
              ★ Contribute
            </a>
          </div>
        </div>

        {/* Architecture visual */}
        <Reveal delay={0.15}>
          <div
            style={{
              padding: "clamp(24px, 3vw, 40px)",
              borderRadius: "var(--radius-lg)",
              background: "rgba(99,102,241,0.04)",
              border: "1px solid rgba(99,102,241,0.14)",
            }}
          >
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 20, textAlign: "center" }}>
              Architecture
            </div>
            <ArchGraphic />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function EnterafluxPanel() {
  const research = ["Adaptive intake modeling", "Multi-agent reasoning core", "Real-world validation studies", "Private beta cohort"];
  return (
    <div
      id="enteraflux"
      className="product-card glass-card"
      style={{ borderRadius: "var(--radius-xl)", padding: "clamp(32px, 4vw, 64px)", width: "85vw", maxWidth: 1000, flexShrink: 0, "--card-accent": "linear-gradient(90deg, #a855f7, #6366f1)" } as React.CSSProperties}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.35fr)", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }} className="product-grid product-grid-rev">
        {/* Concept visual */}
        <Reveal delay={0.15} className="enteraflux-visual">
          <div
            style={{
              padding: "clamp(30px, 4vw, 56px)",
              borderRadius: "var(--radius-lg)",
              background: "rgba(168,85,247,0.05)",
              border: "1px solid rgba(168,85,247,0.16)",
            }}
          >
            <ResearchGraphic />
          </div>
        </Reveal>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "5px 12px",
                borderRadius: 100,
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "rgba(196,140,255,0.95)",
              }}
            >
              ◇ Research Stage
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--text-3)" }}>
              R&amp;D INITIATIVE
            </span>
          </div>

          <h3 style={{ fontFamily: "var(--font)", fontSize: "clamp(34px, 4.6vw, 60px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1 }} className="g-text-violet">
            EnteraFlux
          </h3>
          <p style={{ marginTop: 20, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text-2)", maxWidth: "46ch" }}>
            An ambitious research initiative exploring the frontier of adaptive,
            agent-driven intelligence. Still deep in R&amp;D — we&apos;re pressure-testing
            the science before it ever reaches production.
          </p>

          <div style={{ marginTop: 34 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 18 }}>
              Research Roadmap
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {research.map((r, i) => (
                <Reveal key={r} delay={i * 0.06} as="span">
                  <span
                    style={{
                      display: "inline-block",
                      padding: "9px 16px",
                      borderRadius: 100,
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: "0.04em",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(168,85,247,0.2)",
                      color: "var(--text-2)",
                    }}
                  >
                    {r}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 34 }}>
            <span
              className="animated-border"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 24px",
                borderRadius: 100,
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--text)",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 10px #a855f7" }} />
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const panels = gsap.utils.toArray(".product-card");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => `+=${containerRef.current!.scrollWidth - window.innerWidth}`,
          id: "products-scroll",
        },
      });

      tl.to(containerRef.current, {
        x: () => -(containerRef.current!.scrollWidth - window.innerWidth + 80),
        ease: "none",
      });

      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <Section
      id="products"
      ref={sectionRef}
      style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", overflow: "hidden" }}
      glow="radial-gradient(ellipse 60% 50% at 50% 30%, rgba(99,102,241,0.07), transparent 60%)"
    >
      <div style={{ maxWidth: 820, marginBottom: "clamp(48px, 6vw, 80px)" }}>
        <Reveal>
          <Eyebrow num="05" label="Products" />
        </Reveal>
        <SplitHeadline
          text="Long-term innovations, *built for the future."
          style={{ marginTop: 24, fontSize: "clamp(30px, 4.6vw, 62px)" }}
        />
        <Reveal delay={0.15}>
          <p style={{ marginTop: 24, maxWidth: "52ch", fontSize: "clamp(15px, 1.4vw, 19px)", lineHeight: 1.7, color: "var(--text-2)" }}>
            Beyond client work, Orvantia invests in products that push the field forward —
            from an engineering operating system in active development to frontier AI research.
          </p>
        </Reveal>
      </div>

      <div ref={containerRef} data-cursor-text="DRAG" style={{ display: "flex", gap: "clamp(20px, 2.5vw, 32px)", width: "max-content", paddingRight: 80, cursor: "none" }}>
        <ContinuumPanel />
        <EnterafluxPanel />
      </div>
    </Section>
  );
}
