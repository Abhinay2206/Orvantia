"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

function usePhrase(sp: MotionValue<number>, start: number, end: number) {
  const b = (end - start) * 0.28;
  return {
    opacity: useTransform(sp, [start, start + b, end - b, end], [0, 1, 1, 0]),
    y: useTransform(sp, [start, start + b, end - b, end], [64, 0, 0, -64]),
    scale: useTransform(sp, [start, start + b], [0.95, 1]),
  };
}

const PHRASES = [
  {
    text: "We build AI",
    tag: "01 — VISION",
    size: "clamp(56px, 10.5vw, 144px)",
    style: { color: "rgba(241,245,249,0.24)" },
    bar: "rgba(255,255,255,0.07)",
  },
  {
    text: "that transforms industries.",
    tag: "02 — IMPACT",
    size: "clamp(56px, 10.5vw, 144px)",
    style: { color: "rgba(241,245,249,0.92)" },
    bar: "rgba(255,255,255,0.14)",
  },
  {
    text: "Autonomous products.",
    tag: "03 — PRODUCTS",
    size: "clamp(44px, 8vw, 112px)",
    gradient: true,
    bar: "rgba(99,102,241,0.5)",
    style: {},
  },
  {
    text: "For enterprise scale.",
    tag: "04 — SCALE",
    size: "clamp(26px, 4.5vw, 62px)",
    style: { color: "rgba(99,102,241,0.75)", fontFamily: "var(--mono)" },
    bar: "rgba(99,102,241,0.32)",
    mono: true,
  },
];

export default function ManifestoScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const p0 = usePhrase(scrollYProgress, 0.0, 0.25);
  const p1 = usePhrase(scrollYProgress, 0.25, 0.50);
  const p2 = usePhrase(scrollYProgress, 0.50, 0.75);
  const p3 = usePhrase(scrollYProgress, 0.75, 1.0);
  const phrases = [p0, p1, p2, p3];

  const d0 = useTransform(scrollYProgress, [0, 0.125, 0.25], [0.25, 1, 0.25]);
  const d1 = useTransform(scrollYProgress, [0.25, 0.375, 0.5], [0.25, 1, 0.25]);
  const d2 = useTransform(scrollYProgress, [0.5, 0.625, 0.75], [0.25, 1, 0.25]);
  const d3 = useTransform(scrollYProgress, [0.75, 0.875, 1.0], [0.25, 1, 0.25]);
  const dots = [d0, d1, d2, d3];

  const glowOpacity = useTransform(scrollYProgress, [0.42, 0.56, 0.72], [0, 0.2, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  return (
    <div ref={ref} id="story" style={{ height: "500vh" }}>
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh", background: "var(--bg)" }}
      >
        <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(99,102,241,0.16), transparent 65%)",
            opacity: glowOpacity,
          }}
        />

        {PHRASES.map((phrase, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 md:px-24"
            style={{
              opacity: phrases[i].opacity,
              y: phrases[i].y,
              scale: phrases[i].scale,
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "10px",
                letterSpacing: "0.42em",
                textTransform: "uppercase" as const,
                color: "rgba(241,245,249,0.12)",
                marginBottom: "clamp(24px, 4vw, 40px)",
              }}
            >
              {phrase.tag}
            </div>

            <h2
              style={{
                fontSize: phrase.size,
                fontFamily: phrase.mono ? "var(--mono)" : "var(--font)",
                fontWeight: 700,
                lineHeight: 0.94,
                letterSpacing: "-0.03em",
                maxWidth: "95vw",
                ...(phrase.gradient
                  ? {
                      background:
                        "linear-gradient(135deg, #f1f5f9 10%, rgba(129,140,248,0.95) 48%, rgba(168,85,247,0.9) 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
                  : phrase.style),
              }}
            >
              {phrase.text}
            </h2>

            <div
              style={{
                marginTop: "clamp(24px, 4vw, 40px)",
                width: "clamp(32px, 5vw, 72px)",
                height: "1px",
                background: phrase.bar,
              }}
            />
          </motion.div>
        ))}

        {/* Right-side progress dots */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-2.5"
          style={{ right: "clamp(24px, 3vw, 48px)" }}
        >
          {dots.map((dot, i) => (
            <motion.div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.9)",
                opacity: dot,
              }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: hintOpacity }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase" as const,
              color: "rgba(241,245,249,0.18)",
            }}
          >
            scroll to explore
          </div>
          <motion.div
            style={{
              width: "1px",
              height: "32px",
              background: "linear-gradient(to bottom, rgba(99,102,241,0.6), transparent)",
            }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
