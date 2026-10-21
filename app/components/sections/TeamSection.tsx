"use client";

import { Section, Eyebrow, SplitHeadline, Reveal, Drift } from "./_shared";

// Only the founder carries a label; repeating "Team member" on every row was noise.
const PEOPLE: { name: string; founder?: boolean }[] = [
  { name: "Bakkera Abhinay", founder: true },
  { name: "P Deekshith" },
  { name: "Aisiri MR" },
  { name: "Mekkonda Aarush" },
  { name: "Sunkari Manwitha" },
  { name: "J Vigneshwar Reddy" },
  { name: "Jeevan Kumar" },
];

export default function TeamSection() {
  return (
    <Section id="team" style={{ position: "relative", zIndex: 10 }}>
      <Reveal><Eyebrow num="06" label="Team" /></Reveal>
      <div className="team-top">
        <Drift amount={10}><SplitHeadline text="The people *behind it." style={{ fontSize: "clamp(34px, 5vw, 78px)", maxWidth: "12ch" }} /></Drift>
        <Reveal delay={0.12}>
          <p style={{ maxWidth: "34ch", fontSize: "clamp(14px, 1.25vw, 16px)", lineHeight: 1.7, color: "var(--text-2)" }}>
            A small, hands-on team in Hyderabad that designs, builds, and ships every product end to end.
          </p>
        </Reveal>
      </div>
      <ul className="team-list">
        {PEOPLE.map((p, i) => (
          <li key={p.name}>
            <Reveal>
              <div className="team-row" data-cursor-hover>
                <span className="team-i">{String(i + 1).padStart(2, "0")}</span>
                <span className="team-name">{p.name}</span>
                {p.founder && <span className="team-badge"><i aria-hidden />Studio Lead</span>}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
