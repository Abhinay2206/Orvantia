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
  title: "Orvantia — Intelligent Software for Modern Businesses",
  description:
    "Orvantia is a premium software studio building enterprise SaaS platforms, AI-powered applications, custom software, and intelligent automation that help businesses scale faster.",
  keywords: [
    "software studio",
    "enterprise SaaS",
    "AI applications",
    "custom software",
    "intelligent automation",
    "cloud applications",
  ],
  openGraph: {
    title: "Orvantia — Building Intelligent Software for Modern Businesses",
    description:
      "Enterprise SaaS platforms, AI-powered applications, custom software, and intelligent automation.",
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
