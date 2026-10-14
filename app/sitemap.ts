import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PAGES: [string, number][] = [
  ["/", 1],
  ["/case-study", 0.9],
  ["/products/nutritionos", 0.8],
  ["/products/contextbridge", 0.8],
  ["/products/enteraflux", 0.8],
  ["/privacy", 0.2],
  ["/terms", 0.2],
  ["/cookies", 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => ({ url: `${SITE_URL}${path}`, lastModified: new Date(), priority }));
}
