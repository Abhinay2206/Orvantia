"use client";

import { useState, useEffect } from "react";
import BootSequence from "./components/loader/BootSequence";
import Nav from "./components/navigation/Nav";
import CustomCursor from "./components/ui/CustomCursor";
import Footer from "./components/ui/Footer";
import ScrollProgress from "./components/ui/ScrollProgress";
import SmoothScroll from "./components/providers/SmoothScroll";
import HeroScene from "./components/hero/HeroScene";
import ManifestoSection from "./components/sections/ManifestoSection";
import BrandFilmSection from "./components/sections/BrandFilmSection";
import AboutSection from "./components/sections/AboutSection";
import ServicesSection from "./components/sections/ServicesSection";
import CaseStudySection from "./components/sections/CaseStudySection";
import ProductsGallery from "./components/sections/ProductsGallery";
import ProcessSection from "./components/sections/ProcessSection";
import TeamSection from "./components/sections/TeamSection";
import FaqSection from "./components/sections/FaqSection";
import ContactSection from "./components/sections/ContactSection";

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
    // Sections render behind the intro overlay; this tells them it has lifted.
    (window as { __orvBooted?: boolean }).__orvBooted = true;
    window.dispatchEvent(new Event("orv:booted"));
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
          </>
        )}
        <>
          <SmoothScroll paused={!booted}>
            <Nav show={navVisible} />
            <ScrollProgress />

            <main>
              {/* Hero – full-viewport WebGL contour field */}
              <HeroScene />

              {/* Statement – scroll-lit */}
              <ManifestoSection />

              {/* Reel */}
              <BrandFilmSection />

              {/* 01 · What we fix */}
              <AboutSection />

              {/* 02 · FactoryFlow – proof */}
              <CaseStudySection />

              {/* 03 · What we build */}
              <ServicesSection />

              {/* 04 · Products & experiments – pinned horizontal gallery */}
              <ProductsGallery />

              {/* 05 · Process */}
              <ProcessSection />

              {/* 06 · Team */}
              <TeamSection />

              {/* 07 · FAQ */}
              <FaqSection />

              {/* 08 · Contact */}
              <ContactSection />
            </main>

            <Footer />
          </SmoothScroll>
        </>
      </div>
    </>
  );
}
