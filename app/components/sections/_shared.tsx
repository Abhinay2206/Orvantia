"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";

/* ─── Shared easing ──────────────────────────────────────── */
export const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Reveal — fade + rise on scroll into view ───────────── */
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
      initial={{ opacity: 0, y, rotateX: 10, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.95, ease: EASE, delay }}
      style={{ transformPerspective: 1200, transformOrigin: "center bottom", ...style }}
    >
      {children}
    </MotionTag>
  );
}

/* ─── Stagger container + item ───────────────────────────── */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

/* ─── Section eyebrow — number · rule · label ────────────── */
export function Eyebrow({
  num,
  label,
  color = "rgba(99,102,241,0.7)",
}: {
  num: string;
  label: string;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color }}>{num}</span>
      <div style={{ width: 32, height: 1, background: color, opacity: 0.5 }} />
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(241,245,249,0.4)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Split headline — word-by-word mask rise ────────────── */
export function SplitHeadline({
  text,
  className,
  style,
  gradientClass = "g-text",
  wordDelay = 0.05,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  gradientClass?: string;
  wordDelay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const words = text.split(" ");

  return (
    <h2
      ref={ref}
      className={className}
      style={{
        fontFamily: "var(--font)",
        fontWeight: 700,
        letterSpacing: "-0.035em",
        lineHeight: 1.02,
        ...style,
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em" }}
        >
          <motion.span
            className={w.startsWith("*") ? gradientClass : undefined}
            style={{ display: "inline-block", transformOrigin: "left bottom" }}
            initial={{ y: "115%", rotate: 4, filter: "blur(4px)" }}
            animate={inView ? { y: "0%", rotate: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.95, ease: EASE, delay: i * wordDelay }}
          >
            {w.replace("*", "")}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ─── Section wrapper — consistent padding + ambient glow ── */
export function Section({
  id,
  children,
  glow,
  style,
  className,
}: {
  id?: string;
  children: ReactNode;
  glow?: string;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={className}
      style={{
        position: "relative",
        padding: "clamp(88px, 13vh, 168px) clamp(24px, 5vw, 80px)",
        overflow: "hidden",
        ...style,
      }}
    >
      {glow && (
        <div
          className="pointer-events-none"
          style={{ position: "absolute", inset: 0, background: glow, zIndex: 0 }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1440, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}
