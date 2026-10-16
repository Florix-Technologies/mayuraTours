import type { TourPackage } from "./packages";

export type HighlightPhoto = { src: string; alt: string; tags?: string[] };

/** Existing assets only. Generic scenery is described by subject, never as a verified landmark. */
export const highlightPhotos = {
  coast: { src: "/video/posters/beaches.jpg", alt: "Aerial photograph of a sandy coastline and blue sea", tags: ["coast", "beach", "sea"] },
  goaHeritage: { src: "/images/destinations/goa-illustration-2.png", alt: "Illustrated Goa heritage street with colourful architecture and a church", tags: ["heritage", "church", "architecture"] },
  coastalSunset: { src: "/images/destinations/goa-illustration-3.png", alt: "Illustrated palm-lined beach and fishing boat at sunset", tags: ["sunset", "evening", "coast"] },
  estates: { src: "/video/posters/western-ghats.jpg", alt: "Cultivated green slopes and forested hills in the Western Ghats", tags: ["plantation", "estate", "coffee", "tea", "forest"] },
  hills: { src: "/video/posters/hills.jpg", alt: "Green mountain ridges and an open valley beneath blue sky", tags: ["mountain", "peak", "viewpoint", "hills", "trek"] },
  waterfall: { src: "/video/posters/adventure.jpg", alt: "A woodland waterfall beside a walking platform", tags: ["waterfall", "falls", "walk", "nature"] },
  mysorePalace: { src: "/images/destinations/mysore-illustration-1.png", alt: "Illustrated Mysore palace architecture with gardens at sunset", tags: ["palace", "royal", "heritage"] },
  mysoreHills: { src: "/images/destinations/mysore-illustration-3.png", alt: "Illustrated Mysore hilltop temple with a stairway and Nandi sculpture", tags: ["hill", "temple", "shrine", "garden"] },
} satisfies Record<string, HighlightPhoto>;

export const packageHighlightGalleries: Record<string, HighlightPhoto[]> = {
  goa: [highlightPhotos.coast, highlightPhotos.goaHeritage, highlightPhotos.coastalSunset],
  "ooty-coonoor": [highlightPhotos.estates, highlightPhotos.hills],
  "mysore-srirangapatna": [highlightPhotos.mysorePalace, highlightPhotos.mysoreHills],
  coorg: [highlightPhotos.estates, highlightPhotos.waterfall, highlightPhotos.hills],
  "kerala-munnar": [highlightPhotos.estates, highlightPhotos.hills],
  chikmagalur: [highlightPhotos.hills, highlightPhotos.estates],
};

const subjects = [
  /beach|coast|sea\b|shore|ocean/i,
  /\b(?:heritage|cultur|church|palace|royal|monument|architect|fort|histor|basilica|temple|shrine)/i,
  /food|cuisine|dining|meal|restaurant/i,
  /adventure|activit|trek|hike|walking|walk|jeep|sport/i,
  /mountain|hill|peak|viewpoint|valley|view/i,
  /\b(?:plantation|estate|coffee|tea\b|cultivat)/i,
  /waterfall|falls/i,
  /night|evening|sunset|cafe/i,
  /backwater|houseboat|boating|cruise|waterfront/i,
  /forest|wildlife|nature|sanctuary/i,
  /railway|train/i,
];

/** Exact image > relevant package gallery > cover > local default, including load errors. */
export function getHighlightImages(pkg: TourPackage, item: NonNullable<TourPackage["highlights"]>[number]): HighlightPhoto[] {
  const title = typeof item === "string" ? item : item.title || item.name || "";
  const description = typeof item === "string" ? "" : item.description || "";
  const gallery = (pkg.gallery || []).map((photo, index) => {
    const context = `${photo.alt} ${(photo.tags || []).join(" ")}`;
    const score = subjects.reduce((total, topic) => total + (topic.test(context) ? (topic.test(title) ? 3 : 0) + (topic.test(description) ? 1 : 0) : 0), 0);
    return { photo, score, index };
  }).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score || a.index - b.index);
  const explicit = typeof item !== "string" && item.image?.trim() ? [{ src: item.image, alt: item.imageAlt || title }] : [];
  const candidates: HighlightPhoto[] = [
    ...explicit,
    ...gallery.map(entry => entry.photo),
    { src: pkg.image, alt: pkg.imageAlt || pkg.name },
    { src: "/video/posters/western-ghats.jpg", alt: "Green hills and forested travel landscape" },
  ];
  const seen = new Set<string>();
  return candidates.filter(photo => {
    if (!photo.src?.trim() || seen.has(photo.src)) return false;
    seen.add(photo.src);
    return true;
  });
}
