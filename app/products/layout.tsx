import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Orvantia",
  description:
    "Beyond client work, Orvantia builds its own products: Continuum OS, an engineering operating system in active development, and EnteraFlux, frontier AI research.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
