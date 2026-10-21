"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { Section, Eyebrow, Reveal, Drift } from "./_shared";
import AnimatedCounter from "../ui/AnimatedCounter";
import Testimonial from "./Testimonial";

const METRICS = [
  { to: 285, decimals: 0, suffix: "", label: "Tasks Managed" },
  { to: 1.6, decimals: 1, suffix: "K", label: "Activity Logs" },
  { to: 4.8, decimals: 1, suffix: "K", label: "Emails Delivered" },
  { to: 48, decimals: 0, suffix: "", label: "Concurrent Users" },
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
  "Follow-ups automated - 4.8K emails delivered in three months",
  "Ownership, priority and due date on every card",
  "Overdue surfaced automatically the moment it slips",
  "Scored, exportable productivity reports per member",
];

export const STEPS = [
  ["01", "Mapped the real workflow", "We sat with the floor and traced how work actually moves - who raises a task, who owns it, who signs it off - across every department and shift.", "#6366f1"],
  ["02", "Built one system of record", "Every task, department, and shift went into a single source of truth. The diary and the scattered chats were replaced by one place everyone trusts.", "#22d3ee"],
  ["03", "Automated the follow-ups", "Routing, priorities, due dates, and timed escalations now happen on their own - and 4.8K emails have gone out in three months in production.", "#a855f7"],
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

/* ─── Proof strip — real production numbers, three months in ─── */
export function MetricsBar() {
  return (
    <div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 20 }}>
        Three months in production
      </div>
      <div className="metric-strip">
        {METRICS.map((m) => (
          <div key={m.label} className="metric-cell">
            <div className="metric-num">
              <AnimatedCounter to={m.to} decimals={m.decimals} suffix={m.suffix} duration={1600} />
            </div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudySection() {
  return (
    <Section id="case-study" style={{ position: "relative", zIndex: 10 }}>
      <Reveal><Eyebrow num="02" label="In production" /></Reveal>

      <div className="cs-title-row">
        <Drift amount={12}><h2 className="cs-title serif-display">FactoryFlow</h2></Drift>
        <div className="cs-side">
          <span className="status-pill"><span className="status-dot" />Live in production</span>
          <div className="cs-client">Prayagh Consumer Care Pvt. Ltd.<br />Manufacturing</div>
        </div>
      </div>

      <div className="cs-lede">
        <Reveal>
          <p className="cs-quote">A manufacturing floor ran on a diary and <span className="accent-serif">WhatsApp.</span> Now it runs on this.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontSize: "clamp(15px, 1.35vw, 18px)", lineHeight: 1.7, color: "var(--text-2)", maxWidth: "46ch" }}>
            An enterprise task and workflow platform we designed, built and shipped for Prayagh Consumer Care - now handling their real day-to-day operations across multiple departments.
          </p>
          <a href="/case-study" className="btn-primary" data-cursor-hover style={{ marginTop: 28 }}>Read the full story →</a>
        </Reveal>
      </div>

      <div style={{ marginTop: "clamp(40px, 5vw, 72px)" }}>
        <Reveal><ProductDemo /></Reveal>
      </div>

      <div style={{ marginTop: "clamp(40px, 5vw, 72px)" }}>
        <Testimonial />
      </div>

      <div style={{ marginTop: "clamp(48px, 6vw, 88px)" }}>
        <Reveal><MetricsBar /></Reveal>
      </div>
    </Section>
  );
}
