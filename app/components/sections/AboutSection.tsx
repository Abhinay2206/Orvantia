"use client";

import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

/* The everyday problems growing businesses bring to us - and what we do about them. */
const PILLARS = [
  { k: "Work lives in diaries and WhatsApp", d: "We move it into one system your whole team can see, update, and act on." },
  { k: "Follow-ups depend on someone remembering", d: "Reminders, escalations, and updates go out automatically - nothing slips." },
  { k: "Reports take hours to put together", d: "Live dashboards show sales, tasks, and performance the moment you log in." },
  { k: "Off-the-shelf tools don't fit", d: "We build around how your business already runs, not the other way round." },
  { k: "Big-agency software feels out of reach", d: "Right-sized for growing businesses - practical scope, no enterprise bloat." },
  { k: "Nobody to call after launch", d: "We train your team and stay on for fixes, updates, and improvements." },
];

export default function AboutSection() {
  return (
    <Section id="about" style={{ position: "relative", zIndex: 10 }}>
      <div className="split">
        <div className="split-sticky">
          <Reveal><Eyebrow num="01" label="What we fix" /></Reveal>
          <SplitHeadline text="Software that makes everyday business *simpler." style={{ marginTop: 30, fontSize: "clamp(32px, 3.9vw, 58px)" }} />
          <Reveal delay={0.12}>
            <p style={{ marginTop: 24, maxWidth: "36ch", fontSize: "clamp(15px, 1.3vw, 17px)", lineHeight: 1.7, color: "var(--text-2)" }}>
              We work with growing businesses that still run on paper, spreadsheets, and chat - and replace the manual work with systems that just run.
            </p>
          </Reveal>
        </div>

        <div>
          {PILLARS.map((p, i) => (
            <Reveal key={p.k}>
              <div className="prob-row">
                <span className="prob-n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="prob-k">{p.k}</h3>
                  <p className="prob-d">{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
