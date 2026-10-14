"use client";

import PageShell from "../../components/ui/PageShell";
import CtaBand from "../../components/ui/CtaBand";
import { Section, Eyebrow, SplitHeadline, Reveal } from "../../components/sections/_shared";
import { Terminal } from "../../components/sections/ProductsGallery";

const SITE = "https://contextbridge.orvantia.in/";
const GREEN = "#4ade80";

const STEPS = [
  ["Record", "Run your tests through ContextBridge. The command, exit code and time are stored - whether it passes or fails."],
  ["Save", "Checkpoint the branch, HEAD and file hashes as plain files, with a diff review before anything is saved."],
  ["Switch", "Hand the work to another session, account or agent. The state travels with the repo, not the chat."],
  ["Resume", "The next session runs the gate first. It reports READY, REVIEW or BLOCKED based on what changed since the checkpoint."],
];

const BENCH = [
  ["85/86", "Drift scenarios passed"],
  ["65", "Tokens, median resume check"],
  ["143 ms", "To check 10,000 files"],
  ["0", "Network calls"],
];

const FEATURES = [
  ["Evidence", "Records test commands, exit codes and timestamps, including the failures."],
  ["Checkpoints", "Stores branch, HEAD and file hashes as plain files, with a diff review before saving."],
  ["Decision graph", "Links requirements, decisions, code and tests, so the reason survives with the change."],
  ["Drift detection", "Flags commits since the checkpoint, changed files and failed runs."],
  ["Secret redaction", "Scans before writing. Best-effort - it reduces risk, it does not replace review."],
  ["Local-first and portable", "JSON and Markdown files in your repo. No account, no telemetry."],
  ["Advisory session claims", "Warns when two agents claim overlapping paths."],
];

export default function ContextBridgePage() {
  return (
    <PageShell>
      {/* ── Hero ── */}
      <Section>
        <Reveal>
          <a href="/#products" data-cursor-hover style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-3)", textDecoration: "none" }}>← Back to Orvantia</a>
        </Reveal>
        <div style={{ marginTop: 28 }}><Reveal><Eyebrow num="01" label="Product · Open source" color={GREEN} /></Reveal></div>
        <div className="split" style={{ marginTop: "clamp(28px, 4vw, 56px)", alignItems: "end", gridTemplateColumns: "minmax(0, 6fr) minmax(0, 6fr)" }}>
          <div>
            <Reveal delay={0.06}>
              <h1 className="serif-display" style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(48px, 7.6vw, 124px)", lineHeight: 0.88, letterSpacing: "-0.045em", marginLeft: "-0.04em" }}>ContextBridge</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p style={{ marginTop: 26, fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.4vw, 54px)", lineHeight: 1.04, letterSpacing: "-0.02em", maxWidth: "16ch" }}>
                Context <span className="accent-serif" style={{ color: GREEN }}>outlives</span> the session.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div style={{ marginTop: 34, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
                <a href={SITE} target="_blank" rel="noopener noreferrer" data-cursor-hover className="btn-primary">Visit the site ↗</a>
                <code style={{ fontFamily: "var(--mono)", fontSize: 12.5, padding: "13px 18px", border: "1px solid var(--border-strong)", borderRadius: 4, color: "var(--text)" }}>pip install contextbridge-cli</code>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}><div style={{ display: "flex", justifyContent: "center" }}><Terminal /></div></Reveal>
        </div>
      </Section>

      {/* ── Idea ── */}
      <Section style={{ borderTop: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="02" label="The idea" color={GREEN} /></Reveal>
        <SplitHeadline text="Preserve the state of the work, *not just the story." style={{ marginTop: 28, fontSize: "clamp(32px, 4.8vw, 72px)", maxWidth: "18ch" }} />
        <Reveal delay={0.1}>
          <p style={{ marginTop: 26, maxWidth: "58ch", fontSize: "clamp(15px, 1.4vw, 19px)", lineHeight: 1.7, color: "var(--text-2)" }}>
            ContextBridge is a resume safety gate for AI coding sessions. When work moves between sessions, accounts or agents, it checkpoints the real state of the repo, records the tests you ran, and tells the next session whether it&apos;s safe to edit code.
          </p>
        </Reveal>
      </Section>

      {/* ── How it works ── */}
      <Section style={{ borderTop: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="03" label="How it works" color={GREEN} /></Reveal>
        <div style={{ marginTop: "clamp(28px, 4vw, 56px)", borderTop: "1px solid var(--border-strong)" }}>
          {STEPS.map(([t, d], i) => (
            <Reveal key={t}>
              <div className="prob-row" style={{ gridTemplateColumns: "clamp(44px, 6vw, 84px) minmax(0, 5fr) minmax(0, 7fr)", gap: "clamp(16px, 3vw, 48px)", alignItems: "baseline" }}>
                <span className="prob-n" style={{ paddingTop: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="prob-k">{t}</h3>
                <p className="prob-d" style={{ marginTop: 0, maxWidth: "52ch" }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Benchmarks ── */}
      <Section style={{ borderTop: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="04" label="Measured" color={GREEN} /></Reveal>
        <Reveal delay={0.08}>
          <div className="metric-strip" style={{ ["--cols" as string]: 4, marginTop: "clamp(28px, 4vw, 56px)" }}>
            {BENCH.map(([n, l]) => (
              <div key={l} className="metric-cell"><div className="metric-num">{n}</div><div className="metric-label">{l}</div></div>
            ))}
          </div>
          <p style={{ marginTop: 22, maxWidth: "62ch", fontSize: 13.5, lineHeight: 1.65, color: "var(--text-3)" }}>
            Figures from the project&apos;s own benchmarks: labelled drift scenarios, resume-check size, and a 10,000-file check. It also reports 99.9% agreement with an independent oracle across 800 random git histories. Zero runtime dependencies beyond Python&apos;s standard library and git.
          </p>
        </Reveal>
      </Section>

      {/* ── Features ── */}
      <Section style={{ borderTop: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="05" label="What's inside" color={GREEN} /></Reveal>
        <div style={{ marginTop: "clamp(28px, 4vw, 56px)", borderTop: "1px solid var(--border-strong)" }}>
          {FEATURES.map(([t, d]) => (
            <Reveal key={t}>
              <div className="prob-row" style={{ gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)", gap: "clamp(16px, 3vw, 48px)", alignItems: "baseline" }}>
                <h3 className="prob-k" style={{ fontSize: "clamp(24px, 2.6vw, 40px)" }}>{t}</h3>
                <p className="prob-d" style={{ marginTop: 0, maxWidth: "52ch" }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        headline="Want AI work wired in *safely?"
        body="ContextBridge is free, MIT-licensed and sponsored by Orvantia. If you want AI-assisted work built into your team's process, that's what we do."
        back={{ label: "Visit ContextBridge ↗", href: SITE }}
      />
    </PageShell>
  );
}
