import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EnteraFlux — AI health companion (research) by Orvantia",
  description:
    "EnteraFlux is Orvantia's research-stage AI health companion: cooperating agents for medication, symptoms, nutrition and progress. Not yet available.",
};

export default function EnterafluxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
