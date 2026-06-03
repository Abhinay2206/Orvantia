"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useModal } from "@/app/components/providers/ModalProvider";

const PRODUCTS = [
  {
    num: "01",
    name: "Enteraflux",
    sub: "AI Wellness Companion",
    inDev: true,
    url: "https://www.enteraflux.tech/",
    desc: "Intelligent GLP-1 companion for India. Medication tracking, AI symptom management, and personalised nutrition coaching for your weight management journey.",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.12)",
    stats: [{ v: "98%", l: "Target adherence" }, { v: "Q3", l: "2025 launch" }],
  },
  {
    num: "02",
    name: "Continuum",
    sub: "Autonomous Engineering",
    inDev: true,
    url: "https://continuumos.vercel.app/",
    desc: "Engineering operating layer with deep repository intelligence. Architect, build, review, test, and ship — entirely autonomously.",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.12)",
    stats: [{ v: "5", l: "AI agents" }, { v: "< 5m", l: "Target ship" }],
  },
  {
    num: "03",
    name: "ClinicalAgent",
    sub: "Clinical Research AI",
    inDev: false,
    url: "https://clinicalagent.vercel.app/",
    desc: "AI-powered clinical trial intelligence. Natural language querying, patient enrollment, efficacy analysis, and safety monitoring.",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.12)",
    stats: [{ v: "97%", l: "Confidence" }, { v: "0", l: "Violations" }],
  },
];

const PLATFORM_STATS = [
  { v: "3", label: "AI Products Built", color: "#6366f1" },
  { v: "3", label: "Industries Served", color: "#a855f7" },
  { v: "50+", label: "Workflows Automated", color: "#22d3ee" },
  { v: "99.98%", label: "Uptime", color: "#10b981" },
];

export default function EcosystemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { openModal } = useModal();

  return (
    <section
      ref={ref}
      id="ecosystem"
      className="relative overflow-hidden"
      style={{ padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 96px)" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 40%, rgba(30,10,80,0.22) 0%, rgba(0,20,60,0.1) 45%, transparent 70%)",
        }}
      />

      <div className="relative z-10" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* ─── Header ─────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "clamp(56px, 8vw, 96px)" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 12, marginBottom: 28,
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)", fontSize: 11,
                color: "rgba(99,102,241,0.7)", letterSpacing: "0.05em",
              }}
            >
              04
            </span>
            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.15)" }} />
            <span
              style={{
                fontFamily: "var(--mono)", fontSize: 10,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)",
              }}
            >
              The Product Suite
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(40px, 7vw, 96px)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              marginBottom: 24,
            }}
          >
            <span className="g-text">Purpose-built AI.</span>
            <br />
            <span style={{ color: "rgba(241,245,249,0.35)", fontWeight: 400 }}>Every domain.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(15px, 1.2vw, 18px)",
              color: "rgba(241,245,249,0.32)",
              maxWidth: "52ch",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Our portfolio of autonomous AI products transforms how enterprises,
            engineering teams, and healthcare organizations operate.
          </motion.p>
        </div>

        {/* ─── Live Stats Row ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px, 5vw, 80px)",
            marginBottom: "clamp(48px, 7vw, 80px)",
            padding: "clamp(28px, 4vw, 48px) clamp(32px, 6vw, 80px)",
            borderRadius: "var(--radius-lg)",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap",
          }}
        >
          {PLATFORM_STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "clamp(28px, 4vw, 52px)",
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)", fontSize: 9,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(241,245,249,0.2)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ─── Product cards ───────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            gap: "clamp(12px, 2vw, 20px)",
            marginBottom: "clamp(40px, 6vw, 64px)",
          }}
        >
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card"
              style={{ padding: "clamp(24px, 3vw, 40px)", position: "relative", overflow: "hidden" }}
              data-cursor-hover
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 70% 50% at 0% 0%, ${p.glow}, transparent)` }}
              />

              {/* Large background number */}
              <div
                style={{
                  position: "absolute", top: -8, right: 12,
                  fontFamily: "var(--mono)",
                  fontSize: "clamp(64px, 10vw, 120px)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.03)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {p.num}
              </div>

              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)", fontSize: 10,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: p.color, opacity: 0.7,
                  }}
                >
                  {p.sub}
                </div>
                {p.inDev && (
                  <div
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "3px 8px", borderRadius: 100,
                      background: `${p.color}0D`,
                      border: `1px solid ${p.color}28`,
                    }}
                  >
                    <motion.div
                      style={{ width: 4, height: 4, borderRadius: "50%", background: p.color }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--mono)", fontSize: 8,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        color: `${p.color}B0`,
                      }}
                    >
                      In Development
                    </span>
                  </div>
                )}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(26px, 3vw, 40px)",
                  fontWeight: 700, letterSpacing: "-0.02em",
                  color: "rgba(241,245,249,0.92)", marginBottom: 12,
                }}
              >
                {p.name}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(13px, 1vw, 15px)",
                  color: "rgba(241,245,249,0.32)",
                  lineHeight: 1.65, marginBottom: 24,
                }}
              >
                {p.desc}
              </p>

              <div
                style={{
                  display: "flex", gap: 24,
                  paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)",
                  alignItems: "flex-end", justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 24 }}>
                  {p.stats.map((s) => (
                    <div key={s.l}>
                      <div
                        style={{
                          fontFamily: "var(--mono)", fontSize: 22,
                          fontWeight: 700, color: p.color, marginBottom: 2,
                        }}
                      >
                        {s.v}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--mono)", fontSize: 9,
                          letterSpacing: "0.14em", textTransform: "uppercase",
                          color: "rgba(241,245,249,0.2)",
                        }}
                      >
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--mono)", fontSize: 10,
                    color: p.color, opacity: 0.7,
                    textDecoration: "none", letterSpacing: "0.08em",
                    flexShrink: 0,
                  }}
                  data-cursor-hover
                >
                  Explore →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Unified core CTA ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="glass-card"
          style={{
            padding: "clamp(40px, 6vw, 72px) clamp(32px, 6vw, 80px)",
            textAlign: "center",
            position: "relative", overflow: "hidden",
          }}
        >
          <div
            className="absolute inset-0 rounded-[14px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.07), rgba(168,85,247,0.05) 40%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 28 }}>
              {PRODUCTS.map((p, i) => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      padding: "6px 14px", borderRadius: 100,
                      fontFamily: "var(--mono)", fontSize: 9,
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      background: `${p.color}10`,
                      border: `1px solid ${p.color}25`,
                      color: p.color,
                    }}
                  >
                    {p.name}
                  </div>
                  {i < PRODUCTS.length - 1 && (
                    <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 12 }}>⟺</div>
                  )}
                </div>
              ))}
            </div>

            <h3
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(22px, 3vw, 40px)",
                fontWeight: 300,
                color: "rgba(241,245,249,0.65)",
                marginBottom: 12,
                letterSpacing: "-0.01em",
              }}
            >
              Partner with Orvantia AI
            </h3>
            <p
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(13px, 1vw, 15px)",
                color: "rgba(241,245,249,0.28)",
                maxWidth: "52ch", margin: "0 auto 36px",
                lineHeight: 1.65,
              }}
            >
              Whether you need enterprise automation, autonomous engineering, or
              clinical research intelligence — partner with us to transform your
              organization with autonomous AI products.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button
                className="btn-primary"
                data-cursor-hover
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal("schedule")}
              >
                Schedule a Consultation
              </motion.button>
              <motion.button
                className="btn-secondary"
                data-cursor-hover
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal("book-demo")}
              >
                Request a Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
