"use client";

import PageShell from "../components/ui/PageShell";
import CtaBand from "../components/ui/CtaBand";
import { Section, Eyebrow, SplitHeadline, Reveal } from "../components/sections/_shared";
import { ProductDemo, MetricsBar, Transformation, STEPS, CAPABILITIES } from "../components/sections/CaseStudySection";

const CYAN = "rgba(34,211,238,0.8)";

const FACTS = [
  ["Client", "Prayagh Consumer Care Pvt. Ltd."],
  ["Industry", "Manufacturing"],
  ["What we did", "Discovery, design, build, launch, support"],
  ["Status", "Live in production"],
];

const PROBLEM = [
  ["A diary at the desk", "Every task for every department was written by hand, one line per job. If a page was missed, the work was missed."],
  ["Instructions shouted across the floor", "Jobs were assigned by voice. Nothing was recorded, so nothing could be traced."],
  ["Follow-ups over WhatsApp", "Chasing status meant scrolling chats and sending message after message - one person at a time."],
  ["Reports that arrived a day late", "By the time a problem surfaced in a report, the decision it needed had already passed."],
];

const STACK = ["Next.js", "TypeScript", "MongoDB", "Redis", "Socket.IO", "Role-based access"];

const chip: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", fontSize: 13, color: "var(--text-2)" };

export default function CaseStudyPage() {
  return (
    <PageShell>
      {/* ── Hero ── */}
      <Section glow="radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34,211,238,0.09), transparent 60%)">
        <Reveal>
          <a href="/#case-study" data-cursor-hover style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-3)", textDecoration: "none" }}>← Back to Orvantia</a>
        </Reveal>
        <div style={{ marginTop: 28 }}>
          <Reveal><Eyebrow num="01" label="Case study · Manufacturing" color={CYAN} /></Reveal>
        </div>
        <Reveal delay={0.08}>
          <h1 className="g-text-cyan" style={{ marginTop: 22, fontSize: "clamp(48px, 9vw, 128px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.92 }}>FactoryFlow</h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p style={{ marginTop: 22, fontSize: "clamp(19px, 2.2vw, 30px)", fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.35, maxWidth: "28ch" }}>
            A manufacturing floor ran on a diary and WhatsApp. Now it runs on this.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ marginTop: "clamp(32px, 4vw, 48px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", borderTop: "1px solid var(--border)" }}>
            {FACTS.map(([k, v]) => (
              <div key={k} style={{ padding: "18px 0", borderBottom: "1px solid var(--border)", paddingRight: 20 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)" }}>{k}</div>
                <div style={{ marginTop: 8, fontSize: 15, color: k === "Status" ? "#4ade80" : "var(--text)" }}>{v}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <div style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
          <Reveal><ProductDemo /></Reveal>
        </div>
      </Section>

      {/* ── The problem ── */}
      <Section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="02" label="The problem" color="rgba(248,113,113,0.8)" /></Reveal>
        <SplitHeadline text="The work that slipped was the work *nobody could see." style={{ marginTop: 22, fontSize: "clamp(28px, 4.4vw, 58px)", maxWidth: "20ch" }} />
        <div style={{ marginTop: "clamp(32px, 4vw, 52px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: 14 }}>
          {PROBLEM.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.06} style={{ height: "100%" }}>
              <div className="glass-card" style={{ height: "100%", borderRadius: "var(--radius-lg)", borderLeft: "2px solid rgba(248,113,113,0.55)", padding: "24px 22px" }}>
                <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>{t}</div>
                <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6, color: "var(--text-2)" }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── How we did it ── */}
      <Section>
        <Reveal><Eyebrow num="03" label="How we did it" color={CYAN} /></Reveal>
        <SplitHeadline text="Four steps from paper to *production." style={{ marginTop: 22, fontSize: "clamp(28px, 4.4vw, 58px)", maxWidth: "20ch" }} />
        <div style={{ marginTop: "clamp(32px, 4vw, 52px)", display: "grid", gap: 0, borderTop: "1px solid var(--border)" }}>
          {STEPS.map(([n, title, desc, c], i) => (
            <Reveal key={n} delay={i * 0.05}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(56px, 120px) minmax(0, 1fr)", gap: "clamp(16px, 3vw, 48px)", padding: "clamp(22px, 3vw, 36px) 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(22px, 3vw, 38px)", color: c, lineHeight: 1 }}>{n}</div>
                <div>
                  <div style={{ fontSize: "clamp(20px, 2.4vw, 30px)", fontWeight: 600, letterSpacing: "-0.025em" }}>{title}</div>
                  <p style={{ marginTop: 10, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "64ch" }}>{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Before → after ── */}
      <Section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="04" label="What changed" color={CYAN} /></Reveal>
        <SplitHeadline text="From lost notes to a *system of record." style={{ marginTop: 22, marginBottom: "clamp(28px, 3.6vw, 44px)", fontSize: "clamp(28px, 4.4vw, 58px)", maxWidth: "20ch" }} />
        <Transformation />
      </Section>

      {/* ── Results + under the hood ── */}
      <Section>
        <Reveal><Eyebrow num="05" label="The results" color={CYAN} /></Reveal>
        <SplitHeadline text="Real numbers from the *first month." style={{ marginTop: 22, marginBottom: "clamp(28px, 3.6vw, 44px)", fontSize: "clamp(28px, 4.4vw, 58px)", maxWidth: "20ch" }} />
        <MetricsBar />
        <div style={{ marginTop: "clamp(40px, 5vw, 64px)", display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" }}>
          <Reveal>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 16 }}>Shipped</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{CAPABILITIES.map((c) => <span key={c} style={chip}>{c}</span>)}</div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 16 }}>Under the hood</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{STACK.map((c) => <span key={c} style={{ ...chip, fontFamily: "var(--mono)", fontSize: 12 }}>{c}</span>)}</div>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        headline="Your business could be *next."
        body="If your team still runs on diaries, spreadsheets, or group chats, we can build the system that replaces them - scoped and priced before any code is written."
      />
    </PageShell>
  );
}
