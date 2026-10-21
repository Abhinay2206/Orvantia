"use client";

import { useRef, useState } from "react";
import { Reveal, Aperture } from "./_shared";
import { SITE_URL as SITE } from "@/lib/site";
const QUOTE = "Saving around 4 hours of my daily time.";

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewBody: QUOTE,
    author: { "@type": "Person", name: "BMR", jobTitle: "Senior Vice President", worksFor: { "@type": "Organization", name: "Prayagh Consumer Care Pvt. Ltd." } },
    itemReviewed: { "@type": "Service", name: "FactoryFlow", provider: { "@type": "Organization", name: "Orvantia" } },
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Prayagh Consumer Care on FactoryFlow, built by Orvantia",
    description: `Client story: BMR, Senior Vice President at Prayagh Consumer Care, on FactoryFlow - "${QUOTE}"`,
    thumbnailUrl: `${SITE}/case-study/prayagh-testimonial-poster.jpg`,
    contentUrl: `${SITE}/case-study/prayagh-testimonial.mp4`,
    uploadDate: "2026-10-12",
    duration: "PT55S",
  },
];

/* Client testimonial: vertical video on the left, the quote as real page text on the right. */
export default function Testimonial() {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    v.muted = false;
    v.currentTime = 0;
    void v.play();
  };

  return (
    <figure className="tm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Aperture>
        <div className="tm-video" data-cursor-text={started ? undefined : "Play"} onClick={started ? undefined : play}>
          <video
            ref={ref}
            src="/case-study/prayagh-testimonial.mp4"
            poster="/case-study/prayagh-testimonial-poster.jpg"
            preload="none"
            playsInline
            controls={started}
            aria-label="Video testimonial from BMR, Senior Vice President at Prayagh Consumer Care"
            onEnded={() => setStarted(false)}
          />
          {!started && (
            <button type="button" className="reel-play tm-play" data-cursor-hover onClick={(e) => { e.stopPropagation(); play(); }} aria-label="Play the client testimonial with sound">
              <span aria-hidden>▶</span> Play with sound
            </button>
          )}
        </div>
      </Aperture>
      <Reveal delay={0.1}>
        <div className="tm-body">
          <div className="tm-eyebrow">Client story · Prayagh Consumer Care</div>
          <blockquote className="tm-quote serif-display">
            <p>&ldquo;Saving around <span className="accent-serif">4 hours</span> of my daily time.&rdquo;</p>
          </blockquote>
          <figcaption className="tm-cite">
            <strong>BMR</strong>
            <span>Senior Vice President, Prayagh Consumer Care</span>
            <span>on FactoryFlow, built by Orvantia</span>
          </figcaption>
        </div>
      </Reveal>
    </figure>
  );
}
