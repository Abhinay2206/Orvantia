"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  { text: "ORVANTIA AI: INITIATING SHOWCASE", type: "sys" },
  { text: "Loading enterprise intelligence systems...", type: "init" },
  { text: "Loading autonomous engineering platforms...", type: "init" },
  { text: "Loading healthcare AI solutions...", type: "init" },
  { text: "[OK]   Enteraflux: ONLINE", type: "ok" },
  { text: "[OK]   Continuum: ONLINE", type: "ok" },
  { text: "[OK]   ClinicalAgent: ONLINE", type: "ok" },
  { text: "Synchronizing autonomous agents...", type: "init" },
  { text: "Intelligence network: ACTIVE", type: "sys" },
  { text: "────────────────────────────────────────────", type: "dim" },
  { text: "WELCOME TO ORVANTIA AI.", type: "ready" },
];

const LINE_COLORS: Record<string, string> = {
  ok: "rgba(34,197,94,0.85)",
  ready: "rgba(255,255,255,0.95)",
  sys: "rgba(99,102,241,0.9)",
  dim: "rgba(255,255,255,0.08)",
  init: "rgba(255,255,255,0.35)",
};

const WORD = "ORVANTIA";

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState<number[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = Math.min((visible.length / LINES.length) * 100, 100);

  useEffect(() => {
    let i = 0;
    const delays = [280, 110, 110, 110, 65, 65, 65, 90, 90, 70, 280];
    const tick = () => {
      if (i < LINES.length) {
        setVisible((p) => [...p, i]);
        timer.current = setTimeout(tick, delays[i] ?? 75);
        i++;
      } else {
        setTimeout(() => setShowLogo(true), 160);
        setTimeout(() => setExiting(true), 2350);
        setTimeout(onComplete, 3050);
      }
    };
    timer.current = setTimeout(tick, 180);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ background: "#04040a" }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)",
              backgroundSize: "100% 4px",
              zIndex: 1,
            }}
          />

          {/* Grid texture */}
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" style={{ zIndex: 0 }} />

          {/* ─── Phase 1: Terminal ──────────────────────── */}
          <AnimatePresence>
            {!showLogo && (
              <motion.div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ padding: "0 clamp(32px, 6vw, 80px) 72px", zIndex: 2 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
              >
                {/* Corner decoration */}
                <div
                  className="absolute top-8 left-8 md:top-10 md:left-10 flex items-center gap-3"
                  style={{ opacity: 0.25 }}
                >
                  <div
                    style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: "conic-gradient(#6366f1, #a855f7, #22d3ee, #6366f1)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--mono)", fontSize: 9,
                      letterSpacing: "0.4em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    ORVANTIA · BOOT
                  </span>
                </div>

                {/* Terminal lines */}
                <div style={{ maxWidth: 600 }}>
                  {LINES.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={visible.includes(idx) ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.16 }}
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "clamp(11px, 1vw, 13px)",
                        lineHeight: "1.75",
                        letterSpacing: "0.04em",
                        color: LINE_COLORS[line.type] ?? LINE_COLORS.init,
                      }}
                    >
                      {line.text}
                    </motion.div>
                  ))}

                  {visible.length < LINES.length && (
                    <motion.span
                      style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(99,102,241,0.9)" }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.75, repeat: Infinity }}
                    >
                      ▋
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Phase 2: Logo reveal ────────────────────── */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ zIndex: 2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Deep space glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(40,10,100,0.55), rgba(10,5,40,0.3) 55%, transparent 80%)",
                  }}
                />

                {/* Light sweep (horizontal scan) */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    top: 0, bottom: 0,
                    width: "180px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(99,102,241,0.12), transparent)",
                    zIndex: 1,
                  }}
                  initial={{ left: "-20%" }}
                  animate={{ left: "120%" }}
                  transition={{ delay: 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Wordmark — character blur reveal */}
                <div className="relative z-10" style={{ perspective: "900px" }}>
                  <h1
                    style={{
                      display: "flex",
                      fontSize: "clamp(56px, 10vw, 144px)",
                      fontFamily: "var(--font)",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {WORD.split("").map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, filter: "blur(18px)", scale: 1.08 }}
                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                        transition={{
                          delay: 0.08 + i * 0.065,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                          display: "inline-block",
                          background:
                            "linear-gradient(175deg, rgba(255,255,255,0.97) 0%, rgba(180,185,255,0.85) 55%, rgba(99,102,241,0.75) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </h1>

                  {/* Tagline */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.72, duration: 0.5 }}
                    style={{
                      marginTop: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(99,102,241,0.35))" }} />
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 9,
                        letterSpacing: "0.42em",
                        textTransform: "uppercase",
                        color: "rgba(241,245,249,0.22)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Autonomous Intelligence
                    </span>
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(99,102,241,0.35))" }} />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Progress bar ────────────────────────────── */}
          <div
            className="absolute bottom-0 left-0 h-px"
            style={{
              background: "linear-gradient(90deg, rgba(99,102,241,0.9), rgba(168,85,247,0.9), rgba(34,211,238,0.7))",
              width: `${progress}%`,
              transition: "width 0.12s linear",
              zIndex: 3,
            }}
          />

          {/* Corner timestamp */}
          <motion.div
            className="absolute bottom-4 right-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.1)",
            }}
          >
            {new Date().toISOString().slice(0, 16).replace("T", " ")}Z
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
