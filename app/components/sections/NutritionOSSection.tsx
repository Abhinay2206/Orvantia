"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";
import RollText from "../ui/RollText";

const APP_URL = "https://nutritionos.orvantia.in/";
const ACCENT = "#5fc2ab"; // the app's own teal

const FEATURES = [
  "Telangana & Indian food database",
  "Calorie & macro tracking",
  "Workout logger with progression",
  "Installable PWA",
];

const PHONES = [
  { src: "/nutritionos/food-search.png", alt: "NutritionOS food search showing Indian dishes", depth: -28, tilt: -4 },
  { src: "/nutritionos/home.png", alt: "NutritionOS home screen with calorie ring and macros", depth: -56, tilt: 0 },
  { src: "/nutritionos/workout-log.png", alt: "NutritionOS workout logger with progression suggestion", depth: -28, tilt: 4 },
];

/* Phone bezel wrapping a real app screenshot. */
function Phone({ src, alt, center }: { src: string; alt: string; center?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "780 / 1688",
        borderRadius: "clamp(16px, 2.4vw, 30px)",
        padding: "clamp(3px, 0.5vw, 6px)",
        background: "linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))",
        boxShadow: center
          ? `0 50px 120px rgba(0,0,0,0.65), 0 0 60px rgba(95,194,171,0.16), 0 0 0 1px rgba(255,255,255,0.08)`
          : "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "clamp(13px, 2vw, 25px)" }}
      />
    </div>
  );
}

export default function NutritionOSSection() {
  const phonesRef = useRef<HTMLDivElement>(null);

  // Gentle parallax: each phone drifts at its own rate as you scroll past.
  useEffect(() => {
    const root = phonesRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const els = gsap.utils.toArray<HTMLElement>(".ns-phone", root);
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: PHONES[i].depth,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
          }
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <Section
      id="nutritionos"
      style={{ position: "relative", zIndex: 10, background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      glow="radial-gradient(ellipse 55% 60% at 85% 45%, rgba(95,194,171,0.09), transparent 62%)"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
          gap: "clamp(40px, 6vw, 88px)",
          alignItems: "center",
        }}
      >
        {/* Story */}
        <div style={{ maxWidth: 560 }}>
          <Reveal>
            <Eyebrow num="04" label="Built for ourselves" color="rgba(95,194,171,0.85)" />
          </Reveal>
          <div style={{ marginTop: 24 }}>
            <SplitHeadline
              text="We built it because *nothing good existed."
              style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
            />
          </div>

          <Reveal delay={0.12}>
            <p style={{ marginTop: 22, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text-2)", maxWidth: "52ch" }}>
              Our team goes to the gym, and every nutrition app we tried was
              paywalled, cluttered, or clueless about the food we actually eat.
              So we made our own - fast, beautiful, free, and built around Indian
              meals. It solved a small problem for us and changed our daily
              routine more than we expected.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FEATURES.map((f) => (
                <span
                  key={f}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "8px 15px", borderRadius: 100,
                    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)",
                    fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.04em", color: "var(--text-2)",
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />
                  {f}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div
              style={{
                marginTop: 30, paddingLeft: 18, borderLeft: `2px solid ${ACCENT}`,
                fontSize: "clamp(15px, 1.4vw, 17px)", lineHeight: 1.6, color: "var(--text)", maxWidth: "46ch", fontWeight: 500,
              }}
            >
              That&apos;s how we work: find a real problem, then build the fix
              that makes life easier.
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div style={{ marginTop: 34, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="btn-primary"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #3fa58e)`, color: "#04120e" }}
              >
                <RollText>Open NutritionOS ↗</RollText>
              </a>
              <span className="status-pill" style={{ display: "inline-flex" }}>
                <span className="status-dot" />
                Live &amp; free
              </span>
            </div>
          </Reveal>
        </div>

        {/* Phones */}
        <Reveal delay={0.1}>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open NutritionOS"
            data-cursor-text="OPEN ↗"
            style={{ display: "block", textDecoration: "none" }}
          >
          <div
            ref={phonesRef}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.18fr 1fr",
              gap: "clamp(8px, 1.6vw, 22px)",
              alignItems: "center",
              maxWidth: 640,
              margin: "0 auto",
              padding: "clamp(20px, 3vw, 44px) 0",
            }}
          >
            {PHONES.map((p, i) => (
              <div
                key={p.src}
                className="ns-phone"
                style={{ transform: `rotate(${p.tilt}deg)`, willChange: "transform" }}
              >
                <Phone src={p.src} alt={p.alt} center={i === 1} />
              </div>
            ))}
          </div>
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
