"use client";

import { useRef, useEffect, useState } from "react";
import HeroField, { keyAt, PULL, monotone } from "./HeroField";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { gsap, ORV_EASE } from "@/lib/motion";
import MagneticButton from "../ui/MagneticButton";
import { useModal } from "@/app/components/providers/ModalProvider";
import RollText from "../ui/RollText";
import { sound } from "./sound";

/* ─── Headline: "Software that ___" - the second line says what it does for you ─── */
const PHRASES = ["runs itself.", "follows up.", "sends reports.", "tracks the work.", "never forgets."];
const SIZER = PHRASES.reduce((a, b) => (b.length > a.length ? b : a));
const KIN = "runs itself"; // what the keys type, as it reads in the headline (same length as WORD)
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

  /* The keyboard shot: progress through the hero's pinned run (0..1). The name
     types itself on the keys, the camera pulls back, then the headline arrives. */
  // No keyboard shot when motion is reduced or WebGL is missing: the hero is a plain, static first screen.
  // Decided after mount: the server can't know either, and the first client render must match it.
  const prefersReduced = useReducedMotion();
  const [hasGL, setHasGL] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const c = document.createElement("canvas");
    setHasGL(!!(c.getContext("webgl2") || c.getContext("webgl")));
    setMounted(true);
  }, []);
  const reducedMotion = mounted && (!!prefersReduced || !hasGL);
  const { scrollYProgress: raw } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // The shot runs on its own heavier progress (the 3D trails the scroll with inertia); the type,
  // letterbox and headline follow that same value so the whole shot moves as one. Raw scroll
  // stands in until the 3D reports (or if it never loads).
  const shot = useMotionValue(-1);
  const [shotReady, setShotReady] = useState(false); // the 3D has drawn its first frame
  const prog = useTransform([raw, shot], ([r, s]: number[]) => (s < 0 ? r : s));
  const shown = useTransform(prog, [PULL[0] + 0.14, PULL[1] - 0.02], [0, 1]);
  const contentOpacity = useTransform(shown, (v) => (reducedMotion ? 1 : v));
  const contentY = useTransform(shown, (v) => (reducedMotion ? 0 : (1 - v) * 40));
  const vignette = useTransform(shown, (v) => 1 - v);
  const bars = useTransform(shown, (v) => 1 - v); // letterbox bars slide away as the hero arrives
  const [typed, setTyped] = useState(0);
  const [typing, setTyping] = useState(true);
  const [revealed, setRevealed] = useState(false);
  useMotionValueEvent(prog, "change", (v) => {
    setTyping(v < PULL[0] + 0.02);
    if (v > PULL[0] + 0.18) setRevealed(true);
  });
  const entered = sceneReady && (revealed || !!reducedMotion);

  /* The match cut. While the keys type, "runs itself" is set in the headline's
     own lilac italic, small and centred under the keyboard. As the camera pulls
     back it grows and glides up into the headline's second line, and hands over
     to the real headline there - the typed words become the headline. */
  const stageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const kinRef = useRef<HTMLDivElement>(null);
  const kinBase = useRef({ left: 0, top: 0, w: 0, h: 0, sw: 0, sh: 0 });
  const landed = useRef(false);
  const landedAt = useRef(0);
  const rotorReset = useRef<() => void>(() => {});
  const layoutKin = () => {
    const head = headRef.current, kin = kinRef.current, stage = stageRef.current;
    const rotor = head?.querySelector<HTMLElement>(".hero-rotor");
    const phrase = head?.querySelector<HTMLElement>(".hero-phrase");
    if (!head || !kin || !stage || !rotor || !phrase) return;
    const cs = getComputedStyle(head);
    kin.style.fontSize = cs.fontSize;
    kin.style.lineHeight = cs.lineHeight;
    kin.style.letterSpacing = cs.letterSpacing;
    const r = rotor.getBoundingClientRect(), st = stage.getBoundingClientRect();
    // measure the resting position: take out the transforms actually applied right now
    // (the content's entrance offset and the cursor parallax on the headline)
    const wrap = head.parentElement?.parentElement;
    const mw = wrap ? new DOMMatrix(getComputedStyle(wrap).transform === "none" ? "" : getComputedStyle(wrap).transform) : new DOMMatrix();
    const mh = new DOMMatrix(getComputedStyle(head).transform === "none" ? "" : getComputedStyle(head).transform);
    const left = r.left - st.left - mw.m41 - mh.m41;
    const top = r.top - st.top - mw.m42 - mh.m42 + phrase.offsetTop;
    kinBase.current = { left, top, w: kin.offsetWidth, h: kin.offsetHeight, sw: st.width, sh: st.height };
    applyKin(shown.get());
  };
  const applyKin = (t: number) => {
    const kin = kinRef.current;
    if (!kin) return;
    const { left, top, w, h, sw, sh } = kinBase.current;
    const phone = sw < 760;
    const s0 = phone ? 0.62 : 0.5;
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const cx = sw / 2, cy = sh - Math.min(230, Math.max(160, sh * 0.23)) - (h * s0) / 2;
    const dx0 = cx - left - (w * s0) / 2, dy0 = cy - top - (h * s0) / 2;
    const sc = s0 + (1 - s0) * e;
    const enterY = (1 - t) * 40; // the content's entrance offset, from t itself (the derived value can lag a frame)
    kin.style.transform = `translate3d(${left + dx0 * (1 - e) + spx.get() * e}px, ${top + dy0 * (1 - e) + enterY + spy.get() * e}px, 0) scale(${sc})`;
    kin.style.opacity = String(t < 0.86 ? 1 : Math.max(0, 1 - (t - 0.86) / 0.14));
    // the real headline's phrase takes over only at the very end, in the same spot
    const real = headRef.current?.querySelector<HTMLElement>(".hero-phrase");
    if (real) real.style.opacity = t >= 0.999 ? "" : String(t < 0.86 ? 0 : (t - 0.86) / 0.14);
    if (t >= 0.999 && !landed.current) { landed.current = true; landedAt.current = performance.now(); }
    // back inside the shot: the second line must read "runs itself." again, under the typed words
    if (t < 0.999 && landed.current) { landed.current = false; rotorReset.current(); }
  };
  useMotionValueEvent(shown, "change", (t) => { if (!reducedMotion) applyKin(t); });
  /* Fit: the stage is exactly one screen tall, so on a short window (or at browser zoom) the headline,
     paragraph and index can add up to more than it holds and push the bottom bar out of view. Measure
     the layout and shrink the headline and spacing (--hf) until everything, bar included, fits;
     below 0.72 the paragraph steps aside too. */
  const fit = () => {
    const stage = stageRef.current, body = bodyRef.current, foot = footRef.current;
    if (!stage || !body || !foot) return;
    stage.removeAttribute("data-tight");
    let hf = 1;
    const over = () => body.offsetHeight + foot.offsetHeight - stage.clientHeight;
    stage.style.setProperty("--hf", "1");
    for (let i = 0; i < 14 && over() > 0.5; i++) {
      hf = Math.max(0.45, hf - 0.04);
      if (hf < 0.72) stage.setAttribute("data-tight", "");
      stage.style.setProperty("--hf", hf.toFixed(2));
    }
  };
  useEffect(() => {
    if (!reducedMotion) {
      const run = () => { fit(); layoutKin(); };
      run();
      const ro = new ResizeObserver(run);
      if (stageRef.current) ro.observe(stageRef.current);
      document.fonts?.ready.then(run);
      window.addEventListener("resize", run);
      return () => { ro.disconnect(); window.removeEventListener("resize", run); };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, mounted]);
  useEffect(() => {
    if (reducedMotion) {
      const real = headRef.current?.querySelector<HTMLElement>(".hero-phrase");
      if (real) real.style.opacity = "";
      landed.current = true;
      return;
    }
    layoutKin();
    const ro = new ResizeObserver(() => layoutKin());
    if (stageRef.current) ro.observe(stageRef.current);
    document.fonts?.ready.then(() => layoutKin());
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, mounted]);
  const contentEvents = useTransform(shown, (v) => (reducedMotion || v > 0.5 ? "auto" : "none")); // no invisible clicks during the intro

  /* Autoplay: the shot is scroll-driven, but nobody should have to guess that.
     Shortly after the loader, if the visitor hasn't scrolled, the page glides
     through the shot on its own (about twenty seconds) and lands on the hero.
     Any wheel, touch or key hands control straight back. */
  const [auto, setAuto] = useState<"idle" | "playing" | "done">("idle");
  const runwayEnd = () => {
    const sec = sectionRef.current;
    return sec ? sec.offsetTop + sec.offsetHeight - window.innerHeight : 0;
  };
  type LenisLike = {
    scrollTo: (target: number, opts?: Record<string, unknown>) => void;
    on: (e: "scroll", cb: (l: LenisLike) => void) => () => void;
    scroll: number;
    options: { duration?: number };
    virtualScroll?: { options: { wheelMultiplier: number } };
  };
  const lenis = () => (window as unknown as { lenis?: LenisLike }).lenis;
  useEffect(() => {
    if (!sceneReady || !shotReady || reducedMotion) return;
    // the glide's pace: the board wakes, the keys go at a typist's pace, a slow beat on the
    // ignition, then the long pull-back settles onto the hero
    const pace = monotone([0, 0.03, 0.11, 0.49, 0.6, 0.89, 1], [0, 0.004, keyAt(0), keyAt(10), 0.535, PULL[1], 1]);
    let started = false;
    // a wheel already overrides the glide inside Lenis; touch and keys need the glide stopped first
    const takeOver = (stop: boolean) => {
      if (!started) return;
      started = false;
      if (stop) lenis()?.scrollTo(window.scrollY, { immediate: true, force: true });
      setAuto("done");
    };
    const onWheel = () => takeOver(false);
    const onTouch = () => takeOver(true);
    const timer = setTimeout(() => {
      const l = lenis();
      if (!l || window.scrollY > 4) { setAuto("done"); return; }
      started = true;
      setAuto("playing");
      l.scrollTo(runwayEnd(), { duration: 22, easing: pace, onComplete: () => { started = false; setAuto("done"); } });
    }, 1200);
    const keys = (e: KeyboardEvent) => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) takeOver(true); };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("keydown", keys);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", keys);
    };
  }, [sceneReady, shotReady, reducedMotion]);
  /* Inside the shot the wheel is heavier: each notch moves the page less and glides longer,
     so the keys go down one by one instead of racing past. Normal again below the hero. */
  useEffect(() => {
    const l = lenis();
    if (!l || reducedMotion) return;
    const base = { duration: l.options.duration, wheel: l.virtualScroll?.options.wheelMultiplier ?? 1 };
    let inShot: boolean | null = null;
    let end = runwayEnd();
    const ro = new ResizeObserver(() => { end = runwayEnd(); }); // not read on every scroll event: that would force layout each time
    if (stageRef.current) ro.observe(stageRef.current);
    const apply = () => {
      const now = l.scroll < end - 2;
      if (now === inShot) return;
      inShot = now;
      l.options.duration = now ? 2.1 : base.duration;
      if (l.virtualScroll) l.virtualScroll.options.wheelMultiplier = now ? 0.42 : base.wheel;
    };
    apply();
    const off = l.on("scroll", apply);
    return () => { off(); ro.disconnect(); l.options.duration = base.duration; if (l.virtualScroll) l.virtualScroll.options.wheelMultiplier = base.wheel; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, reducedMotion]);

  /* Opt-in sound: off by default. A click per key press, a quiet bed while the hero is on screen. */
  const [soundOn, setSoundOn] = useState(false);
  const remember = (v: boolean) => { try { localStorage.setItem("orv-sound", v ? "1" : "0"); } catch { /* storage blocked */ } };
  const toggleSound = async () => {
    if (sound.on) { sound.disable(); setSoundOn(false); remember(false); }
    else { await sound.enable(); sound.ambient(onScreen ? 1 : 0); setSoundOn(true); remember(true); }
  };
  // a returning visitor who chose sound gets it back on their first click or key (browsers need a gesture)
  useEffect(() => {
    let pref = false;
    try { pref = localStorage.getItem("orv-sound") === "1"; } catch { /* storage blocked */ }
    if (!pref) return;
    const arm = async () => { if (!sound.on) { await sound.enable(); setSoundOn(true); } };
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => { window.removeEventListener("pointerdown", arm); window.removeEventListener("keydown", arm); };
  }, []);
  /* Each key that goes down: a click, and its letter lifts off the key as light and glides
     into its place in the typed line (the keyboard reports where the key is on screen). */
  useEffect(() => {
    const onKey = (e: Event) => {
      const d = (e as CustomEvent<{ k: number; space: boolean; x: number; y: number }>).detail;
      sound.click(d.space);
      const kin = kinRef.current, stage = stageRef.current;
      const ch = kin?.querySelectorAll<HTMLElement>(".c")[d.k];
      if (!kin || !stage || !ch || d.space) return;
      const r = ch.getBoundingClientRect(), st = stage.getBoundingClientRect();
      const sc = new DOMMatrix(getComputedStyle(kin).transform === "none" ? "" : getComputedStyle(kin).transform).a || 1;
      ch.style.setProperty("--fx", `${(d.x - (r.left - st.left + r.width / 2)) / sc}px`);
      ch.style.setProperty("--fy", `${(d.y - (r.top - st.top + r.height / 2)) / sc}px`);
      ch.dataset.fly = "";
    };
    const onTyped = (e: Event) => setTyped((e as CustomEvent<{ n: number }>).detail.n);
    const onCue = (e: Event) => {
      const name = (e as CustomEvent<{ name: string }>).detail.name;
      sound.cue(name);
      const kin = kinRef.current;
      if (name === "ignite" && kin) { kin.classList.remove("is-lit"); void kin.offsetWidth; kin.classList.add("is-lit"); }
    };
    window.addEventListener("orv:key", onKey);
    window.addEventListener("orv:typed", onTyped);
    window.addEventListener("orv:cue", onCue);
    return () => {
      window.removeEventListener("orv:key", onKey);
      window.removeEventListener("orv:typed", onTyped);
      window.removeEventListener("orv:cue", onCue);
    };
  }, []);
  useEffect(() => { if (soundOn) sound.ambient(onScreen ? 1 : 0); }, [onScreen, soundOn]);

  const skipIntro = () => {
    setAuto("done");
    lenis()?.scrollTo(runwayEnd(), { duration: 1.4, force: true });
  };

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
    if (!entered || !headRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phrases = gsap.utils.toArray<HTMLElement>(".hero-phrase", headRef.current);
    const first = headRef.current.querySelector<HTMLElement>(".hero-l1");
    let timer: ReturnType<typeof setInterval> | undefined;
    const ctx = gsap.context(() => {
      // y: 0 clears the CSS pre-hide offset, which GSAP would otherwise read as pixels.
      gsap.set([first, ...phrases], { y: 0, yPercent: 135 });
      if (reduced) { gsap.set([first, phrases[0]], { yPercent: 0 }); return; }
      gsap.to(first, { yPercent: 0, duration: 1.3, ease: ORV_EASE, delay: 0.3 });
      // the second line arrives with the typed words (the match cut), so it is already in place
      if (reducedMotion) gsap.to(phrases[0], { yPercent: 0, duration: 1.3, ease: ORV_EASE, delay: 0.46 });
      else gsap.set(phrases[0], { yPercent: 0 });
      let i = 0;
      const start = setTimeout(() => {
        rotorReset.current = () => {
          gsap.killTweensOf(phrases);
          phrases.forEach((p, k) => gsap.set(p, { yPercent: k === 0 ? 0 : 135 }));
          i = 0;
        };
        timer = setInterval(() => {
          // keep "runs itself." until the typed words have landed, and for a beat after
          if (!landed.current || performance.now() - landedAt.current < 2400) return;
          const out = phrases[i];
          i = (i + 1) % phrases.length;
          gsap.to(out, { yPercent: -135, duration: 0.9, ease: ORV_EASE, overwrite: true });
          gsap.fromTo(phrases[i], { yPercent: 135 }, { yPercent: 0, duration: 1, ease: ORV_EASE, overwrite: true });
        }, 3000);
      }, 2600);
      return () => clearTimeout(start);
    }, headRef);
    return () => { clearInterval(timer); ctx.revert(); };
  }, [entered]);

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
    <section ref={sectionRef} id="hero" className={`hero-runway${reducedMotion ? " is-static" : ""}`} onMouseMove={onMouseMove}>
     <div className="hero-stage" ref={stageRef}>
      {/* ─── Canvas ─ */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <HeroField active={onScreen} start={sceneReady} onProgress={(p) => { if (shot.get() < 0) setShotReady(true); shot.set(p); }} />
      </div>

      {/* ─── Overlays ─ */}
      {/* Cinematic vignette and letterbox over the keyboard shot; they lift as the hero arrives. */}
      {!reducedMotion && <motion.div className="hero-vignette" style={{ opacity: vignette }} aria-hidden />}
      {!reducedMotion && <motion.div className="hero-bar hero-bar-top" style={{ scaleY: bars }} aria-hidden />}
      {!reducedMotion && <motion.div className="hero-bar hero-bar-bottom" style={{ scaleY: bars }} aria-hidden />}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: contentOpacity }}>
        {/* Keep the type on calm, dark ground (fades in with the headline, so the keyboard shot stays clear). */}
        <div className="hero-shade" />
      </motion.div>

      {/* ─── Editorial content ─ */}
      <motion.div
        ref={bodyRef}
        className="relative flex flex-col justify-end"
        // In flow (not absolutely placed) so a short screen makes the hero taller
        // instead of pushing the text up under the fixed nav.
        style={{ zIndex: 4, y: contentY, opacity: contentOpacity, pointerEvents: contentEvents, flex: 1, padding: "108px clamp(24px, 6vw, 96px) clamp(20px, 4vh, 40px)" }}
      >
        <div style={{ maxWidth: 1500, width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
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
              animate={entered ? { opacity: 1, y: 0 } : {}}
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
              animate={entered ? { opacity: 1, y: 0 } : {}}
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
        ref={footRef}
        // sticky: on short screens the hero is taller than the window, so the bar
        // stays pinned to the bottom of the viewport instead of below the fold
        style={{ position: "relative", zIndex: 4, padding: "28px clamp(24px, 6vw, 96px) clamp(16px, 3vh, 30px)", pointerEvents: "none", background: "linear-gradient(to top, rgba(4,4,10,0.96) 55%, transparent)" }}
        initial={{ opacity: 0 }}
        animate={sceneReady ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.9 }}
      >
        <div className="hero-foot">
          <span>Hyderabad · {clock || "--:--"} IST</span>
          <span className="hidden md:block">Automation · SaaS · Custom software</span>
          <button type="button" className="hero-sound" aria-pressed={soundOn} onClick={toggleSound} data-cursor-hover>
            <span className={`hero-sound-bars${soundOn ? " on" : ""}`} aria-hidden><i /><i /><i /></span>
            Sound {soundOn ? "on" : "off"}
          </button>
          <span className="hero-scroll">Scroll <i aria-hidden>↓</i></span>
        </div>
      </motion.div>

      {/* The typed words (see the match cut above) */}
      {!reducedMotion && (
        <div ref={kinRef} className="hero-kin" aria-hidden>
          {KIN.split("").map((ch, k) => (
            <span key={k}>
              {k === typed && typed < KIN.length && <i className="hero-kin-caret" />}
              <span className={k < typed ? "c on" : "c"}>{ch === " " ? "\u00a0" : ch}</span>
            </span>
          ))}
          <span className={typed >= KIN.length ? "c on" : "c"}>.</span>
        </div>
      )}

      {/* The intro overlay: says what this is, types the name with the keys, and shows how to move on */}
      {!reducedMotion && (
        <div className={`hero-intro${sceneReady ? " is-in" : ""}${typing ? "" : " is-done"}`}>
          <div className="hero-intro-eyebrow" aria-hidden>Orvantia <i /> Software &amp; automation studio</div>
          <div className="hero-intro-bottom" aria-hidden>
            <div className="hero-intro-cue">
              <span className="hero-intro-mouse"><i /></span>
              <span>{auto === "playing" ? "Scroll anytime to take over" : "Scroll to type"}</span>
            </div>
          </div>
          <div className="hero-intro-actions">
            <button type="button" className="hero-skip" aria-pressed={soundOn} onClick={toggleSound} tabIndex={typing ? 0 : -1}>
              <span className={`hero-sound-bars${soundOn ? " on" : ""}`} aria-hidden><i /><i /><i /></span>
              {soundOn ? "Sound on" : "Turn sound on"}
            </button>
            <button type="button" className="hero-skip" onClick={skipIntro} tabIndex={typing ? 0 : -1}>
              Skip intro <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}
     </div>
    </section>
  );
}
