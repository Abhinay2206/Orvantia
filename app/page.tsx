"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BootSequence from "./components/loader/BootSequence";
import Nav from "./components/navigation/Nav";
import CustomCursor from "./components/ui/CustomCursor";
import Marquee from "./components/ui/Marquee";
import Footer from "./components/ui/Footer";
import ManifestoCTA from "./components/ui/ManifestoCTA";
import ManifestoScroll from "./components/sections/ManifestoScroll";
import ProductsShowcase from "./components/sections/ProductsShowcase";
import EcosystemSection from "./components/sections/EcosystemSection";
import SmoothScroll from "./components/providers/SmoothScroll";

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

            <main>
              {/* Hero — full viewport Three.js + bloom */}
              <HeroScene />

              {/* Ticker */}
              <Marquee />

              {/* Cinema manifesto scroll — 500vh pinned */}
              <ManifestoScroll />

              {/* Products horizontal showcase — 350vh pinned */}
              <ProductsShowcase />

              {/* Ecosystem overview */}
              <EcosystemSection />

              {/* Final manifesto CTA */}
              <ManifestoCTA />
            </main>

            <Footer />
          </SmoothScroll>
        </>
      )}
    </>
  );
}
