"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
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

/* ─── Tilt card with spotlight ──────────────────────────── */
function ProductCard({
  p,
  i,
  inView,
}: {
  p: (typeof PRODUCTS)[number];
  i: number;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const rotateX = useSpring(rX, { damping: 28, stiffness: 220 });
  const rotateY = useSpring(rY, { damping: 28, stiffness: 220 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rX.set(((y - cy) / cy) * -7);
    rY.set(((x - cx) / cx) * 7);
    setSpotlight({ x, y });
  };

  const handleMouseLeave = () => {
    rX.set(0);
    rY.set(0);
    setHovering(false);
  };

  return (
    <motion.div
      key={p.name}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        className="glass-card product-card"
        style={{
          padding: "clamp(24px, 3vw, 40px)",
          position: "relative",
          overflow: "hidden",
          "--card-accent": p.color,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          height: "100%",
        } as React.CSSProperties}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleMouseLeave}
        data-cursor-hover
      >
        {/* Spotlight */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: spotlight.x,
            top: spotlight.y,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${p.color}20 0%, transparent 65%)`,
            transform: "translate(-50%, -50%)",
            opacity: hovering ? 1 : 0,
            transition: "opacity 0.35s ease",
            zIndex: 0,
          }}
        />

        {/* Hover glow corner */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${p.glow}, transparent)`,
            opacity: hovering ? 1 : 0,
            transition: "opacity 0.4s ease",
            borderRadius: 14,
          }}
        />

        {/* Animated border gradient on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[14px]"
          style={{
            background: `linear-gradient(135deg, ${p.color}30, transparent 40%, ${p.color}15)`,
            opacity: hovering ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
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

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
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
            <motion.a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--mono)", fontSize: 10,
                color: p.color, opacity: 0.7,
                textDecoration: "none", letterSpacing: "0.08em",
                flexShrink: 0,
                display: "flex", alignItems: "center", gap: 4,
              }}
              whileHover={{ opacity: 1, gap: 8 }}
              data-cursor-hover
            >
              Explore →
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Magnetic CTA button ────────────────────────────────── */
function MagneticButton({
  children,
  className,
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const bx = useMotionValue(0);
  const by = useMotionValue(0);
  const x = useSpring(bx, { damping: 14, stiffness: 180 });
  const y = useSpring(by, { damping: 14, stiffness: 180 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    bx.set((e.clientX - rect.left - rect.width / 2) * 0.38);
    by.set((e.clientY - rect.top - rect.height / 2) * 0.38);
  };

  const handleMouseLeave = () => {
    bx.set(0);
    by.set(0);
  };

  return (
    <motion.button
      ref={btnRef}
      className={className}
      style={{ ...style, x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      data-cursor-hover
    >
      {children}
    </motion.button>
  );
}

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
          {PLATFORM_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Product cards with tilt ─────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            gap: "clamp(12px, 2vw, 20px)",
            marginBottom: "clamp(40px, 6vw, 64px)",
            alignItems: "stretch",
          }}
        >
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.name} p={p} i={i} inView={inView} />
          ))}
        </div>

        {/* ─── CTA block ───────────────────────── */}
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
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
              <MagneticButton className="btn-primary" onClick={() => openModal("schedule")}>
                Schedule a Consultation
              </MagneticButton>
              <MagneticButton className="btn-secondary" onClick={() => openModal("book-demo")}>
                Request a Demo
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
