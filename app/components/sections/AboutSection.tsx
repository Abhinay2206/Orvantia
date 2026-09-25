"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

gsap.registerPlugin(ScrollTrigger);

/* The everyday problems growing businesses bring to us - and what we do about them. */
const PILLARS = [
  { k: "Work lives in diaries and WhatsApp", d: "We move it into one system your whole team can see, update, and act on." },
  { k: "Follow-ups depend on someone remembering", d: "Reminders, escalations, and updates go out automatically - nothing slips." },
  { k: "Reports take hours to put together", d: "Live dashboards show sales, tasks, and performance the moment you log in." },
  { k: "Off-the-shelf tools don't fit", d: "We build around how your business already runs, not the other way round." },
  { k: "Big-agency software feels out of reach", d: "Right-sized for growing businesses - practical scope, no enterprise bloat." },
  { k: "Nobody to call after launch", d: "We train your team and stay on for fixes, updates, and improvements." },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current || !leftColRef.current || !rightColRef.current) return;

    // We only want the pin effect on desktop where we have two columns
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        // 1. Pin the left column while the right column scrolls
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 15%",
          end: () => `+=${rightColRef.current!.offsetHeight - leftColRef.current!.offsetHeight}`,
          pin: leftColRef.current,
          pinSpacing: false,
        });

        // 2. Cinematic stagger reveal for the cards
        const cards = cardsRef.current.filter(Boolean);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rightColRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      });
      // 3. Cinematic exit (Deck of cards effect)
      gsap.to([leftColRef.current, rightColRef.current], {
        scale: 0.9,
        opacity: 0.2,
        y: -100,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center top",
          end: "bottom top",
          scrub: true,
        }
      });
      
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <Section
      id="about"
      ref={sectionRef}
      style={{ position: "relative", zIndex: 10, background: "var(--bg)", borderTop: "1px solid var(--border)" }}
      glow="radial-gradient(ellipse 60% 50% at 15% 20%, rgba(99,102,241,0.09), transparent 60%)"
    >
      <div
        style={{
          display: "grid",
          gap: "clamp(48px, 7vw, 96px)",
          alignItems: "start",
        }}
        className="grid-cols-1 lg:grid-cols-[1fr_1.2fr]"
      >
        {/* Header - Pinned Column */}
        <div ref={leftColRef} style={{ maxWidth: 620, paddingBottom: "40px" }} className="will-change-transform">
          <Reveal>
            <Eyebrow num="01" label="What We Fix" />
          </Reveal>
          <SplitHeadline
            text="Software that makes everyday business *simpler."
            style={{ marginTop: 26, fontSize: "clamp(30px, 4.6vw, 62px)" }}
          />
          <Reveal delay={0.15}>
            <p style={{ marginTop: 22, maxWidth: "44ch", fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text-2)" }}>
              We work with growing businesses that still run on paper, spreadsheets,
              and chat - and replace the manual work with systems that just run.
            </p>
          </Reveal>
        </div>

        {/* Pillars grid - Scrolling Column */}
        <div
          ref={rightColRef}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 16,
          }}
        >
          {PILLARS.map((p, i) => (
            <div
              key={p.k}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="about-pillar glass-card"
              style={{
                background: "rgba(255,255,255,0.02)",
                padding: "clamp(32px, 4vw, 48px)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                willChange: "transform, opacity, filter",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: "rgba(99,102,241,0.8)",
                  }}
                >
                  0{i + 1}
                </span>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font)",
                    fontSize: "clamp(20px, 2vw, 26px)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    marginBottom: 12,
                  }}
                >
                  {p.k}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-2)" }}>
                  {p.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
