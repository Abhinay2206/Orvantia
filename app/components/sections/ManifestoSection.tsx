"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

/*
 * Scroll-lit manifesto. Words light up one by one as the statement scrolls
 * through, then a hairline strikes through the manual tools ("~word") and they
 * fall back, while the promise ("*word", serif accent) stays lit.
 */
const STATEMENT =
  "Most growing businesses still run on a ~diary, a ~spreadsheet and a ~WhatsApp ~group. We turn that everyday chaos into *software *that *runs *itself - so your team can get back to the work that matters.";

export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const tokens = STATEMENT.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const text = el.querySelector(".mf-text");
      const words = gsap.utils.toArray<HTMLElement>(".mf-w", el);
      const last = words.findIndex((w) => w.textContent === "group"); // the strikes start once the last tool is lit
      const tl = gsap.timeline({ scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 52%", scrub: 0.6 } });
      tl.fromTo(words, { opacity: 0.12 }, { opacity: 1, ease: "none", stagger: 0.1, duration: 0.5 }, 0)
        .to(gsap.utils.toArray<HTMLElement>(".mf-line", el), { scaleX: 1, ease: "power2.inOut", stagger: 0.22, duration: 0.5 }, last * 0.1 + 0.6)
        .to(gsap.utils.toArray<HTMLElement>(".mf-strike", el), { color: "rgba(241,245,249,0.3)", ease: "none", stagger: 0.22, duration: 0.5 }, "<");
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(gsap.utils.toArray<HTMLElement>(".mf-line", el), { scaleX: 1 });
      gsap.set(gsap.utils.toArray<HTMLElement>(".mf-strike", el), { color: "rgba(241,245,249,0.3)" });
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
          className="mf-text serif-display"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(34px, 5.6vw, 92px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.06,
            color: "var(--text)",
          }}
        >
          {tokens.map((tok, i) => {
            const space = i < tokens.length - 1 ? " " : "";
            const word = tok.replace(/^[*~]/, "");
            if (tok.startsWith("~")) {
              const [, body, punct] = word.match(/^(.*?)([,.]?)$/)!; // the strike stops before punctuation
              return (
                <span key={i}>
                  <span className="mf-strike"><span className="mf-w">{body}</span><i className="mf-line" aria-hidden /></span>
                  {punct && <span className="mf-w">{punct}</span>}
                  {space}
                </span>
              );
            }
            return (
              <span key={i}>
                <span className={tok.startsWith("*") ? "mf-w accent-serif" : "mf-w"}>{word}</span>
                {space}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
