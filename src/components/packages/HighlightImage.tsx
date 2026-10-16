"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin } from "lucide-react";
import type { HighlightPhoto } from "@/lib/data/highlight-images";
import styles from "./package-experience.module.css";

/** Each failure advances through the same relevance-ordered chain, including correct alt text. */
export default function HighlightImage({ candidates }: { candidates: HighlightPhoto[] }) {
  const [failed, setFailed] = useState<string[]>([]);
  const photo = candidates.find(candidate => !failed.includes(candidate.src));
  if (!photo) return <div className={styles.imageFallback} role="img" aria-label="Travel image unavailable"><MapPin size={28} aria-hidden="true" /></div>;
  return <Image key={photo.src} src={photo.src} alt={photo.alt} fill
    sizes="(max-width: 639px) 230px, 220px" className={styles.photo}
    onError={() => setFailed(previous => [...previous, photo.src])} />;
}
