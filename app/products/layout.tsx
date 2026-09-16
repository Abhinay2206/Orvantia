import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Orvantia",
  description:
    "Beyond client work, Orvantia invests in EnteraFlux - a frontier AI research initiative.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
