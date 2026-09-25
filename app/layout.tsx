import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
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

// Editorial serif - used in italic for the accent word in headlines.
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orvantia | Software & Automation for Growing Businesses",
  description:
    "Orvantia helps small and growing businesses replace diaries, spreadsheets, and WhatsApp follow-ups with automation, SaaS, and custom software their teams actually use.",
  keywords: [
    "business automation",
    "custom software for small business",
    "SaaS development",
    "workflow automation",
    "software studio India",
    "web and mobile apps",
  ],
  openGraph: {
    title: "Orvantia | Software & Automation for Growing Businesses",
    description:
      "We replace manual work with automation, SaaS, and custom software - built for growing businesses.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <body>
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
