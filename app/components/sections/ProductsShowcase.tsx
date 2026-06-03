"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/* ─── Data ───────────────────────────────────────────────── */
const PRODUCTS = [
  {
    num: "01",
    id: "continuum",
    category: "AUTONOMOUS ENGINEERING",
    name: "Continuum",
    inDev: true,
    url: "https://continuumos.vercel.app/",
    desc: "An Orvantia AI engineering platform that builds a living knowledge graph of your entire codebase — then deploys specialized agents to architect, build, review, test, and ship autonomously.",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.09)",
    stats: [
      { v: "4m 31s", l: "Ship time" },
      { v: "5", l: "AI agents" },
      { v: "98.2%", l: "Coverage" },
    ],
    pipeline: [
      { id: "ARC", name: "Architect", color: "#a855f7", status: "Designing", task: "Decomposing into 12 services" },
      { id: "DEV", name: "Developer", color: "#6366f1", status: "Writing", task: "Implementing API layer" },
      { id: "REV", name: "Reviewer", color: "#22d3ee", status: "Scanning", task: "0 critical issues found" },
      { id: "TST", name: "Tester", color: "#10b981", status: "Running", task: "847 tests — 98.2% passing" },
      { id: "DEP", name: "Deployer", color: "#f59e0b", status: "Staging", task: "60% traffic shifted" },
    ],
  },
  {
    num: "02",
    id: "enteraflux",
    category: "AI WELLNESS COMPANION",
    name: "Enteraflux",
    inDev: true,
    url: "https://www.enteraflux.tech/",
    desc: "Orvantia AI's intelligent companion for GLP-1 users in India. Medication tracking, AI symptom management, and personalised nutrition coaching — built for Ozempic, Wegovy, and Mounjaro.",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.09)",
    stats: [
      { v: "98%", l: "Adherence" },
      { v: "4.2kg", l: "Avg/month" },
    ],
    agents: [
      { id: "RX", name: "Medication Intelligence", status: "Active", color: "#6366f1", metric: "98%", metricLabel: "Adherence" },
      { id: "SX", name: "Symptom Monitor", status: "Logging", color: "#22d3ee", metric: "72%", metricLabel: "Reduction" },
      { id: "NX", name: "Nutrition Coach", status: "Planning", color: "#a855f7", metric: "1,240", metricLabel: "kcal/day" },
      { id: "PX", name: "Progress Engine", status: "Tracking", color: "#f59e0b", metric: "4.2kg", metricLabel: "Avg loss" },
    ],
  },
  {
    num: "03",
    id: "clinical",
    category: "CLINICAL RESEARCH AI",
    name: "ClinicalAgent",
    url: "https://clinicalagent.vercel.app/",
    desc: "Orvantia AI's clinical trial intelligence solution. Natural language querying across 12,400+ studies — accelerating patient enrollment, efficacy analysis, and safety monitoring.",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.07)",
    stats: [
      { v: "97.8%", l: "Confidence" },
      { v: "0", l: "Violations" },
      { v: "0", l: "Patients" },
    ],
    clinicalAgents: [
      { id: "DX", name: "Diagnostic Reasoning", status: "Reasoning", color: "#22d3ee", confidence: 97 },
      { id: "RX", name: "Research Synthesis", status: "Scanning", color: "#6366f1", confidence: 99 },
      { id: "CX", name: "Care Coordination", status: "Routing", color: "#a855f7", confidence: 96 },
      { id: "CP", name: "Compliance Monitor", status: "Auditing", color: "#10b981", confidence: 100 },
    ]
  },
] as const;

