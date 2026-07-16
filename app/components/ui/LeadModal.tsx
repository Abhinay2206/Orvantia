"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export type ModalType = "book-demo" | "schedule" | "discuss";

const TITLES: Record<ModalType, string> = {
  "book-demo": "Book a Product Demo",
  schedule: "Schedule a Consultation",
  discuss: "Discuss Your Use Case",
};

const INQUIRY_OPTIONS = [
  "Start Your Project",
  "Book a Demo",
  "Schedule a Consultation",
  "Discuss My Use Case",
  "Partnership",
  "Other",
];

const PRODUCTS = ["Enterprise SaaS", "AI Integration", "Custom Software", "Automation", "Not sure yet"];

const DEFAULT_INQUIRY: Record<ModalType, string> = {
  "book-demo": "Book a Demo",
  schedule: "Schedule a Consultation",
  discuss: "Discuss My Use Case",
};

interface Props {
  type: ModalType;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 10,
  padding: "12px 16px",
  color: "rgba(241,245,249,0.9)",
  fontFamily: "var(--font)",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
};

export default function LeadModal({ type, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    type: DEFAULT_INQUIRY[type],
    products: [] as string[],
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => firstRef.current?.focus(), 100);
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const toggleProduct = (p: string) => {
    setForm((f) => ({
      ...f,
      products: f.products.includes(p)
        ? f.products.filter((x) => x !== p)
        : [...f.products, p],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="overlay"
        data-lenis-prevent="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(4,4,10,0.85)",
          backdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
          cursor: "auto",
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%", maxWidth: 560,
            maxHeight: "90vh", overflowY: "auto",
            background: "rgba(7,7,16,0.96)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 20,
            boxShadow: "0 0 80px rgba(99,102,241,0.12), 0 40px 120px rgba(0,0,0,0.6)",
            cursor: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "24px 28px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 10,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(99,102,241,0.7)", marginBottom: 6,
              }}>
                Orvantia AI
              </div>
              <h2 style={{
                fontFamily: "var(--font)", fontSize: "clamp(18px,2.5vw,24px)",
                fontWeight: 700, letterSpacing: "-0.02em",
                color: "rgba(241,245,249,0.95)", margin: 0,
              }}>
                {TITLES[type]}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(241,245,249,0.4)", fontSize: 18, cursor: "pointer",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              ×
            </button>
          </div>

          {/* Success state */}
          {status === "success" ? (
            <div style={{ padding: "48px 28px", textAlign: "center" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: 24,
              }}>✓</div>
              <h3 style={{
                fontFamily: "var(--font)", fontSize: 20, fontWeight: 600,
                color: "rgba(241,245,249,0.95)", marginBottom: 10,
              }}>
                Message received.
              </h3>
              <p style={{
                fontFamily: "var(--font)", fontSize: 14,
                color: "rgba(241,245,249,0.4)", lineHeight: 1.65, marginBottom: 28,
              }}>
                We&apos;ll review your inquiry and get back to you within 1–2 business days. Check your inbox for a confirmation.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: "24px 28px 28px" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 7 }}>
                    Full Name <span style={{ color: "#6366f1" }}>*</span>
                  </label>
                  <input
                    ref={firstRef}
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Alex Chen"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 7 }}>
                    Work Email <span style={{ color: "#6366f1" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="alex@company.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 7 }}>
                    Company <span style={{ color: "#6366f1" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="Acme Corp"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 7 }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 7 }}>
                  Inquiry Type <span style={{ color: "#6366f1" }}>*</span>
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
                >
                  {INQUIRY_OPTIONS.map((o) => (
                    <option key={o} value={o} style={{ background: "#070710" }}>{o}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 10 }}>
                  Product(s) of Interest
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PRODUCTS.map((p) => {
                    const active = form.products.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => toggleProduct(p)}
                        style={{
                          padding: "7px 14px", borderRadius: 100, cursor: "pointer",
                          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
                          border: active ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.09)",
                          color: active ? "rgba(129,140,248,0.95)" : "rgba(241,245,249,0.35)",
                          transition: "all 0.2s",
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 7 }}>
                  How can we help? <span style={{ color: "#6366f1" }}>*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your use case, team size, timeline, or anything that helps us prepare..."
                  required
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
                />
              </div>

              {error && (
                <p style={{
                  fontFamily: "var(--mono)", fontSize: 11, color: "rgba(248,113,113,0.85)",
                  marginBottom: 16, padding: "10px 14px",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary"
                style={{ width: "100%", cursor: status === "loading" ? "wait" : "pointer", opacity: status === "loading" ? 0.7 : 1 }}
              >
                {status === "loading" ? "Sending…" : "Send Message →"}
              </button>

              <p style={{
                marginTop: 14, textAlign: "center",
                fontFamily: "var(--mono)", fontSize: 10,
                color: "rgba(241,245,249,0.2)", letterSpacing: "0.06em",
              }}>
                We respond within 1–2 business days.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
