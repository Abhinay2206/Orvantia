"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ORV_EASE } from "@/lib/motion";
import { useModal } from "@/app/components/providers/ModalProvider";
import MagneticButton from "./MagneticButton";
import RollText from "./RollText";

const NAV = [
  {
    heading: "Products",
    links: [
      { label: "All Products", sub: "NutritionOS · EnteraFlux", href: "/products" },
      { label: "NutritionOS", sub: "Free Fitness Tracker", href: "https://nutritionos.orvantia.in/" },
      { label: "EnteraFlux", sub: "Research Stage", href: "https://www.enteraflux.tech/" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "About", href: "/#about" },
      { label: "Case Study", href: "/#case-study" },
      { label: "Services", href: "/#services" },
      { label: "Process", href: "/#process" },
      { label: "Team", href: "/#team" },
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

const WORDMARK = "ORVANTIA".split("");
// Closing line - "*word" is set in the serif accent.
const CLOSING = "Let's make your business *run *itself.".split(" ");

/* Live studio time in Hyderabad. */
function useStudioTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true });
    const tick = () => setTime(fmt.format(new Date()).toUpperCase());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Footer() {
  const { openModal } = useModal();
  const time = useStudioTime();
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLHeadingElement>(null);

  /* Wordmark letters rise out of the floor as the footer scrolls in. */
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wm-letter",
        { yPercent: 105 },
        {
          yPercent: 0,
          ease: ORV_EASE,
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.8 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  /* Closing line lights up word by word as it scrolls in - echoes the manifesto. */
  useEffect(() => {
    const el = closingRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelectorAll(".cl-w"),
        { opacity: 0.12 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: 0.6 } }
      );
    });
    return () => mm.revert();
  }, []);

  const toTop = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number) => void } }).lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {/* ─── Closing CTA ───────────────────────────────── */}
      <div
        className="relative z-10"
        style={{
          padding: "clamp(72px, 10vw, 140px) clamp(24px, 5vw, 72px) clamp(56px, 7vw, 96px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "clamp(32px, 5vw, 64px)",
          borderBottom: "1px solid rgba(255,255,255,0.055)",
        }}
      >
        <div style={{ maxWidth: 900 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 22 }}>
            Still running on paper &amp; WhatsApp?
          </div>
          <h2
            ref={closingRef}
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(40px, 7.4vw, 118px)",
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
              color: "var(--text)",
            }}
          >
            {CLOSING.map((w, i) => (
              <span key={i}>
                <span className={w.startsWith("*") ? "cl-w accent-serif" : "cl-w"}>{w.replace("*", "")}</span>
                {i < CLOSING.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
        </div>

        <MagneticButton className="footer-cta" strength={0.35} onClick={() => openModal("schedule")}>
          <span>Start a project</span>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 13L13 3M13 3H5M13 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </MagneticButton>
      </div>

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
            A software studio helping growing businesses replace manual work
            with automation, SaaS, and custom software.
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
                fontSize: 10,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(241,245,249,0.22)",
                marginBottom: 20,
              }}
            >
              {col.heading}
            </div>
            <ul className="footer-links" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
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
                    <RollText>{link.label}</RollText>
                    {"sub" in link && link.sub && (
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 10,
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

      {/* ─── Full-bleed wordmark ─────────────────────────── */}
      <div
        ref={wordmarkRef}
        className="relative z-10 overflow-hidden"
        aria-hidden
        style={{ padding: "clamp(24px, 4vw, 48px) clamp(12px, 2vw, 32px) 0", userSelect: "none" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font)",
            fontSize: "clamp(64px, 21.4vw, 400px)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.8,
          }}
        >
          {WORDMARK.map((l, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.02em" }}>
              <span className="wm-letter">{l}</span>
            </span>
          ))}
        </div>
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
          © {new Date().getFullYear()} Orvantia, Inc. All rights reserved.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "rgba(241,245,249,0.35)" }}>
          <span className="status-dot" style={{ background: "#4ade80" }} />
          HYDERABAD · {time || "--:--"} IST
        </div>

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
                  width: 40,
                  height: 40,
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
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
          <button type="button" onClick={toTop} data-cursor-hover className="footer-top">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
