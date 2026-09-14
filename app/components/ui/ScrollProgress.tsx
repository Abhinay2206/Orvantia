"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "case-study", label: "Case Study" },
  { id: "next-project", label: "Next" },
  { id: "process", label: "Process" },
  { id: "team", label: "Team" },
  { id: "contact", label: "Contact" },
];

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    let raf = 0;
    const update = () => {
      // Always at the top of the page → Home, no ambiguity from thin hit-band edge cases.
      if (window.scrollY < window.innerHeight * 0.5) {
        setActive("hero");
        return;
      }
      const line = window.innerHeight * 0.5;
      let current = els[0]?.id ?? "hero";
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0"
        style={{
          height: 2,
          zIndex: 200,
          transformOrigin: "left",
          scaleX,
          background: "linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)",
          boxShadow: "0 0 12px rgba(99,102,241,0.6)",
        }}
      />

      <div
        className="hidden lg:flex fixed flex-col items-end gap-3.5 group/nav"
        style={{ right: 26, top: "50%", transform: "translateY(-50%)", zIndex: 90 }}
      >
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              data-cursor-hover
              className="group flex items-center gap-2.5 justify-end"
              style={{ background: "transparent", border: "none", cursor: "none" }}
            >
              <span
                className={`transition-all duration-300 origin-right ${on ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-1.5 scale-95"} group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-110 group-hover/nav:opacity-75 group-hover/nav:translate-x-0 group-hover/nav:scale-100`}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: on ? "var(--text)" : "var(--text-3)",
                }}
              >
                {s.label}
              </span>
              <span
                className={`transition-all duration-300 ${on ? "w-[22px] bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "w-[14px] bg-white/20"} group-hover:w-[28px] group-hover:bg-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.6)]`}
                style={{
                  height: 2,
                  borderRadius: 2,
                  background: on ? "linear-gradient(90deg,#6366f1,#a855f7)" : undefined,
                }}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
