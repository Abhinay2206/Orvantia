"use client";

import { useRef, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { NodeCloud, CameraRig } from "./IntelligenceNetwork";
import DeepSpaceField from "./AuroraField";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import MagneticButton from "../ui/MagneticButton";
import { useModal } from "@/app/components/providers/ModalProvider";
import * as THREE from "three";

/* ─── Headline config ────────────────────────────────────── */
const LINES: Array<Array<{ t: string; style: "solid" | "grad" | "outline" }>> = [
  [{ t: "Building", style: "solid" }, { t: "Intelligent", style: "grad" }],
  [{ t: "Software", style: "solid" }, { t: "for", style: "solid" }],
  [{ t: "Modern", style: "outline" }, { t: "Businesses", style: "grad" }],
];

/* ─── Trust items ────────────────────────────────────────── */
const TRUST_ITEMS = [
  { name: "FactoryFlow", tag: "Enterprise", icon: "⬡", color: "rgba(99,102,241,0.5)" },
  { name: "Continuum OS", tag: "Open Source", icon: "◈", color: "rgba(34,211,238,0.5)" },
  { name: "EnteraFlux", tag: "Research", icon: "◆", color: "rgba(168,85,247,0.5)" },
  { name: "Future Innovations", tag: "Coming Soon", icon: "✦", color: "rgba(129,140,248,0.5)" },
];

/* ─── Main Hero ──────────────────────────────────────────── */
export default function HeroScene() {
  const mouseRef = useRef<[number, number]>([0, 0]);
  const scrollRef = useRef<number>(0);
  const { openModal } = useModal();
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [sceneReady, setSceneReady] = useState(false);

  /* Mouse parallax */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.5 });
  const spy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.5 });

  /* Scroll exit */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"]);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSceneReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  /* GSAP headline reveal */
  useEffect(() => {
    if (!sceneReady) return;
    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 120, opacity: 0, skewY: 4 });
      gsap.to(lines, {
        yPercent: 0, opacity: 1, skewY: 0,
        duration: 1.2, ease: "expo.out", stagger: 0.1, delay: 0.3,
      });
    });
    return () => ctx.revert();
  }, [sceneReady]);

  const onMouseMove = (e: React.MouseEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    mouseRef.current = [nx, ny];
    px.set(nx * 16);
    py.set(ny * 12);
  };

  const wordStyle = (s: "solid" | "grad" | "outline"): React.CSSProperties => {
    if (s === "grad")
      return {
        background: "linear-gradient(100deg, #818cf8 0%, #a855f7 52%, #22d3ee 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };
    if (s === "outline")
      return { color: "transparent", WebkitTextStroke: "1.2px rgba(241,245,249,0.55)" };
    return { color: "#f4f6fb" };
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#04040a" }}
      onMouseMove={onMouseMove}
    >
      {/* ─── Canvas ─ */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 2, 32], fov: 56, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.35, powerPreference: "high-performance" }}
          dpr={[1, 1.2]}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <DeepSpaceField mouseRef={mouseRef} />
            <CameraRig mouseRef={mouseRef} scrollRef={scrollRef} />
            <NodeCloud mouseRef={mouseRef} scrollRef={scrollRef} />
            <EffectComposer>
              <Bloom mipmapBlur luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.7} levels={5} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* ─── Overlays ─ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(4,4,10,0.55) 0%, transparent 26%, transparent 74%, rgba(4,4,10,0.95) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(4,4,10,0.5), transparent 30%, transparent 70%, rgba(4,4,10,0.4))" }} />
      </div>

      {/* ─── Ambient particles ─ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: 1 + Math.random() * 1.5,
              height: 1 + Math.random() * 1.5,
              opacity: 0.1 + Math.random() * 0.2,
              animationDuration: `${14 + Math.random() * 18}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* ─── Right vertical accent ─ */}
      <motion.div
        className="absolute hidden lg:flex items-center pointer-events-none"
        style={{ right: 34, top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center", gap: 14, zIndex: 3, opacity: contentOpacity }}
      >
        <div style={{ width: 26, height: 1, background: "rgba(129,140,248,0.3)" }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(241,245,249,0.28)", whiteSpace: "nowrap" }}>
          Est. 2026 · SaaS · AI
        </span>
        <div style={{ width: 26, height: 1, background: "rgba(129,140,248,0.3)" }} />
      </motion.div>

      {/* ─── Editorial content (left-aligned) ─ */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center"
        style={{ zIndex: 4, y: contentY, opacity: contentOpacity, filter: contentBlur, padding: "0 clamp(24px, 6vw, 96px)" }}
      >
        <div style={{ maxWidth: 1080, width: "100%" }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={sceneReady ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(20px, 3vh, 34px)" }}
          >
            <span className="status-dot" style={{ background: "#4ade80" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-2)" }}>
              Premium Software Studio
            </span>
            <span style={{ width: 40, height: 1, background: "rgba(129,140,248,0.4)" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-3)" }}>
              Available for projects
            </span>
          </motion.div>

          {/* Headline — kinetic + mouse parallax */}
          <motion.h1
            style={{
              x: spx, y: spy,
              fontFamily: "var(--font)", fontWeight: 600,
              letterSpacing: "-0.04em", lineHeight: 0.98,
              fontSize: "clamp(38px, 7vw, 108px)",
            }}
          >
            {LINES.map((line, li) => (
              <span key={li} style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
                <span ref={(el) => { lineRefs.current[li] = el; }} style={{ display: "inline-block" }}>
                  {line.map((seg, si) => (
                    <span key={si} style={{ ...wordStyle(seg.style), marginRight: "0.28em" }}>
                      {seg.t}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </motion.h1>

          {/* Subcopy + CTAs row */}
          <div style={{ marginTop: "clamp(26px, 4vh, 40px)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28 }}>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={sceneReady ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: "clamp(14px, 1.25vw, 18px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "42ch" }}
            >
              We design and engineer enterprise SaaS, AI-powered applications, and custom
              software that help modern businesses scale faster.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={sceneReady ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", gap: 18, alignItems: "center", flexShrink: 0 }}
            >
              <MagneticButton
                className="hero-cta-primary"
                style={{ padding: "15px 32px" }}
                onClick={() => openModal("schedule")}
              >
                <span style={{ position: "relative", zIndex: 1, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "white" }}>
                  Start Your Project
                </span>
              </MagneticButton>

              <button
                className="hero-cta-secondary"
                data-cursor-hover
                onClick={() => document.querySelector("#case-study")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-2)" }}>
                  View Our Work
                </span>
                <span className="hero-cta-arrow" aria-hidden>→</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ─── Bottom trust bar ─ */}
      <motion.div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ zIndex: 4, opacity: contentOpacity, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,4,10,0.4)", backdropFilter: "blur(6px)", padding: "12px 0" }}
        initial={{ opacity: 0 }}
        animate={sceneReady ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.9 }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "clamp(12px, 2vw, 28px)", flexWrap: "wrap",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}>
          <span
            className="hidden sm:block"
            style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(241,245,249,0.15)", whiteSpace: "nowrap", marginRight: 8 }}
          >
            Building For
          </span>

          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.name}
              className="hero-trust-card"
              initial={{ opacity: 0, y: 10 }}
              animate={sceneReady ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.6 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ "--trust-color": item.color } as React.CSSProperties}
            >
              <span style={{ fontSize: 13, lineHeight: 1, opacity: 0.5 }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily: "var(--font)", fontSize: "clamp(10px, 0.85vw, 12px)", fontWeight: 500, color: "rgba(241,245,249,0.6)", whiteSpace: "nowrap", lineHeight: 1.2 }}>
                  {item.name}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 7, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.2)", marginTop: 1 }}>
                  {item.tag}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
