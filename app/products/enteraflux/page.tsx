"use client";

import PageShell from "../../components/ui/PageShell";
import CtaBand from "../../components/ui/CtaBand";
import { Section, Eyebrow, SplitHeadline, Reveal } from "../../components/sections/_shared";

const SITE = "https://www.enteraflux.tech/";
const VIOLET = "rgba(196,140,255,0.9)";

const AGENTS = [
  ["RX", "Medication", "Keeps doses and schedules on track, with reminders that follow the treatment plan.", "#6366f1"],
  ["SX", "Symptoms", "Logs how someone feels and surfaces patterns worth raising with a doctor.", "#22d3ee"],
  ["NX", "Nutrition", "Plans meals around Indian food and adjusts them week by week.", "#a855f7"],
  ["PX", "Progress", "Tracks the journey toward a goal and flags when something drifts off course.", "#f59e0b"],
];

const ROADMAP = [
  ["Adaptive intake modeling", "Learning what each person actually eats and needs, instead of one generic plan."],
  ["Multi-agent reasoning core", "The layer that lets the four agents share context and agree on a single suggestion."],
  ["Real-world validation studies", "Testing with real people before anything is claimed."],
  ["Private beta cohort", "A small, closed group first - wider access only once it's proven safe and useful."],
];

export default function EnterafluxPage() {
  return (
    <PageShell>
      {/* ── Hero ── */}
      <Section glow="radial-gradient(ellipse 60% 60% at 70% 30%, rgba(168,85,247,0.12), transparent 62%)">
        <Reveal>
          <a href="/#products" data-cursor-hover style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-3)", textDecoration: "none" }}>← Back to Orvantia</a>
        </Reveal>
        <div style={{ marginTop: 28 }}>
          <Reveal><Eyebrow num="01" label="Product · Research stage" color={VIOLET} /></Reveal>
        </div>
        <Reveal delay={0.08}>
          <h1 className="g-text-violet" style={{ marginTop: 22, fontSize: "clamp(48px, 9vw, 128px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.92 }}>EnteraFlux</h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p style={{ marginTop: 22, fontSize: "clamp(18px, 2vw, 27px)", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.45, maxWidth: "34ch" }}>
            An AI health companion in research: cooperating agents that look after medication, symptoms, nutrition and progress - so long treatment journeys aren&apos;t managed alone.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href={SITE} target="_blank" rel="noopener noreferrer" data-cursor-hover className="btn-primary" style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>Follow the research ↗</a>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", padding: "8px 14px", borderRadius: 100, border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.08)", color: VIOLET }}>◇ Not yet available</span>
          </div>
        </Reveal>
      </Section>

      {/* ── How it's designed ── */}
      <Section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="02" label="How it's designed" color={VIOLET} /></Reveal>
        <SplitHeadline text="Four agents, one *care plan." style={{ marginTop: 22, fontSize: "clamp(28px, 4.4vw, 58px)", maxWidth: "20ch" }} />
        <div style={{ marginTop: "clamp(32px, 4vw, 52px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 14 }}>
          {AGENTS.map(([id, name, desc, c], i) => (
            <Reveal key={id} delay={i * 0.06} style={{ height: "100%" }}>
              <div className="glass-card" style={{ height: "100%", borderRadius: "var(--radius-lg)", padding: "24px 22px 26px", background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${c}14, transparent 70%)` }}>
                <span style={{ display: "inline-grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, fontFamily: "var(--mono)", fontSize: 13, color: c, background: `${c}18`, border: `1px solid ${c}40` }}>{id}</span>
                <div style={{ marginTop: 18, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>{name}</div>
                <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.6, color: "var(--text-2)" }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Roadmap ── */}
      <Section>
        <Reveal><Eyebrow num="03" label="Research roadmap" color={VIOLET} /></Reveal>
        <SplitHeadline text="Proven first, *public later." style={{ marginTop: 22, fontSize: "clamp(28px, 4.4vw, 58px)", maxWidth: "20ch" }} />
        <Reveal delay={0.1}>
          <p style={{ marginTop: 20, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text-2)", maxWidth: "58ch" }}>
            Health software has to be right, not just impressive. EnteraFlux stays in research until the science holds up - this is the path it has to clear.
          </p>
        </Reveal>
        <div style={{ marginTop: "clamp(28px, 3.6vw, 48px)", borderTop: "1px solid var(--border)" }}>
          {ROADMAP.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(48px, 110px) minmax(0, 1fr)", gap: "clamp(16px, 3vw, 48px)", padding: "clamp(20px, 2.8vw, 32px) 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(20px, 2.6vw, 32px)", color: VIOLET, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div style={{ fontSize: "clamp(19px, 2.2vw, 27px)", fontWeight: 600, letterSpacing: "-0.025em" }}>{t}</div>
                  <p style={{ marginTop: 8, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "60ch" }}>{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        headline="Got an ambitious *idea too?"
        body="We take on hard problems carefully - research first, then software that holds up in the real world."
      />
    </PageShell>
  );
}
