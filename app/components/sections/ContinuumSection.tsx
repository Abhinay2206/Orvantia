"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PIPELINE = [
  { id: "ARC", name: "Architect", color: "#a855f7", status: "Designing", task: "Decomposing feature into 12 services" },
  { id: "DEV", name: "Developer", color: "#6366f1", status: "Writing", task: "Implementing API layer (3 of 7 files)" },
  { id: "REV", name: "Reviewer", color: "#22d3ee", status: "Scanning", task: "Security audit — 0 critical issues" },
  { id: "TST", name: "Tester", color: "#10b981", status: "Running", task: "Generated 847 tests — 98.2% passing" },
  { id: "DEP", name: "Deployer", color: "#f59e0b", status: "Staging", task: "Blue-green deploy — 60% traffic shifted" },
];

const TERMINAL_LINES = [
  { text: "$ continuum status --build", type: "active" },
  { text: "  Status: IN DEVELOPMENT", type: "info" },
  { text: "  Landing page: LIVE ✓", type: "success" },
  { text: "  [ARC] Repository graph engine — building", type: "info" },
  { text: "  [DEV] Multi-agent code generation — building", type: "info" },
  { text: "  [REV] Automated PR review — building", type: "info" },
  { text: "  [TST] Test generation pipeline — building", type: "info" },
  { text: "  [DEP] Autonomous deploy agent — building", type: "info" },
  { text: "  Early access: OPEN", type: "success" },
  { text: "  Target ship time: < 5 min / feature", type: "" },
  { text: "  Target coverage: 98%+ ✓", type: "" },
  { text: "  Launch: Q4 2025", type: "active" },
];

export default function ContinuumSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      ref={ref}
      id="continuum"
      className="relative py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 85% 50%, rgba(168,85,247,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="section-num">02</span>
            <div className="h-px w-8" style={{ background: "rgba(168,85,247,0.4)" }} />
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--mono)", color: "rgba(168,85,247,0.7)" }}
            >
              Autonomous Engineering Platform
            </span>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.22)",
              }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#a855f7" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-[9px] tracking-[0.14em] uppercase"
                style={{ fontFamily: "var(--mono)", color: "rgba(168,85,247,0.75)" }}
              >
                In Development
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold leading-[0.92] tracking-tight mb-5"
            style={{
              fontSize: "clamp(44px, 7vw, 90px)",
              fontFamily: "var(--font)",
            }}
          >
            <span className="g-text-violet">Continuum</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-base md:text-lg font-light leading-relaxed max-w-2xl"
            style={{ color: "rgba(241,245,249,0.4)", fontFamily: "var(--font)" }}
          >
            An engineering operating layer with deep repository intelligence.
            Continuum maps your entire codebase — then deploys five specialized
            agents to architect, build, review, test, and ship. Zero context
            switching. Full system awareness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.26 }}
            style={{ marginTop: 24 }}
          >
            <a
              href="https://continuumos.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none", display: "inline-block", cursor: "none" }}
              data-cursor-hover
            >
              Visit Landing Page →
            </a>
          </motion.div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Agent pipeline */}
          <div className="space-y-3">
            {PIPELINE.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-4 p-4 rounded-[14px] transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.022)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                whileHover={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: `${agent.color}30`,
                }}
                data-cursor-hover
              >
                {/* ID badge */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{
                    background: `${agent.color}15`,
                    border: `1px solid ${agent.color}30`,
                    color: agent.color,
                    fontFamily: "var(--mono)",
                  }}
                >
                  {agent.id}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "rgba(241,245,249,0.8)", fontFamily: "var(--font)" }}
                    >
                      {agent.name}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.1em] uppercase"
                      style={{ color: agent.color, fontFamily: "var(--mono)", opacity: 0.8 }}
                    >
                      {agent.status}
                    </span>
                  </div>
                  <p
                    className="text-[11px] truncate"
                    style={{ color: "rgba(241,245,249,0.28)", fontFamily: "var(--mono)" }}
                  >
                    {agent.task}
                  </p>
                </div>

                {/* Pulse */}
                <motion.div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: agent.color }}
                  animate={{ opacity: [1, 0.25, 1], scale: [1, 0.7, 1] }}
                  transition={{ duration: 1.5 + i * 0.2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div
              className="terminal"
              style={{ boxShadow: "0 0 60px rgba(168,85,247,0.08)" }}
            >
              <div className="terminal-header">
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <div key={i} className="terminal-dot" style={{ background: c, opacity: 0.8 }} />
                ))}
                <span className="ml-2 terminal-line dim" style={{ fontSize: "11px" }}>
                  continuum — autonomous build
                </span>
              </div>

              <div className="terminal-body space-y-1">
                {TERMINAL_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.25 }}
                    className={`terminal-line ${line.type}`}
                  >
                    {line.text}
                  </motion.div>
                ))}

                {inView && (
                  <motion.span
                    className="terminal-line"
                    style={{ color: "rgba(168,85,247,0.8)" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ▋
                  </motion.span>
                )}
              </div>
            </div>

            {/* Micro stats below terminal */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { v: "< 5min", l: "Target Ship" },
                { v: "5 Agents", l: "Specialized" },
                { v: "98%+", l: "Target Coverage" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.6 + i * 0.1 }}
                  className="glass-card p-3 text-center"
                >
                  <div
                    className="text-base font-semibold mb-0.5"
                    style={{ color: "rgba(168,85,247,0.9)", fontFamily: "var(--mono)" }}
                  >
                    {s.v}
                  </div>
                  <div className="mono-label text-[9px]">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
