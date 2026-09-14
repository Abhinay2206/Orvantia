"use client";

import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

const FOUNDER = { name: "Bakkera Abhinay", role: "Founder", initials: "BA", color: "#6366f1" };

const TEAM = [
  { name: "P Deekshith", role: "Team Member", initials: "PD", color: "#a855f7" },
  { name: "Aisiri MR", role: "Team Member", initials: "AM", color: "#22d3ee" },
  { name: "Mekkonda Aarush", role: "Team Member", initials: "MA", color: "#3b82f6" },
  { name: "Sunkari Manwitha", role: "Team Member", initials: "SM", color: "#ff0000" },
  { name: "J Vigneshwar Reddy", role: "Team Member", initials: "JV", color: "#818cf8" },
];

function Avatar({ text, color, size = 44 }: { text: string; color: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}40`,
        color: color,
        fontFamily: "var(--font)",
        fontWeight: 600,
        fontSize: Math.round(size * 0.36),
        letterSpacing: "0.01em",
      }}
    >
      {text}
    </div>
  );
}

function PersonRow({ name, role, initials, color, emphasize }: { name: string; role: string; initials: string; color: string; emphasize?: boolean }) {
  return (
    <div
      data-cursor-hover
      className="glass-card"
      style={{
        borderRadius: "var(--radius)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "border-color 0.25s, background 0.25s",
      }}
    >
      <Avatar text={initials} color={color} size={emphasize ? 48 : 40} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font)", fontSize: emphasize ? 17 : 15, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.3 }}>
          {name}
        </div>
        <div style={{ marginTop: 2, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: emphasize ? color : "var(--text-3)" }}>
          {role}
        </div>
      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <Section
      id="team"
      style={{ position: "relative", zIndex: 10 }}
      glow="radial-gradient(ellipse 50% 40% at 20% 15%, rgba(99,102,241,0.06), transparent 60%)"
    >
      {/* Header */}
      <div style={{ maxWidth: 760, marginBottom: "clamp(36px, 4.4vw, 56px)" }}>
        <Reveal>
          <Eyebrow num="07" label="Team" color="rgba(129,140,248,0.85)" />
        </Reveal>
        <SplitHeadline text="The people *behind it." style={{ marginTop: 20, fontSize: "clamp(26px, 3.6vw, 46px)" }} />
        <Reveal delay={0.15}>
          <p style={{ marginTop: 16, maxWidth: "48ch", fontSize: 15, lineHeight: 1.65, color: "var(--text-2)" }}>
            A small, hands-on team that designs, builds, and ships every product end to end.
          </p>
        </Reveal>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 12 }}>
        <Reveal>
          <PersonRow {...FOUNDER} emphasize />
        </Reveal>
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={0.05 + i * 0.04}>
            <PersonRow {...m} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
