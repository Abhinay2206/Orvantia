"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";

const SRC = "/film/orvantia-brand-film.mp4";
const POSTER = "/film/orvantia-brand-film-poster.jpg";
const LENGTH = 72;
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, "0")}`;

/*
 * The brand film, presented as a scroll reel: a tall section with a sticky
 * full-screen stage. The video starts as a small rounded window low in the
 * frame and opens to full-bleed as you scroll, while the title lifts away.
 * It plays muted in the window; "Play with sound" restarts it with a control
 * bar. The clip-path and title are scrubbed by scroll, so they stay in sync.
 */
export default function BrandFilmSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const inViewRef = useRef(false);

  // Lazy-load near the viewport; play the muted preview only while in view.
  useEffect(() => {
    const el = sectionRef.current, v = videoRef.current;
    if (!el || !v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSrc(SRC); near.disconnect(); } }, { rootMargin: "900px 0px" });
    const view = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
        if (e.isIntersecting) { if (v.getAttribute("src") && !reduced) v.play().catch(() => {}); }
        else v.pause(); // never keep playing (or talking) while off-screen
      },
      { rootMargin: "200px" }
    );
    near.observe(el); view.observe(el);

    const onTime = () => { setTime(v.currentTime); if (fillRef.current && v.duration) fillRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`; };
    const onEnded = () => { setLive(false); v.muted = true; setMuted(true); v.loop = true; v.currentTime = 0; v.play().catch(() => {}); };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("pause", () => setPaused(true));
    v.addEventListener("play", () => setPaused(false));
    return () => { near.disconnect(); view.disconnect(); v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnded); };
  }, []);

  // Source arrives after the visibility check - start once it does.
  useEffect(() => {
    const v = videoRef.current;
    if (src && v && inViewRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
  }, [src]);

  // Scroll-scrubbed: the window opens to full-bleed, the title lifts and fades.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 901px)", () => {
      gsap.to(".reel-frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${window.innerHeight * 0.95}`, scrub: true } });
      gsap.to(".reel-title", { yPercent: -40, opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${window.innerHeight * 0.55}`, scrub: true } });
    });
    mm.add("(prefers-reduced-motion: no-preference) and (max-width: 900px)", () => {
      gsap.fromTo(".reel-frame", { clipPath: "inset(31% 13% 11% 13% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${window.innerHeight * 0.85}`, scrub: true } });
      gsap.to(".reel-title", { yPercent: -50, opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${window.innerHeight * 0.45}`, scrub: true } });
    });
    // Title lines rise out of their masks as the section arrives.
    const lines = gsap.utils.toArray<HTMLElement>(".reel-title .mask > span", el);
    gsap.set(lines, { yPercent: 110 });
    const st = ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.1, ease: "orv", stagger: 0.12 }) });
    return () => { st.kill(); mm.revert(); };
  }, []);

  const playWithSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!src) setSrc(SRC);
    v.loop = false; v.currentTime = 0; v.muted = false;
    setMuted(false); setLive(true);
    v.play().catch(() => {});
  };
  const togglePause = () => { const v = videoRef.current; if (!v) return; v.paused ? v.play().catch(() => {}) : v.pause(); };
  const toggleSound = () => { const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current; if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
  };
  const full = () => {
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {}); else v.webkitEnterFullscreen?.();
  };

  return (
    <section id="film" ref={sectionRef} className={`reel${live ? " live" : ""}`} aria-label="Orvantia brand film">
      <div className="reel-pin">
        <div className="reel-title">
          <h2>
            <span className="mask"><span>Built beyond</span></span>
            <span className="mask"><span className="it">the idea.</span></span>
          </h2>
          <p>The brand film<br />{mmss(LENGTH)} · why we build</p>
        </div>

        <div className="reel-frame" data-cursor-text={live ? undefined : "Play"} onClick={live ? undefined : playWithSound}>
          <video ref={videoRef} src={src} poster={POSTER} muted loop playsInline preload="none" aria-label="Orvantia brand film" />
        </div>

        <div className="reel-ui reel-play-wrap">
          <button type="button" className="reel-play" data-cursor-hover onClick={playWithSound}>
            <i aria-hidden />
            <span>Play with sound<small>{mmss(LENGTH)} · 16:9</small></span>
          </button>
        </div>

        <div className="reel-badge" aria-hidden>Preview · muted</div>

        <div className="reel-bar">
          <button type="button" onClick={togglePause} data-cursor-hover>{paused ? "Play" : "Pause"}</button>
          <div className="reel-track" role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={LENGTH} aria-valuenow={Math.round(time)} onClick={seek} data-cursor-hover>
            <i ref={fillRef} />
          </div>
          <span>{mmss(time)} / {mmss(LENGTH)}</span>
          <button type="button" onClick={toggleSound} data-cursor-hover>{muted ? "Sound off" : "Sound on"}</button>
          <button type="button" onClick={full} data-cursor-hover className="reel-full">Full</button>
        </div>
      </div>
    </section>
  );
}
