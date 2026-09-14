"use client";

import { motion } from "framer-motion";
import { Section, Reveal } from "./_shared";

/* ─── CCTV attendance scan visual ────────────────────────── */
function ScanVisual() {
  const boxes = [
    { x: "13%", y: "32%", w: "19%", h: "44%" },
    { x: "42%", y: "22%", w: "21%", h: "54%" },
    { x: "70%", y: "36%", w: "18%", h: "40%" },
  ];
  const corner = (pos: React.CSSProperties): React.CSSProperties => ({ position: "absolute", width: 16, height: 16, ...pos });
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: 16, overflow: "hidden", background: "radial-gradient(ellipse at 50% 15%, rgba(99,102,241,0.16), rgba(4,4,10,0.72))", border: "1px solid rgba(99,102,241,0.22)" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(129,140,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div style={corner({ top: 12, left: 12, borderTop: "2px solid rgba(34,211,238,0.7)", borderLeft: "2px solid rgba(34,211,238,0.7)" })} />
      <div style={corner({ top: 12, right: 12, borderTop: "2px solid rgba(34,211,238,0.7)", borderRight: "2px solid rgba(34,211,238,0.7)" })} />
      <div style={corner({ bottom: 12, left: 12, borderBottom: "2px solid rgba(34,211,238,0.7)", borderLeft: "2px solid rgba(34,211,238,0.7)" })} />
      <div style={corner({ bottom: 12, right: 12, borderBottom: "2px solid rgba(34,211,238,0.7)", borderRight: "2px solid rgba(34,211,238,0.7)" })} />

      {boxes.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.2, duration: 0.4 }}
          style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, border: "1.5px solid rgba(74,222,128,0.85)", borderRadius: 6, boxShadow: "0 0 16px rgba(74,222,128,0.22)" }}
        >
          <span style={{ position: "absolute", top: -15, left: 0, fontFamily: "var(--mono)", fontSize: 7.5, letterSpacing: "0.08em", color: "rgba(74,222,128,0.95)", background: "rgba(4,4,10,0.75)", padding: "1px 5px", borderRadius: 3, whiteSpace: "nowrap" }}>
            PRESENT ✓
          </span>
        </motion.div>
      ))}

      <motion.div
        initial={{ top: "2%" }}
        animate={{ top: ["2%", "96%", "2%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.9), transparent)", boxShadow: "0 0 12px rgba(34,211,238,0.6)" }}
      />

      <div style={{ position: "absolute", top: 12, left: 38, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.14em", color: "var(--text-2)", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", boxShadow: "0 0 8px #f87171" }} />
        CAM 01 · LIVE
      </div>
    </div>
  );
}

export default function NextProjectSection() {
  return (
    <Section
      id="next-project"
      style={{ position: "relative", zIndex: 10, background: "var(--bg)" }}
      glow="radial-gradient(ellipse 60% 60% at 20% 50%, rgba(99,102,241,0.06), transparent 60%)"
    >
      <Reveal>
        <div
          className="glass-card"
          style={{
            borderRadius: "var(--radius-xl)",
            padding: "clamp(28px, 3.6vw, 52px)",
            background: "linear-gradient(135deg, rgba(99,102,241,0.09), rgba(10,10,20,0.6) 60%)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(28px, 4vw, 56px)",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(129,140,248,0.9)" }}>
                What we&apos;re building next
              </span>
              <span className="status-pill" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "rgba(251,191,36,0.92)" }}>
                <span className="status-dot" style={{ background: "#fbbf24" }} />
                In demo
              </span>
            </div>
            <h3 className="g-text" style={{ fontFamily: "var(--font)", fontSize: "clamp(26px, 3.4vw, 46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.03 }}>
              Attendance, without the register.
            </h3>
            <p style={{ marginTop: 16, fontSize: "clamp(15px, 1.4vw, 18px)", color: "var(--text-2)", lineHeight: 1.65, maxWidth: "52ch" }}>
              Our next system reads attendance straight from a factory&apos;s existing CCTV
              cameras - automatic roll-call in real time, with no punch cards, biometric
              queues, or manual entry. Currently in live demo.
            </p>
            <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Computer Vision", "CCTV Integration", "Automated Roll-Call", "Real-time"].map((t) => (
                <span key={t} style={{ padding: "8px 15px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.04em", color: "var(--text-2)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <Reveal delay={0.15}>
            <ScanVisual />
          </Reveal>
        </div>
      </Reveal>
    </Section>
  );
}
