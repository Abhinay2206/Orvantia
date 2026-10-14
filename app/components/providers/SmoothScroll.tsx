"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children, paused = false }: { children: React.ReactNode; paused?: boolean }) {
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const lenis = (window as any).lenis as Lenis | undefined;
    if (paused) lenis?.stop(); else lenis?.start();
  }, [paused]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
      smoothWheel: true,
    });
    
    if (pausedRef.current) lenis.stop();   // held until the intro finishes

    // Expose for global modal controls
    (window as any).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
