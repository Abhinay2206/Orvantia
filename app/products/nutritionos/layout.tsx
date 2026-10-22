import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "NutritionOS — free nutrition & training tracker by Orvantia" },
  alternates: { canonical: "/products/nutritionos" },
  openGraph: { url: "/products/nutritionos", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  description:
    "Free, private nutrition and training tracker with 750+ Indian foods, AI plate recognition, workouts and progress reports. Built by Orvantia.",
};

const LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NutritionOS",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description: "Free nutrition and training tracker with Indian foods, AI plate recognition and progress reports.",
  url: `${SITE_URL}/products/nutritionos`,
  author: { "@type": "Organization", name: "Orvantia", url: SITE_URL },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function NutritionOSLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      {children}
    </>
  );
}
