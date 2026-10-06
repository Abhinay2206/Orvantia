"use client";

import { useModal } from "../providers/ModalProvider";
import { Section, SplitHeadline, Reveal } from "../sections/_shared";

/* Closing call to action for detail pages. */
export default function CtaBand({ headline, body, back = { label: "← Back to Orvantia", href: "/" } }: { headline: string; body: string; back?: { label: string; href: string } }) {
  const { openModal } = useModal();
  return (
    <Section style={{ textAlign: "center", borderTop: "1px solid var(--border)" }} glow="radial-gradient(ellipse 60% 70% at 50% 100%, rgba(99,102,241,0.14), transparent 65%)">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SplitHeadline text={headline} style={{ fontSize: "clamp(32px, 5.4vw, 76px)", textAlign: "center", maxWidth: "16ch" }} />
        <Reveal delay={0.15}>
          <p style={{ marginTop: 22, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "48ch" }}>{body}</p>
        </Reveal>
        <Reveal delay={0.25}>
          <div style={{ marginTop: 34, display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" className="btn-primary" data-cursor-hover onClick={() => openModal("schedule")}>Start your project</button>
            <a href={back.href} className="btn-secondary" data-cursor-hover style={{ textDecoration: "none" }}>{back.label}</a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
