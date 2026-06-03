"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const AGENTS = [
  {
    id: "TI",
    name: "Trial Intelligence",
    color: "#22d3ee",
    status: "Querying",
    task: "Natural language search — 12,400 clinical trials indexed",
    confidence: 97,
  },
  {
    id: "EA",
    name: "Efficacy Analysis",
    color: "#6366f1",
    status: "Comparing",
    task: "Cross-study outcome analysis — 847 trials processed",
    confidence: 99,
  },
  {
    id: "PE",
    name: "Patient Enrollment",
    color: "#a855f7",
    status: "Matching",
    task: "AI-powered participant matching — 240 patients identified",
    confidence: 96,
  },
  {
    id: "SM",
    name: "Safety Monitoring",
    color: "#10b981",
    status: "Auditing",
    task: "Real-time adverse event detection — 0 missed signals",
    confidence: 100,
  },
];

const TRUST = [
  { label: "HIPAA Compliant", color: "#22d3ee" },
  { label: "SOC 2 Type II", color: "#6366f1" },
  { label: "FDA Framework Ready", color: "#a855f7" },
  { label: "ISO 27001", color: "#10b981" },
  { label: "HL7 FHIR Compatible", color: "#f59e0b" },
];

export default function ClinicalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      ref={ref}
      id="clinical"
      className="relative py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 80%, rgba(34,211,238,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="section-num" style={{ color: "rgba(34,211,238,0.8)" }}>03</span>
            <div className="h-px w-8" style={{ background: "rgba(34,211,238,0.4)" }} />
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--mono)", color: "rgba(34,211,238,0.7)" }}
            >
              Clinical Research AI
            </span>
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
            <span className="g-text-cyan">ClinicalAgents</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-base md:text-lg font-light leading-relaxed max-w-2xl"
            style={{ color: "rgba(241,245,249,0.4)", fontFamily: "var(--font)" }}
          >
            AI-powered clinical trial intelligence built by researchers, for
            researchers. Query 12,400+ studies in natural language, accelerate
            patient enrollment, and monitor safety in real-time — HIPAA
            compliant by design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.26 }}
            style={{ marginTop: 24 }}
          >
            <a
              href="https://clinicalagent.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none", display: "inline-block", cursor: "none" }}
              data-cursor-hover
            >
              Explore ClinicalAgents →
            </a>
          </motion.div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Agents (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            {AGENTS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.1 }}
                className="glass-card p-5 group"
                data-cursor-hover
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      background: `${a.color}15`,
                      border: `1px solid ${a.color}30`,
                      color: a.color,
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {a.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "rgba(241,245,249,0.85)", fontFamily: "var(--font)" }}
                      >
                        {a.name}
                      </span>
                      <span
                        className="text-[9px] tracking-[0.1em] uppercase"
                        style={{ color: a.color, fontFamily: "var(--mono)", opacity: 0.75 }}
                      >
                        {a.status}
                      </span>
                    </div>
                    <p
                      className="text-[11px]"
                      style={{ color: "rgba(241,245,249,0.28)", fontFamily: "var(--mono)" }}
                    >
                      {a.task}
                    </p>
                  </div>

                  {/* Confidence bar */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className="text-sm font-bold tabular-nums"
                      style={{ color: a.color, fontFamily: "var(--mono)" }}
                    >
                      {a.confidence}%
                    </span>
                    <div
                      className="w-16 h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: a.color }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${a.confidence}%` } : {}}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right side: trust + stats (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-5"
            >
              <div
                className="text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ fontFamily: "var(--mono)", color: "rgba(241,245,249,0.25)" }}
              >
                Compliance &amp; Certification
              </div>
              <div className="space-y-2.5">
                {TRUST.map((t, i) => (
                  <motion.div
                    key={t.label}
                    initial={{ opacity: 0, x: 8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.45 + i * 0.07 }}
                    className="flex items-center gap-2.5"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: t.color }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "rgba(241,245,249,0.5)", fontFamily: "var(--mono)" }}
                    >
                      {t.label}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
                    <span
                      className="text-[9px] tracking-[0.1em]"
                      style={{ color: "rgba(34,197,94,0.7)", fontFamily: "var(--mono)" }}
                    >
                      VERIFIED
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* System status */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="terminal flex-1"
            >
              <div className="terminal-header">
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <div key={i} className="terminal-dot" style={{ background: c, opacity: 0.8 }} />
                ))}
                <span className="ml-2 terminal-line dim">clinical — monitor</span>
              </div>
              <div className="terminal-body space-y-1.5">
                {[
                  { t: "SYSTEM / ONLINE", tp: "success" },
                  { t: "TRIALS INDEXED / 12,400+", tp: "info" },
                  { t: "PARTICIPANTS MATCHED / 240", tp: "info" },
                  { t: "ADVERSE SIGNALS / 0", tp: "success" },
                  { t: "HIPAA COMPLIANT / YES", tp: "success" },
                  { t: "CONFIDENCE / 97.8%", tp: "active" },
                ].map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className={`terminal-line ${l.tp}`}
                  >
                    {l.t}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
