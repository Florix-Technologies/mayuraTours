import { destinationArtwork } from "./destination-artwork";
import type { TourPackage } from "./packages";
import { universalTravelArtwork } from "./package-backgrounds";

export type ArtworkImage = { src: string; alt: string };
export type ArtworkSlot = { experienceKey: string; subject: string; status: "approved" | "review" | "missing" | "existing" | "rejected"; image?: ArtworkImage };
/** No public URL is registered until its file exists and is approved. */
export const stateArtwork: Record<string, ArtworkSlot[]> = {
  "karnataka": [{"experienceKey": "heritage", "subject": "Mysore Palace", "status": "approved", "image": {"src": "/images/package-artwork/karnataka/heritage.webp", "alt": "3D Mysore Palace architectural artwork"}}, {"experienceKey": "nature", "subject": "Abbey Falls, Coorg", "status": "approved", "image": {"src": "/images/package-artwork/karnataka/nature.webp", "alt": "3D Abbey Falls waterfall artwork for Coorg"}}, {"experienceKey": "wildlife", "subject": "Kabini elephant", "status": "approved", "image": {"src": "/images/package-artwork/karnataka/wildlife.webp", "alt": "3D Kabini elephant wildlife artwork"}}],
  "kerala": [{"experienceKey": "backwaters", "subject": "Traditional Kerala houseboat", "status": "approved", "image": {"src": "/images/package-artwork/kerala/backwaters.webp", "alt": "3D traditional Kerala houseboat artwork"}}, {"experienceKey": "hills", "subject": "Munnar tea estates", "status": "approved", "image": {"src": "/images/package-artwork/kerala/hills.webp", "alt": "3D Munnar tea estates with curved tea rows and green hills"}}, {"experienceKey": "coastal", "subject": "Kovalam lighthouse", "status": "approved", "image": {"src": "/images/package-artwork/kerala/coastal.webp", "alt": "3D Kovalam lighthouse coastal artwork"}}],
  "tamil-nadu": [{"experienceKey": "heritage", "subject": "Meenakshi Temple gopuram", "status": "approved", "image": {"src": "/images/package-artwork/tamil-nadu/heritage.webp", "alt": "3D Meenakshi Amman Temple sculpted gopuram artwork"}}, {"experienceKey": "hills", "subject": "Nilgiri toy train", "status": "approved", "image": {"src": "/images/package-artwork/tamil-nadu/hills.webp", "alt": "3D Nilgiri toy train artwork"}}, {"experienceKey": "coastal", "subject": "Mahabalipuram Shore Temple", "status": "approved", "image": {"src": "/images/package-artwork/tamil-nadu/coastal.webp", "alt": "3D Mahabalipuram Shore Temple granite complex artwork"}}],
  "andhra-pradesh": [{"experienceKey": "heritage", "subject": "Tirumala Temple", "status": "rejected"}, {"experienceKey": "nature", "subject": "Borra Caves, Araku", "status": "missing"}],
  "telangana": [{"experienceKey": "heritage", "subject": "Charminar, Hyderabad", "status": "missing"}, {"experienceKey": "temples", "subject": "Ramappa Temple", "status": "missing"}],
  "goa": [{"experienceKey": "existing", "subject": "Existing approved Goa artwork", "status": "existing"}],
  "arunachal-pradesh": [{"experienceKey": "heritage", "subject": "Tawang Monastery", "status": "missing"}],
  "assam": [{"experienceKey": "wildlife", "subject": "Kaziranga one-horned rhinoceros", "status": "missing"}],
  "bihar": [{"experienceKey": "heritage", "subject": "Mahabodhi Temple, Bodh Gaya", "status": "missing"}],
  "chhattisgarh": [{"experienceKey": "nature", "subject": "Chitrakote Waterfall", "status": "missing"}],
  "gujarat": [{"experienceKey": "heritage", "subject": "Statue of Unity", "status": "missing"}],
  "haryana": [{"experienceKey": "heritage", "subject": "Pinjore Garden pavilion", "status": "missing"}],
  "himachal-pradesh": [{"experienceKey": "heritage", "subject": "Shimla Christ Church", "status": "missing"}],
  "jharkhand": [{"experienceKey": "nature", "subject": "Hundru Waterfall", "status": "missing"}],
  "madhya-pradesh": [{"experienceKey": "heritage", "subject": "Sanchi Stupa", "status": "missing"}],
  "maharashtra": [{"experienceKey": "heritage", "subject": "Gateway of India", "status": "missing"}],
  "manipur": [{"experienceKey": "nature", "subject": "Loktak Lake floating hut", "status": "missing"}],
  "meghalaya": [{"experienceKey": "nature", "subject": "Living Root Bridge", "status": "missing"}],
  "mizoram": [{"experienceKey": "culture", "subject": "Traditional Mizo bamboo house", "status": "missing"}],
  "nagaland": [{"experienceKey": "culture", "subject": "Traditional Naga morung", "status": "missing"}],
  "odisha": [{"experienceKey": "heritage", "subject": "Konark Sun Temple wheel", "status": "missing"}],
  "punjab": [{"experienceKey": "heritage", "subject": "Golden Temple, Amritsar", "status": "missing"}],
  "rajasthan": [{"experienceKey": "heritage", "subject": "Hawa Mahal", "status": "missing"}],
  "sikkim": [{"experienceKey": "heritage", "subject": "Rumtek Monastery", "status": "missing"}],
  "tripura": [{"experienceKey": "heritage", "subject": "Ujjayanta Palace", "status": "missing"}],
  "uttar-pradesh": [{"experienceKey": "heritage", "subject": "Taj Mahal", "status": "missing"}],
  "uttarakhand": [{"experienceKey": "heritage", "subject": "Kedarnath Temple", "status": "missing"}],
  "west-bengal": [{"experienceKey": "heritage", "subject": "Victoria Memorial, Kolkata", "status": "missing"}],
};

