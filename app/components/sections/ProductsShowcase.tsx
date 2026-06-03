"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion";

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
      { v: "12.4k+", l: "Studies" },
    ],
  },
] as const;

/* ─── Live Browser Preview ───────────────────────────────── */
function LiveBrowserPreview({
  url,
  color,
  stats,
}: {
  url: string;
  color: string;
  stats: ReadonlyArray<{ v: string; l: string }>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.44);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { damping: 22, stiffness: 140 });
  const rotateY = useSpring(tiltY, { damping: 22, stiffness: 140 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setScale(containerRef.current.offsetWidth / 1280);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    tiltX.set(((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -9);
    tiltY.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 9);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const IFRAME_H = 820;

  return (
    <div
      ref={wrapperRef}
      style={{ perspective: 1400, perspectiveOrigin: "center center", cursor: "none" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Browser shell */}
        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: `0 48px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04), 0 0 100px ${color}12`,
            background: "#080812",
          }}
        >
          {/* ── Chrome bar ── */}
          <div
            style={{
              background: "rgba(8,8,20,0.98)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 }} />
              ))}
            </div>

            {/* Nav arrows */}
            <div style={{ display: "flex", gap: 8, opacity: 0.3, flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </div>

            {/* URL bar */}
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 7,
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                gap: 7,
                minWidth: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" style={{ flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.32)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {url.replace("https://", "").replace(/\/$/, "")}
              </span>
              <motion.div
                style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Reload / globe */}
            <div style={{ opacity: 0.2, flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
          </div>

          {/* ── Iframe viewport ── */}
          <div ref={containerRef} style={{ width: "100%", position: "relative", background: "#05050e" }}>
            <div
              style={{
                height: `${IFRAME_H * scale}px`,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <iframe
                src={url}
                style={{
                  width: 1280,
                  height: IFRAME_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "0 0",
                  pointerEvents: "none",
                  border: "none",
                  display: "block",
                }}
                sandbox="allow-scripts allow-same-origin"
                title={`Live preview`}
              />

              {/* Scanline sweep */}
              <motion.div
                className="pointer-events-none absolute inset-x-0"
                style={{
                  height: "18%",
                  background: `linear-gradient(to bottom, transparent, ${color}12, transparent)`,
                  zIndex: 2,
                }}
                animate={{ top: ["-18%", "118%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
              />

              {/* Bottom fade */}
              <div
                className="absolute bottom-0 inset-x-0 pointer-events-none"
                style={{
                  height: "50%",
                  background: "linear-gradient(to top, #080812 0%, transparent 100%)",
                  zIndex: 3,
                }}
              />

              {/* Floating stat cards */}
              {stats.slice(0, 2).map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 12, x: i === 0 ? 12 : -12 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.22, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    bottom: i === 0 ? "30%" : "17%",
                    right: i === 0 ? 16 : undefined,
                    left: i === 0 ? undefined : 16,
                    zIndex: 5,
                    background: "rgba(8,8,20,0.88)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: `1px solid ${color}35`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    minWidth: 84,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}10`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 20,
                      fontWeight: 700,
                      color,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 8,
                      color: "rgba(255,255,255,0.28)",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                    }}
                  >
                    {s.l}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Colored bottom accent line */}
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
          </div>
        </div>

        {/* Ground reflection */}
        <div
          style={{
            height: 48,
            marginTop: -2,
            background: `linear-gradient(to bottom, rgba(8,8,20,0.22), transparent)`,
            filter: "blur(6px)",
            transform: "scaleY(-1)",
            opacity: 0.45,
            borderRadius: "0 0 14px 14px",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Open site link */}
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 16,
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: `${color}80`,
          textDecoration: "none",
          cursor: "none",
        }}
        whileHover={{ color }}
        data-cursor-hover
      >
        <div style={{ width: 20, height: 1, background: "currentColor" }} />
        Open live site
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      </motion.a>
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
        <div style={{ position: "relative" }}>
          <LiveBrowserPreview
            url={product.url}
            color={product.color}
            stats={product.stats}
          />
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
