import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FactoryFlow case study — Orvantia",
  description:
    "How Orvantia replaced a manufacturer's diary-and-WhatsApp workflow with FactoryFlow: one system of record, automated follow-ups, and live reporting for Prayagh Consumer Care.",
};

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
