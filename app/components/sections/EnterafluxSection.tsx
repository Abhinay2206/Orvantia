"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const AGENTS = [
  {
    id: "RX",
    name: "Medication Intelligence",
    status: "Active",
    color: "#6366f1",
    task: "Semaglutide 1mg – next injection in 6 days",
    metric: "98%",
    metricLabel: "Adherence rate",
  },
  {
    id: "SX",
    name: "Symptom Monitor",
    status: "Logging",
    color: "#22d3ee",
    task: "Nausea pattern detected – post-meal protocol suggested",
    metric: "72%",
    metricLabel: "Symptom reduction",
  },
  {
    id: "NX",
    name: "Nutrition Coach",
    status: "Planning",
    color: "#a855f7",
    task: "Personalised Indian meal plan – Week 4 adjusted",
    metric: "1,240",
    metricLabel: "kcal / day",
  },
  {
    id: "PX",
    name: "Progress Engine",
    status: "Tracking",
    color: "#f59e0b",
    task: "4.2 kg lost in 6 weeks – on track for goal",
    metric: "4.2kg",
    metricLabel: "Avg monthly loss",
  },
];

const STATS = [
  { v: 98, s: "%", label: "Target adherence" },
  { v: 72, s: "%", label: "Side effect reduction" },
  { v: 4.2, s: "kg", label: "Target monthly loss" },
  { v: "Q3", s: "", label: "2025 Launch" },
];

function AgentCard({ agent, delay, inView }: {
  agent: typeof AGENTS[0];
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-5 relative overflow-hidden group"
      data-cursor-hover
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[14px]"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 10% 50%, ${agent.color}12, transparent)`,
        }}
      />

      <div className="flex items-start justify-between mb-4">
        {/* Agent ID badge */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold tracking-wider"
          style={{
            background: `${agent.color}15`,
            border: `1px solid ${agent.color}30`,
            color: agent.color,
            fontFamily: "var(--mono)",
          }}
        >
          {agent.id}
        </div>

        {/* Status */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: `${agent.color}10`,
            border: `1px solid ${agent.color}25`,
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: agent.color }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span
            className="text-[9px] tracking-[0.12em] uppercase"
            style={{ fontFamily: "var(--mono)", color: agent.color }}
          >
            {agent.status}
          </span>
        </div>
      </div>

      <h4
        className="text-sm font-medium mb-1.5"
        style={{ color: "rgba(241,245,249,0.85)", fontFamily: "var(--font)" }}
      >
        {agent.name}
      </h4>

      <p
        className="text-xs leading-relaxed mb-4"
        style={{ color: "rgba(241,245,249,0.3)", fontFamily: "var(--mono)", fontSize: "11px" }}
      >
        {agent.task}
      </p>

      {/* Metric */}
      <div
        className="flex items-end gap-1.5 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          className="text-xl font-semibold"
          style={{ color: agent.color, fontFamily: "var(--mono)" }}
        >
          {agent.metric}
        </span>
        <span
          className="text-[10px] mb-0.5 tracking-[0.1em] uppercase"
          style={{ color: "rgba(241,245,249,0.25)", fontFamily: "var(--mono)" }}
        >
          {agent.metricLabel}
        </span>
      </div>
    </motion.div>
  );
}

export default function EnterafluxSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      ref={ref}
      id="enteraflux"
      className="relative py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Halo */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: "radial-gradient(ellipse 70% 50% at 15% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)",
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
            <span className="section-num">01</span>
            <div className="h-px w-8" style={{ background: "rgba(99,102,241,0.4)" }} />
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--mono)", color: "rgba(99,102,241,0.7)" }}
            >
              AI Wellness Companion
            </span>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.22)",
              }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#6366f1" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-[9px] tracking-[0.14em] uppercase"
                style={{ fontFamily: "var(--mono)", color: "rgba(99,102,241,0.75)" }}
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
            <span className="g-text">Enteraflux</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-base md:text-lg font-light leading-relaxed max-w-2xl"
            style={{ color: "rgba(241,245,249,0.4)", fontFamily: "var(--font)" }}
          >
            The intelligent companion for your GLP-1 journey. Medication
            tracking, AI-powered symptom management, and personalised Indian
            nutrition coaching – built to make every week on Ozempic or
            Wegovy count.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.26 }}
            style={{ marginTop: 24 }}
          >
            <a
              href="https://www.enteraflux.tech/"
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

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: agent grid (3 cols) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGENTS.map((a, i) => (
              <AgentCard key={a.id} agent={a} delay={0.2 + i * 0.1} inView={inView} />
            ))}
          </div>

          {/* Right: system dashboard (2 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* System status panel */}
            <div className="terminal flex-1">
              <div className="terminal-header">
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <div key={i} className="terminal-dot" style={{ background: c, opacity: 0.8 }} />
                ))}
                <span className="ml-2 terminal-line dim">
                  enteraflux – wellness monitor
                </span>
              </div>
              <div className="terminal-body space-y-1.5">
                {[
                  { t: "BUILD / IN PROGRESS", type: "info" },
                  { t: "LANDING PAGE / LIVE", type: "success" },
                  { t: "BETA / WAITLIST OPEN", type: "active" },
                  { t: "PLATFORM / INDIA", type: "info" },
                  { t: "MEDICATIONS / GLP-1 SUPPORTED", type: "success" },
                  { t: "LAUNCH / Q3 2025", type: "info" },
                  { t: "────────────────────", type: "dim" },
                  { t: "Shaping the GLP-1 journey.", type: "active" },
                ].map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className={`terminal-line ${l.type}`}
                  >
                    {l.t}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  className="glass-card p-4 text-center"
                >
                  <div
                    className="text-2xl font-bold mb-1 tabular-nums"
                    style={{
                      fontFamily: "var(--mono)",
                      color: "rgba(99,102,241,0.9)",
                    }}
                  >
                    {s.v}{s.s}
                  </div>
                  <div className="mono-label text-[9px]">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
