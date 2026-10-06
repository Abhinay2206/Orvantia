"use client";

import Nav from "../navigation/Nav";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import SmoothScroll from "../providers/SmoothScroll";

/* Chrome shared by every detail page: grain, cursor, smooth scroll, nav, footer. */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grain" />
      <CustomCursor />
      <SmoothScroll>
        <Nav show />
        <main style={{ paddingTop: 64 }}>{children}</main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
