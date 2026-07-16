"use client";

import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

const PILLARS = [
  { k: "Enterprise SaaS", d: "Multi-tenant platforms engineered for scale, security, and reliability." },
  { k: "AI Solutions", d: "LLM apps, agents, and intelligent automation embedded into real workflows." },
  { k: "Custom Software", d: "Bespoke products built around your operations — not off-the-shelf." },
  { k: "Automation", d: "Systems that remove manual work and run your business while you sleep." },
  { k: "Cloud Applications", d: "Cloud-native architecture, observability, and CI/CD from day one." },
  { k: "Long-term Partnerships", d: "We build, ship, and evolve with you — well beyond launch." },
];

export default function AboutSection() {
  return (
    <Section
      id="about"
      glow="radial-gradient(ellipse 60% 50% at 15% 20%, rgba(99,102,241,0.09), transparent 60%)"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "clamp(48px, 7vw, 96px)",
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: 920 }}>
          <Reveal>
            <Eyebrow num="02" label="Who We Are" />
          </Reveal>
          <SplitHeadline
            text="A premium software studio building *intelligent products for modern business."
            style={{ marginTop: 26, fontSize: "clamp(30px, 4.6vw, 62px)" }}
          />
          <Reveal delay={0.15}>
            <p
              style={{
                marginTop: 28,
                maxWidth: "56ch",
                fontSize: "clamp(15px, 1.4vw, 19px)",
                lineHeight: 1.7,
                color: "var(--text-2)",
              }}
            >
              Orvantia designs and engineers enterprise SaaS platforms, AI-powered
              applications, and custom software for teams that refuse to settle for
              generic tooling. We pair deep systems engineering with design
              craftsmanship — and stay for the long run as your product partner.
            </p>
          </Reveal>
        </div>

        {/* Pillars grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: 1,
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {PILLARS.map((p, i) => (
            <Reveal
              key={p.k}
              delay={i * 0.06}
              className="about-pillar"
              style={{
                background: "var(--bg)",
                padding: "clamp(26px, 3vw, 40px)",
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text-3)",
                }}
              >
                0{i + 1}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font)",
                    fontSize: "clamp(18px, 1.8vw, 22px)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    marginBottom: 10,
                  }}
                >
                  {p.k}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-2)" }}>
                  {p.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
