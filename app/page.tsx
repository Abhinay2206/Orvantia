"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BootSequence from "./components/loader/BootSequence";
import Nav from "./components/navigation/Nav";
import CustomCursor from "./components/ui/CustomCursor";
import Marquee from "./components/ui/Marquee";
import Footer from "./components/ui/Footer";
import ScrollProgress from "./components/ui/ScrollProgress";
import SmoothScroll from "./components/providers/SmoothScroll";
import AboutSection from "./components/sections/AboutSection";
import ServicesSection from "./components/sections/ServicesSection";
import CaseStudySection from "./components/sections/CaseStudySection";
import NextProjectSection from "./components/sections/NextProjectSection";
import ProcessSection from "./components/sections/ProcessSection";
import TeamSection from "./components/sections/TeamSection";
import ContactSection from "./components/sections/ContactSection";

const HeroScene = dynamic(() => import("./components/hero/HeroScene"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-20 h-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          boxShadow: "0 0 40px rgba(99,102,241,0.2)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  ),
});

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [skipBoot, setSkipBoot] = useState(false);

  useEffect(() => {
    document.body.style.overflow = booted ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [booted]);

  // Arriving from another page with a target section (e.g. "/#contact") –
  // skip the intro and land directly on that section instead of the top.
  useEffect(() => {
    if (window.location.hash) setSkipBoot(true);
  }, []);

  useEffect(() => {
    if (!booted) return;
    const hash = window.location.hash;
    if (!hash) return;

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    let fallbackTimer: ReturnType<typeof setTimeout>;
    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        // Guarantee the landing even if the smooth animation is throttled
        // (background tab, reduced motion, etc.) - snap into place if it
        // hasn't visibly progressed shortly after.
        fallbackTimer = setTimeout(() => {
          const stillNear = window.scrollY < 40;
          const target = el.getBoundingClientRect().top + window.scrollY;
          if (stillNear && target > 200) {
            window.scrollTo({ top: target, behavior: "auto" });
          }
        }, 700);
        return;
      }
      attempts++;
      if (attempts < 20) timer = setTimeout(tryScroll, 100);
    };
    timer = setTimeout(tryScroll, 150);
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [booted]);

  const onBooted = () => {
    setBooted(true);
    setTimeout(() => setNavVisible(true), 300);
  };

  return (
    <>
      <BootSequence onComplete={onBooted} skip={skipBoot} />

      {/* Stable wrapper: without it React inserts this subtree using the exiting
          BootSequence node as its insertBefore reference, which framer-motion
          removes mid-insert -> NotFoundError that kills the whole React root. */}
      <div>
        {booted && (
        <>
          <div className="grain" />
          <CustomCursor />

          <SmoothScroll>
            <Nav show={navVisible} />
            <ScrollProgress />

            <main>
              {/* 01 · Hero – full viewport Three.js + bloom */}
              <HeroScene />

              {/* Ticker */}
              <Marquee />

              {/* 02 · About – premium software studio */}
              <AboutSection />

              {/* 03 · Services – interactive capability cards */}
              <ServicesSection />

              {/* 04 · FactoryFlow case study */}
              <CaseStudySection />

              {/* 05 · What's next – CCTV attendance (in demo) */}
              <NextProjectSection />

              {/* 06 · Development process */}
              <ProcessSection />

              {/* 07 · Team */}
              <TeamSection />

              {/* 08 · Contact – details, socials + project form */}
              <ContactSection />
            </main>

            <Footer />
          </SmoothScroll>
        </>
        )}
      </div>
    </>
  );
}
