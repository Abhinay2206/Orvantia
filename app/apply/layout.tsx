import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply - Orvantia AI Founding Builders",
  description:
    "Join the Founding Builder Community at Orvantia AI. We're looking for engineers, researchers, and designers to help build the next generation of autonomous AI products.",
  openGraph: {
    title: "Apply to Orvantia AI - Founding Builders",
    description: "Build autonomous AI products. Join Orvantia AI's founding builder community.",
    type: "website",
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ cursor: "auto" }}>
      {children}
    </div>
  );
}
