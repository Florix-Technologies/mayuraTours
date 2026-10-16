"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { packageBackgrounds, universalTravelArtwork } from "@/lib/data/package-backgrounds";
import styles from "./package-experience.module.css";

function JournalArtwork({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return <Image src={failed ? universalTravelArtwork : src} alt="" fill unoptimized sizes="360px" onError={() => setFailed(true)} />;
}

export default function DestinationBackdrop({ slug, image }: { slug: string; image?: string }) {
  const destinationArt = image || packageBackgrounds[slug] || universalTravelArtwork;
  return <div aria-hidden="true" className={styles.travelBackdrop}>
    <Reveal className={`${styles.journalMotif} ${styles.journalOpening}`}><JournalArtwork key={destinationArt} src={destinationArt} /></Reveal>
    <Reveal className={`${styles.journalMotif} ${styles.journalRoute}`}><svg viewBox="0 0 400 360" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path className={styles.journalDottedPath} d="M25 330C260 350 65 70 228 88S335 240 375 25" pathLength="100" strokeDasharray="2 5"/><path d="m273 58 68-27-22 64-12-28-34-9 68-27-34 36" strokeLinejoin="round"/><circle cx="25" cy="330" r="5"/></svg></Reveal>
    <Reveal className={`${styles.journalMotif} ${styles.journalClosing}`}><svg viewBox="0 0 400 360" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><circle cx="190" cy="175" r="96"/><circle cx="190" cy="175" r="85" strokeDasharray="1 9"/><path d="M190 62v30m0 166v30M77 175h30m166 0h30m-113-70 23 93-23-13-23 13 23-93Z"/><path d="m110 255 160-160M110 95l160 160" opacity=".4"/></svg></Reveal>
  </div>;
}
