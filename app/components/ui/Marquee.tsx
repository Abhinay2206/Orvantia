"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";

const ROW1 = ["Business Automation", "SaaS Platforms", "Custom Software", "AI Assistants"];
const ROW2 = ["Dashboards & Reports", "Web & Mobile Apps", "3D Websites", "Support After Launch"];

/* One strip of words; rendered twice back-to-back so a -50% shift loops seamlessly. */
function Strip({ words, serif }: { words: string[]; serif?: boolean }) {
  return (
    <>
      {[0, 1].map((copy) => (
        <div key={copy} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {words.map((w) => (
            <Word key={w} word={w} serif={serif} />
          ))}
        </div>
      ))}
    </>
  );
}

function Word({ word, serif }: { word: string; serif?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
      <span
        style={
          serif
            ? {
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "1.08em",
                letterSpacing: "-0.01em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(199,203,255,0.45)",
              }
            : { fontFamily: "var(--font)", fontWeight: 600, letterSpacing: "-0.04em", color: "rgba(241,245,249,0.9)" }
        }
      >
        {word}
      </span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          fontSize: "0.34em",
          margin: "0 0.9em",
          color: serif ? "rgba(168,85,247,0.7)" : "rgba(129,140,248,0.8)",
          transform: "translateY(-0.1em)",
        }}
      >
        ✦
      </span>
    </span>
  );
}

/**
 * Kinetic marquee - two oversized rows drifting in opposite directions.
 * Scroll velocity speeds them up and leans them into the motion; scrolling
 * back up flips their direction.
 */
export default function Marquee() {
  const rootRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!root || !r1 || !r2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrap = gsap.utils.wrap(-50, 0);
    const setX1 = gsap.quickSetter(r1, "xPercent");
    const setX2 = gsap.quickSetter(r2, "xPercent");
    const skew = gsap.quickTo([r1, r2], "skewX", { duration: 0.5, ease: "power3" });

    let x1 = 0;
    let x2 = -25;
    let dir = 1;
    let boost = 0;
    let leaning = false;
    const BASE = 1.4; // xPercent per second at rest

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        dir = self.direction;
        boost = Math.min(Math.abs(v) / 260, 14);
        skew(gsap.utils.clamp(-7, 7, -v / 320));
        leaning = true;
      },
    });

    const tick = (_t: number, dt: number) => {
      const step = ((BASE + boost) * dt) / 1000;
      x1 = wrap(x1 - step * dir);
      x2 = wrap(x2 + step * dir);
      setX1(x1);
      setX2(x2);
      boost *= 0.93;
      if (leaning && boost < 0.15) {
        skew(0);
        leaning = false;
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const rowStyle: React.CSSProperties = {
    display: "flex",
    width: "max-content",
    willChange: "transform",
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{
        padding: "clamp(28px, 5vw, 64px) 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontSize: "clamp(40px, 7.5vw, 116px)",
        lineHeight: 1.08,
      }}
    >
      <p className="sr-only">What we build: {[...ROW1, ...ROW2].join(", ")}</p>
      <div ref={row1Ref} style={rowStyle} aria-hidden>
        <Strip words={ROW1} />
      </div>
      <div ref={row2Ref} style={rowStyle} aria-hidden>
        <Strip words={ROW2} serif />
      </div>

      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{ width: "12vw", background: "linear-gradient(90deg, var(--bg), transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{ width: "12vw", background: "linear-gradient(-90deg, var(--bg), transparent)" }}
      />
    </div>
  );
}
