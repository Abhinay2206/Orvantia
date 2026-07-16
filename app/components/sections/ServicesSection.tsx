"use client";

import { useRef } from "react";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

type Service = { n: string; k: string; d: string; c: string };

const SERVICES: Service[] = [
  { n: "01", k: "SaaS Development", d: "Multi-tenant products with billing, auth, and roles built to scale.", c: "#6366f1" },
  { n: "02", k: "AI Integration", d: "LLM copilots, RAG, and agents wired into your product surface.", c: "#a855f7" },
  { n: "03", k: "Enterprise Dashboards", d: "Real-time analytics and control planes engineers actually trust.", c: "#22d3ee" },
  { n: "04", k: "Web Apps", d: "Fast, accessible interfaces on Next.js and modern React.", c: "#3b82f6" },
  { n: "05", k: "Mobile Apps", d: "Native-feeling iOS & Android from a single, maintainable codebase.", c: "#818cf8" },
  { n: "06", k: "UI/UX", d: "Design systems and interaction craft that make software feel premium.", c: "#3b82f6" },
  { n: "07", k: "Maintenance", d: "Long-term ownership — monitoring, hardening, and iteration.", c: "#818cf8" },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Reveal delay={(i % 3) * 0.06}>
      <div
        ref={ref}
        onMouseMove={onMove}
        data-cursor-hover
        className="service-card glass-card hover-lift"
        style={
          {
            "--svc": s.c,
            position: "relative",
            height: "100%",
            minHeight: 210,
            padding: "clamp(24px, 2.4vw, 34px)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          } as React.CSSProperties
        }
      >
        {/* Spotlight */}
        <div
          className="service-spot"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.3s",
            background:
              "radial-gradient(340px circle at var(--mx) var(--my), color-mix(in srgb, var(--svc) 16%, transparent), transparent 65%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-3)" }}>{s.n}</span>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: s.c,
              boxShadow: `0 0 14px ${s.c}`,
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <h3
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(19px, 1.9vw, 24px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: 10,
            }}
          >
            {s.k}
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-2)" }}>{s.d}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function ServicesSection() {
  return (
    <Section
      id="services"
      style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      glow="radial-gradient(ellipse 50% 40% at 85% 10%, rgba(168,85,247,0.08), transparent 60%)"
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginBottom: "clamp(44px, 5vw, 72px)" }}>
        <div style={{ maxWidth: 760 }}>
          <Reveal>
            <Eyebrow num="03" label="Capabilities" color="rgba(168,85,247,0.75)" />
          </Reveal>
          <SplitHeadline
            text="Everything you need to *ship, scale, and evolve."
            style={{ marginTop: 24, fontSize: "clamp(30px, 4.4vw, 60px)" }}
          />
        </div>
        <Reveal delay={0.2}>
          <p style={{ maxWidth: "34ch", fontSize: 15, lineHeight: 1.7, color: "var(--text-2)" }}>
            One partner across the full software lifecycle — from first prototype to
            enterprise-grade platform in production.
          </p>
        </Reveal>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(14px, 1.4vw, 20px)",
        }}
      >
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.k} s={s} i={i} />
        ))}
      </div>
    </Section>
  );
}
