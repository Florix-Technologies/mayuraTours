"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { MapPin } from "lucide-react";
import type { HighlightPhoto } from "@/lib/data/highlight-images";
import { isImageSource, needsUnoptimizedImage } from "@/lib/data/package-visuals";
import styles from "./package-experience.module.css";

/** Each failure advances through the same relevance-ordered chain, including correct alt text. */
export default function HighlightImage({ candidates, fallback }: { candidates: HighlightPhoto[]; fallback?: ReactNode }) {
  const [failed, setFailed] = useState<string[]>([]);
  const photo = candidates.find(candidate => isImageSource(candidate.src) && !failed.includes(candidate.src));
  if (!photo) return fallback ?? <div className={styles.imageFallback} role="img" aria-label="Travel image unavailable"><MapPin size={28} aria-hidden="true" /></div>;
  return <Image key={photo.src} src={photo.src} alt={photo.alt} fill unoptimized={needsUnoptimizedImage(photo.src)}
    sizes="(max-width: 639px) 230px, 220px" className={styles.photo}
    onError={() => setFailed(previous => [...previous, photo.src])} />;
}
