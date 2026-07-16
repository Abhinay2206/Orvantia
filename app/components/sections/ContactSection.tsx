"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section, Eyebrow, Reveal, EASE } from "./_shared";

/* ─── Interactive globe (pure CSS/SVG, lightweight) ──────── */
function Globe() {
  const arcs = [
    { d: "M 60 150 Q 150 40 240 150", delay: 0 },
    { d: "M 40 120 Q 150 220 260 120", delay: 0.6 },
    { d: "M 80 60 Q 150 150 220 240", delay: 1.2 },
  ];
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 380, aspectRatio: "1", margin: "0 auto" }}>
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, rgba(99,102,241,0.25), rgba(34,211,238,0.08) 45%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
      <svg viewBox="0 0 300 300" style={{ position: "relative", width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="sphere" cx="38%" cy="32%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.28)" />
            <stop offset="55%" stopColor="rgba(30,20,70,0.35)" />
            <stop offset="100%" stopColor="rgba(4,4,10,0.5)" />
          </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="120" fill="url(#sphere)" stroke="rgba(129,140,248,0.35)" strokeWidth="1" />

        {/* Longitude lines */}
        {[0.28, 0.55, 0.8, 1].map((s, i) => (
          <ellipse
            key={`lon${i}`}
            cx="150"
            cy="150"
            rx={120 * s}
            ry="120"
            fill="none"
            stroke="rgba(99,102,241,0.16)"
            strokeWidth="0.8"
          />
        ))}
        {/* Latitude lines */}
        {[-70, -35, 0, 35, 70].map((y, i) => {
          const rx = Math.sqrt(Math.max(0, 120 * 120 - y * y));
          return (
            <ellipse
              key={`lat${i}`}
              cx="150"
              cy={150 + y}
              rx={rx}
              ry={rx * 0.24}
              fill="none"
              stroke="rgba(34,211,238,0.12)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Connection arcs */}
        {arcs.map((a, i) => (
          <g key={i}>
            <motion.path
              d={a.d}
              fill="none"
              stroke="rgba(34,211,238,0.6)"
              strokeWidth="1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0.4] }}
              transition={{ duration: 2.4, delay: a.delay, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            />
          </g>
        ))}

        {/* Location pins */}
        {[
          [90, 110], [200, 95], [150, 190], [110, 175], [225, 165],
        ].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#22d3ee"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.6, 1] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 6px #22d3ee)" }}
          />
        ))}
      </svg>
    </div>
  );
}

const BUDGETS = ["< ₹10 K", "₹10 K - 50 K", "₹50 K - 1 L", "₹1 L+"];
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Exploring"];
const SERVICES = ["SaaS Platform", "AI / ML", "Web App", "Mobile App", "Automation", "Custom Software"];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--mono)",
  fontSize: 10,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--text-3)",
  marginBottom: 10,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--border-strong)",
  borderRadius: 10,
  padding: "13px 16px",
  color: "var(--text)",
  fontFamily: "var(--font)",
  fontSize: 15,
  outline: "none",
  transition: "border-color 0.2s",
};

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor-hover
      style={{
        padding: "9px 16px",
        borderRadius: 100,
        cursor: "pointer",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.06em",
        background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)",
        border: active ? "1px solid rgba(99,102,241,0.55)" : "1px solid var(--border-strong)",
        color: active ? "rgba(129,140,248,0.95)" : "var(--text-2)",
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

type Status = "idle" | "loading" | "success" | "error";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please add your name, email, and a short message.");
      return;
    }
    setError("");
    setStatus("loading");
    const composed =
      `${form.message}\n\n— Budget: ${budget || "Not specified"}` +
      `\n— Timeline: ${timeline || "Not specified"}` +
      `\n— Services: ${services.join(", ") || "Not specified"}`;
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || "—",
          phone: "",
          type: "Start Your Project",
          products: services,
          message: composed,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed to send");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Section
      id="contact"
      glow="radial-gradient(ellipse 80% 70% at 50% 100%, rgba(30,10,80,0.35), transparent 65%)"
    >
      <div style={{ maxWidth: 760, margin: "0 auto clamp(48px, 6vw, 80px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow num="08" label="Contact" />
          </div>
        </Reveal>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="g-text"
          style={{
            marginTop: 26,
            fontFamily: "var(--font)",
            fontSize: "clamp(34px, 6vw, 82px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Let&apos;s Build Something Extraordinary
        </motion.h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
          gap: "clamp(32px, 5vw, 72px)",
          alignItems: "center",
        }}
      >
        {/* Globe + reassurance */}
        <Reveal>
          <div>
            <Globe />
            <div style={{ marginTop: 32, textAlign: "center", maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-2)" }}>
                Tell us what you&apos;re building. We reply within 1–2 business days with a
                clear, no-pressure path forward.
              </p>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <span className="status-pill" style={{ display: "inline-flex" }}>
                  <span className="status-dot" />
                  Available for new projects
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1}>
          <div className="frosted" style={{ borderRadius: "var(--radius-xl)", padding: "clamp(28px, 3.5vw, 48px)" }}>
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 22px",
                    fontSize: 26,
                    color: "#4ade80",
                  }}
                >
                  ✓
                </div>
                <h3 style={{ fontFamily: "var(--font)", fontSize: 24, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
                  Message received.
                </h3>
                <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.65 }}>
                  Thanks — we&apos;ll be in touch within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="contact-row">
                  <div>
                    <label style={labelStyle}>Name <span style={{ color: "var(--indigo)" }}>*</span></label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Alex Chen"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: "var(--indigo)" }}>*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="alex@company.com"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>Company</label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="Acme Corp"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
                  />
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>What do you need?</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SERVICES.map((s) => (
                      <Chip key={s} active={services.includes(s)} onClick={() => toggleService(s)}>{s}</Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>Budget</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {BUDGETS.map((b) => (
                      <Chip key={b} active={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>{b}</Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>Timeline</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TIMELINES.map((t) => (
                      <Chip key={t} active={timeline === t} onClick={() => setTimeline(timeline === t ? "" : t)}>{t}</Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Project details <span style={{ color: "var(--indigo)" }}>*</span></label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your product, goals, and where you are today…"
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 110 }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
                  />
                </div>

                {error && (
                  <p
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "rgba(248,113,113,0.9)",
                      marginBottom: 16,
                      padding: "10px 14px",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: 8,
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary"
                  data-cursor-hover
                  style={{ width: "100%", cursor: status === "loading" ? "wait" : "pointer", opacity: status === "loading" ? 0.7 : 1 }}
                >
                  {status === "loading" ? "Sending…" : "Start Your Project →"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
