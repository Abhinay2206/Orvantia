"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/app/components/providers/ModalProvider";

const LINKS = [
  { label: "Products", href: "#products" },
  { label: "Continuum", href: "#continuum" },
  { label: "Enteraflux", href: "#enteraflux" },
  { label: "ClinicalAgents", href: "#clinical" },
  { label: "Ecosystem", href: "#ecosystem" },
];

export default function Nav({ show }: { show: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          className="fixed top-0 inset-x-0 z-[100]"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 transition-all duration-400"
            style={{
              background: scrolled ? "rgba(4,4,10,0.7)" : "transparent",
              backdropFilter: scrolled ? "blur(20px)" : "none",
              borderBottom: scrolled
                ? "1px solid rgba(255,255,255,0.05)"
                : "1px solid transparent",
            }}
          />

          <div className="relative flex items-center justify-between px-6 md:px-10 h-16">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2.5 group"
              data-cursor-hover
            >
              {/* Mark */}
              <div className="relative w-6 h-6">
                <img src="/logo.png" alt="Orvantia Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>

              <span
                className="font-semibold tracking-[0.12em] uppercase text-sm"
                style={{ fontFamily: "var(--font)", color: "rgba(241,245,249,0.9)" }}
              >
                Orvantia
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {LINKS.map((l) => (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  data-cursor-hover
                  className="transition-colors text-xs tracking-[0.12em] uppercase"
                  style={{
                    fontFamily: "var(--mono)",
                    color: "rgba(241,245,249,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "rgba(241,245,249,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "rgba(241,245,249,0.35)";
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                className="btn-secondary"
                style={{ padding: "9px 20px" }}
                data-cursor-hover
                onClick={() => openModal("book-demo")}
              >
                Book Demo
              </button>
              <button
                className="btn-primary"
                style={{ padding: "9px 20px" }}
                data-cursor-hover
                onClick={() => openModal("schedule")}
              >
                Partner with Us
              </button>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setOpen(!open)}
              data-cursor-hover
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-px rounded-full bg-white/50"
                  style={{ width: i === 1 ? 16 : 22 }}
                  animate={open ? {
                    rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                    y: i === 0 ? 6 : i === 2 ? -6 : 0,
                    opacity: i === 1 ? 0 : 1,
                    width: 22,
                  } : {}}
                  transition={{ duration: 0.25 }}
                />
              ))}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                className="md:hidden px-6 py-5 space-y-1"
                style={{
                  background: "rgba(4,4,10,0.95)",
                  backdropFilter: "blur(30px)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {LINKS.map((l, i) => (
                  <motion.button
                    key={l.href}
                    onClick={() => go(l.href)}
                    className="block w-full text-left py-3 text-xs tracking-[0.15em] uppercase transition-colors"
                    style={{ fontFamily: "var(--mono)", color: "rgba(241,245,249,0.4)" }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ color: "rgba(241,245,249,0.85)", x: 4 }}
                  >
                    {l.label}
                  </motion.button>
                ))}
                <div className="pt-3 flex gap-3">
                  <button className="btn-secondary flex-1" style={{ padding: "10px 0" }} onClick={() => { setOpen(false); openModal("book-demo"); }}>Book Demo</button>
                  <button className="btn-primary flex-1" style={{ padding: "10px 0" }} onClick={() => { setOpen(false); openModal("schedule"); }}>Partner with Us</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
