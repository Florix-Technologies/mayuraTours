# Package Details content and destination visuals

The current catalogue is `src/lib/data/packages.ts`. There is no admin panel,
upload endpoint, package API, database or runtime publishing integration in this
repository. Editing this bundled catalogue requires deployment. Runtime admin
publishing and an authenticated admin preview remain dependencies on that missing
content system; this change does not create a second package store or mock admin.

All packages use the same premium Package Details route, sections, responsive CSS,
scroll/hover animations and booking handler. Destination presentation is resolved
in `src/lib/data/package-visuals.ts`, independently of the URL. Existing destination
asset catalogues remain the source of approved artwork. The original Goa cover is
preserved as an explicit visual override on that record; other Goa packages use their own cover.

## Fields for a package editor

Supply the existing `TourPackage` fields: unique `slug`, `name`, `description`,
`badge`, `badgeVariant`, `tags`, displayed `price`, authoritative catalogue
`priceValue` where known, `priceUnit`, cover `image`, `imageAlt` and
`whatsappMessage`. Do not infer a numeric price from the display string.

Publish actual `highlights`, `itinerary` (all days), `included`, `excluded` and
`gallery: [{ src, alt }]` entries. Optional `duration`, `destination`, `tagline`,
`travellerInfo` and `specialities` populate the existing UI. Existing booking
preferences and price calculations are unchanged.

Set optional `destinationKey` to `goa`, `ooty-coonoor`, `mysore-srirangapatna`,
`coorg`, `kerala-munnar` or `chikmagalur` to reuse that destination's artwork.
The aliases `ooty`, `mysore` and `kerala` are accepted. This never inherits
another package's prices, itinerary, inclusions or demonstration content.
An unrecognized destination key automatically receives the shared default design.
No registry edit is needed for an ordinary new destination.

Optional upload URLs can be supplied as:

```ts
visuals: {
  hero: { src: "/uploads/hero.webp", alt: "Destination cover" },
  avatar: { src: "/uploads/avatar.webp", alt: "Destination artwork" },
  backgroundImage: "/uploads/journal.svg",
  label: "Explore somewhere new",
},
highlights: [{ title: "Local experiences", description: "Actual package detail",
  image: "/uploads/highlight.webp", imageAlt: "Local experience", theme: "blue" }],
gallery: [{ src: "/uploads/photo.webp", alt: "Destination photograph" }],
```

Package uploads override destination presets. Existing top-level `avatar`,
`backgroundImage` and `ctaImage` remain supported. Store durable public upload
URLs; this repository does not implement the upload service. Public local paths
and HTTP(S) CDN URLs are accepted. External upload hosts use direct image delivery
without requiring a Next image-host configuration deployment.

## Missing content and assets

A new destination uses its own cover in the hero and introduction. Failed custom
hero/avatar images fall back to that cover, then a neutral image-unavailable panel.
No other destination's photography is substituted. Decorative art falls back to
the destination-neutral travel journal, then disappears if that also fails.
Highlights without uploads retain the existing styled text cards and semantic
vector illustrations; failed uploads return to those illustrations. Missing
itinerary/inclusions/exclusions receive the existing explicit unpublished-content
message. Actual gallery entries are now rendered; the old stock highlight
reference galleries are retained under `highlightGallery`, separate from the
published `gallery`, without adding new imagery to the approved pages.

A future runtime content adapter must supply the same records to package listing,
details and checkout together, with server-side price validation. Switching only
the Details route to remote data would leave the current booking lookup incomplete.
Reuse this renderer and visual resolver for an admin preview once that workflow
exists; do not publish preview/demo records as authoritative booking data.
