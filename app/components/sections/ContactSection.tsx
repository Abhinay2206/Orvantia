"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, ORV_EASE } from "@/lib/motion";
import { Section, Eyebrow, Reveal, SplitHeadline, EASE } from "./_shared";

/* ─── Contact details + socials ──────────────────────────── */
const SOCIALS = [
  {
    label: "Instagram",
    handle: "@orvantia.in",
    href: "https://www.instagram.com/orvantia.in",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    handle: "Orvantia AI",
    href: "https://www.linkedin.com/company/orvantiaai",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 10v7M7 7.2v.02M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
];

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
      <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-strong)", color: "var(--text-2)" }}>
        {icon}
      </span>
      <div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 14.5, color: "var(--text)", lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}

function SocialLink({ label, handle, href, icon }: (typeof SOCIALS)[number]) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      aria-label={`${label} — ${handle}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 11, padding: "11px 16px",
        borderRadius: 12, textDecoration: "none",
        background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-strong)",
        color: "var(--text-2)", transition: "border-color 0.2s, color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
    >
      {icon}
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
        <span style={{ fontFamily: "var(--font)", fontSize: 13.5, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.02em", color: "var(--text-3)" }}>{handle}</span>
      </span>
    </a>
  );
}

function ContactPanel() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const paths = gsap.utils.toArray<SVGPathElement | SVGCircleElement>(".draw-icon", el);
    if (!paths.length) return;
    gsap.set(paths, { drawSVG: "0%" });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => gsap.to(paths, { drawSVG: "100%", duration: 0.9, ease: ORV_EASE, stagger: 0.08, delay: 0.15 }),
    });
    return () => st.kill();
  }, []);

  return (
    <Reveal>
      <div ref={panelRef} className="frosted" style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius-xl)", padding: "clamp(28px, 3.5vw, 48px)", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #6366f1, #a855f7 45%, #22d3ee)" }} />
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 14 }}>
          Talk to us directly
        </div>
        <a
          href="mailto:abhinaybakkera@orvantia.in"
          data-cursor-hover
          className="email-link"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font)", fontSize: "clamp(20px, 2.6vw, 32px)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", textDecoration: "none", transition: "color 0.2s", width: "fit-content" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#818cf8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
        >
          abhinaybakkera@orvantia.in
          <span className="email-arrow" style={{ fontSize: "0.7em" }}>↗</span>
        </a>
        <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "var(--text-2)", maxWidth: "40ch" }}>
          Tell us what you&apos;re building. We reply within 1–2 business days with a clear,
          no-pressure path forward.
        </p>

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <InfoRow
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path className="draw-icon" d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" /><circle className="draw-icon" cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" /></svg>}
            label="Based in"
            value="Hyderabad, Telangana · India"
          />
          <InfoRow
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><circle className="draw-icon" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path className="draw-icon" d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
            label="Response time"
            value="Within 1–2 business days"
          />
        </div>

        <div style={{ height: 1, background: "var(--border)", margin: "28px 0" }} />

        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 14 }}>
          Follow us
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {SOCIALS.map((s) => (
            <SocialLink key={s.label} {...s} />
          ))}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 28 }}>
          <span className="status-pill" style={{ display: "inline-flex" }}>
            <span className="status-dot" />
            Available for new projects
          </span>
        </div>
      </div>
    </Reveal>
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

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    // Sequence form elements sliding up
    const elements = formRef.current.querySelectorAll(".form-anim");
    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        }
      }
    );
  }, [status]); // Re-run if status changes so the success message or form re-animates

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
      `${form.message}\n\n- Budget: ${budget || "Not specified"}` +
      `\n- Timeline: ${timeline || "Not specified"}` +
      `\n- Services: ${services.join(", ") || "Not specified"}`;
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || "-",
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
      style={{ position: "relative", zIndex: 10 }}
      glow="radial-gradient(ellipse 80% 70% at 50% 100%, rgba(30,10,80,0.35), transparent 65%)"
    >
      <div style={{ maxWidth: 760, margin: "0 auto clamp(48px, 6vw, 80px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow num="08" label="Contact" />
          </div>
        </Reveal>
        <SplitHeadline
          text="Let's build something *extraordinary."
          style={{ marginTop: 26, fontSize: "clamp(34px, 6vw, 82px)", letterSpacing: "-0.04em", lineHeight: 1 }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
          gap: "clamp(24px, 3vw, 40px)",
          alignItems: "stretch",
        }}
      >
        {/* Contact details + socials */}
        <ContactPanel />

        {/* Form */}
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
                Thanks – we&apos;ll be in touch within 1–2 business days.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={submit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="contact-row form-anim">
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

              <div style={{ marginBottom: 22 }} className="form-anim">
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

              <div style={{ marginBottom: 22 }} className="form-anim">
                <label style={labelStyle}>What do you need?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SERVICES.map((s) => (
                    <Chip key={s} active={services.includes(s)} onClick={() => toggleService(s)}>{s}</Chip>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 22 }} className="form-anim">
                <label style={labelStyle}>Budget</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {BUDGETS.map((b) => (
                    <Chip key={b} active={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>{b}</Chip>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 22 }} className="form-anim">
                <label style={labelStyle}>Timeline</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TIMELINES.map((t) => (
                    <Chip key={t} active={timeline === t} onClick={() => setTimeline(timeline === t ? "" : t)}>{t}</Chip>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }} className="form-anim">
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
                  className="form-anim"
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
                className="btn-primary form-anim"
                data-cursor-hover
                style={{ width: "100%", cursor: status === "loading" ? "wait" : "pointer", opacity: status === "loading" ? 0.7 : 1 }}
              >
                {status === "loading" ? "Sending…" : "Start Your Project →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
