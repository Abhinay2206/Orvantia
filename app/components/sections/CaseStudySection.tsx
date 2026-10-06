"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { Section, Eyebrow, Reveal } from "./_shared";
import AnimatedCounter from "../ui/AnimatedCounter";

const METRICS = [
  { to: 231, decimals: 0, suffix: "", label: "Tasks Managed" },
  { to: 989, decimals: 0, suffix: "", label: "Activity Logs" },
  { to: 2.1, decimals: 1, suffix: "K", label: "Emails Delivered" },
  { to: 38, decimals: 0, suffix: "", label: "Concurrent Users" },
  { to: 0, decimals: 0, suffix: "", label: "Minutes Downtime" },
];

const BEFORE = [
  "Every task written by hand in a diary, one line per job",
  "Follow-ups chased over WhatsApp, message by message",
  "No shared view of who owned what",
  "Overdue work discovered too late, if at all",
  "Performance argued from memory, not data",
];

const AFTER = [
  "One system of record - no diary, nothing lost",
  "Follow-ups automated - 2.1K notifications in month one",
  "Ownership, priority and due date on every card",
  "Overdue surfaced automatically the moment it slips",
  "Scored, exportable productivity reports per member",
];

export const STEPS = [
  ["01", "Mapped the real workflow", "We sat with the floor and traced how work actually moves - who raises a task, who owns it, who signs it off - across every department and shift.", "#6366f1"],
  ["02", "Built one system of record", "Every task, department, and shift went into a single source of truth. The diary and the scattered chats were replaced by one place everyone trusts.", "#22d3ee"],
  ["03", "Automated the follow-ups", "Routing, priorities, due dates, and timed escalations now happen on their own - and 2.1K notifications went out in the first month.", "#a855f7"],
  ["04", "Deployed and handed over", "Shipped to production, trained the team, and handed over with credentials, a data policy, and a maintenance term.", "#3b82f6"],
];

export const CAPABILITIES = [
  "Task Management",
  "Workflow Automation",
  "Role-Based Access",
  "Query Threads",
  "Activity Timeline",
  "Real-time Notifications",
  "Excel Import / Export",
  "Analytics & Reports",
  "Productivity Scoring",
  "Secure Auth",
];

