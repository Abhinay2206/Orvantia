import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "ContextBridge — resume safety gate for AI coding sessions | Orvantia" },
  alternates: { canonical: "/products/contextbridge" },
  openGraph: { url: "/products/contextbridge", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  description:
    "ContextBridge checkpoints the real state of a repo, records the tests you ran, and tells the next AI coding session whether it's safe to edit. Free, MIT-licensed, local-first. Sponsored by Orvantia.",
};

const LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ContextBridge",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description: "Resume safety gate for AI coding sessions: checkpoints repo state and tells the next session whether it is safe to edit.",
  url: `${SITE_URL}/products/contextbridge`,
  author: { "@type": "Organization", name: "Orvantia", url: SITE_URL },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function ContextBridgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      {children}
    </>
  );
}
