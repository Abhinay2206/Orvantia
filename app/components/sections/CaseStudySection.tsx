"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section, Eyebrow, SplitHeadline, Reveal, EASE } from "./_shared";
import AnimatedCounter from "../ui/AnimatedCounter";

/* ─── Animated dashboard mockup (browser-framed) ─────────── */
const BARS = [42, 68, 55, 80, 62, 91, 74, 88, 60, 96, 70, 84];

function DashboardMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div
      ref={ref}
      className="frosted"
      style={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Browser chrome */}
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
        <div
          style={{
            marginLeft: 12,
            flex: 1,
            maxWidth: 320,
            height: 22,
            borderRadius: 6,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-3)",
            letterSpacing: "0.05em",
          }}
        >
          app.factoryflow.io/dashboard
        </div>
      </div>

      {/* Dashboard body */}
      <div style={{ padding: "clamp(16px, 2vw, 26px)" }}>
        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { l: "Tasks Completed", v: 482, c: "#6366f1" },
            { l: "On-Time Rate", v: 96, s: "%", c: "#22d3ee" },
            { l: "Overdue Tasks", v: 4, s: "%", c: "#a855f7" },
          ].map((k) => (
            <div
              key={k.l}
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>
                {k.l}
              </div>
              <div style={{ fontFamily: "var(--font)", fontSize: "clamp(18px, 2.2vw, 26px)", fontWeight: 700, color: k.c, lineHeight: 1 }}>
                {inView ? <AnimatedCounter to={k.v} suffix={k.s ?? ""} duration={1500} /> : 0}
                {!inView && (k.s ?? "")}
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div
          style={{
            padding: "18px 18px 10px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-2)" }}>
              Task Completion Trend
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(34,197,94,0.8)" }}>▲ 18.2%</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(4px, 1vw, 10px)", height: 120 }}>
            {BARS.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={inView ? { height: `${h}%` } : {}}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.05 }}
                style={{
                  flex: 1,
                  borderRadius: "4px 4px 0 0",
                  background:
                    i === 9
                      ? "linear-gradient(to top, rgba(34,211,238,0.9), rgba(99,102,241,0.6))"
                      : "linear-gradient(to top, rgba(99,102,241,0.55), rgba(99,102,241,0.12))",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Phone mockup ───────────────────────────────────────── */
function PhoneMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: -6 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      className="frosted"
      style={{
        width: 148,
        borderRadius: 26,
        padding: 8,
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        background: "rgba(10,10,20,0.9)",
      }}
    >
      <div style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.02)", padding: 14 }}>
        <div style={{ height: 4, width: 40, borderRadius: 4, background: "rgba(255,255,255,0.12)", margin: "0 auto 16px" }} />
        <div style={{ fontFamily: "var(--mono)", fontSize: 7, letterSpacing: "0.2em", color: "var(--text-3)", marginBottom: 6 }}>TEAM A · LIVE</div>
        <div style={{ fontFamily: "var(--font)", fontSize: 22, fontWeight: 700, color: "#22d3ee", marginBottom: 14 }}>82%</div>
        {[70, 88, 54, 92].map((w, i) => (
          <div key={i} style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,0.05)", marginBottom: 8, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${w}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.6 + i * 0.1 }}
              style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const FEATURES = [
  "Task Management",
  "Workflow Management",
  "Team Collaboration",
  "Project & Department Organization",
  "Role-Based Access Control",
  "Progress Tracking",
  "Activity Timeline",
  "Comments & Discussions",
  "Real-time Notifications",
  "Analytics & Reports",
  "Dashboard Insights",
  "Secure Authentication",
  "Responsive Enterprise Dashboard",
];

export default function CaseStudySection() {
  return (
    <Section
      id="case-study"
      glow="radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34,211,238,0.08), transparent 60%)"
    >
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28 }}>
        <div style={{ maxWidth: 820 }}>
          <Reveal>
            <Eyebrow num="04" label="Featured Case Study" color="rgba(34,211,238,0.8)" />
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
                Enterprise Client Project
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.13}>
            <p
              style={{
                marginTop: 12,
                fontFamily: "var(--font)",
                fontSize: "clamp(15px, 1.5vw, 19px)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "var(--text)",
              }}
            >
              Enterprise Task &amp; Workflow Management Platform
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p style={{ marginTop: 14, fontSize: "clamp(15px, 1.5vw, 20px)", color: "var(--text-2)", maxWidth: "68ch", lineHeight: 1.6 }}>
              FactoryFlow is a modern enterprise SaaS platform developed by Orvantia to
              streamline task management and operational workflows within manufacturing
              organizations. The platform centralizes task assignment, workflow tracking,
              team collaboration, progress monitoring, analytics, and role-based access
              through a secure, intuitive, and scalable dashboard, enabling organizations
              to improve productivity and operational efficiency.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Device showcase */}
      <div style={{ position: "relative", marginTop: "clamp(44px, 6vw, 80px)" }}>
        <Reveal>
          <DashboardMock />
        </Reveal>
        <div style={{ position: "absolute", right: "clamp(-8px, 2vw, 40px)", bottom: "-48px" }} className="hidden md:block">
          <PhoneMock />
        </div>
      </div>

      {/* Challenge / Solution */}
      <div
        style={{
          marginTop: "clamp(72px, 9vw, 120px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: "clamp(16px, 2vw, 28px)",
        }}
      >
        {[
          { t: "The Challenge", c: "#a855f7", b: "Teams were coordinating tasks and approvals across scattered spreadsheets, chat threads, and email — with no shared view of who owned what, what was overdue, or how work was actually progressing across departments." },
          { t: "The Solution", c: "#22d3ee", b: "A secure, intuitive dashboard that centralizes task assignment, workflow tracking, and team collaboration — with role-based access, activity timelines, and real-time analytics so every department can see exactly where work stands." },
        ].map((x, i) => (
          <Reveal key={x.t} delay={i * 0.08}>
            <div className="glass-card" style={{ padding: "clamp(28px, 3vw, 40px)", borderRadius: "var(--radius-lg)", height: "100%" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: x.c, marginBottom: 16 }}>
                {x.t}
              </div>
              <p style={{ fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text)" }}>{x.b}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Key Features */}
      <div style={{ marginTop: "clamp(28px, 4vw, 48px)" }}>
        <Reveal>
          <div className="glass-card" style={{ padding: "clamp(28px, 3vw, 44px)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 24 }}>
              Key Features
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                gap: "clamp(14px, 1.8vw, 22px)",
              }}
            >
              {FEATURES.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 10px #6366f1", flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: "var(--text)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
