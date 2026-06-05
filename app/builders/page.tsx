"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

// ── Disclosure Modal ──────────────────────────────────────────────────────────
function DisclosureModal({ onClose, onAccept }: { onClose: () => void; onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(4,4,10,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 540, background: "rgba(10,10,22,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "40px 36px", boxShadow: "0 0 80px rgba(99,102,241,0.15), 0 0 0 1px rgba(99,102,241,0.08)" }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fbbf24" }}>Important Notice</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.01em" }}>Before You Continue</h2>
        <p style={{ fontSize: 13, color: "rgba(241,245,249,0.45)", marginBottom: 28, lineHeight: 1.7 }}>Orvantia AI is currently building products and acquiring clients.</p>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 12 }}>We are looking for ambitious builders who want to:</p>
          {["Gain real-world experience", "Build production-grade systems", "Work on autonomous AI products", "Collaborate with other builders"].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#818cf8", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "rgba(241,245,249,0.6)" }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 12, padding: "16px 18px", marginBottom: 28 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(251,191,36,0.6)", marginBottom: 10 }}>At this stage:</p>
          {["No guaranteed stipend", "No guaranteed salary", "Future paid opportunities may be available as products and client engagements grow"].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 7 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#fbbf24", flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: "rgba(251,191,36,0.7)", lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(241,245,249,0.4)", lineHeight: 1.7, marginBottom: 24 }}>Anyone applying should do so because they genuinely want to learn, build, and contribute.</p>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 28 }}>
          <div onClick={() => setChecked(!checked)} style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1, background: checked ? "#6366f1" : "rgba(255,255,255,0.04)", border: checked ? "1px solid rgba(99,102,241,0.8)" : "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
            {checked && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
          <span style={{ fontSize: 13, color: "rgba(241,245,249,0.65)", lineHeight: 1.6, userSelect: "none" }}>I understand and agree.</span>
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 100, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.4)" }}>Go Back</button>
          <button onClick={() => { if (checked) onAccept(); }} disabled={!checked}
            style={{ flex: 2, padding: "12px", borderRadius: 100, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, cursor: checked ? "pointer" : "not-allowed", background: checked ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(255,255,255,0.05)", border: "none", color: checked ? "white" : "rgba(255,255,255,0.25)", boxShadow: checked ? "0 0 20px rgba(99,102,241,0.3)" : "none", transition: "all 0.2s" }}>
            Create Account →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Background ────────────────────────────────────────────────────────────────
function BackgroundBlobs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "-20%", left: "-10%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
      <motion.div animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "20%", right: "-15%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />
      <motion.div animate={{ x: [0, 15, 0], y: [0, 25, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", bottom: "-10%", left: "30%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }} />
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(241,245,249,0.2)", marginBottom: 12 }}>{children}</p>;
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", margin: "0 auto", maxWidth: 1000 }} />;
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ name, desc, color, delay }: { name: string; desc: string; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }} whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 24px", cursor: "default", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "rgba(241,245,249,0.95)", marginBottom: 6 }}>{name}</h3>
      <p style={{ fontSize: 13, color: "rgba(241,245,249,0.4)", lineHeight: 1.65 }}>{desc}</p>
    </motion.div>
  );
}

// ── Step Card ─────────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, delay }: { num: string; title: string; desc: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.5 }} style={{ display: "flex", gap: 16 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", fontFamily: "var(--font-mono), monospace" }}>{num}</span>
      </div>
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "rgba(241,245,249,0.9)", marginBottom: 4 }}>{title}</h4>
        <p style={{ fontSize: 13, color: "rgba(241,245,249,0.4)", lineHeight: 1.65 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

// ── Benefit Card ──────────────────────────────────────────────────────────────
function BenefitCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.45 }}
      style={{ padding: "22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
      <div style={{ fontSize: 20, marginBottom: 12, lineHeight: 1 }}>{icon}</div>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: "rgba(241,245,249,0.9)", marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: 12, color: "rgba(241,245,249,0.38)", lineHeight: 1.7 }}>{desc}</p>
    </motion.div>
  );
}

