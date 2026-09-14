"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORD = "ORVANTIA";

/* ─── Concentric ring component ──────────────────────────── */
function ConcentricRings() {
  const rings = [
    { radius: 60, delay: 0, opacity: 0.25, dash: "4 8" },
    { radius: 90, delay: 0.1, opacity: 0.18, dash: "2 12" },
    { radius: 120, delay: 0.2, opacity: 0.12, dash: "6 16" },
    { radius: 155, delay: 0.3, opacity: 0.08, dash: "3 20" },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: ring.opacity }}
          transition={{ delay: ring.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "absolute", width: ring.radius * 2, height: ring.radius * 2 }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${ring.radius * 2} ${ring.radius * 2}`} className="animate-spin-slow" style={{ animationDuration: `${18 + i * 6}s` }}>
            <circle
              cx={ring.radius}
              cy={ring.radius}
              r={ring.radius - 2}
              fill="none"
              stroke="rgba(129,140,248,0.6)"
              strokeWidth="1"
              strokeDasharray={ring.dash}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Welcome reveal (Orvantia name) ─────────────────────── */
export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 1900);
    const completeTimer = setTimeout(() => onComplete(), 2750);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-center"
          style={{ background: "#04040a" }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Grid texture */}
          <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" style={{ zIndex: 0 }} />

          {/* Deep space glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30,8,80,0.4), rgba(8,4,30,0.2) 50%, transparent 80%)",
              zIndex: 0,
            }}
          />

          <ConcentricRings />

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", zIndex: 2, marginBottom: 28 }}
          >
            <img
              src="/logo.png"
              alt="Orvantia Logo"
              style={{
                width: "clamp(40px, 6vw, 56px)",
                height: "clamp(40px, 6vw, 56px)",
                objectFit: "contain",
                filter: "drop-shadow(0 0 20px rgba(99,102,241,0.4))",
              }}
            />
          </motion.div>

          {/* Light sweep */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              bottom: 0,
              width: "200px",
              background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.1), transparent)",
              zIndex: 3,
            }}
            initial={{ left: "-20%" }}
            animate={{ left: "120%" }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Wordmark – character blur reveal */}
          <div className="relative z-10" style={{ perspective: "900px" }}>
            <h1
              style={{
                display: "flex",
                fontSize: "clamp(48px, 9vw, 128px)",
                fontFamily: "var(--font)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {WORD.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(175deg, rgba(255,255,255,0.97) 0%, rgba(180,185,255,0.85) 55%, rgba(99,102,241,0.75) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 22,
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(241,245,249,0.35)",
              paddingLeft: "0.4em",
            }}
          >
            Premium Software Studio
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
