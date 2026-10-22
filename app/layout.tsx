import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ModalProvider from "./components/providers/ModalProvider";
import PageCurtain from "./components/ui/PageCurtain";
import { SITE_URL, SITE_NAME, SITE_DESC } from "@/lib/site";

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

const TITLE = "Orvantia | Software & Automation for Growing Businesses";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Orvantia" },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: [
    "business automation",
    "custom software for small business",
    "SaaS development",
    "workflow automation",
    "software studio India",
    "software company Hyderabad",
    "web and mobile apps",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: TITLE,
    description: "We replace manual work with automation, SaaS, and custom software - built for growing businesses.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Orvantia - software that runs itself" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "We replace manual work with automation, SaaS, and custom software - built for growing businesses.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = { themeColor: "#04040a", colorScheme: "dark" };

const ORG_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#org`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESC,
    address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/og.png`,
    description: SITE_DESC,
    areaServed: "Worldwide",
    address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
    knowsAbout: ["Business automation", "SaaS development", "Custom software", "Workflow automation"],
  },
  { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, publisher: { "@id": `${SITE_URL}/#org` }, inLanguage: "en" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <body>
        {/* Arriving through the page transition: start covered by its tiles. Runs while the body is
            parsed, so before the first paint. It sits in <body>, not <head>: browser extensions inject
            their own scripts into <head>, which would make React report a hydration mismatch. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("orv-nav"))document.documentElement.classList.add("orv-curtain")}catch(e){}` }} />
        <a href="#main" className="skip-link">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }} />
        <ModalProvider>{children}</ModalProvider>
        <PageCurtain />
      </body>
    </html>
  );
}