// ── Track Card ────────────────────────────────────────────────────────────────
function TrackCard({ name, color, tags, desc, delay }: { name: string; color: string; tags: string[]; desc: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.45 }}
      whileHover={{ borderColor: `${color}30`, transition: { duration: 0.15 } }}
      style={{ padding: "24px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, cursor: "default", transition: "border-color 0.2s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <h4 style={{ fontSize: 15, fontWeight: 700, color: "rgba(241,245,249,0.92)" }}>{name}</h4>
      </div>
      <p style={{ fontSize: 12, color: "rgba(241,245,249,0.38)", lineHeight: 1.7, marginBottom: 16 }}>{desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {tags.map((t) => (
          <span key={t} style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, background: `${color}10`, border: `1px solid ${color}22`, color: `${color}` }}>{t}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.4 }}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(241,245,249,0.78)", lineHeight: 1.5 }}>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: 18, color: "rgba(129,140,248,0.7)", flexShrink: 0, lineHeight: 1 }}>+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 13, color: "rgba(241,245,249,0.45)", lineHeight: 1.8, paddingBottom: 18 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Stat Pill ─────────────────────────────────────────────────────────────────
function StatPill({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay, duration: 0.4 }}
      style={{ textAlign: "center", padding: "20px 28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: "rgba(241,245,249,0.95)", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>{label}</div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BuildersLanding() {
  const router = useRouter();
  const [showDisclosure, setShowDisclosure] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);
      if (user) {
        if (user.email?.endsWith("@orvantia.ai") && user.emailVerified) router.replace("/admin");
        else router.replace("/dashboard");
      }
    });
    return unsub;
  }, [router]);

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "var(--font-space), system-ui, sans-serif", overflowX: "hidden" }}>
      <BackgroundBlobs />

      {/* Nav */}
      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 60, background: "rgba(4,4,10,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="Orvantia" style={{ width: 24, height: 24, objectFit: "contain" }} />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.85)" }}>Orvantia</span>
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.12)", margin: "0 4px" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)" }}>Builders</span>
        </a>
        <a href="/builders/login" style={{ padding: "8px 18px", borderRadius: 100, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.22)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.12)"; }}>
          Sign In
        </a>
      </motion.header>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 32px", zIndex: 1 }}>
        <motion.div style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 800, width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", marginBottom: 28 }}>
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "block" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#818cf8" }}>Builder Program</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20, background: "linear-gradient(135deg, rgba(241,245,249,0.98) 0%, rgba(129,140,248,0.95) 50%, rgba(168,85,247,0.9) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Build Real.<br />Grow Fast.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.65, color: "rgba(241,245,249,0.5)", maxWidth: 600, margin: "0 auto 14px" }}>
            Work on production AI systems, build a portfolio that stands out, and get noticed by the teams shaping the future.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(241,245,249,0.32)", maxWidth: 520, margin: "0 auto 40px" }}>
            At Orvantia AI, we evaluate builders on what they create — not just what is written on their resume.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 44 }}>
            {[{ name: "Enteraflux", color: "#818cf8" }, { name: "Continuum", color: "#22d3ee" }, { name: "ClinicalAgents", color: "#a855f7" }].map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
                style={{ padding: "6px 16px", borderRadius: 100, background: `${p.color}12`, border: `1px solid ${p.color}30`, fontSize: 12, letterSpacing: "0.06em", color: p.color }}>
                {p.name}
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button onClick={() => setShowDisclosure(true)} whileHover={{ y: -2, boxShadow: "0 0 48px rgba(99,102,241,0.5)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "13px 32px", borderRadius: 100, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "white", cursor: "pointer", background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))", boxShadow: "0 0 32px rgba(99,102,241,0.35)", border: "none" }}>
              Apply Now →
            </motion.button>
            <motion.a href="#how-it-works" whileHover={{ y: -2 }}
              style={{ padding: "13px 24px", borderRadius: 100, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", color: "rgba(241,245,249,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center" }}>
              See How It Works
            </motion.a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ marginTop: 60 }}>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(241,245,249,0.2)" }}>Scroll</span>
              <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(99,102,241,0.4), transparent)" }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Divider />

      {/* Stats Bar */}
      <section style={{ padding: "60px 32px", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          <StatPill value="3" label="Live Products" delay={0} />
          <StatPill value="20+" label="Open Challenges" delay={0.07} />
          <StatPill value="5" label="Review Dimensions" delay={0.14} />
          <StatPill value="100%" label="Real Codebase" delay={0.21} />
        </div>
      </section>

      <Divider />

      {/* What You Gain */}
      <section style={{ padding: "80px 32px", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel>Professional Experience</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(241,245,249,0.9)" }}>What you walk away with</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <BenefitCard icon="🏗️" title="Production Portfolio" desc="Ship real features on live products. Link your commits and PRs — not just side projects." delay={0} />
          <BenefitCard icon="📝" title="Professional Reference" desc="Top contributors receive a formal reference letter from the Orvantia founding team." delay={0.07} />
          <BenefitCard icon="🎯" title="Scored Feedback" desc="Receive detailed scores across 5 dimensions with written feedback from domain experts." delay={0.14} />
          <BenefitCard icon="🤝" title="1-on-1 Discussion" desc="Every reviewed submission gets a live technical discussion with the Orvantia team." delay={0.21} />
          <BenefitCard icon="🌐" title="Builder Network" desc="Collaborate with builders from top colleges and early startups across India." delay={0.28} />
          <BenefitCard icon="🏅" title="Completion Certificate" desc="Receive a verified digital certificate for every challenge you complete successfully." delay={0.35} />
        </div>
      </section>

      <Divider />

      {/* Experience Tracks */}
      <section style={{ padding: "80px 32px", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel>Experience Tracks</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(241,245,249,0.9)" }}>Choose your focus area</h2>
          <p style={{ fontSize: 14, color: "rgba(241,245,249,0.35)", marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>Challenges span four domains. Pick one or explore all.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <TrackCard name="AI / LLM" color="#818cf8" desc="Build agent workflows, RAG pipelines, and autonomous AI features using the latest models." tags={["LLMs", "Agents", "RAG", "Prompt Eng"]} delay={0} />
          <TrackCard name="Full Stack" color="#22d3ee" desc="Build end-to-end features spanning Next.js frontends, Node APIs, and Firebase backends." tags={["React", "Next.js", "Node", "Firebase"]} delay={0.07} />
          <TrackCard name="DevOps / Infra" color="#a855f7" desc="Design scalable infrastructure, CI/CD pipelines, and cloud deployments that run production." tags={["AWS", "Docker", "CI/CD", "PostgreSQL"]} delay={0.14} />
          <TrackCard name="Product / Design" color="#fbbf24" desc="Turn wireframes into polished UIs. Own feature specs and work directly with founders." tags={["Figma", "UX", "TailwindCSS", "Three.js"]} delay={0.21} />
        </div>
      </section>

      <Divider />

      {/* Products Section */}
      <section style={{ padding: "80px 32px", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel>Current Products</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(241,245,249,0.9)" }}>Build on real products</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <ProductCard name="Enteraflux" desc="Enterprise Agent OS — autonomous workflows for modern organizations." color="#818cf8" delay={0} />
          <ProductCard name="Continuum" desc="Autonomous Engineering Platform — AI that builds, reviews, and ships." color="#22d3ee" delay={0.1} />
          <ProductCard name="ClinicalAgents" desc="Healthcare Intelligence Platform — clinical AI at the point of care." color="#a855f7" delay={0.2} />
        </div>
      </section>

      <Divider />

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: "80px 32px", maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel>The Process</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(241,245,249,0.9)" }}>From builder to contributor</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
          {[
            { num: "01", title: "Create your account", desc: "Sign up and complete your builder profile with your skills, background, and links." },
            { num: "02", title: "Pick a track + challenge", desc: "Browse tasks across AI, full stack, DevOps, and design — built around real products." },
            { num: "03", title: "Build and submit", desc: "Work at your own pace. Submit your repo, a Loom walkthrough, and a short write-up." },
            { num: "04", title: "Get reviewed", desc: "The Orvantia team reviews your work and schedules a live technical discussion." },
            { num: "05", title: "Receive your score", desc: "See scores across 5 dimensions with detailed written feedback from the team." },
            { num: "06", title: "Become a contributor", desc: "Top builders are shortlisted and invited to contribute to live Orvantia products." },
          ].map((step, i) => <StepCard key={step.num} {...step} delay={i * 0.07} />)}
        </div>
      </section>

      <Divider />

      {/* FAQ */}
      <section style={{ padding: "80px 32px", maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(241,245,249,0.9)" }}>Common questions</h2>
        </motion.div>
        <div>
          {[
            { q: "Who can apply to the Builder Program?", a: "Anyone — students, recent graduates, or working professionals. We care about what you can build, not your pedigree. If you have a GitHub and something to show, apply." },
            { q: "Is this a paid opportunity?", a: "At this stage there is no guaranteed stipend or salary. The program is designed for builders who want real experience, a portfolio of production work, and visibility to the founding team. Paid opportunities open as our products and client engagements grow." },
            { q: "How long does a challenge take?", a: "Challenges are scoped for 1–2 weeks of focused work. You pick your own timeline, but the team reviews submissions on a rolling basis." },
            { q: "What happens after I complete a challenge?", a: "You receive a score, written feedback, and a 1-on-1 discussion with the team. Standout builders are shortlisted for contributor roles on live products. You also receive a completion certificate you can reference on your resume or LinkedIn." },
            { q: "Can I work on multiple challenges?", a: "Yes. You can accept one challenge at a time. After it is reviewed you can pick the next. There is no cap on how many you complete." },
            { q: "Do I need prior work experience?", a: "No. Many of our best contributors joined straight out of college. We review code quality, approach, and communication — all things you can demonstrate without a job title." },
          ].map((item, i) => <FaqItem key={i} q={item.q} a={item.a} delay={i * 0.05} />)}
        </div>
      </section>

      <Divider />

      {/* CTA Banner */}
      <section style={{ padding: "80px 32px", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 28, padding: "60px 40px", boxShadow: "0 0 80px rgba(99,102,241,0.08)" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16, background: "linear-gradient(135deg, #f1f5f9, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Ready to build?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(241,245,249,0.45)", marginBottom: 36, lineHeight: 1.7 }}>
            Join builders who are proving their skills through real challenges and building careers that start here.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button onClick={() => setShowDisclosure(true)} whileHover={{ y: -2, boxShadow: "0 0 48px rgba(99,102,241,0.5)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "14px 36px", borderRadius: 100, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "white", cursor: "pointer", background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))", boxShadow: "0 0 32px rgba(99,102,241,0.35)", border: "none" }}>
              Apply Now →
            </motion.button>
            <motion.a href="/builders/login" whileHover={{ y: -2 }}
              style={{ padding: "14px 28px", borderRadius: 100, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", color: "rgba(241,245,249,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "inline-block" }}>
              Sign In
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 11, color: "rgba(241,245,249,0.18)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Orvantia AI · Builder Program</p>
      </footer>

      <AnimatePresence>
        {showDisclosure && <DisclosureModal onClose={() => setShowDisclosure(false)} onAccept={() => router.push("/builders/signup")} />}
      </AnimatePresence>
    </div>
  );
}
