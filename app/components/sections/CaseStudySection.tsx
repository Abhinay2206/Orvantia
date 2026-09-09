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
  "Tasks scattered across spreadsheets, chat and email",
  "No shared view of who owned what",
  "Overdue work discovered too late",
  "Follow-ups chased manually, one message at a time",
  "Performance argued from memory, not data",
];

const AFTER = [
  "One system of record for every task and department",
  "Ownership, priority and due date on every card",
  "Overdue surfaced automatically the moment it slips",
  "2.1K automated notifications in the first month alone",
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

/* ─── Before → After story ───────────────────────────────── */
function BeforeAfter() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        gap: "clamp(16px, 2vw, 28px)",
      }}
    >
      {[
        { label: "Before", color: "rgba(248,113,113,0.85)", items: BEFORE, mark: "—" },
        { label: "After", color: "#22d3ee", items: AFTER, mark: "→" },
      ].map((col, ci) => (
        <Reveal key={col.label} delay={ci * 0.08}>
          <div
            className="glass-card"
            style={{
              padding: "clamp(26px, 3vw, 38px)",
              borderRadius: "var(--radius-lg)",
              height: "100%",
              background: "rgba(10,10,20,0.6)",
              backdropFilter: "blur(12px)",
              borderTop: `1px solid ${col.color}`,
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: col.color,
                marginBottom: 22,
              }}
            >
              {col.label} FactoryFlow
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {col.items.map((item) => (
                <div key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      color: col.color,
                      lineHeight: 1.5,
                      flexShrink: 0,
                    }}
                  >
                    {col.mark}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(14px, 1.3vw, 16px)",
                      lineHeight: 1.55,
                      color: ci === 0 ? "var(--text-2)" : "var(--text)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
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
            A manufacturing floor ran on spreadsheets. Now it runs on this.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <p style={{ marginTop: 14, fontSize: "clamp(15px, 1.4vw, 18px)", color: "var(--text-2)", maxWidth: "62ch", lineHeight: 1.65 }}>
            An enterprise task and workflow platform we designed, built, and shipped for a
            manufacturing client - now handling their real day-to-day operations across
            multiple departments.
          </p>
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
                <div key={m.label}>
                  <div
                    style={{
                      fontFamily: "var(--font)",
                      fontSize: "clamp(34px, 4.4vw, 56px)",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      color: "#22d3ee",
                    }}
                  >
                    <AnimatedCounter to={m.to} decimals={m.decimals} suffix={m.suffix} duration={1600} />
                  </div>
                  <div
                    style={{
                      marginTop: 10,
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

      {/* Before → After */}
      <div style={{ marginTop: "clamp(28px, 3.4vw, 44px)" }}>
        <BeforeAfter />
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
                style={{
                  padding: "8px 16px",
                  borderRadius: 100,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                  fontSize: 13,
                  color: "var(--text-2)",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
