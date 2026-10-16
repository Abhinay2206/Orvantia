"use client";

import { useRef, useEffect, useState } from "react";
import HeroField from "./HeroField";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { gsap, ORV_EASE } from "@/lib/motion";
import MagneticButton from "../ui/MagneticButton";
import { useModal } from "@/app/components/providers/ModalProvider";
import RollText from "../ui/RollText";

/* ─── Headline: "Software that ___" - the second line says what it does for you ─── */
const PHRASES = ["runs itself.", "follows up.", "sends reports.", "tracks the work.", "never forgets."];
const SIZER = PHRASES.reduce((a, b) => (b.length > a.length ? b : a));
const INDEX = [
  ["FactoryFlow", "Live · Manufacturing", "#case-study"],
  ["NutritionOS", "Live · Free", "/products/nutritionos"],
  ["ContextBridge", "Open source", "/products/contextbridge"],
];

/* ─── Main Hero ──────────────────────────────────────────── */
export default function HeroScene() {
  const { openModal } = useModal();
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const [clock, setClock] = useState("");
  const [sceneReady, setSceneReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  /* Mouse parallax */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.5 });
  const spy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.5 });

  /* Scroll exit */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Stop rendering the background once the hero is off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The hero plays its entrance once the intro overlay has gone (it renders behind it).
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const go = () => { timer = setTimeout(() => setSceneReady(true), 120); };
    if ((window as { __orvBooted?: boolean }).__orvBooted) go();
    else window.addEventListener("orv:booted", go, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener("orv:booted", go); };
  }, []);

  /* Headline: lines rise out of their masks, then the second line cycles. */
  useEffect(() => {
    if (!sceneReady || !headRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phrases = gsap.utils.toArray<HTMLElement>(".hero-phrase", headRef.current);
    const first = headRef.current.querySelector<HTMLElement>(".hero-l1");
    let timer: ReturnType<typeof setInterval> | undefined;
    const ctx = gsap.context(() => {
      // y: 0 clears the CSS pre-hide offset, which GSAP would otherwise read as pixels.
      gsap.set([first, ...phrases], { y: 0, yPercent: 135 });
      if (reduced) { gsap.set([first, phrases[0]], { yPercent: 0 }); return; }
      gsap.to(first, { yPercent: 0, duration: 1.3, ease: ORV_EASE, delay: 0.3 });
      gsap.to(phrases[0], { yPercent: 0, duration: 1.3, ease: ORV_EASE, delay: 0.46 });
      let i = 0;
      const start = setTimeout(() => {
        timer = setInterval(() => {
          const out = phrases[i];
          i = (i + 1) % phrases.length;
          gsap.to(out, { yPercent: -135, duration: 0.9, ease: ORV_EASE, overwrite: true });
          gsap.fromTo(phrases[i], { yPercent: 135 }, { yPercent: 0, duration: 1, ease: ORV_EASE, overwrite: true });
        }, 3000);
      }, 2600);
      return () => clearTimeout(start);
    }, headRef);
    return () => { clearInterval(timer); ctx.revert(); };
  }, [sceneReady]);

  /* Studio clock - Hyderabad. */
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true });
    const tick = () => setClock(fmt.format(new Date()).toUpperCase());
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    px.set(nx * 16);
    py.set(ny * 12);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full"
      style={{ background: "#04040a", minHeight: "100svh", display: "flex", flexDirection: "column", overflow: "clip" }}
      onMouseMove={onMouseMove}
    >
      {/* ─── Canvas ─ */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <HeroField active={onScreen} start={sceneReady} />
      </div>

      {/* ─── Overlays ─ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Keep the type on calm, dark ground: the left column and the foot fall to black. */}
        <div className="hero-shade" />
      </div>

      {/* ─── Editorial content ─ */}
      <motion.div
        className="relative flex flex-col justify-end"
        // In flow (not absolutely placed) so a short screen makes the hero taller
        // instead of pushing the text up under the fixed nav.
        style={{ zIndex: 4, y: contentY, opacity: contentOpacity, flex: 1, padding: "108px clamp(24px, 6vw, 96px) clamp(20px, 4vh, 40px)" }}
      >
        <div style={{ maxWidth: 1500, width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={sceneReady ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: "clamp(16px, 2.6vh, 30px)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(241,245,249,0.6)" }}
          >
            Software &amp; automation studio
          </motion.div>

          <motion.h1
            ref={headRef}
            className="hero-h1"
            aria-label="Software that runs itself. Orvantia builds automation, SaaS and custom software for growing businesses."
            style={{ x: spx, y: spy }}
          >
            <span className="hero-mask"><span className="hero-l1">Software that</span></span>
            <span className="hero-mask hero-rotor" aria-hidden>
              <span className="hero-sizer">{SIZER}</span>
              {PHRASES.map((ph) => <span key={ph} className="hero-phrase">{ph}</span>)}
            </span>
          </motion.h1>

          <div className="hero-row">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={sceneReady ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ maxWidth: "44ch" }}
            >
              <p style={{ fontSize: "clamp(15px, 1.3vw, 19px)", lineHeight: 1.65, color: "var(--text-2)" }}>
                We help growing businesses run leaner and move faster - with automated systems, SaaS platforms and custom software, built and shipped end to end.
              </p>
              <div className="hero-ctas" style={{ marginTop: 28, display: "flex", gap: 22, alignItems: "center" }}>
                <MagneticButton className="hero-cta-primary" style={{ padding: "15px 32px" }} onClick={() => openModal("schedule")}>
                  <span style={{ position: "relative", zIndex: 1, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#05050a" }}>
                    <RollText>Start your project</RollText>
                  </span>
                </MagneticButton>
                <button className="hero-cta-secondary" data-cursor-hover onClick={() => document.querySelector("#case-study")?.scrollIntoView({ behavior: "smooth" })}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-2)" }}>
                    <RollText>See the work</RollText>
                  </span>
                  <span className="hero-cta-arrow" aria-hidden>→</span>
                </button>
              </div>
            </motion.div>

            <motion.nav
              className="hero-index"
              aria-label="Selected work"
              initial={{ opacity: 0, y: 14 }}
              animate={sceneReady ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-index-title">Now running</div>
              {INDEX.map(([name, meta, href]) => (
                <a key={name} href={href} className="hero-index-row" data-cursor-hover>
                  <span className="hero-index-name">{name}</span>
                  <span className="hero-index-meta">{meta}</span>
                  <span aria-hidden className="hero-index-arrow">↗</span>
                </a>
              ))}
            </motion.nav>
          </div>
        </div>
      </motion.div>

      <motion.div
        // sticky: on short screens the hero is taller than the window, so the bar
        // stays pinned to the bottom of the viewport instead of below the fold
        style={{ position: "sticky", bottom: 0, zIndex: 4, opacity: contentOpacity, padding: "28px clamp(24px, 6vw, 96px) clamp(16px, 3vh, 30px)", pointerEvents: "none", background: "linear-gradient(to top, rgba(4,4,10,0.96) 55%, transparent)" }}
        initial={{ opacity: 0 }}
        animate={sceneReady ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.9 }}
      >
        <div className="hero-foot">
          <span>Hyderabad · {clock || "--:--"} IST</span>
          <span className="hidden sm:block">Automation · SaaS · Custom software</span>
          <span className="hero-scroll">Scroll <i aria-hidden>↓</i></span>
        </div>
      </motion.div>
    </section>
  );
}
