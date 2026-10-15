# Package detail destination line art

These illustrations are decorative artistic impressions, not precise architectural drawings. All destination assets are included.

Goa now uses `goa-coastal-engraving.png`, generated with the built-in image generation tool to match the attached reference's vintage engraving and watercolor treatment. It has a transparent background, coastal architectural vignettes, palms, a compass and a dotted route, with no text or UI. CSS controls its low opacity, soft edge masks, mobile cropping, and two non-tiled placements. `goa.svg` is the original unused simplified asset. Other destinations remain unchanged.

The complete generation prompt is recorded in `goa-coastal-engraving.prompt.txt`.

The lower scroll-visible composition is separate from this upper artwork. `DestinationBackdrop.tsx` combines the handwritten destination name, a new `goa-lower-coast.png` engraving (built-in image generation; prompt in `goa-lower-coast.prompt.txt`), and the original vector `goa-travel-motif.svg` containing a postage motif, palms, compass and one dotted route. Each is positioned once with no tiling. The lower artwork uses page-wide edge placement and independent opacity/fade masks; the center remains clear. The upper composition is not duplicated.

- `goa.svg`: palms, coastal waves, fort and Portuguese-inspired facade.
- `mysore-srirangapatna.svg`: palace-inspired domes and heritage arches.
- `ooty-coonoor.svg`: Nilgiri hills, plantation contours and railway.
- `coorg.svg`: coffee foliage, hills and waterfall.
- `kerala-munnar.svg`: houseboat, coconut palm and tea hills.
- `chikmagalur.svg`: coffee foliage, mist lines, mountains and forest.

Replace these exact files to upgrade the artwork. Preserve transparent backgrounds, the 480 x 360 viewBox, muted blue strokes, and absence of text/UI. Slug selection lives in package-experience.module.css. Missing artwork or unknown slugs gracefully leave the warm ivory surface visible; no unrelated image is substituted. Art is limited to faded edges below the cinematic hero.
