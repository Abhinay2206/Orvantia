"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const NAV = [
  {
    heading: "Products",
    links: [
      { label: "All Products", sub: "Continuum OS · EnteraFlux", href: "/products" },
      { label: "Continuum OS", sub: "Open-Source Engineering OS", href: "https://continuumos.vercel.app/" },
      { label: "EnteraFlux", sub: "Research Stage", href: "https://www.enteraflux.tech/" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "About", href: "/#about" },
      { label: "Services", href: "/#services" },
      { label: "Case Study", href: "/#case-study" },
      { label: "Process", href: "/#process" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/orvantia.in",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/orvantiaai",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 10v7M7 7.2v.02M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Footer() {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const wordmarkInView = useInView(wordmarkRef, { once: true, margin: "-15%" });

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.055)",
        background: "var(--bg)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 100%, rgba(20,5,70,0.28), transparent 65%)",
        }}
      />

      {/* ─── Top grid ──────────────────────────────────── */}
      <div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]"
        style={{
          padding: "clamp(56px, 8vw, 96px) clamp(24px, 5vw, 72px) clamp(40px, 5vw, 64px)",
          gap: "clamp(24px, 4vw, 64px)",
        }}
      >
        {/* Brand column */}
        <div>
          {/* Logo mark */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ position: "relative", width: 28, height: 28 }}>
              <img src="/logo.png" alt="Orvantia Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <span
              style={{
                fontFamily: "var(--font)",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(241,245,249,0.85)",
              }}
            >
              Orvantia
            </span>
          </div>

          <p
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(14px, 1.1vw, 16px)",
              color: "rgba(241,245,249,0.28)",
              lineHeight: 1.7,
              maxWidth: "34ch",
              marginBottom: 24,
            }}
          >
            A premium software studio building enterprise SaaS platforms, AI-powered
            applications, and custom software for modern businesses.
          </p>

          {/* Status */}
          <div className="status-pill" style={{ display: "inline-flex" }}>
            <div className="status-dot" />
            Open for Partnership
          </div>
        </div>

        {/* Nav columns */}
        {NAV.map((col) => (
          <div key={col.heading}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(241,245,249,0.22)",
                marginBottom: 20,
              }}
            >
              {col.heading}
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={"href" in link ? link.href : "#"}
                    target={"href" in link && link.href.startsWith("http") ? "_blank" : undefined}
                    rel={"href" in link && link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    data-cursor-hover
                    style={{
                      fontFamily: "var(--font)",
                      fontSize: "clamp(13px, 1vw, 14px)",
                      color: "rgba(241,245,249,0.3)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.75)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.3)")}
                  >
                    {link.label}
                    {"sub" in link && link.sub && (
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 9,
                          color: "rgba(241,245,249,0.18)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {link.sub}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ─── Divider ───────────────────────────────────── */}
      <div
        className="relative z-10"
        style={{
          margin: "0 clamp(24px, 5vw, 72px)",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)",
        }}
      />

      {/* ─── Huge outline wordmark ──────────────────────── */}
      <div
        ref={wordmarkRef}
        className="relative z-10 overflow-hidden"
        style={{ padding: "clamp(16px, 3vw, 32px) clamp(24px, 5vw, 72px) 0" }}
      >
        <motion.h2
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={wordmarkInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: "var(--font)",
            fontSize: "clamp(72px, 15vw, 220px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.055)",
            userSelect: "none",
            transition: "WebkitTextStroke 0.3s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.webkitTextStroke = "1px rgba(99,102,241,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.webkitTextStroke = "1px rgba(255,255,255,0.055)";
          }}
        >
          ORVANTIA
        </motion.h2>
      </div>

      {/* ─── Bottom bar ────────────────────────────────── */}
      <div
        className="relative z-10"
        style={{
          padding: "clamp(20px, 3vw, 28px) clamp(24px, 5vw, 72px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          marginTop: "clamp(12px, 2vw, 24px)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "rgba(241,245,249,0.14)",
            letterSpacing: "0.06em",
          }}
        >
          © {new Date().getFullYear()} Orvantia AI, Inc. All rights reserved.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          {/* Socials */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor-hover
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(241,245,249,0.4)",
                  transition: "color 0.2s, border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(241,245,249,0.9)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(241,245,249,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "transparent"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
          {LEGAL.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              data-cursor-hover
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "rgba(241,245,249,0.14)",
                textDecoration: "none",
                letterSpacing: "0.08em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.45)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.14)")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
