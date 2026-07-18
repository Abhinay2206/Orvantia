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
import ProductsSection from "./components/sections/ProductsSection";
import ProcessSection from "./components/sections/ProcessSection";
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

  useEffect(() => {
    document.body.style.overflow = booted ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [booted]);

  const onBooted = () => {
    setBooted(true);
    setTimeout(() => setNavVisible(true), 300);
  };

  return (
    <>
      <BootSequence onComplete={onBooted} />

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

              {/* 05 · Products – Continuum OS + EnteraFlux */}
              <ProductsSection />

              {/* 06 · Development process */}
              <ProcessSection />

              {/* 07 · Contact – globe + project form */}
              <ContactSection />
            </main>

            <Footer />
          </SmoothScroll>
        </>
      )}
    </>
  );
}
