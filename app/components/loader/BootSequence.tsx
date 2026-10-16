"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORD = "Orvantia";
const EASE = [0.16, 1, 0.3, 1] as const;

/*
 * Intro: the wordmark rises letter by letter out of its masks while a counter
 * runs to 100, then the whole panel lifts away like a curtain. onComplete fires
 * as the curtain starts to lift, so the hero's entrance plays during the reveal
 * instead of after it. The small mark sits exactly where the nav logo lands.
 */
export default function BootSequence({ onComplete, skip }: { onComplete: () => void; skip?: boolean }) {
  const [exiting, setExiting] = useState(false);
  const [count, setCount] = useState(0);
  const done = useRef(false);

  const finish = useRef(() => {});
  finish.current = () => {
    if (done.current) return;
    done.current = true;
    setExiting(true);
    onComplete();
  };

  // Arriving with a target section (e.g. "/#contact"): skip straight past the intro.
  useEffect(() => {
    if (skip) finish.current();
  }, [skip]);

  useEffect(() => {
    if (skip) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduced ? 500 : 1500;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / total);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = setTimeout(() => finish.current(), total + (reduced ? 100 : 320));
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [skip]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="boot"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="boot-head px-6 md:px-10">
            <motion.img src="/logo.png" alt="" width={24} height={24} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
          </div>

          <div className="boot-center">
            <div className="boot-word serif-display">
              {WORD.split("").map((ch, i) => (
                <span key={i} className="boot-mask">
                  <motion.span
                    style={{ display: "inline-block" }}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ delay: 0.12 + i * 0.045, duration: 1.1, ease: EASE }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </div>
            <motion.div className="boot-tag" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: EASE }}>
              Software &amp; automation studio
            </motion.div>
          </div>

          <div className="boot-foot px-6 md:px-10">
            <span>Hyderabad, India</span>
            <span className="boot-count">{String(count).padStart(3, "0")}</span>
          </div>
          <div className="boot-bar" style={{ transform: `scaleX(${count / 100})` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
