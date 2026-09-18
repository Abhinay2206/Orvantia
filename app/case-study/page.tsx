"use client";

import { motion } from "framer-motion";
import Nav from "../components/navigation/Nav";
import Footer from "../components/ui/Footer";
import CustomCursor from "../components/ui/CustomCursor";
import SmoothScroll from "../components/providers/SmoothScroll";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import { EASE } from "@/lib/motion";

const PROBLEM = [
  ["A diary at the desk", "Every task for every department was written by hand, one line per job. If a page was missed, the work was missed."],
  ["Instructions shouted across the floor", "Jobs were assigned by voice. Nothing was recorded, so nothing could be traced."],
  ["Follow-ups over WhatsApp", "Chasing status meant scrolling chats and sending message after message - one person at a time."],
  ["Reports that arrived a day late", "By the time a problem surfaced in a report, the decision it needed had already passed."],
];

const STEPS = [
  ["01", "Mapped the real workflow", "We sat with the floor and traced how work actually moves - who raises a task, who owns it, who signs it off - across every department and shift.", "#6366f1"],
  ["02", "Built one system of record", "Every task, department, and shift went into a single source of truth. The diary and the scattered chats were replaced by one place everyone trusts.", "#22d3ee"],
  ["03", "Automated the follow-ups", "Routing, priorities, due dates, and timed escalations now happen on their own - the manual WhatsApp chase is gone, and 2.1K notifications went out in the first month.", "#a855f7"],
  ["04", "Deployed and handed over", "Shipped to production, trained the team, and formally handed over with credentials, a data policy, and a contracted maintenance term.", "#3b82f6"],
];

const PAIRS = [
  ["Every task written by hand in a diary", "One system of record - no diary, nothing lost"],
  ["Follow-ups chased over WhatsApp, message by message", "Follow-ups automated - 2.1K notifications in month one"],
  ["No shared view of who owned what", "Ownership, priority and due date on every card"],
  ["Overdue work discovered too late, if at all", "Overdue surfaced automatically the moment it slips"],
  ["Performance argued from memory, not data", "Scored, exportable productivity reports per member"],
];

const METRICS = [
  { to: 231, decimals: 0, suffix: "", label: "Tasks Managed" },
  { to: 989, decimals: 0, suffix: "", label: "Activity Logs" },
  { to: 2.1, decimals: 1, suffix: "K", label: "Emails Delivered" },
  { to: 38, decimals: 0, suffix: "", label: "Concurrent Users" },
  { to: 0, decimals: 0, suffix: "", label: "Minutes Downtime" },
];

const SHOTS = [
  ["Dashboard", "app.factoryflow.io/dashboard", "/case-study/factoryflow/dashboard.png", "Every department, one glance", "Live task distribution, completion rates, and today's priorities the moment a manager logs in."],
  ["Task Board", "app.factoryflow.io/tasks", "/case-study/factoryflow/tasks.png", "Work that moves, visibly", "Kanban across Pending, In Progress, Completed and Overdue - with filters, priorities, and bulk Excel import."],
  ["Query Center", "app.factoryflow.io/queries", "/case-study/factoryflow/queries.png", "Questions stop getting lost", "Threaded queries attached to the task itself, with resolution tracking and average reply time."],
  ["Productivity", "app.factoryflow.io/productivity", "/case-study/factoryflow/productivity.png", "Performance you can defend", "Scored leaderboards across completion, on-time, response and consistency - exportable to Excel, CSV, or PDF."],
];

const CAPABILITIES = ["Task Management", "Workflow Automation", "Role-Based Access", "Query Threads", "Activity Timeline", "Real-time Notifications", "Excel Import / Export", "Analytics & Reports", "Productivity Scoring", "Secure Auth"];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.7, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

const wrap: React.CSSProperties = { maxWidth: 1080, margin: "0 auto", padding: "0 clamp(20px, 5vw, 72px)" };
const eyebrow: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(34,211,238,0.8)" };

