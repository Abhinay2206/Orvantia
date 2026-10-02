"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { SplitHeadline, Reveal } from "./_shared";

const SRC = "/film/orvantia-brand-film.mp4";
const POSTER = "/film/orvantia-brand-film-poster.jpg";
const LENGTH = "1:12";

/*
 * The brand film. Plays muted while on screen (the voice-over is set as
 * on-screen type, so it reads without sound), grows from an inset card to
 * full width as it scrolls in, and only downloads once the visitor is near.
 * Click for sound; "Watch the film" restarts it fullscreen with sound.
 */
export default function BrandFilmSection() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const heardRef = useRef(false);
  const inViewRef = useRef(false);
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Load when near, play only while in view.
  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    const near = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSrc(SRC); near.disconnect(); } },
      { rootMargin: "600px 0px" }
    );
    const visible = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
        if (e.isIntersecting) { if (video.getAttribute("src") && (!prefersReduced || !video.muted)) video.play().catch(() => {}); }
        else video.pause();
      },
      { threshold: 0.35 }
    );
    near.observe(frame);
    visible.observe(frame);

    const onTime = () => { if (barRef.current && video.duration) barRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`; };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      near.disconnect(); visible.disconnect();
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // The source arrives after the visibility check — start playing once it does.
  useEffect(() => {
    const v = videoRef.current;
    if (src && v && inViewRef.current && !reduced) v.play().catch(() => {});
  }, [src, reduced]);

  // Inset card → full frame as it scrolls into view.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        frame,
        { scale: 0.86, borderRadius: 44 },
        { scale: 1, borderRadius: 20, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "center center", scrub: 0.6 } }
      );
    });
    return () => mm.revert();
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!src) setSrc(SRC);
    const next = !v.muted;
    v.muted = next;
    // First time sound comes on, start the story from the top.
    if (!next && !heardRef.current) { heardRef.current = true; v.currentTime = 0; }
    v.play().catch(() => {});
    setMuted(next);
  };

  const watchFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (!src) setSrc(SRC);
    heardRef.current = true;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {});
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.();
  };

  return (
    <section
      id="film"
      aria-label="Orvantia brand film"
      style={{ position: "relative", zIndex: 10, padding: "clamp(24px, 6vh, 72px) clamp(16px, 3vw, 48px) clamp(80px, 14vh, 160px)" }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div className="center" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "clamp(32px, 5vw, 64px)" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "clamp(20px, 3vw, 32px)" }}>
            ( The film )
          </div>
          <SplitHeadline text="Built *beyond the idea." style={{ fontSize: "clamp(34px, 6vw, 88px)", textAlign: "center" }} />
          <Reveal delay={0.15}>
            <p style={{ marginTop: 18, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: 1.6, color: "var(--text-2)", maxWidth: "46ch" }}>
              {LENGTH} on why we build software that survives reality.
            </p>
          </Reveal>
        </div>

        <div className="film-wrap">
        <div
          ref={frameRef}
          className="film-frame"
          onClick={toggleSound}
          data-cursor-hover
          data-cursor-text={muted ? "SOUND" : "MUTE"}
          role="button"
          tabIndex={0}
          aria-label={muted ? "Turn sound on" : "Mute"}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSound(); } }}
        >
          <video
            ref={videoRef}
            src={src}
            poster={POSTER}
            muted
            loop
            playsInline
            preload="none"
            aria-label="Orvantia — Built beyond the idea"
          />

          <div className="film-shade" aria-hidden />

          {reduced && !playing && (
            <div className="film-big-play" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
            </div>
          )}

          <div className="film-progress" aria-hidden><div ref={barRef} /></div>
        </div>

          <div className="film-controls">
            <button type="button" className="film-watch" onClick={watchFull}>
              <span className="film-play" aria-hidden>
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
              </span>
              Watch the film
              <span className="film-len">{LENGTH}</span>
            </button>

            <span className="film-hint">{muted ? "Playing muted · click the film for sound" : "Sound on"}</span>

            <button
              type="button"
              className="film-sound"
              onClick={(e) => { e.stopPropagation(); toggleSound(); }}
              aria-label={muted ? "Turn sound on" : "Mute"}
            >
              {muted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" /><path d="m22 9-6 6M16 9l6 6" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
