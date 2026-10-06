"use client";

import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

// Answers the questions small-business owners ask before they reach out.
const FAQ = [
  ["We're a small business. Is this for us?", "Yes - that's who we build for. If your team still runs on diaries, spreadsheets or WhatsApp groups, we replace the manual work with software sized to your business, not an enterprise suite."],
  ["How much does a project cost?", "It depends on scope - from small automations to full platforms. You get a clear scope, timeline and fixed price before any code is written, so there are no surprises."],
  ["How long does it take?", "Small automations take weeks; larger systems usually take one to a few months. We build in small, visible steps, so you see working software early - not just at the end."],
  ["Do we own the software and our data?", "Yes. At handover you get the credentials and your data, and we document how it's stored and protected."],
  ["What happens after launch?", "We set it up, train your team, and stay on for fixes, updates and improvements as your business grows."],
  ["Will it work on our phones?", "Everything we build works on phones as well as desktops - most of your team will use it on the go."],
];

export default function FaqSection() {
  return (
    <Section id="faq" style={{ position: "relative", zIndex: 10 }}>
      <div className="faq-grid">
        <div>
          <Reveal><Eyebrow num="08" label="Questions" color="rgba(129,140,248,0.85)" /></Reveal>
          <SplitHeadline text="Before you *ask." style={{ marginTop: 22, fontSize: "clamp(30px, 4.6vw, 62px)" }} />
          <Reveal delay={0.12}>
            <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.65, color: "var(--text-2)", maxWidth: "34ch" }}>
              Still unsure? Ask us directly - we reply within one to two business days.
            </p>
          </Reveal>
        </div>
        <div>
          {FAQ.map(([q, a], i) => (
            <Reveal key={q} delay={i * 0.04}>
              <details className="faq-item" open={i === 0}>
                <summary data-cursor-hover>{q}<span aria-hidden>+</span></summary>
                <p>{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
