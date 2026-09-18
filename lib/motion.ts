"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, DrawSVGPlugin);

/**
 * House motion language — the one easing curve for the entire site.
 * Previously this drifted: `_shared.tsx`'s EASE was [0.19,1,0.22,1] while
 * 24+ components hardcoded [0.16,1,0.3,1] and a few more used "expo.out" /
 * "power3.out" directly. This is now the single source of truth for both
 * Framer Motion (`EASE`, a plain bezier array) and GSAP (`ORV_EASE`, a
 * registered CustomEase bound to the identical curve).
 */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const ORV_EASE = "orv";

if (!CustomEase.get(ORV_EASE)) {
  CustomEase.create(ORV_EASE, "0.16, 1, 0.3, 1");
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
