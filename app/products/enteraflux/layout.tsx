import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "EnteraFlux — AI health companion (research) by Orvantia" },
  alternates: { canonical: "/products/enteraflux" },
  openGraph: { url: "/products/enteraflux", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  description:
    "EnteraFlux is Orvantia's research-stage AI health companion: cooperating agents for medication, symptoms, nutrition and progress. Not yet available.",
};

export default function EnterafluxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
