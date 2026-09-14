"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Section, Eyebrow, Reveal, EASE } from "./_shared";
import AnimatedCounter from "../ui/AnimatedCounter";

/* ─── Real product screenshots ───────────────────────────── */
const VIEWS = [
  {
    key: "dashboard",
    tab: "Dashboard",
    src: "/case-study/factoryflow/dashboard.png",
    path: "app.factoryflow.io/dashboard",
    headline: "Every department, one glance",
    desc: "Live task distribution, completion rates, and today's priorities surfaced the moment a manager logs in.",
  },
  {
    key: "tasks",
    tab: "Task Board",
    src: "/case-study/factoryflow/tasks.png",
    path: "app.factoryflow.io/tasks",
    headline: "Work that moves, visibly",
    desc: "Kanban across Pending, In Progress, Completed and Overdue - with filters, priorities, and bulk Excel import.",
  },
  {
    key: "queries",
    tab: "Query Center",
    src: "/case-study/factoryflow/queries.png",
    path: "app.factoryflow.io/queries",
    headline: "Questions stop getting lost",
    desc: "Threaded queries attached to the task itself, with resolution tracking and average reply time in view.",
  },
  {
    key: "productivity",
    tab: "Productivity",
    src: "/case-study/factoryflow/productivity.png",
    path: "app.factoryflow.io/productivity",
    headline: "Performance you can defend",
    desc: "Scored leaderboards across completion, on-time, response and consistency - exportable to Excel, CSV, or PDF.",
  },
];

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

const CAPABILITIES = [
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

/* ─── Interactive screenshot viewer ──────────────────────── */
function ProductViewer() {
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-20%" });

  // Auto-advance until the visitor takes control.
  useEffect(() => {
    if (locked || !inView) return;
    const id = setInterval(() => setActive((i) => (i + 1) % VIEWS.length), 4200);
    return () => clearInterval(id);
  }, [locked, inView]);

  const view = VIEWS[active];

  return (
    <div ref={ref}>
      {/* Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {VIEWS.map((v, i) => {
          const on = i === active;
          return (
            <button
              key={v.key}
              onClick={() => {
                setActive(i);
                setLocked(true);
              }}
              style={{
                position: "relative",
                padding: "9px 18px",
                borderRadius: 100,
                border: `1px solid ${on ? "rgba(34,211,238,0.45)" : "rgba(255,255,255,0.08)"}`,
                background: on ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.02)",
                color: on ? "#22d3ee" : "var(--text-2)",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "color 0.3s, background 0.3s, border-color 0.3s",
              }}
            >
              {v.tab}
              {on && !locked && (
                <motion.span
                  key={active}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.2, ease: "linear" }}
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 1,
                    background: "rgba(34,211,238,0.8)",
                    borderRadius: 1,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Browser-framed screenshot */}
      <div
        className="frosted"
        style={{
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
          <div
            style={{
              marginLeft: 12,
              flex: 1,
              maxWidth: 340,
              height: 24,
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
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {view.path}
          </div>
        </div>

        {/* All frames stacked so every screenshot preloads and swaps instantly */}
        <div style={{ position: "relative", aspectRatio: "2047 / 1032", background: "rgba(255,255,255,0.02)" }}>
          {VIEWS.map((v, i) => (
            <motion.img
              key={v.key}
              src={v.src}
              alt={`FactoryFlow ${v.tab}`}
              initial={{ opacity: i === 0 ? 1 : 0 }}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Caption for the active view */}
      <div style={{ marginTop: 20, minHeight: 78 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(19px, 2vw, 26px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              {view.headline}
            </div>
            <p style={{ marginTop: 8, fontSize: "clamp(14px, 1.3vw, 17px)", color: "var(--text-2)", maxWidth: "72ch", lineHeight: 1.6 }}>
              {view.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Before → After transformation (paired rows) ────────── */
function Transformation() {
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

      {/* Interactive product tour */}
      <div style={{ marginTop: "clamp(40px, 5vw, 66px)" }}>
        <Reveal>
          <ProductViewer />
        </Reveal>
      </div>

      {/* Proof bar — real first-month production numbers */}
      <div style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
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
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
                gap: "clamp(20px, 2.4vw, 32px)",
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
      </div>

      {/* Before → After transformation */}
      <div style={{ marginTop: "clamp(36px, 4.5vw, 56px)" }}>
        <Reveal>
          <h3 style={{ fontFamily: "var(--font)", fontSize: "clamp(20px, 2.4vw, 30px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 }}>
            From lost notes to a system of record.
          </h3>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em", color: "var(--text-3)", marginBottom: 24 }}>
            Every problem the floor had - and what replaced it.
          </p>
        </Reveal>
        <Transformation />
      </div>

      {/* Capabilities */}
      <div style={{ marginTop: "clamp(28px, 3.4vw, 44px)" }}>
        <Reveal>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                marginRight: 6,
              }}
            >
              Shipped
            </span>
            {CAPABILITIES.map((c) => (
              <span
                key={c}
                data-cursor-hover
                className="cap-chip"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 100,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                  fontSize: 13,
                  color: "var(--text-2)",
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(34,211,238,0.7)", flexShrink: 0 }} />
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* View full case study */}
      <div style={{ marginTop: "clamp(32px, 4vw, 52px)" }}>
        <Reveal>
          <a href="/case-study" className="btn-primary" data-cursor-hover style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.9), rgba(59,130,246,0.9))" }}>
            View the full case study →
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
