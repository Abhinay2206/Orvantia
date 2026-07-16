"use client";

import { useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { NodeCloud, CameraRig } from "./IntelligenceNetwork";
import AuroraField from "./AuroraField";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import MagneticButton from "../ui/MagneticButton";
import { useModal } from "@/app/components/providers/ModalProvider";
import * as THREE from "three";

/* Headline: mix of solid + gradient-outlined words for editorial contrast */
const LINES: Array<Array<{ t: string; style: "solid" | "grad" | "outline" }>> = [
  [{ t: "Building", style: "solid" }, { t: "Intelligent", style: "grad" }],
  [{ t: "Software", style: "solid" }, { t: "for", style: "solid" }],
  [{ t: "Modern", style: "outline" }, { t: "Businesses", style: "grad" }],
];

const MARQUEE = ["Enterprise SaaS", "AI Applications", "Custom Software", "Cloud Infrastructure", "Intelligent Automation", "UI / UX Engineering"];

export default function HeroScene() {
  const mouseRef = useRef<[number, number]>([0, 0]);
  const scrollRef = useRef<number>(0);
  const { openModal } = useModal();
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  /* Mouse parallax for the headline (springed) */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.5 });
  const spy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.5 });

  /* Scroll-driven cinematic exit */
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

  /* GSAP headline line reveal */
  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 120, opacity: 0, skewY: 4 });
      gsap.to(lines, { yPercent: 0, opacity: 1, skewY: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, delay: 0.3 });
    });
    return () => ctx.revert();
  }, []);

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
      {/* ─── One canvas: aurora shader + particle network ─ */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 2, 32], fov: 56, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.35, powerPreference: "high-performance" }}
          dpr={[1, 1.2]}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <AuroraField mouseRef={mouseRef} />
            <CameraRig mouseRef={mouseRef} scrollRef={scrollRef} />
            <NodeCloud mouseRef={mouseRef} scrollRef={scrollRef} />
            <EffectComposer>
              <Bloom mipmapBlur luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.7} levels={5} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* ─── Framing overlays ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(4,4,10,0.55) 0%, transparent 26%, transparent 74%, rgba(4,4,10,0.95) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(4,4,10,0.5), transparent 30%, transparent 70%, rgba(4,4,10,0.4))" }} />
      </div>


      {/* ─── Vertical accent (right edge) ─────────────── */}
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

      {/* ─── Editorial content (left-aligned) ─────────── */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center"
        style={{ zIndex: 4, y: contentY, opacity: contentOpacity, filter: contentBlur, padding: "0 clamp(24px, 6vw, 96px)" }}
      >
        <div style={{ maxWidth: 1080, width: "100%" }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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
              x: spx,
              y: spy,
              fontFamily: "var(--font)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
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

          {/* Subcopy + CTAs */}
          <div style={{ marginTop: "clamp(26px, 4vh, 40px)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28 }}>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: "clamp(14px, 1.25vw, 18px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "42ch" }}
            >
              We design and engineer enterprise SaaS, AI-powered applications, and custom
              software that help modern businesses scale faster.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", gap: 18, alignItems: "center", flexShrink: 0 }}
            >
              <MagneticButton className="btn-primary" style={{ padding: "15px 32px" }} onClick={() => openModal("schedule")}>
                Start Your Project
              </MagneticButton>
              <button
                className="hero-textlink"
                data-cursor-hover
                onClick={() => document.querySelector("#case-study")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "transparent", border: "none", cursor: "none", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-2)" }}
              >
                View Our Work
                <span aria-hidden style={{ display: "inline-block" }}>→</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ─── Bottom marquee strip ─────────────────────── */}
      <motion.div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ zIndex: 4, opacity: contentOpacity, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,4,10,0.4)", backdropFilter: "blur(6px)", padding: "12px 0" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.9 }}
      >
        <div className="flex w-max animate-marquee-left">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 28, paddingRight: 28, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", whiteSpace: "nowrap" }}>
              {t}
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(129,140,248,0.5)" }} />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
