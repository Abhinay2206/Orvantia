"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ORV_EASE } from "@/lib/motion";

interface AnimatedCounterProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

/**
 * Counts up to `to` once the element scrolls into view. Same public
 * interface as before, now driven by GSAP (one motion engine, one house
 * ease) instead of a hand-rolled requestAnimationFrame + cubic formula.
 */
export default function AnimatedCounter({
  to,
  duration = 1800,
  suffix = "",
  prefix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const render = (v: number) => {
      el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
    };
    render(0);

    const proxy = { val: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          val: to,
          duration: duration / 1000,
          ease: ORV_EASE,
          onUpdate: () => render(proxy.val),
        });
      },
    });

    return () => st.kill();
  }, [to, duration, suffix, prefix, decimals]);

  return <span ref={ref} />;
}
