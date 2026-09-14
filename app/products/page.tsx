"use client";

import Nav from "../components/navigation/Nav";
import Footer from "../components/ui/Footer";
import CustomCursor from "../components/ui/CustomCursor";
import SmoothScroll from "../components/providers/SmoothScroll";
import ProductsSection from "../components/sections/ProductsSection";

export default function ProductsPage() {
  return (
    <>
      <div className="grain" />
      <CustomCursor />

      <SmoothScroll>
        <Nav show />

        <main style={{ paddingTop: 64 }}>
          <ProductsSection />
        </main>

        <Footer />
      </SmoothScroll>
    </>
  );
}
