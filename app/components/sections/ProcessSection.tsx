"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !leftColRef.current || !rightColRef.current || !progressLineRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        // Pin the left column
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 20%",
          end: () => `+=${rightColRef.current!.offsetHeight - leftColRef.current!.offsetHeight}`,
          pin: leftColRef.current,
          pinSpacing: false,
        });
      });
      return () => ctx.revert();
    });

    // Both desktop and mobile: Progress line and step highlighting
    const ctx2 = gsap.context(() => {
      // Draw the progress line
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rightColRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
          }
        }
      );

      // Highlight steps as they enter the center of the viewport
      const steps = gsap.utils.toArray(".process-step");
      steps.forEach((step: any, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => gsap.to(step, { opacity: 1, filter: "blur(0px)", duration: 0.4 }),
          onLeave: () => gsap.to(step, { opacity: 0.3, filter: "blur(2px)", duration: 0.4 }),
          onEnterBack: () => gsap.to(step, { opacity: 1, filter: "blur(0px)", duration: 0.4 }),
          onLeaveBack: () => gsap.to(step, { opacity: 0.3, filter: "blur(2px)", duration: 0.4 }),
        });
        // Initial state
        gsap.set(step, { opacity: 0.3, filter: "blur(2px)" });
      });
    });

    return () => {
      mm.revert();
      ctx2.revert();
    };
  }, []);

  return (
    <Section
      id="process"
      ref={sectionRef}
      style={{ position: "relative", zIndex: 10 }}
      glow="radial-gradient(ellipse 50% 60% at 90% 50%, rgba(34,211,238,0.06), transparent 60%)"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-start">
        {/* Left Column (Pinned on Desktop) */}
        <div ref={leftColRef} style={{ maxWidth: 820, paddingBottom: 40 }} className="will-change-transform">
          <Reveal>
            <Eyebrow num="06" label="How We Work" color="rgba(34,211,238,0.8)" />
          </Reveal>
          <SplitHeadline
            text="A process engineered for *momentum."
            style={{ marginTop: 24, fontSize: "clamp(30px, 4.6vw, 62px)" }}
          />
        </div>

        {/* Right Column (Scrolling Steps) */}
        <div ref={rightColRef} style={{ position: "relative", paddingLeft: "clamp(28px, 4vw, 56px)" }}>
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
          <div
            ref={progressLineRef}
            style={{
              position: "absolute",
              left: "clamp(6px, 1vw, 12px)",
              top: 8,
              bottom: 8,
              width: 1,
              background: "linear-gradient(to bottom, #6366f1, #a855f7, #22d3ee)",
              boxShadow: "0 0 12px rgba(99,102,241,0.6)",
              transformOrigin: "top",
              transform: "scaleY(0)",
            }}
          />

          <div style={{ display: "grid", gap: "clamp(28px, 4vw, 48px)" }}>
            {STEPS.map((s, i) => (
              <div key={s.k} className="process-step" style={{ position: "relative", display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: "clamp(20px, 3vw, 40px)", alignItems: "baseline", willChange: "opacity, filter" }}>
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
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
