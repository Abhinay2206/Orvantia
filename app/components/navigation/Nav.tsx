"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/app/components/providers/ModalProvider";
import RollText from "../ui/RollText";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Case Study", href: "#case-study" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "/products" },
  { label: "Process", href: "#process" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
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

  // Freeze the page behind the open mobile menu.
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (open) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    // Route links (e.g. /products) navigate; hash links scroll on the home page
    // or jump to the home page's section from any other route.
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    if (window.location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
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
              href="/"
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
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
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
                    e.currentTarget.style.color = "rgba(241,245,249,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(241,245,249,0.35)";
                  }}
                >
                  <RollText>{l.label}</RollText>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="hidden xl:block">
                <button
                  className="btn-secondary"
                  style={{ padding: "9px 20px" }}
                  data-cursor-hover
                  onClick={() => go("#contact")}
                >
                  Let&apos;s Talk
                </button>
              </span>
              <button
                className="btn-primary"
                style={{ padding: "9px 20px" }}
                data-cursor-hover
                onClick={() => openModal("schedule")}
              >
                <RollText>Start Your Project</RollText>
              </button>
            </div>

            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col items-end justify-center gap-1.5"
              style={{ width: 44, height: 44, marginRight: -10, padding: 10 }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
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

          {/* Mobile menu - full-screen sheet with large tap targets */}
          <AnimatePresence>
            {open && (
              <motion.div
                className="lg:hidden mobile-menu"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {LINKS.map((l, i) => (
                    <div key={l.href} style={{ overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <motion.button
                        onClick={() => go(l.href)}
                        className="mobile-menu-link"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 + i * 0.04 }}
                      >
                        <span className="mobile-menu-idx">{String(i + 1).padStart(2, "0")}</span>
                        {l.label}
                        <span aria-hidden style={{ marginLeft: "auto", fontSize: 18, color: "var(--text-3)" }}>
                          {l.href.startsWith("/") ? "↗" : "→"}
                        </span>
                      </motion.button>
                    </div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  style={{ marginTop: "auto", paddingTop: 28 }}
                >
                  <button
                    className="btn-primary"
                    style={{ width: "100%", padding: "16px 0", justifyContent: "center" }}
                    onClick={() => { setOpen(false); openModal("schedule"); }}
                  >
                    Start Your Project
                  </button>
                  <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em" }}>
                    <a href="mailto:abhinaybakkera@orvantia.in" style={{ color: "var(--text-2)", textDecoration: "none" }}>
                      abhinaybakkera@orvantia.in
                    </a>
                    <div style={{ display: "flex", gap: 16 }}>
                      <a href="https://www.instagram.com/orvantia.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-2)", textDecoration: "none" }}>Instagram</a>
                      <a href="https://www.linkedin.com/company/orvantiaai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-2)", textDecoration: "none" }}>LinkedIn</a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
