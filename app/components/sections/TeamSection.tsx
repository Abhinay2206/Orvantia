"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ORV_EASE } from "@/lib/motion";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

type Person = { name: string; role: string; initials: string; color: string; founder?: boolean };

const PEOPLE: Person[] = [
  { name: "Bakkera Abhinay", role: "Founder", initials: "BA", color: "#818cf8", founder: true },
  { name: "P Deekshith", role: "Team Member", initials: "PD", color: "#a855f7" },
  { name: "Aisiri MR", role: "Team Member", initials: "AM", color: "#22d3ee" },
  { name: "Mekkonda Aarush", role: "Team Member", initials: "MA", color: "#60a5fa" },
  { name: "Sunkari Manwitha", role: "Team Member", initials: "SM", color: "#fb7185" },
  { name: "J Vigneshwar Reddy", role: "Team Member", initials: "JV", color: "#5fc2ab" },
];

/* Overlapping avatar stack - fans out on hover. */
function AvatarStack() {
  return (
    <div className="team-stack" aria-hidden>
      {PEOPLE.map((p, i) => (
        <span
          key={p.name}
          className="team-stack-dot"
          style={{ "--c": p.color, zIndex: PEOPLE.length - i } as React.CSSProperties}
        >
          {p.initials}
        </span>
      ))}
    </div>
  );
}

function TeamCard({ p, i }: { p: Person; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const q = useRef<Record<string, ReturnType<typeof gsap.quickTo>>>({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { "--mx": "50%", "--my": "0%", transformPerspective: 800 });
    q.current = {
      rx: gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3" }),
      ry: gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3" }),
      mx: gsap.quickTo(el, "--mx", { duration: 0.45, ease: "power3" }),
      my: gsap.quickTo(el, "--my", { duration: 0.45, ease: "power3" }),
    };
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    q.current.ry?.((px - 0.5) * 10);
    q.current.rx?.((0.5 - py) * 10);
    q.current.mx?.(px * 100);
    q.current.my?.(py * 100);
  };

  const onLeave = () => {
    q.current.rx?.(0);
    q.current.ry?.(0);
  };

  return (
    <div className="team-card-wrap">
      <div
        ref={ref}
        className="team-card"
        data-cursor-hover
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ "--c": p.color } as React.CSSProperties}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="team-avatar">
            <span>{p.initials}</span>
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-4)" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: "var(--font)", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.3 }}>
            {p.name}
          </div>
          <div
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--mono)",
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: p.founder ? p.color : "var(--text-3)",
            }}
          >
            {p.founder && <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />}
            {p.role}
          </div>
        </div>

        <span className="team-line" aria-hidden />
      </div>
    </div>
  );
}

export default function TeamSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  /* Cards flip up into place, one after another. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".team-card-wrap", grid);
      gsap.set(cards, { opacity: 0, rotateX: -35, y: 40, transformOrigin: "center top" });
      const batch = ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, rotateX: 0, y: 0, duration: 1.1, ease: ORV_EASE, stagger: 0.08 }),
      });
      return () => batch.forEach((t) => t.kill());
    });
    return () => mm.revert();
  }, []);

  return (
    <Section
      id="team"
      style={{ position: "relative", zIndex: 10 }}
      glow="radial-gradient(ellipse 50% 40% at 20% 15%, rgba(99,102,241,0.06), transparent 60%)"
    >
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28, marginBottom: "clamp(36px, 4.4vw, 56px)" }}>
        <div style={{ maxWidth: 640 }}>
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

        <Reveal delay={0.2}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <AvatarStack />
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", lineHeight: 1.7 }}>
              {PEOPLE.length} people
              <br />
              <span style={{ color: "var(--text-2)" }}>Hyderabad, India</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        ref={gridRef}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 12, perspective: 1200 }}
      >
        {PEOPLE.map((p, i) => (
          <TeamCard key={p.name} p={p} i={i} />
        ))}
      </div>
    </Section>
  );
}
