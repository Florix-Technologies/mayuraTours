"use client";

import Image from "next/image";
import { useState } from "react";
import { packageBackgrounds, universalTravelArtwork } from "@/lib/data/package-backgrounds";
import styles from "./package-experience.module.css";

/** Scoped to highlights: each motif has a distinct placement and silhouette. */
export default function HighlightsBackdrop({ slug, artwork }: { slug: string; artwork?: string }) {
  const [failed, setFailed] = useState(false);
  const src = artwork || packageBackgrounds[slug] || universalTravelArtwork;
  return <div className={styles.highlightsBackdrop} aria-hidden="true">
    <svg className={styles.highlightRoute} viewBox="0 0 160 520" fill="none" stroke="currentColor" strokeWidth="1.1">
      <path d="M125 5C-90 100 190 200 65 295S-5 425 120 510" pathLength="100" strokeDasharray="1 3" />
      <circle cx="125" cy="5" r="4" /><circle cx="120" cy="510" r="5" />
    </svg>
    <div className={styles.highlightLandscape}><Image key={src} src={failed ? universalTravelArtwork : src} alt="" fill unoptimized sizes="280px" onError={() => setFailed(true)} /></div>
    <svg className={styles.highlightCompass} viewBox="0 0 180 180" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="90" cy="90" r="62" /><circle cx="90" cy="90" r="53" strokeDasharray="1 7" />
      <path d="m90 48 14 55-14-8-14 8 14-55ZM90 15v19m0 112v19M15 90h19m112 0h19" />
    </svg>
  </div>;
}