/* ─── Panel visual ───────────────────────────────────────── */
function EnterafluxVisual({ product }: { product: typeof PRODUCTS[1] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 10 }}>
      {"agents" in product && product.agents.map((a) => (
        <div
          key={a.id}
          className="glass-card"
          style={{ padding: "16px 18px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${a.color}15`, border: `1px solid ${a.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--mono)", fontSize: 9, color: a.color, fontWeight: 700,
              }}
            >
              {a.id}
            </div>
            <motion.div
              style={{
                width: 6, height: 6, borderRadius: "50%", background: a.color,
              }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
          <div style={{ fontFamily: "var(--font)", fontSize: 12, color: "rgba(241,245,249,0.8)", marginBottom: 4 }}>
            {a.name}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(241,245,249,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {a.status}
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 700, color: a.color }}>
              {a.metric}
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(241,245,249,0.22)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {a.metricLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContinuumVisual({ product }: { product: typeof PRODUCTS[0] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {"pipeline" in product && product.pipeline.map((a, i) => (
        <div
          key={a.id}
          className="glass-card"
          style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: `${a.color}15`, border: `1px solid ${a.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--mono)", fontSize: 9, color: a.color, fontWeight: 700,
            }}
          >
            {a.id}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontFamily: "var(--font)", fontSize: 12, color: "rgba(241,245,249,0.8)" }}>
                {a.name}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: a.color, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {a.status}
              </span>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(241,245,249,0.25)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.task}
            </div>
          </div>
          <motion.div
            style={{ width: 7, height: 7, borderRadius: "50%", background: a.color, flexShrink: 0 }}
            animate={{ opacity: [1, 0.2, 1], scale: [1, 0.7, 1] }}
            transition={{ duration: 1.4 + i * 0.25, repeat: Infinity }}
          />
        </div>
      ))}
    </div>
  );
}

function ClinicalVisual({ product }: { product: typeof PRODUCTS[2] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {"clinicalAgents" in product && product.clinicalAgents.map((a, i) => (
        <div
          key={a.id}
          className="glass-card"
          style={{ padding: "14px 16px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${a.color}15`, border: `1px solid ${a.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--mono)", fontSize: 9, color: a.color, fontWeight: 700,
                }}
              >
                {a.id}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font)", fontSize: 12, color: "rgba(241,245,249,0.8)" }}>
                  {a.name}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: `${a.color}AA`, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {a.status}
                </div>
              </div>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 700, color: a.color }}>
              {a.confidence}%
            </span>
          </div>
          <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <motion.div
              style={{ height: "100%", background: a.color, borderRadius: 2 }}
              initial={{ width: 0 }}
              animate={{ width: `${a.confidence}%` }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Single Panel ───────────────────────────────────────── */
type ProductType = typeof PRODUCTS[number];

function Panel({ product, vw, index }: { product: ProductType; vw: number; index: number }) {
  const glowX = index % 2 === 0 ? "25%" : "75%";

  return (
    <div
      id={product.id}
      className="overflow-y-auto overflow-x-hidden no-scrollbar"
      style={{
        width: vw > 0 ? `${vw}px` : "100vw",
        height: "100%",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${glowX} 50%, ${product.glow}, transparent 70%)`,
        }}
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 items-start md:items-center"
        style={{
          position: "relative",
          minHeight: "100%",
          padding: "clamp(100px, 12vh, 120px) clamp(24px, 6vw, 96px)",
          gap: "clamp(48px, 5vw, 80px)",
        }}
      >
        {/* ─── LEFT ─────────────────────── */}
        <div>
          {/* Product label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--mono)", fontSize: 11,
                color: `${product.color}B0`, letterSpacing: "0.05em",
              }}
            >
              {product.num}
            </span>
            <div style={{ width: 28, height: 1, background: `${product.color}60` }} />
            <span
              style={{
                fontFamily: "var(--mono)", fontSize: 10,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: `${product.color}90`,
              }}
            >
              {product.category}
            </span>
            {"inDev" in product && product.inDev && (
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "4px 10px", borderRadius: 100,
                  background: `${product.color}0D`,
                  border: `1px solid ${product.color}30`,
                }}
              >
                <motion.div
                  style={{ width: 5, height: 5, borderRadius: "50%", background: product.color }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  style={{
                    fontFamily: "var(--mono)", fontSize: 9,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: `${product.color}C0`,
                  }}
                >
                  In Development
                </span>
              </div>
            )}
          </div>

          {/* Product name */}
          <h2
            style={{
              fontSize: "clamp(32px, 6vw, 84px)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: "rgba(241,245,249,0.95)",
              marginBottom: 20,
              wordBreak: "break-word",
            }}
          >
            {product.name}
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(14px, 1.1vw, 17px)",
              color: "rgba(241,245,249,0.38)",
              lineHeight: 1.65,
              maxWidth: "36ch",
              marginBottom: 40,
            }}
          >
            {product.desc}
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "clamp(24px, 4vw, 48px)", marginBottom: 44 }}>
            {product.stats.map((s) => (
              <div key={s.l}>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "clamp(22px, 3vw, 40px)",
                    fontWeight: 700,
                    color: product.color,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)", fontSize: 9,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(241,245,249,0.22)",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href={"url" in product ? product.url : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{
              borderColor: `${product.color}45`,
              color: `${product.color}95`,
              cursor: "none",
              textDecoration: "none",
              display: "inline-block",
            }}
            data-cursor-hover
          >
            {"inDev" in product && product.inDev
              ? "Visit Landing Page →"
              : `Explore ${product.name} →`}
          </a>
        </div>

        {/* ─── RIGHT ────────────────────── */}
        <div style={{ overflow: "auto", maxHeight: "80vh" }}>
          {index === 0 && <ContinuumVisual product={product as typeof PRODUCTS[0]} />}
          {index === 1 && <EnterafluxVisual product={product as typeof PRODUCTS[1]} />}
          {index === 2 && <ClinicalVisual product={product as typeof PRODUCTS[2]} />}
        </div>
      </div>

      {/* Section number watermark */}
      <div
        style={{
          position: "absolute", bottom: 32, right: "clamp(32px, 5vw, 80px)",
          fontFamily: "var(--mono)", fontSize: "clamp(80px, 14vw, 200px)",
          fontWeight: 700, color: "rgba(255,255,255,0.025)",
          lineHeight: 1, letterSpacing: "-0.04em", userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {product.num}
      </div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────── */
export default function ProductsShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const resize = () => setVw(window.innerWidth);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, vw > 0 ? -vw * (PRODUCTS.length - 1) : 0]
  );

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(v < 0.37 ? 0 : v < 0.68 ? 1 : 2);
  });

  return (
    <div ref={ref} id="products" style={{ height: `${PRODUCTS.length * 100 + 50}vh` }}>
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh", background: "var(--bg)" }}
      >
        <motion.div
          style={{
            x,
            display: "flex",
            width: vw > 0 ? `${vw * PRODUCTS.length}px` : `${PRODUCTS.length * 100}vw`,
            height: "100%",
          }}
        >
          {PRODUCTS.map((product, i) => (
            <Panel key={product.id} product={product} index={i} vw={vw} />
          ))}
        </motion.div>

        {/* Panel progress indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 28, display: "flex", gap: 10, alignItems: "center" }}
        >
          {PRODUCTS.map((p, i) => (
            <div
              key={p.id}
              style={{
                height: 2,
                width: active === i ? 32 : 14,
                borderRadius: 2,
                background: PRODUCTS[i].color,
                opacity: active === i ? 1 : 0.22,
                transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
