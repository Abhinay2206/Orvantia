"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useModal } from "@/app/components/providers/ModalProvider";

export default function ManifestoCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const { openModal } = useModal();

  const lines = [
    {
      text: "Not an AI agency. Not a chatbot.",
      size: "clamp(18px, 2.8vw, 44px)",
      style: { color: "rgba(241,245,249,0.2)" },
    },
    {
      text: "Building autonomous",
      size: "clamp(44px, 7.5vw, 108px)",
      style: { color: "rgba(241,245,249,0.92)" },
    },
    {
      text: "AI products.",
      size: "clamp(44px, 7.5vw, 108px)",
      gradient: true,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 clamp(24px, 6vw, 96px)", textAlign: "center" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(30,10,90,0.3), rgba(0,20,80,0.15) 50%, transparent 75%)",
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-18 pointer-events-none" />

      {/* Horizon line */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "50%",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.15) 30%, rgba(168,85,247,0.15) 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10" style={{ maxWidth: "1200px" }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--mono)",
            fontSize: "10px",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(241,245,249,0.15)",
            marginBottom: "clamp(40px, 6vw, 72px)",
          }}
        >
          Orvantia AI
        </motion.div>

        {/* Manifesto lines */}
        <div style={{ marginBottom: "clamp(48px, 8vw, 88px)" }}>
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 56 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: line.size,
                fontFamily: "var(--font)",
                fontWeight: 700,
                lineHeight: 0.96,
                letterSpacing: "-0.03em",
                marginBottom: "0.08em",
                ...(line.gradient
                  ? {
                      background:
                        "linear-gradient(135deg, #f1f5f9 0%, rgba(129,140,248,0.95) 45%, rgba(99,102,241,0.85) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
                  : line.style),
              }}
            >
              {line.text}
            </motion.p>
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14 }}
        >
          <motion.button
            className="btn-primary"
            data-cursor-hover
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal("schedule")}
          >
            Schedule a Consultation
          </motion.button>
          <motion.button
            className="btn-secondary"
            data-cursor-hover
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal("discuss")}
          >
            Discuss Your Use Case
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
