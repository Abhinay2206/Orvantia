import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ModalProvider from "./components/providers/ModalProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orvantia AI",
  description:
    "Orvantia AI builds autonomous AI operating systems — Continuum, Enteraflux, ClinicalAgents. Intelligence that thinks, acts, and delivers.",
  keywords: ["AI OS", "autonomous agents", "enterprise AI", "agentic AI", "healthcare AI"],
  openGraph: {
    title: "Orvantia AI",
    description: "Building Autonomous Intelligence.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
