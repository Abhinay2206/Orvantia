import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Orvantia",
  description:
    "Orvantia's own products: NutritionOS, a free fitness and nutrition tracker built for Indian meals, and EnteraFlux, a research initiative.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