export const packageArtworkDefaults: Record<string, { stateKey: string; experienceKey: string }> = {
  goa: { stateKey: "goa", experienceKey: "existing" },
  "mysore-srirangapatna": { stateKey: "karnataka", experienceKey: "heritage" },
  coorg: { stateKey: "karnataka", experienceKey: "nature" },
  chikmagalur: { stateKey: "karnataka", experienceKey: "nature" },
  "ooty-coonoor": { stateKey: "tamil-nadu", experienceKey: "hills" },
  "kerala-munnar": { stateKey: "kerala", experienceKey: "hills" },
};
const normalize = (value = "") => value.trim().toLowerCase().replace(/[ _&]+/g, "-");
const experiences: Record<string, string> = { mountains: "hills", "mountains-tea-estates": "hills", tea: "hills", beach: "coastal", beaches: "coastal", temples: "temples", coffee: "nature" };

/** Pure selection: stable across SSR/reloads, with no randomness or browser state. */
export function resolveArtwork(pkg: TourPackage, destinationKey: string): ArtworkImage {
  const defaults = packageArtworkDefaults[destinationKey];
  const stateKey = normalize(pkg.stateKey || pkg.state || defaults?.stateKey);
  // Goa always keeps the approved file, including for future packages.
  if (stateKey === "goa" || destinationKey === "goa") return destinationArtwork.goa;
  const override = pkg.artworkOverride ?? pkg.visuals?.avatar ?? pkg.avatar;
  if (override && validArtworkSource(override.src)) return override;
  const requested = normalize(pkg.experienceKey || pkg.travelExperience || defaults?.experienceKey);
  const experienceKey = experiences[requested] || requested;
  const slots = stateArtwork[stateKey] || [];
  const match = slots.find(slot => slot.experienceKey === experienceKey);
  if (match?.status === "approved" && match.image) return match.image;
  const destination = destinationArtwork[destinationKey];
  if (destination) return destination;
  // An unspecified experience may use the state's approved default. A known but
  // unavailable category never silently substitutes an unrelated landmark.
  if (!experienceKey) {
    const approved = slots.find(slot => slot.status === "approved" && slot.image);
    if (approved?.image) return approved.image;
  }
  return { src: universalTravelArtwork, alt: "Travel journal illustration" };
}

export function validArtworkSource(src: string | undefined): src is string {
  if (!src || src.trim() !== src || /[\\\x00-\x20]/.test(src)) return false;
  if (/^\/(?!\/)/.test(src)) return !src.split("/").some(part => part === ".." || part === ".");
  try { return ["https:", "http:"].includes(new URL(src).protocol); } catch { return false; }
}
