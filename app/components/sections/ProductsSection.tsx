"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

gsap.registerPlugin(ScrollTrigger);

/* ─── Research / concept graphic (orbiting rings) ────────── */
function ResearchGraphic() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { rotate: 0 },
      {
        rotate: 90,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      }
    );
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

function EnterafluxPanel() {
  const research = ["Adaptive intake modeling", "Multi-agent reasoning core", "Real-world validation studies", "Private beta cohort"];
  return (
    <div
      id="enteraflux"
      className="glass-card"
      style={{ borderRadius: "var(--radius-xl)", padding: "clamp(32px, 4vw, 64px)", maxWidth: 1000, margin: "0 auto" }}
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
            agent-driven intelligence. Still deep in R&amp;D – we&apos;re pressure-testing
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
  return (
    <Section
      id="products"
      style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      glow="radial-gradient(ellipse 60% 50% at 50% 30%, rgba(99,102,241,0.07), transparent 60%)"
    >
      <div style={{ maxWidth: 820, marginBottom: "clamp(48px, 6vw, 80px)" }}>
        <Reveal>
          <Eyebrow num="01" label="Our Products" />
        </Reveal>
        <SplitHeadline
          text="A long-term investment, *built for the future."
          style={{ marginTop: 24, fontSize: "clamp(30px, 4.6vw, 62px)" }}
        />
        <Reveal delay={0.15}>
          <p style={{ marginTop: 24, maxWidth: "52ch", fontSize: "clamp(15px, 1.4vw, 19px)", lineHeight: 1.7, color: "var(--text-2)" }}>
            Beyond client work, Orvantia invests in frontier research that pushes the
            field forward.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <EnterafluxPanel />
      </Reveal>
    </Section>
  );
}
