"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState, Fragment, type ReactNode, type CSSProperties } from "react";
import { gsap, ScrollTrigger, SplitText, EASE, ORV_EASE } from "@/lib/motion";

/* Shared easing - one house curve, GSAP + Framer Motion alike. */
export { EASE };

/* Reveal - fade + rise on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  once = true,
  className,
  style,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "span" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px" });
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, ease: EASE, delay }}
      style={{ transformPerspective: 1200, transformOrigin: "center bottom", ...style }}
    >
      {children}
    </MotionTag>
  );
}

/* Stagger container + item. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

/* Section running head - a chapter card. The number and label type themselves
   on (mono, with a caret) as the section arrives, then the hairline draws out to
   the edge of the column. It echoes the keyboard that opens the page. */
export function Eyebrow({
  num,
  label,
  color = "rgba(196,181,253,0.9)",
}: {
  num: string;
  label: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const total = num.length + label.length;
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(total); return; }
    let i = 0;
    const id = setInterval(() => { i += 1; setN(i); if (i >= total) clearInterval(id); }, 38);
    return () => clearInterval(id);
  }, [inView, total]);
  const done = n >= total;
  const typedNum = num.slice(0, Math.min(n, num.length));
  const typedLabel = label.slice(0, Math.max(0, n - num.length));
  return (
    <div ref={ref} className={`eyebrow${done ? " is-typed" : ""}`} style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
      <span className="ty" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", color }}>
        <span className="ty-ghost">{num}</span>
        <span className="ty-live" aria-hidden>{typedNum}</span>
      </span>
      <span
        className="ty"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(241,245,249,0.55)",
          whiteSpace: "nowrap",
        }}
      >
        <span className="ty-ghost">{label}</span>
        <span className="ty-live" aria-hidden>{typedLabel}{inView && <i className={`ty-caret${done ? " is-done" : ""}`} />}</span>
      </span>
      <span className="eyebrow-rule" />
    </div>
  );
}

/* Aperture - media opens from a framed, slightly zoomed crop to full frame as it
   scrolls in, like a lens iris. Scrubbed, so it reverses on the way back up. */
export function Aperture({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const st = { trigger: el, start: "top 92%", end: "top 40%", scrub: 0.8 };
      gsap.fromTo(el, { clipPath: "inset(12% 9% 12% 9% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 6px)", ease: "none", scrollTrigger: st });
      const inner = el.firstElementChild;
      if (inner) gsap.fromTo(inner, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { ...st } });
    });
    return () => mm.revert();
  }, []);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}

/* Drift - a big title moves a touch slower than the page, so the scroll has depth. */
export function Drift({ children, amount = 14, className, style }: { children: ReactNode; amount?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(el, { yPercent: amount }, { yPercent: -amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  }, [amount]);
  return <div ref={ref} className={className} style={{ willChange: "transform", ...style }}>{children}</div>;
}

/**
 * Split headline - cinematic char-by-char cascade.
 *
 * Gradient words ("*word") stay whole-unit so their background-clip text
 * gradient never breaks across per-char spans; every other word splits
 * into real SplitText characters and cascades in on scroll.
 */
export function SplitHeadline({
  text,
  className,
  style,
  gradientClass = "accent-serif",
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  gradientClass?: string;
  /** @deprecated no longer used - the reveal timing is now GSAP-driven. */
  wordDelay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const outerWordSpans = Array.from(el.children) as HTMLElement[];
    const splits: SplitText[] = [];
    const targets: Element[] = [];

    outerWordSpans.forEach((outer) => {
      const gradEl = outer.querySelector<HTMLElement>("[data-split-grad]");
      if (gradEl) {
        targets.push(gradEl);
        return;
      }
      const plainEl = outer.querySelector<HTMLElement>("[data-split-word]");
      if (plainEl) {
        const split = new SplitText(plainEl, { type: "chars" });
        splits.push(split);
        targets.push(...split.chars);
      }
    });

    gsap.set(targets, { yPercent: 120 });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(targets, { yPercent: 0, duration: 1.05, ease: ORV_EASE, stagger: 0.022 });
      },
    });

    return () => {
      st.kill();
      splits.forEach((s) => s.revert());
    };
  }, [text]);

  return (
    <h2
      ref={ref}
      className={`serif-display ${className ?? ""}`}
      style={{
        fontFamily: "var(--serif)",
        fontWeight: 400,
        letterSpacing: "-0.025em",
        lineHeight: 0.98,
        ...style,
        // Instrument Serif sets smaller than a grotesk at the same size.
        fontSize: style?.fontSize ? `calc(${style.fontSize} * 1.3)` : undefined,
      }}
    >
      {words.map((w, i) => {
        const isGrad = w.startsWith("*");
        const clean = w.replace("*", "");
        return (
          <Fragment key={i}>
            <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em" }}>
              <span
                data-split-word={isGrad ? undefined : true}
                data-split-grad={isGrad ? true : undefined}
                className={isGrad ? gradientClass : undefined}
                style={{ display: "inline-block" }}
              >
                {clean}
              </span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        );
      })}
    </h2>
  );
}

/* Section wrapper - consistent padding. */
import { forwardRef } from "react";

export const Section = forwardRef<
  HTMLElement,
  {
    id?: string;
    children: ReactNode;
    /** @deprecated ambient glows were removed in the v2 design system; ignored. */
    glow?: string;
    style?: CSSProperties;
    className?: string;
  }
>(function Section({ id, children, style, className }, ref) {
  return (
    <section
      id={id}
      ref={ref}
      className={className}
      style={{
        position: "relative",
        padding: "clamp(72px, calc(7vw + 46px), 168px) clamp(24px, 5vw, 80px)",
        overflow: "clip",
        ...style,
      }}
    >
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1440, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
});
