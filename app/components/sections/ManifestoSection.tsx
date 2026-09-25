"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/motion";

/*
 * Scroll-lit manifesto. Words start dim and light up one by one as the
 * statement scrolls through the viewport. "[icon]" tokens become small inline
 * pills; "*word" tokens are set in the serif accent.
 */
const STATEMENT =
  "Most growing businesses still run on a [diary] diary, a [sheet] spreadsheet and a [chat] WhatsApp group. We turn that everyday chaos into *software *that *runs *itself [bolt] - so your team can get back to the work that matters.";

const PILLS: Record<string, { color: string; icon: ReactNode }> = {
  diary: {
    color: "#fbbf24",
    icon: (
      <path d="M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 0v18M11 8h4M11 12h4" />
    ),
  },
  sheet: {
    color: "#4ade80",
    icon: <path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16" />,
  },
  chat: {
    color: "#22c55e",
    icon: <path d="M4 19l1.4-4A7.5 7.5 0 1 1 9 18.6L4 19Z" />,
  },
  bolt: {
    color: "#a5b4fc",
    icon: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  },
};

function Pill({ kind }: { kind: string }) {
  const p = PILLS[kind];
  if (!p) return null;
  return (
    <span
      className="mf-w mf-pill"
      aria-hidden
      style={{ "--pill": p.color } as React.CSSProperties}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {p.icon}
      </svg>
    </span>
  );
}

export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const tokens = STATEMENT.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = gsap.utils.toArray<HTMLElement>(".mf-w", el);
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: el.querySelector(".mf-text"), start: "top 78%", end: "bottom 42%", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>(".mf-pill", el),
        { scale: 0.4, rotate: -12 },
        {
          scale: 1,
          rotate: 0,
          ease: "back.out(2)",
          stagger: 0.3,
          scrollTrigger: { trigger: el.querySelector(".mf-text"), start: "top 75%", end: "bottom 50%", scrub: 0.6 },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="why"
      aria-label="Why Orvantia"
      style={{ position: "relative", zIndex: 10, padding: "clamp(96px, 16vh, 200px) clamp(24px, 5vw, 80px)" }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10.5,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "var(--text-3)",
            marginBottom: "clamp(28px, 4vw, 48px)",
          }}
        >
          ( Why we exist )
        </div>

        <p
          className="mf-text"
          style={{
            fontFamily: "var(--font)",
            fontSize: "clamp(28px, 4.3vw, 66px)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1.16,
            color: "var(--text)",
          }}
        >
          {tokens.map((tok, i) => {
            const pill = tok.match(/^\[(\w+)\]$/);
            const space = i < tokens.length - 1 ? " " : "";
            if (pill) {
              return (
                <span key={i}>
                  <Pill kind={pill[1]} />
                  {space}
                </span>
              );
            }
            const accent = tok.startsWith("*");
            return (
              <span key={i}>
                <span className={accent ? "mf-w accent-serif" : "mf-w"}>{tok.replace("*", "")}</span>
                {space}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
