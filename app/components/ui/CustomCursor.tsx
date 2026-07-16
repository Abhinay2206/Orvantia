"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CustomCursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const cursorOpacity = useMotionValue(0);
  const isHovering = useMotionValue(0);
  const isClicking = useMotionValue(0);
  const isTextHovering = useMotionValue(0);
  const [cursorText, setCursorText] = useState("");

  const dotX = useSpring(mx, { damping: 40, stiffness: 500, mass: 0.3 });
  const dotY = useSpring(my, { damping: 40, stiffness: 500, mass: 0.3 });
  const ringX = useSpring(mx, { damping: 22, stiffness: 180, mass: 0.6 });
  const ringY = useSpring(my, { damping: 22, stiffness: 180, mass: 0.6 });

  // Spring the raw 0/1 signals for smooth transitions
  const hoverSpring = useSpring(isHovering, { damping: 20, stiffness: 260, mass: 0.3 });
  const clickSpring = useSpring(isClicking, { damping: 15, stiffness: 400, mass: 0.2 });
  const textHoverSpring = useSpring(isTextHovering, { damping: 20, stiffness: 220, mass: 0.4 });

  // Derive scale values via transform (pure GPU, no layout recalcs)
  const ringHoverScale = useTransform(hoverSpring, [0, 1], [1, 1.375]);
  const ringClickScale = useTransform(clickSpring, [0, 1], [1, 0.75]);
  const ringTextScale = useTransform(textHoverSpring, [0, 1], [1, 2.8]); // Huge scale for text
  const dotHoverScale = useTransform(hoverSpring, [0, 1], [1, 1.5]);
  const dotClickScale = useTransform(clickSpring, [0, 1], [1, 1.6]);
  
  // Fade out dot when text is shown
  const dotOpacity = useTransform(textHoverSpring, [0, 1], [1, 0]);

  // Combine hover + click + text scales by multiplying
  const ringScale = useTransform(
    [ringHoverScale, ringClickScale, ringTextScale],
    ([h, c, t]: number[]) => h * c * t
  );
  const dotScale = useTransform(
    [dotHoverScale, dotClickScale],
    ([h, c]: number[]) => h * c
  );

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      cursorOpacity.set(1);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.set(target.closest("button, a, [data-cursor-hover]") !== null ? 1 : 0);
      
      const textEl = target.closest("[data-cursor-text]");
      if (textEl) {
        setCursorText(textEl.getAttribute("data-cursor-text") || "");
        isTextHovering.set(1);
      } else {
        isTextHovering.set(0);
        // Delay clearing text so it doesn't flash empty during shrink
        setTimeout(() => { if (isTextHovering.get() === 0) setCursorText(""); }, 200);
      }
    };

    const handleDown = () => isClicking.set(1);
    const handleUp = () => isClicking.set(0);
    const handleLeave = () => cursorOpacity.set(0);
    const handleEnter = () => cursorOpacity.set(1);

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    window.addEventListener("mousedown", handleDown, { passive: true });
    window.addEventListener("mouseup", handleUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
    };
  }, [mx, my, cursorOpacity, isHovering, isClicking, isTextHovering]);

  return (
    <>
      {/* Trailing ring — fixed 32px, scale-only transitions (no layout recalcs) */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: 32,
          height: 32,
          border: "1px solid rgba(255,255,255,0.25)",
          background: useTransform(textHoverSpring, [0, 1], ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)"]),
          backdropFilter: useTransform(textHoverSpring, [0, 1], ["blur(0px)", "blur(4px)"]),
          opacity: cursorOpacity,
          scale: ringScale,
          mixBlendMode: "difference",
        }}
      />
      
      {/* Contextual Text Overlay */}
      <motion.div
        className="fixed pointer-events-none z-[9999] flex items-center justify-center text-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: useTransform(
            [cursorOpacity, textHoverSpring],
            ([co, th]: number[]) => co * th
          ),
          mixBlendMode: "difference",
        }}
      >
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.2em", color: "white", fontWeight: 600 }}>
          {cursorText}
        </span>
      </motion.div>

      {/* Core dot — fixed 4px, scale-only transitions */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-white/90"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 4,
          height: 4,
          opacity: useTransform(
            [cursorOpacity, dotOpacity],
            ([co, dp]: number[]) => co * dp
          ),
          scale: dotScale,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
