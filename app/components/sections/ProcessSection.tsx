"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ORV_EASE } from "@/lib/motion";
import { Section, Eyebrow, SplitHeadline } from "./_shared";

const STEPS = [
  { k: "Understand", d: "We learn how your business runs today - who does what, and where time gets lost." },
  { k: "Plan & Quote", d: "A clear scope, timeline, and price before any code is written. No surprises." },
  { k: "Design", d: "Simple screens your team understands on day one - on phone or desktop." },
  { k: "Build & Test", d: "We build in small visible steps and test with your real data before launch." },
  { k: "Launch & Support", d: "We set it up, train your team, and stay on for fixes and improvements." },
];

/* Five steps across a rule that draws itself as each one enters. */
export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(".proc-line", { scaleX: 0 });
      gsap.set(".proc-text", { yPercent: 40, opacity: 0 });
      ScrollTrigger.batch(".proc-col", {
        start: "top 88%",
        once: true,
        onEnter: (cols) => {
          gsap.to(cols.map((c) => c.querySelector(".proc-line")), { scaleX: 1, duration: 1.2, ease: ORV_EASE, stagger: 0.12 });
          gsap.to(cols.map((c) => c.querySelector(".proc-text")), { yPercent: 0, opacity: 1, duration: 1, ease: ORV_EASE, stagger: 0.12, delay: 0.15 });
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Section id="process" style={{ position: "relative", zIndex: 10 }}>
      <Eyebrow num="05" label="How we work" />
      <SplitHeadline text="A simple process, *no surprises." style={{ marginTop: 30, fontSize: "clamp(34px, 5vw, 78px)", maxWidth: "14ch" }} />
      <div ref={ref} className="proc-grid">
        {STEPS.map((s, i) => (
          <div key={s.k} className="proc-col">
            <div className="proc-line" />
            <div className="proc-text">
              <span className="proc-n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="proc-k">{s.k}</h3>
              <p className="proc-d">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
