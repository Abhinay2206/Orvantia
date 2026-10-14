"use client";

import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

const PEOPLE = [
  { name: "Bakkera Abhinay", role: "Founder" },
  { name: "P Deekshith", role: "Team member" },
  { name: "Aisiri MR", role: "Team member" },
  { name: "Mekkonda Aarush", role: "Team member" },
  { name: "Sunkari Manwitha", role: "Team member" },
  { name: "J Vigneshwar Reddy", role: "Team member" },
  { name: "Jeevan Kumar", role: "Team member" },
];

export default function TeamSection() {
  return (
    <Section id="team" style={{ position: "relative", zIndex: 10 }}>
      <Reveal><Eyebrow num="06" label="Team" /></Reveal>
      <div className="team-top">
        <SplitHeadline text="The people *behind it." style={{ fontSize: "clamp(34px, 5vw, 78px)", maxWidth: "12ch" }} />
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
                <span className="team-role">{p.role}</span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
