"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: "01",
    title: "Human Intent",
    body: "A goal is expressed. Natural language, a strategic objective, or a structured directive – the system understands context and purpose.",
    color: "rgba(241,245,249,0.8)",
    accent: "#6366f1",
  },
  {
    n: "02",
    title: "Agent Coordination",
    body: "The orchestration layer decomposes the goal, assigns specialised agents, resolves dependencies and establishes execution order.",
    color: "rgba(241,245,249,0.8)",
    accent: "#a855f7",
  },
  {
    n: "03",
    title: "Autonomous Execution",
    body: "Agents reason, plan, act and verify in parallel. Self-correcting. No human in the loop required.",
    color: "rgba(241,245,249,0.8)",
    accent: "#22d3ee",
  },
  {
    n: "04",
    title: "Real-World Impact",
    body: "Decisions ship. Software deploys. Healthcare improves. Business outcomes materialise at machine speed.",
    color: "rgba(241,245,249,0.8)",
    accent: "#10b981",
  },
];

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  useEffect(() => {
    if (!lineRef.current || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 65%",
            end: "bottom 35%",
            scrub: 1.2,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="products"
      className="relative py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(30,10,70,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div
            className="text-[10px] tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "var(--mono)", color: "rgba(241,245,249,0.25)" }}
          >
            Intelligence In Motion
          </div>
          <h2
            className="font-bold leading-tight tracking-tight"
            style={{
              fontSize: "clamp(32px, 5vw, 60px)",
              fontFamily: "var(--font)",
              color: "rgba(241,245,249,0.85)",
            }}
          >
            From intent to impact -<br />
            <span className="g-text">fully autonomous.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[19px] top-0 bottom-0 w-px"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              ref={lineRef}
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, #6366f1, #a855f7, #22d3ee, #10b981)",
                transformOrigin: "top",
              }}
            />
          </div>

          <div className="space-y-14 pl-14">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.15 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Node */}
                <div
                  className="absolute -left-14 top-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: `${s.accent}15`,
                    border: `1px solid ${s.accent}40`,
                    boxShadow: `0 0 16px ${s.accent}20`,
                  }}
                >
                  <span
                    className="text-[10px] font-bold"
                    style={{ fontFamily: "var(--mono)", color: s.accent }}
                  >
                    {s.n}
                  </span>
                </div>

                <h3
                  className="text-xl md:text-2xl font-semibold mb-3"
                  style={{ fontFamily: "var(--font)", color: s.accent }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: "var(--font)", color: "rgba(241,245,249,0.38)" }}
                >
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
