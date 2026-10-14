// ponytail: guess at the live domain - set NEXT_PUBLIC_SITE_URL in Vercel if different
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://orvantia.in").replace(/\/$/, "");
export const SITE_NAME = "Orvantia";
export const SITE_DESC =
  "Orvantia helps small and growing businesses replace diaries, spreadsheets, and WhatsApp follow-ups with automation, SaaS, and custom software their teams actually use.";