/* ─── Narrated product demo (captions are burned in, so it reads muted) ─── */
export function ProductDemo() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cinematic entrance: the product window tilts up and settles flat as it
  // scrolls into view.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        frame,
        { rotateX: 16, scale: 0.9, transformOrigin: "center top" },
        {
          rotateX: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "top 35%", scrub: 0.8 },
        }
      );
    });
    return () => mm.revert();
  }, []);

  // Plays muted while on screen. preload="none" keeps it off the network until then.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ perspective: 1400 }}>
      <div
        ref={frameRef}
        className="frosted"
        style={{
          willChange: "transform",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(248,113,113,0.6)" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(251,191,36,0.6)" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(34,197,94,0.6)" }} />
          <div style={{ marginLeft: 12, flex: 1, maxWidth: 340, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 12px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.05em", overflow: "hidden", whiteSpace: "nowrap" }}>
            app.factoryflow.io
          </div>
        </div>
        <video
          ref={videoRef}
          src="/case-study/factoryflow-demo.mp4"
          poster="/case-study/factoryflow-demo-poster.jpg"
          muted
          loop
          playsInline
          controls
          preload="none"
          aria-label="FactoryFlow product demo"
          style={{ display: "block", width: "100%", aspectRatio: "16 / 9", background: "#000" }}
        />
      </div>
      <p style={{ marginTop: 14, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)" }}>
        Product tour · 1:35 · unmute for narration
      </p>
    </div>
  );
}

/* ─── Before → After transformation (paired rows) ────────── */
export function Transformation() {
  const pairs = BEFORE.map((b, i) => ({ before: b, after: AFTER[i] }));
  return (
    <div>
      {/* Column labels (desktop) */}
      <div className="xform-row" style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(248,113,113,0.85)", paddingLeft: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(248,113,113,0.8)" }} />
          Before · Diary &amp; WhatsApp
        </div>
        <div />
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#22d3ee", paddingLeft: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 8px #22d3ee" }} />
          After · FactoryFlow
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {pairs.map((p, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="xform-row">
              {/* Before */}
              <div
                className="xform-cell is-before"
                style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.055)", borderLeft: "2px solid rgba(248,113,113,0.55)", background: "rgba(248,113,113,0.03)", padding: "14px 16px", display: "flex", gap: 11, alignItems: "flex-start" }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(248,113,113,0.65)", marginTop: 7, flexShrink: 0 }} />
                <span style={{ fontSize: "clamp(13px, 1.2vw, 15px)", lineHeight: 1.5, color: "var(--text-2)" }}>{p.before}</span>
              </div>

              {/* Arrow */}
              <div style={{ display: "grid", placeItems: "center" }}>
                <span className="xform-arrow" style={{ fontFamily: "var(--mono)", fontSize: 17, color: "rgba(34,211,238,0.75)", lineHeight: 1 }}>→</span>
              </div>

              {/* After */}
              <div
                className="xform-cell is-after"
                style={{ borderRadius: 12, border: "1px solid rgba(34,211,238,0.2)", borderLeft: "2px solid #22d3ee", background: "rgba(34,211,238,0.05)", padding: "14px 16px", display: "flex", gap: 11, alignItems: "flex-start" }}
              >
                <span style={{ color: "#22d3ee", fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "clamp(13px, 1.2vw, 15px)", lineHeight: 1.5, color: "var(--text)" }}>{p.after}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ─── Proof bar — real first-month production numbers ─── */
export function MetricsBar() {
  return (
        <Reveal>
          <div
            className="glass-card"
            style={{
              padding: "clamp(28px, 3.4vw, 46px)",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(10,10,20,0.6) 55%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                marginBottom: 28,
              }}
            >
              First month in production
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 118px), 1fr))",
                gap: "clamp(12px, 2.4vw, 32px)",
              }}
            >
              {METRICS.map((m) => (
                <div key={m.label} className="stat-cell" style={{ padding: "14px 16px" }}>
                  <div
                    className="g-text-cyan"
                    style={{
                      fontFamily: "var(--font)",
                      fontSize: "clamp(34px, 4.4vw, 56px)",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedCounter to={m.to} decimals={m.decimals} suffix={m.suffix} duration={1600} />
                  </div>
                  <div style={{ marginTop: 12, height: 2, width: 32, borderRadius: 2, background: "linear-gradient(90deg, #22d3ee, transparent)" }} />
                  <div
                    style={{
                      marginTop: 12,
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--text-3)",
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
  );
}

export default function CaseStudySection() {
  return (
    <Section
      id="case-study"
      style={{ position: "relative", zIndex: 10 }}
      glow="radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34,211,238,0.08), transparent 60%)"
    >
      {/* Header */}
      <div style={{ maxWidth: 900 }}>
        <Reveal>
          <Eyebrow num="02" label="Featured Case Study" color="rgba(34,211,238,0.8)" />
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26, flexWrap: "wrap" }}>
            <h2
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(38px, 6vw, 84px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
              }}
              className="g-text-cyan"
            >
              FactoryFlow
            </h2>
            <span className="status-pill" style={{ marginBottom: 8 }}>
              <span className="status-dot" />
              Live in Production
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              marginTop: 18,
              fontSize: "clamp(17px, 1.8vw, 23px)",
              color: "var(--text)",
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              maxWidth: "34ch",
              fontWeight: 600,
            }}
          >
            A manufacturing floor ran on a diary and WhatsApp. Now it runs on this.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <p style={{ marginTop: 14, fontSize: "clamp(15px, 1.4vw, 18px)", color: "var(--text-2)", maxWidth: "62ch", lineHeight: 1.65 }}>
            An enterprise task and workflow platform we designed, built, and shipped for
            <strong style={{ color: "var(--text)", fontWeight: 600 }}> Prayagh Consumer Care Pvt. Ltd.</strong> - now
            handling their real day-to-day operations across multiple departments.
          </p>
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)" }}>
            <span style={{ width: 22, height: 1, background: "rgba(34,211,238,0.5)" }} />
            Client · Prayagh Consumer Care Pvt. Ltd.
          </div>
        </Reveal>
      </div>

      {/* Narrated product tour */}
      <div style={{ marginTop: "clamp(40px, 5vw, 66px)" }}>
        <Reveal>
          <ProductDemo />
        </Reveal>
      </div>

      <div style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
        <MetricsBar />
      </div>

      <div style={{ marginTop: "clamp(32px, 4vw, 52px)", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Reveal>
          <a href="/case-study" className="btn-primary" data-cursor-hover style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.9), rgba(59,130,246,0.9))" }}>
            Read the full story →
          </a>
        </Reveal>
        <Reveal delay={0.08}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--text-3)" }}>
            The problem, how we fixed it, and what changed
          </span>
        </Reveal>
      </div>
    </Section>
  );
}
