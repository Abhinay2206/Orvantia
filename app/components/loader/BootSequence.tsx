"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Terminal lines ─────────────────────────────────────── */
const LINES = [
  { text: "ORVANTIA STUDIO · SYSTEM INIT", type: "sys" },
  { text: "Compiling enterprise SaaS platforms...", type: "init" },
  { text: "Loading AI engine core...", type: "init" },
  { text: "Provisioning cloud infrastructure...", type: "init" },
  { text: "[OK]   Continuum OS: ONLINE", type: "ok" },
  { text: "[OK]   EnteraFlux: RESEARCH", type: "ok" },
  { text: "[OK]   FactoryFlow: DEPLOYED", type: "ok" },
  { text: "Initializing 3D viewport...", type: "init" },
  { text: "Studio systems: READY", type: "sys" },
];

const LINE_COLORS: Record<string, string> = {
  ok: "rgba(34,197,94,0.85)",
  sys: "rgba(99,102,241,0.9)",
  init: "rgba(255,255,255,0.35)",
};

const WORD = "ORVANTIA";

/* ─── Concentric ring component ──────────────────────────── */
function ConcentricRings({ visible }: { visible: boolean }) {
  const rings = [
    { radius: 60, delay: 0, speed: 12, opacity: 0.25, dash: "4 8" },
    { radius: 90, delay: 0.1, speed: 16, opacity: 0.18, dash: "2 12" },
    { radius: 120, delay: 0.2, speed: 20, opacity: 0.12, dash: "6 16" },
    { radius: 155, delay: 0.3, speed: 25, opacity: 0.08, dash: "3 20" },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={visible ? { scale: 1, opacity: ring.opacity } : {}}
          transition={{ delay: ring.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            width: ring.radius * 2,
            height: ring.radius * 2,
          }}
        >
          <svg
            width={ring.radius * 2}
            height={ring.radius * 2}
            viewBox={`0 0 ${ring.radius * 2} ${ring.radius * 2}`}
            style={{
              animation: `spin-slow ${ring.speed}s linear infinite${i % 2 === 1 ? " reverse" : ""}`,
            }}
          >
            <circle
              cx={ring.radius}
              cy={ring.radius}
              r={ring.radius - 1}
              fill="none"
              stroke="rgba(99,102,241,0.6)"
              strokeWidth="0.5"
              strokeDasharray={ring.dash}
            />
          </svg>
        </motion.div>
      ))}

      {/* Central pulse */}
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0.8], opacity: [0, 0.4, 0.15] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      )}
    </div>
  );
}

/* ─── Main BootSequence ──────────────────────────────────── */
export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState<number[]>([]);
  const [phase, setPhase] = useState<"terminal" | "logo" | "exiting">("terminal");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = Math.min((visible.length / LINES.length) * 100, 100);

  useEffect(() => {
    let i = 0;
    const delays = [250, 90, 90, 90, 55, 55, 55, 80, 200];
    const tick = () => {
      if (i < LINES.length) {
        setVisible((p) => [...p, i]);
        timer.current = setTimeout(tick, delays[i] ?? 65);
        i++;
      } else {
        setTimeout(() => setPhase("logo"), 120);
        setTimeout(() => setPhase("exiting"), 2000);
        setTimeout(onComplete, 2700);
      }
    };
    timer.current = setTimeout(tick, 150);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exiting" && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ background: "#04040a" }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)",
              backgroundSize: "100% 4px",
              zIndex: 10,
            }}
          />

          {/* Grid texture */}
          <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" style={{ zIndex: 0 }} />

          {/* Deep space glow (always present) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30,8,80,0.4), rgba(8,4,30,0.2) 50%, transparent 80%)",
              zIndex: 0,
            }}
          />

          {/* ─── Phase 1: Terminal ───────────────────── */}
          <AnimatePresence>
            {phase === "terminal" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 2 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Glassmorphic terminal panel */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: "28px 32px",
                    maxWidth: 480,
                    width: "calc(100% - 48px)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Panel header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {["rgba(255,95,87,0.7)", "rgba(255,189,46,0.7)", "rgba(40,201,64,0.7)"].map((c, i) => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginLeft: 8 }}>
                      orvantia · boot
                    </span>
                  </div>

                  {/* Separator */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 14 }} />

                  {/* Terminal lines */}
                  {LINES.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={visible.includes(idx) ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.14 }}
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "clamp(10px, 0.9vw, 12px)",
                        lineHeight: "1.8",
                        letterSpacing: "0.04em",
                        color: LINE_COLORS[line.type] ?? LINE_COLORS.init,
                      }}
                    >
                      {line.text}
                    </motion.div>
                  ))}

                  {/* Blinking cursor */}
                  {visible.length < LINES.length && (
                    <motion.span
                      style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(99,102,241,0.9)" }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                    >
                      ▋
                    </motion.span>
                  )}

                  {/* Inner progress bar */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: 2,
                      background: "linear-gradient(90deg, rgba(99,102,241,0.8), rgba(168,85,247,0.8), rgba(34,211,238,0.6))",
                      width: `${progress}%`,
                      transition: "width 0.1s linear",
                      borderRadius: "0 0 16px 16px",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Phase 2: Logo reveal + rings ───────── */}
          <AnimatePresence>
            {phase === "logo" && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ zIndex: 2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                {/* Concentric rings */}
                <ConcentricRings visible={true} />

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
                    background:
                      "linear-gradient(90deg, transparent, rgba(99,102,241,0.1), transparent)",
                    zIndex: 3,
                  }}
                  initial={{ left: "-20%" }}
                  animate={{ left: "120%" }}
                  transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Wordmark — character blur reveal */}
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
                        transition={{
                          delay: 0.06 + i * 0.06,
                          duration: 0.55,
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Bottom progress bar ──────────────── */}
          <div
            className="absolute bottom-0 left-0 h-px"
            style={{
              background: "linear-gradient(90deg, rgba(99,102,241,0.9), rgba(168,85,247,0.9), rgba(34,211,238,0.7))",
              width: `${progress}%`,
              transition: "width 0.1s linear",
              zIndex: 11,
            }}
          />

          {/* Corner timestamp */}
          <motion.div
            className="absolute bottom-4 right-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.08)",
            }}
          >
            {new Date().toISOString().slice(0, 16).replace("T", " ")}Z
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
