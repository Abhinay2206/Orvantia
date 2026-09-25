"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, ORV_EASE } from "@/lib/motion";
import { useModal } from "@/app/components/providers/ModalProvider";
import { Section, Eyebrow, SplitHeadline, Reveal } from "./_shared";

type Service = { n: string; k: string; d: string; c: string };

const SERVICES: Service[] = [
  { n: "01", k: "Business Automation", d: "Replace diaries, spreadsheets, and WhatsApp follow-ups with systems that run themselves.", c: "#818cf8" },
  { n: "02", k: "Custom Business Software", d: "Tools built around how your team actually works - tasks, inventory, attendance, and more.", c: "#a855f7" },
  { n: "03", k: "SaaS Platforms", d: "Launch your own software product, with logins, roles, and billing handled.", c: "#22d3ee" },
  { n: "04", k: "AI Assistants", d: "Practical AI that sorts, summarises, and answers - only where it saves real time.", c: "#60a5fa" },
  { n: "05", k: "Dashboards & Reports", d: "See sales, tasks, and team performance at a glance, without chasing anyone.", c: "#818cf8" },
  { n: "06", k: "Websites & Web Apps", d: "Fast, modern sites and apps that look great and work on any phone.", c: "#60a5fa" },
  { n: "07", k: "Mobile Apps", d: "Android and iOS apps for your customers or your field team.", c: "#c084fc" },
  { n: "08", k: "3D & Premium Websites", d: "Cinematic, WebGL-driven portfolios and landing pages that feel alive.", c: "#d4ff50" },
  { n: "09", k: "Support & Maintenance", d: "We stay after launch - fixes, updates, and improvements as you grow.", c: "#5fc2ab" },
];

export default function ServicesSection() {
  const { openModal } = useModal();
  const listRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const moveX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const moveY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const [active, setActive] = useState<Service | null>(null);

  /* Rows draw their rule and rise in as they enter - one batched listener. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ctx = gsap.context(() => {
      gsap.set(".svc-line", { scaleX: 0 });
      gsap.set(".svc-inner", { yPercent: 60, opacity: 0 });
      ScrollTrigger.batch(".svc-row", {
        start: "top 90%",
        once: true,
        onEnter: (rows) => {
          gsap.to(rows.map((r) => r.querySelector(".svc-line")), { scaleX: 1, duration: 1.1, ease: ORV_EASE, stagger: 0.07 });
          gsap.to(rows.map((r) => r.querySelector(".svc-inner")), { yPercent: 0, opacity: 1, duration: 1, ease: ORV_EASE, stagger: 0.07, delay: 0.1 });
        },
      });
    }, list);
    return () => ctx.revert();
  }, []);

  /* Floating "Start" badge that chases the cursor across the list. */
  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;
    gsap.set(badge, { xPercent: -50, yPercent: -50, scale: 0 });
    moveX.current = gsap.quickTo(badge, "x", { duration: 0.55, ease: "power3" });
    moveY.current = gsap.quickTo(badge, "y", { duration: 0.55, ease: "power3" });
  }, []);

  useEffect(() => {
    if (!badgeRef.current) return;
    gsap.to(badgeRef.current, { scale: active ? 1 : 0, duration: 0.45, ease: ORV_EASE, overwrite: "auto" });
  }, [active]);

  const onMove = (e: React.MouseEvent) => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    moveX.current?.(e.clientX - r.left);
    moveY.current?.(e.clientY - r.top);
  };

  return (
    <Section
      id="services"
      style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      glow="radial-gradient(ellipse 50% 40% at 85% 10%, rgba(168,85,247,0.08), transparent 60%)"
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginBottom: "clamp(44px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 760 }}>
          <Reveal>
            <Eyebrow num="03" label="What We Build" color="rgba(168,85,247,0.75)" />
          </Reveal>
          <SplitHeadline
            text="One team for *everything your business needs."
            style={{ marginTop: 24, fontSize: "clamp(30px, 4.4vw, 60px)" }}
          />
        </div>
        <Reveal delay={0.2}>
          <p style={{ maxWidth: "34ch", fontSize: 15, lineHeight: 1.7, color: "var(--text-2)" }}>
            From the first conversation to live software your team uses every day -
            and still here after launch.
          </p>
        </Reveal>
      </div>

      <div
        ref={listRef}
        className="svc-list"
        onMouseMove={onMove}
        onMouseLeave={() => setActive(null)}
        style={{ position: "relative" }}
      >
        {SERVICES.map((s) => (
          <button
            key={s.k}
            type="button"
            className="svc-row"
            data-cursor-hover
            onMouseEnter={() => setActive(s)}
            onClick={() => openModal("schedule")}
            style={{ "--svc": s.c } as React.CSSProperties}
          >
            <span className="svc-line" aria-hidden />
            <span className="svc-inner">
              <span className="svc-num">{s.n}</span>
              <span className="svc-title">{s.k}</span>
              <span className="svc-desc">{s.d}</span>
              <span className="svc-go" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H5M13 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </button>
        ))}
        <span className="svc-rule-end" aria-hidden />

        {/* Cursor-chasing badge (pointer devices only) */}
        <div
          ref={badgeRef}
          className="svc-badge"
          aria-hidden
          style={{ background: active?.c ?? "#818cf8" }}
        >
          Start a project
        </div>
      </div>
    </Section>
  );
}
