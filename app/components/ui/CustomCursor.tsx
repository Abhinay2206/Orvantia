"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const dotX = useSpring(mx, { damping: 40, stiffness: 500, mass: 0.3 });
  const dotY = useSpring(my, { damping: 40, stiffness: 500, mass: 0.3 });
  const ringX = useSpring(mx, { damping: 22, stiffness: 180, mass: 0.6 });
  const ringY = useSpring(my, { damping: 22, stiffness: 180, mass: 0.6 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.closest("button, a, [data-cursor-hover]") !== null;
      setHovering(isHoverable);
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [mx, my, visible]);

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 44 : 32,
          height: hovering ? 44 : 32,
          border: `1px solid ${hovering ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.25)"}`,
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.8 : 1,
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.15s ease, scale 0.1s ease",
          mixBlendMode: "difference",
        }}
      />

      {/* Core dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 6 : 4,
          height: hovering ? 6 : 4,
          background: hovering ? "rgba(99,102,241,1)" : "rgba(255,255,255,0.9)",
          opacity: visible ? 1 : 0,
          scale: clicking ? 1.5 : 1,
          transition: "width 0.3s ease, height 0.3s ease, background 0.3s ease, opacity 0.15s ease, scale 0.1s ease",
          boxShadow: hovering ? "0 0 8px rgba(99,102,241,0.8)" : "none",
        }}
      />
    </>
  );
}
