"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { NodeCloud, CameraRig } from "./IntelligenceNetwork";
import { motion } from "framer-motion";
import AnimatedCounter from "../ui/AnimatedCounter";
import * as THREE from "three";

const WORD = "ORVANTIA";

const LIVE_STATS: Array<{ value: number; suffix: string; label: string; color: string; decimals?: number; prefix?: string }> = [
  { value: 3, suffix: "", label: "Industries Served", color: "#22d3ee" },
  { value: 3, suffix: "", label: "AI Products Built", color: "#6366f1" },
  { value: 99.98, suffix: "%", label: "Uptime", decimals: 2, color: "#10b981" },
  { value: 50, suffix: "+", label: "Workflows Automated", color: "#a855f7" },
];

export default function HeroScene() {
  const mouseRef = useRef<[number, number]>([0, 0]);

  const onMouseMove = (e: React.MouseEvent) => {
    mouseRef.current = [
      (e.clientX / window.innerWidth) * 2 - 1,
      (e.clientY / window.innerHeight) * 2 - 1,
    ];
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#04040a" }}
      onMouseMove={onMouseMove}
    >
      {/* ─── Three.js canvas ─────────────────────────── */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2, 32], fov: 56, near: 0.1, far: 200 }}
          gl={{
            antialias: true,
            alpha: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5,
          }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={["#04040a"]} />
          <fog attach="fog" args={["#04040a", 42, 100]} />
          <Suspense fallback={null}>
            <CameraRig mouseRef={mouseRef} />
            <NodeCloud mouseRef={mouseRef} />
            <EffectComposer>
              <Bloom
                mipmapBlur
                luminanceThreshold={0.08}
                luminanceSmoothing={0.85}
                intensity={3.0}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* ─── Vignettes ────────────────────────────────── */}
      {/* Heavy bottom gradient — text lives here */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "78%",
          background:
            "linear-gradient(to top, #04040a 0%, rgba(4,4,10,0.92) 30%, rgba(4,4,10,0.55) 58%, transparent 100%)",
        }}
      />
      {/* Left */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{ width: "18%", background: "linear-gradient(to right, rgba(4,4,10,0.65), transparent)" }}
      />
      {/* Right */}
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{ width: "18%", background: "linear-gradient(to left, rgba(4,4,10,0.65), transparent)" }}
      />
      {/* Top */}
      <div
        className="absolute top-0 inset-x-0 pointer-events-none"
        style={{ height: "20%", background: "linear-gradient(to bottom, #04040a, transparent)" }}
      />

      {/* ─── Status pill (top-left) ───────────────────── */}
      <motion.div
        className="absolute pointer-events-auto"
        style={{ top: "clamp(24px, 3vw, 40px)", left: "clamp(24px, 5vw, 72px)" }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
      </motion.div>

      {/* ─── Vertical accent text (right edge) ───────── */}
      <motion.div
        className="absolute hidden lg:flex items-center"
        style={{
          right: 20,
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          transformOrigin: "center",
          gap: 16,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <div
          style={{
            width: 1,
            height: 24,
            background: "rgba(99,102,241,0.25)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 8,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(241,245,249,0.1)",
            whiteSpace: "nowrap",
          }}
        >
          ORVANTIA · AI · 2026 · AUTONOMOUS PRODUCTS
        </span>
        <div
          style={{
            width: 1,
            height: 24,
            background: "rgba(99,102,241,0.25)",
          }}
        />
      </motion.div>

      {/* ─── Main content (bottom-anchored) ──────────── */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ padding: "0 clamp(24px, 5vw, 72px)" }}
      >
        {/* Category label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "rgba(99,102,241,0.65)",
            }}
          >
            01
          </span>
          <div
            style={{ width: 24, height: 1, background: "rgba(99,102,241,0.35)" }}
          />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(241,245,249,0.2)",
            }}
          >
            Autonomous AI Products
          </span>
        </motion.div>

        {/* ─── HUGE heading: character reveal ───────── */}
        <div style={{ perspective: "800px", marginBottom: 14 }}>
          <h1
            style={{
              fontSize: "clamp(68px, 13vw, 190px)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
              display: "flex",
              flexWrap: "nowrap",
            }}
          >
            {WORD.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: "28%", rotateX: -55 }}
                animate={{ opacity: 1, y: "0%", rotateX: 0 }}
                transition={{
                  delay: 0.65 + i * 0.055,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  display: "inline-block",
                  background:
                    "linear-gradient(175deg, rgba(255,255,255,0.97) 0%, rgba(180,185,255,0.8) 65%, rgba(99,102,241,0.7) 100%)",
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

        {/* Subtitle row + CTAs */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 0,
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(13px, 1.3vw, 18px)",
              color: "rgba(241,245,249,0.38)",
              lineHeight: 1.55,
              maxWidth: "44ch",
            }}
          >
            We build autonomous AI products that transform enterprise operations,
            engineering, and healthcare at scale.
          </motion.p>
        </div>

        {/* ─── Live stats bar ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.9 }}
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 22,
            paddingTop: 20,
            paddingBottom: 32,
            borderTop: "1px solid rgba(255,255,255,0.055)",
            gap: 0,
            flexWrap: "wrap",
          }}
        >
          {LIVE_STATS.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                flex: "1 1 110px",
                minWidth: 110,
              }}
            >
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 24,
                    background: "rgba(255,255,255,0.055)",
                    marginRight: "clamp(16px, 3vw, 36px)",
                    flexShrink: 0,
                  }}
                />
              )}
              <div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "clamp(18px, 2.2vw, 30px)",
                    fontWeight: 700,
                    color: s.color,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  <AnimatedCounter
                    to={s.value}
                    suffix={s.suffix}
                    prefix={s.prefix ?? ""}
                    decimals={s.decimals ?? 0}
                    duration={1600}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(241,245,249,0.18)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}

          {/* Scroll cue — right side of the bar */}
          <motion.div
            className="hidden md:flex flex-col items-end gap-1.5 ml-auto"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 8,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(241,245,249,0.18)",
              }}
            >
              Scroll
            </span>
            <motion.div
              style={{
                width: 1,
                height: 28,
                background:
                  "linear-gradient(to bottom, rgba(99,102,241,0.7), transparent)",
                transformOrigin: "top",
              }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Thin decorative line (left edge accent) ─── */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{
          left: "clamp(24px, 5vw, 72px)",
          bottom: "clamp(160px, 22vh, 280px)",
          width: "clamp(40px, 8vw, 100px)",
          height: 1,
          background:
            "linear-gradient(90deg, rgba(99,102,241,0.6), rgba(168,85,247,0.2), transparent)",
          transformOrigin: "left",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.45, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </section>
  );
}
