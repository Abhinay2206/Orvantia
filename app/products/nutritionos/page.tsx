"use client";

import PageShell from "../../components/ui/PageShell";
import CtaBand from "../../components/ui/CtaBand";
import { Section, Eyebrow, SplitHeadline, Reveal } from "../../components/sections/_shared";

const URL = "https://nutritionos.orvantia.in/";
const TEAL = "#5fc2ab";

function Phone({ src, alt, tilt = 0, glow = false }: { src: string; alt: string; tilt?: number; glow?: boolean }) {
  return (
    <div style={{ aspectRatio: "780 / 1688", borderRadius: "clamp(16px, 2vw, 28px)", padding: "clamp(3px, 0.45vw, 6px)", background: "linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))", boxShadow: glow ? "0 50px 120px rgba(0,0,0,0.6), 0 0 60px rgba(95,194,171,0.18), 0 0 0 1px rgba(255,255,255,0.08)" : "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)", transform: `rotate(${tilt}deg)` }}>
      <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "clamp(13px, 1.7vw, 23px)" }} />
    </div>
  );
}

const SPOTLIGHTS = [
  ["Food made for Indian kitchens", "750+ Telangana, Indian and global foods with English and Telugu names, in the portions you actually eat - cups, bowls, rotis, pieces. Search runs on your phone, so results appear as you type, even offline.", "/nutritionos/food-search.png"],
  ["Snap your plate", "Photograph a meal and AI suggests the foods and portion sizes. You review and edit every item - nothing is logged until you confirm. Opt-in and in beta.", "/nutritionos/ai-capture.png"],
  ["Training that progresses", "Set-by-set logging with a rest timer, your numbers from last time, progressive-overload suggestions and personal records - plus templates, weekly programs and a plate calculator.", "/nutritionos/workout-log.png"],
  ["See every muscle you trained", "A front-and-back muscle map shades each muscle group by weekly sets, so imbalances show up before they become injuries.", "/nutritionos/muscle-balance.png"],
  ["Progress you can prove", "Weight trend, calories, protein, training volume, steps, sleep and mood from 7 days to a year - and a PDF report to share with a coach.", "/nutritionos/progress-weight.png"],
  ["Habits that stick", "Streaks, badges and weekly goals, a fasting timer (16:8, 18:6, OMAD or custom), and sleep, mood and energy logging.", "/nutritionos/fasting.png"],
];

const MORE = [
  ["Barcode scanner", "Scan packaged food; values are checked before they're saved."],
  ["Meals & recipes", "One tap adds a whole meal; recipes get per-serving nutrition."],
  ["Coach sharing", "Private read-only links with an expiry you control."],
  ["Installable app", "Add it to your home screen; logging works offline and syncs later."],
  ["Your data, yours", "Export everything as JSON or CSV, or delete it all in one step."],
  ["Light & dark", "Follows your system theme, with reminders when you want them."],
];

const STATS = [["750+", "Foods, English & Telugu"], ["180+", "Exercises"], ["390+", "Automated tests"], ["₹0", "Free to use"]];
const STACK = ["Next.js 16", "React 19", "TypeScript", "MongoDB", "Auth.js", "Zod", "Vitest", "PWA"];

