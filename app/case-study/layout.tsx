import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "FactoryFlow case study — Orvantia" },
  alternates: { canonical: "/case-study" },
  openGraph: { url: "/case-study", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  description:
    "How FactoryFlow replaced a manufacturer's diary and WhatsApp workflow with one system of record, automated follow-ups and live reports.",
};

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
