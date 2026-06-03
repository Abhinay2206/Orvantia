"use client";

export default function SectionDivider({ color = "rgba(255,255,255,0.06)" }: { color?: string }) {
  return (
    <div
      className="h-divider mx-6 md:mx-12 lg:mx-20"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
    />
  );
}
