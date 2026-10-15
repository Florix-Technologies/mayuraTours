import { Great_Vibes } from "next/font/google";
import styles from "./package-experience.module.css";

const script = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });
const destinationNames: Record<string, string> = {
  goa: "Goa", "mysore-srirangapatna": "Mysore", "ooty-coonoor": "Ooty",
  coorg: "Coorg", "kerala-munnar": "Kerala", chikmagalur: "Chikmagalur",
};

/** One lower composition, independent of the upper artwork and all content. */
export default function DestinationBackdrop({ slug }: { slug: string }) {
  return <div aria-hidden="true" className={styles.lowerDestinationBackdrop}>
    <span className={`${script.className} ${styles.destinationLettering}`}>{destinationNames[slug]}</span>
    {slug === "goa" && <>
      <span className={styles.lowerCoastalArtwork} />
      <span className={styles.lowerTravelArtwork} />
    </>}
  </div>;
}