export default function CaseStudyPage() {
  return (
    <>
      <div className="grain" />
      <CustomCursor />
      <SmoothScroll>
        <Nav show />

        <main style={{ paddingTop: 120, paddingBottom: 40 }}>
          {/* ── Hero ── */}
          <section style={wrap}>
            <Reveal>
              <a href="/#case-study" data-cursor-hover style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-3)", textDecoration: "none" }}>
                ← Back to Orvantia
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <div style={{ marginTop: 26, ...eyebrow }}>Case Study · 01</div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
                <h1 className="g-text-cyan" style={{ fontFamily: "var(--font)", fontSize: "clamp(44px, 8vw, 104px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.92 }}>
                  FactoryFlow
                </h1>
                <span className="status-pill" style={{ marginBottom: 10 }}><span className="status-dot" />Live in Production</span>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <p style={{ marginTop: 22, fontSize: "clamp(19px, 2.2vw, 30px)", color: "var(--text)", fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.4, maxWidth: "26ch" }}>
                A manufacturing floor ran on a diary and WhatsApp. Now it runs on this.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
                {[["Client", "Prayagh Consumer Care Pvt. Ltd."], ["Scope", "Task & shift operations"], ["Status", "Handed over · Live"], ["Support through", "January 2027"]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 6 }}>{k}</div>
                    <div style={{ fontSize: 14.5, color: "var(--text)", lineHeight: 1.4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ── The problem ── */}
          <section style={{ ...wrap, marginTop: "clamp(70px, 10vw, 130px)" }}>
            <Reveal><div style={eyebrow}>The problem</div></Reveal>
            <Reveal delay={0.05}>
              <h2 style={{ marginTop: 18, fontFamily: "var(--font)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: "18ch" }}>
                The information had nowhere to go.
              </h2>
            </Reveal>
            <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(14px, 1.6vw, 22px)" }}>
              {PROBLEM.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.06}>
                  <div className="glass-card" style={{ borderRadius: "var(--radius-lg)", padding: "clamp(22px, 2.4vw, 32px)", height: "100%", borderTop: "1px solid rgba(248,113,113,0.5)" }}>
                    <div style={{ fontFamily: "var(--font)", fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{t}</div>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-2)" }}>{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── How we transformed it ── */}
          <section style={{ ...wrap, marginTop: "clamp(70px, 10vw, 130px)" }}>
            <Reveal><div style={{ ...eyebrow, color: "rgba(129,140,248,0.85)" }}>How we transformed it</div></Reveal>
            <Reveal delay={0.05}>
              <h2 style={{ marginTop: 18, fontFamily: "var(--font)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: "20ch" }}>
                From paper chaos to a system that remembers.
              </h2>
            </Reveal>
            <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: "clamp(14px, 1.6vw, 20px)" }}>
              {STEPS.map(([n, t, d, c], i) => (
                <Reveal key={n} delay={i * 0.05}>
                  <div className="glass-card" style={{ borderRadius: "var(--radius-lg)", padding: "clamp(24px, 2.6vw, 38px)", display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(18px, 3vw, 40px)", alignItems: "start" }}>
                    <div style={{ fontFamily: "var(--font)", fontSize: "clamp(30px, 4vw, 54px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: c as string, opacity: 0.9 }}>{n}</div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font)", fontSize: "clamp(19px, 2vw, 26px)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 10 }}>{t}</h3>
                      <p style={{ fontSize: "clamp(14px, 1.3vw, 16px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "68ch" }}>{d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Before → After ── */}
          <section style={{ ...wrap, marginTop: "clamp(70px, 10vw, 130px)" }}>
            <Reveal><div style={eyebrow}>The transformation</div></Reveal>
            <Reveal delay={0.05}>
              <h2 style={{ marginTop: 18, fontFamily: "var(--font)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                From lost notes to a system of record.
              </h2>
            </Reveal>
            <div style={{ marginTop: 40 }}>
              <div className="xform-row" style={{ marginBottom: 12 }}>
                <div style={{ ...eyebrow, fontSize: 10, color: "rgba(248,113,113,0.85)", paddingLeft: 16 }}>Before</div>
                <div />
                <div style={{ ...eyebrow, fontSize: 10, color: "#22d3ee", paddingLeft: 16 }}>After</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PAIRS.map(([b, a], i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <div className="xform-row">
                      <div className="xform-cell is-before" style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.055)", borderLeft: "2px solid rgba(248,113,113,0.55)", background: "rgba(248,113,113,0.03)", padding: "14px 16px", display: "flex", gap: 11, alignItems: "flex-start" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(248,113,113,0.65)", marginTop: 7, flexShrink: 0 }} />
                        <span style={{ fontSize: "clamp(13px,1.2vw,15px)", lineHeight: 1.5, color: "var(--text-2)" }}>{b}</span>
                      </div>
                      <div style={{ display: "grid", placeItems: "center" }}>
                        <span className="xform-arrow" style={{ fontFamily: "var(--mono)", fontSize: 17, color: "rgba(34,211,238,0.75)" }}>→</span>
                      </div>
                      <div className="xform-cell is-after" style={{ borderRadius: 12, border: "1px solid rgba(34,211,238,0.2)", borderLeft: "2px solid #22d3ee", background: "rgba(34,211,238,0.05)", padding: "14px 16px", display: "flex", gap: 11, alignItems: "flex-start" }}>
                        <span style={{ color: "#22d3ee", fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: "clamp(13px,1.2vw,15px)", lineHeight: 1.5, color: "var(--text)" }}>{a}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── What we shipped (screenshots) ── */}
          <section style={{ ...wrap, marginTop: "clamp(70px, 10vw, 130px)" }}>
            <Reveal><div style={eyebrow}>What we shipped</div></Reveal>
            <Reveal delay={0.05}>
              <h2 style={{ marginTop: 18, fontFamily: "var(--font)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                The product, in production.
              </h2>
            </Reveal>
            <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: "clamp(40px, 6vw, 80px)" }}>
              {SHOTS.map(([tab, path, src, head, desc], i) => (
                <Reveal key={tab} delay={0.05}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(24px, 3vw, 48px)", alignItems: "center" }}>
                    <div style={{ order: i % 2 ? 2 : 1 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22d3ee", marginBottom: 14 }}>{tab}</div>
                      <h3 style={{ fontFamily: "var(--font)", fontSize: "clamp(22px, 2.6vw, 34px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>{head}</h3>
                      <p style={{ fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "44ch" }}>{desc}</p>
                    </div>
                    <div className="frosted" style={{ order: i % 2 ? 1 : 2, borderRadius: 14, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(248,113,113,0.6)" }} />
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(251,191,36,0.6)" }} />
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(34,197,94,0.6)" }} />
                        <span style={{ marginLeft: 10, fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-3)" }}>{path}</span>
                      </div>
                      <img src={src as string} alt={`FactoryFlow ${tab}`} style={{ width: "100%", height: "auto", display: "block" }} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Results ── */}
          <section style={{ ...wrap, marginTop: "clamp(70px, 10vw, 130px)" }}>
            <Reveal>
              <div className="glass-card" style={{ borderRadius: "var(--radius-lg)", padding: "clamp(28px, 3.4vw, 48px)", background: "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(10,10,20,0.6) 55%)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 28 }}>First month in production</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "clamp(20px, 2.4vw, 32px)" }}>
                  {METRICS.map((m) => (
                    <div key={m.label} className="stat-cell" style={{ padding: "14px 16px" }}>
                      <div className="g-text-cyan" style={{ fontFamily: "var(--font)", fontSize: "clamp(34px, 4.4vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        <AnimatedCounter to={m.to} decimals={m.decimals} suffix={m.suffix} duration={1600} />
                      </div>
                      <div style={{ marginTop: 12, height: 2, width: 32, borderRadius: 2, background: "linear-gradient(90deg, #22d3ee, transparent)" }} />
                      <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Capabilities */}
            <Reveal delay={0.05}>
              <div style={{ marginTop: "clamp(28px, 3.4vw, 44px)", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginRight: 6 }}>Shipped</span>
                {CAPABILITIES.map((c) => (
                  <span key={c} className="cap-chip" data-cursor-hover style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", fontSize: 13, color: "var(--text-2)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(34,211,238,0.7)" }} />
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ── CTA ── */}
          <section style={{ ...wrap, marginTop: "clamp(70px, 10vw, 130px)", textAlign: "center" }}>
            <Reveal>
              <h2 className="g-text" style={{ fontFamily: "var(--font)", fontSize: "clamp(28px, 5vw, 60px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: "20ch", margin: "0 auto 26px" }}>
                Have a floor that still runs on paper?
              </h2>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/#contact" className="btn-primary" data-cursor-hover>Start Your Project</a>
                <a href="/" className="btn-secondary" data-cursor-hover>Back to Home</a>
              </div>
            </Reveal>
          </section>
        </main>

        <Footer />
      </SmoothScroll>
    </>
  );
}