export default function NutritionOSPage() {
  return (
    <PageShell>
      {/* ── Hero ── */}
      <Section glow="radial-gradient(ellipse 60% 60% at 80% 40%, rgba(95,194,171,0.12), transparent 62%)">
        <Reveal>
          <a href="/#products" data-cursor-hover style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-3)", textDecoration: "none" }}>← Back to Orvantia</a>
        </Reveal>
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: "clamp(40px, 6vw, 88px)", alignItems: "center" }}>
          <div>
            <Reveal><Eyebrow num="01" label="Product · Live & free" color="rgba(95,194,171,0.85)" /></Reveal>
            <Reveal delay={0.08}>
              <h1 style={{ marginTop: 22, fontSize: "clamp(48px, 8vw, 112px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.92, color: TEAL }}>NutritionOS</h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ marginTop: 22, fontSize: "clamp(18px, 1.9vw, 25px)", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.45, maxWidth: "30ch" }}>
                A fast, private nutrition and training tracker - built for one thumb on a phone, with a food database made for Indian cooking.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <a href={URL} target="_blank" rel="noopener noreferrer" data-cursor-hover className="btn-primary" style={{ background: `linear-gradient(135deg, ${TEAL}, #3fa58e)`, color: "#04120e" }}>Open NutritionOS ↗</a>
                <span className="status-pill" style={{ display: "inline-flex" }}><span className="status-dot" />Live · installable web app</span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.18fr 1fr", gap: "clamp(8px, 1.4vw, 20px)", alignItems: "center", maxWidth: 560, margin: "0 auto" }}>
              <Phone src="/nutritionos/food-search.png" alt="Food search" tilt={-4} />
              <Phone src="/nutritionos/home.png" alt="NutritionOS home: calorie ring and macros" glow />
              <Phone src="/nutritionos/workout-log.png" alt="Workout logger" tilt={4} />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Why ── */}
      <Section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="02" label="Why we built it" color="rgba(95,194,171,0.85)" /></Reveal>
        <SplitHeadline text="We built it because *nothing good existed." style={{ marginTop: 22, fontSize: "clamp(28px, 4.4vw, 58px)", maxWidth: "20ch" }} />
        <Reveal delay={0.12}>
          <p style={{ marginTop: 24, fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: 1.7, color: "var(--text-2)", maxWidth: "60ch" }}>
            Our team goes to the gym, and every nutrition app we tried was paywalled, cluttered, or clueless about the food we actually eat. So we built our own - fast, clean, free, and made for Indian meals. It&apos;s the same way we work for clients: find the real problem, then build the fix people actually use.
          </p>
        </Reveal>
      </Section>

      {/* ── Feature spotlights ── */}
      <Section>
        <Reveal><Eyebrow num="03" label="What it does" color="rgba(95,194,171,0.85)" /></Reveal>
        <div style={{ marginTop: "clamp(32px, 4vw, 56px)", display: "grid", gap: "clamp(56px, 8vw, 110px)" }}>
          {SPOTLIGHTS.map(([title, desc, src], i) => (
            <div key={title} className="nos-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: "clamp(32px, 6vw, 96px)", alignItems: "center" }}>
              <Reveal style={{ order: i % 2 ? 2 : 0 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: TEAL }}>{String(i + 1).padStart(2, "0")}</div>
                <h2 style={{ marginTop: 14, fontSize: "clamp(26px, 3.4vw, 44px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.05, maxWidth: "16ch" }}>{title}</h2>
                <p style={{ marginTop: 16, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.7, color: "var(--text-2)", maxWidth: "46ch" }}>{desc}</p>
              </Reveal>
              <Reveal delay={0.1} style={{ order: 1 }}>
                <div style={{ maxWidth: 260, margin: "0 auto" }}><Phone src={src} alt={title} tilt={i % 2 ? -3 : 3} glow /></div>
              </Reveal>
            </div>
          ))}
        </div>
      </Section>

      {/* ── More + built properly ── */}
      <Section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <Reveal><Eyebrow num="04" label="Also inside" color="rgba(95,194,171,0.85)" /></Reveal>
        <div style={{ marginTop: "clamp(28px, 3.6vw, 44px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 14 }}>
          {MORE.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.05} style={{ height: "100%" }}>
              <div className="glass-card" style={{ height: "100%", borderRadius: "var(--radius-lg)", padding: "22px 22px 24px" }}>
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>{t}</div>
                <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-2)" }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ marginTop: "clamp(48px, 6vw, 80px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: 24 }}>
          {STATS.map(([v, l]) => (
            <Reveal key={l}>
              <div style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, letterSpacing: "-0.045em", color: TEAL, lineHeight: 1 }}>{v}</div>
              <div style={{ marginTop: 10, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)" }}>{l}</div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div style={{ marginTop: "clamp(36px, 4vw, 56px)", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginRight: 6 }}>Built with</span>
            {STACK.map((s) => <span key={s} style={{ padding: "7px 14px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-2)" }}>{s}</span>)}
          </div>
        </Reveal>
      </Section>

      <CtaBand
        headline="Want an app built *this carefully?"
        body="NutritionOS is how we build when we're our own client. We bring the same care to software for your business."
        back={{ label: "Open NutritionOS ↗", href: URL }}
      />
    </PageShell>
  );
}
