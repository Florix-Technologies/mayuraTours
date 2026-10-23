"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { universalTravelArtwork } from "@/lib/data/package-backgrounds";
import { isImageSource } from "@/lib/data/package-visuals";
import styles from "./package-experience.module.css";

export function JournalArtwork({ src }: { src: string }) {
  const [failed, setFailed] = useState<string[]>([]);
  const image = [src, universalTravelArtwork].find(candidate => isImageSource(candidate) && !failed.includes(candidate));
  return image ? <Image key={image} src={image} alt="" fill unoptimized sizes="360px" onError={() => setFailed(previous => [...previous, image])} /> : null;
}

export default function DestinationBackdrop({ image = universalTravelArtwork }: { image?: string }) {
  const destinationArt = image;
  return <div aria-hidden="true" className={styles.travelBackdrop}>
    <Reveal className={`${styles.journalMotif} ${styles.journalOpening}`}><JournalArtwork key={destinationArt} src={destinationArt} /></Reveal>
    <Reveal className={`${styles.journalMotif} ${styles.journalRoute}`}><svg viewBox="0 0 400 360" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path className={styles.journalDottedPath} d="M25 330C260 350 65 70 228 88S335 240 375 25" pathLength="100" strokeDasharray="2 5"/><path d="m273 58 68-27-22 64-12-28-34-9 68-27-34 36" strokeLinejoin="round"/><circle cx="25" cy="330" r="5"/></svg></Reveal>
    <Reveal className={`${styles.journalMotif} ${styles.journalClosing}`}><svg viewBox="0 0 400 360" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><circle cx="190" cy="175" r="96"/><circle cx="190" cy="175" r="85" strokeDasharray="1 9"/><path d="M190 62v30m0 166v30M77 175h30m166 0h30m-113-70 23 93-23-13-23 13 23-93Z"/><path d="m110 255 160-160M110 95l160 160" opacity=".4"/></svg></Reveal>
  </div>;
}
