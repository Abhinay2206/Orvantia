import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ModalProvider from "./components/providers/ModalProvider";

// Self-hosted (latin subset) so builds never depend on downloading fonts from
// Google - a failed download there breaks the Vercel build.
const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-Variable.woff2",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-mono",
  weight: "300 500",
  display: "swap",
});

// Editorial serif - used in italic for the accent word in headlines.
const instrumentSerif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
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
