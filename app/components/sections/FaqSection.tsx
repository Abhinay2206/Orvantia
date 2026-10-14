"use client";

import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";
import { FAQ } from "@/lib/faq";

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

export default function FaqSection() {
  return (
    <Section id="faq" style={{ position: "relative", zIndex: 10 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      <div className="faq-grid">
        <div>
          <Reveal><Eyebrow num="07" label="Questions" color="rgba(129,140,248,0.85)" /></Reveal>
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
