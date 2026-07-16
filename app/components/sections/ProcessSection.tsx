"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

const STEPS = [
  { k: "Discovery", d: "We immerse in your business, users, and constraints to define what winning looks like." },
  { k: "Planning", d: "Scope, architecture, and milestones — a clear map before a single line of code." },
  { k: "Research", d: "We de-risk the hard parts: feasibility spikes, models, and technical proofs." },
  { k: "Design", d: "Interaction and systems design that make the product feel inevitable." },
  { k: "Development", d: "Typed, tested, reviewed code shipped in tight, visible increments." },
  { k: "Testing", d: "Automated and human QA across correctness, performance, and security." },
  { k: "Deployment", d: "Zero-drama releases with observability and rollback built in." },
  { k: "Continuous Improvement", d: "We stay on — monitoring, iterating, and evolving with your business." },
];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section
      id="process"
      glow="radial-gradient(ellipse 50% 60% at 90% 50%, rgba(34,211,238,0.06), transparent 60%)"
    >
      <div style={{ maxWidth: 820, marginBottom: "clamp(52px, 6vw, 84px)" }}>
        <Reveal>
          <Eyebrow num="06" label="How We Work" color="rgba(34,211,238,0.8)" />
        </Reveal>
        <SplitHeadline
          text="A process engineered for *momentum."
          style={{ marginTop: 24, fontSize: "clamp(30px, 4.6vw, 62px)" }}
        />
      </div>

      <div ref={ref} style={{ position: "relative", paddingLeft: "clamp(28px, 4vw, 56px)" }}>
        {/* Track */}
        <div
          style={{
            position: "absolute",
            left: "clamp(6px, 1vw, 12px)",
            top: 8,
            bottom: 8,
            width: 1,
            background: "var(--border-strong)",
          }}
        />
        {/* Progress */}
        <motion.div
          style={{
            position: "absolute",
            left: "clamp(6px, 1vw, 12px)",
            top: 8,
            width: 1,
            height: lineHeight,
            background: "linear-gradient(to bottom, #6366f1, #a855f7, #22d3ee)",
            boxShadow: "0 0 12px rgba(99,102,241,0.6)",
          }}
        />

        <div style={{ display: "grid", gap: "clamp(28px, 4vw, 48px)" }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.k} delay={0.02}>
              <div style={{ position: "relative", display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: "clamp(20px, 3vw, 40px)", alignItems: "baseline" }}>
                {/* Node */}
                <div
                  style={{
                    position: "absolute",
                    left: "calc(clamp(6px, 1vw, 12px) - clamp(28px, 4vw, 56px))",
                    top: 6,
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: "var(--bg)",
                    border: "1px solid var(--indigo)",
                    transform: "translateX(-50%)",
                    boxShadow: "0 0 0 4px var(--bg)",
                  }}
                >
                  <span style={{ position: "absolute", inset: 3, borderRadius: "50%", background: "var(--indigo)", boxShadow: "0 0 8px var(--indigo)" }} />
                </div>

                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "clamp(24px, 3vw, 40px)",
                    fontWeight: 700,
                    color: "var(--text-4)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font)",
                      fontSize: "clamp(20px, 2.4vw, 32px)",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: "var(--text)",
                      marginBottom: 8,
                    }}
                  >
                    {s.k}
                  </h3>
                  <p style={{ fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "52ch" }}>
                    {s.d}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
