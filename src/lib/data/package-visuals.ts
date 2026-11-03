import { resolveArtwork, validArtworkSource } from "./state-artwork";
import type { TourPackage } from "./packages";
import { mysoreScenes } from "./destination-artwork";
import { packageBackgrounds, universalTravelArtwork } from "./package-backgrounds";

export type VisualImage = { src: string; alt: string };
export type PackageVisuals = {
  hero?: VisualImage;
  avatar?: VisualImage;
  backgroundImage?: string;
  label?: string;
};

/** Destination presentation only: never inherit itinerary, prices or booking facts. */
export const destinationVisuals = {
  goa: { name: "Goa", label: "By the Arabian Sea", illustrations: [1, 2, 3].map(index => ({ src: `/images/destinations/goa-illustration-${index}.png`, alt: `Goa coastal travel illustration ${index}` })), video: { src: "/video/goa-beach-aerial.mp4", poster: "/video/posters/beaches.jpg", title: "Goa coastal film", label: "Goa coastal destination film" } },
  "ooty-coonoor": { name: "Ooty & Coonoor", label: "Into the Nilgiris" },
  "mysore-srirangapatna": { name: "Mysore & Srirangapatna", label: "A journey through heritage", palace: mysoreScenes.palace, feature: { ...mysoreScenes.market, label: "Heritage in the everyday", title: "A different perspective on Mysore." } },
  coorg: { name: "Coorg", label: "In coffee country" },
  "kerala-munnar": { name: "Kerala & Munnar", label: "Backwaters to tea hills" },
  chikmagalur: { name: "Chikmagalur", label: "Above the coffee estates" },
} satisfies Record<string, { name: string; label: string; illustrations?: VisualImage[]; video?: { src: string; poster: string; title: string; label: string }; palace?: VisualImage; feature?: VisualImage & { label: string; title: string } }>;

type DestinationVisual = { name: string; label: string; illustrations?: VisualImage[]; video?: { src: string; poster: string; title: string; label: string }; palace?: VisualImage; feature?: VisualImage & { label: string; title: string } };
const aliases: Record<string, string> = { ooty: "ooty-coonoor", mysore: "mysore-srirangapatna", kerala: "kerala-munnar" };

export function resolvePackageVisuals(pkg: TourPackage) {
  const requested = (pkg.destinationKey ?? pkg.destination ?? pkg.slug).trim().toLowerCase();
  const key = aliases[requested] ?? requested;
  const preset = (destinationVisuals as Record<string, DestinationVisual>)[key];
  const cover = pkg.coverImage && isImageSource(pkg.coverImage.src) ? pkg.coverImage
    : { src: isImageSource(pkg.image) ? pkg.image : universalTravelArtwork, alt: pkg.imageAlt || pkg.name };
  const hero = [pkg.heroImage, pkg.visuals?.hero, cover].find(image => image && isImageSource(image.src))!;
  return {
    ...preset,
    key,
    name: pkg.destination || preset?.name || pkg.name,
    label: pkg.visuals?.label || preset?.label || "Discover your destination",
    hero,
    avatar: resolveArtwork(pkg, key),
    backgroundImage: pkg.visuals?.backgroundImage || pkg.backgroundImage || (preset ? packageBackgrounds[key] : undefined) || universalTravelArtwork,
  };
}

/** Permit uploaded public/CDN images without allowing arbitrary URL protocols. */
export function isImageSource(src: string | undefined): src is string {
  return validArtworkSource(src);
}

export function needsUnoptimizedImage(src: string) {
  return !src.startsWith("/") && isImageSource(src) && new URL(src).hostname !== "images.unsplash.com";
}
