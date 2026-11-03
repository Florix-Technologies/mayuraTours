# Package artwork maintenance

The runtime registry is `src/lib/data/state-artwork.ts`: 28 states and 36 experience slots. No runtime dependency uses the external development archive.

## Active artwork

Approved files under `public/images/package-artwork/`:

- karnataka/heritage.webp - Mysore Palace (original approved RGB asset; its opaque background remains unchanged).
- karnataka/nature.webp - Abbey Falls; used by Coorg and Chikmagalur.
- karnataka/wildlife.webp - Kabini Elephant; available to future wildlife packages.
- kerala/backwaters.webp - Kerala Houseboat; available to future packages.
- kerala/coastal.webp - Kovalam Lighthouse; available to future packages.
- tamil-nadu/hills.webp - Nilgiri Toy Train; used by Ooty/Coonoor.

Goa keeps `public/images/destinations/goa-new-avatar.png` and the existing AvatarStage interactions. All other public destination assets remain available, including the Munnar artwork and legacy destination fallbacks.

## Pending, rejected and missing

Pending landmark verification: Tamil Nadu Heritage (Meenakshi Temple) and Coastal (Shore Temple). Their sources are archived outside the project, not served publicly.

Rejected: Kerala Hills (generic Munnar house), Andhra Pradesh Heritage (inaccurate Tirumala depiction), earlier generic Coorg/Araku house concepts, and the failed Mysore transparency extraction. Do not activate these assets. Rejected supplied sources are retained in the external archive.

25 slots have not been generated, including Andhra Pradesh Nature (Araku/Borra Caves) and both Telangana variations. The full state/experience list is in the runtime registry; original briefs and manifest are preserved in the external archive.

## Selection and adding approved assets

Selection is deterministic: preserve Goa, apply a valid manual override, use approved state/experience artwork, then existing destination artwork. An unspecified experience may use an approved state default; otherwise the existing universal travel-journal SVG provides a fallback. Missing/review/rejected slots have no public image URLs. Image loading failures retain the existing cover or neutral placeholder behavior.

To add an approved variation:

1. Copy its verified WebP to `public/images/package-artwork/{state}/{experience}.webp` without overwriting approved originals.
2. Update its existing registry slot to `status: "approved"` and add `image: { src, alt }` with the real public path.
3. Verify mappings and run `node --test --test-isolation=none tests/*.test.mjs`, TypeScript and production build.

Package fields include stateKey/state, destinationKey/destination, experienceKey/travelExperience, coverImage, optional heroImage and artworkOverride. Legacy image/visuals fields remain supported. Heroes are independent of artwork. Highlight categories and custom images use the reusable highlight illustration system. See package-details-data.md for the content contract. No admin/upload backend is implemented.

## External development archive

`F:\Florix\mayura website\mayura-development-archive-2026-10-29\mayura-artwork-and-development-materials.zip`

ZIP SHA-256: `e3ed805fe8b019e6c730fbb642d3f15691da8d219009994c62d83af5b0eeeeeb`

The archive contains 18 original project-relative files: the full artwork/package-artwork directory, the unused output/avatar-previews image, and the duplicate legacy/mysore-illustration-1.png. ARCHIVE-INVENTORY.json lists their original paths and SHA-256 hashes. Every member was decoded/read back and hash-verified before local deletion. The review sheet and original manifests are historical; the registry and status summary above describe current approvals.

## Cleanup audit - 2026-10-29

Checked source imports, CSS URLs, runtime registries, package data, tests, configuration, documentation and both legacy HTML reference pages. Template-generated Goa illustration paths were treated as live references; all public files were retained. No ZIP/temp archives were found inside the project outside excluded dependencies/build/Git directories. The user-supplied ZIP on D: was outside this cleanup scope and was not modified.

Removed only archived review/development materials and the byte-identical legacy Mysore image duplicate (the public original remains). Empty artwork/ and output/ directories were removed after their listed files were safely archived. Legacy HTML was intentionally retained as source/design reference; dependency folders, build output, agents/editor configuration, source, tests and existing documentation were preserved.

All public assets and application source are hash-checked against the pre-cleanup inventory. No UI, animation, booking, authentication, pricing, navigation or image quality changes are part of this cleanup.

## Removed local files (all preserved in the verified archive)

- `artwork/package-artwork/activation-report.json`
- `artwork/package-artwork/artwork-master-manifest.csv`
- `artwork/package-artwork/extraction-report.json`
- `artwork/package-artwork/INTEGRATION.md`
- `artwork/package-artwork/mysore-isolation-review/README.md`
- `artwork/package-artwork/mysore-isolation-review/rejected-extraction-candidate.png`
- `artwork/package-artwork/pending-review/tamil-nadu/coastal.webp`
- `artwork/package-artwork/pending-review/tamil-nadu/heritage.webp`
- `artwork/package-artwork/provisional-artwork-review-inventory.json`
- `artwork/package-artwork/provisional-artwork-review-sheet.png`
- `artwork/package-artwork/PROVISIONAL-REVIEW.md`
- `artwork/package-artwork/README.md`
- `artwork/package-artwork/rejected/andhra-pradesh/heritage.webp`
- `artwork/package-artwork/rejected/kerala/hills.webp`
- `artwork/package-artwork/rejected/README.md`
- `artwork/package-artwork/remaining-25-individual-image-briefs.md`
- `legacy/mysore-illustration-1.png`
- `output/avatar-previews/universal-travel-avatar-preview-v1.png`

## Verification results

- 31 tests passed; all existing package artwork mappings and missing/unapproved fallback checks pass.
- TypeScript (`npx tsc --noEmit`) passed.
- Production build passed, generating 18 static routes and the dynamic package route.
- Full lint completed with the same 9 pre-existing errors and 3 warnings in unchanged traveler-details, SiteHeader, SiteFooter, PackagesSection, TrustSection, Select, about, contact and PackageCard files. No lint configuration or unrelated source was changed.
- All 165 protected files (source, public assets, tests, retained legacy references) match their pre-cleanup SHA-256 hashes.
- 57 literal local media paths plus the template-generated Goa illustration series exist. All registry assets are additionally covered by tests.
- `git diff --check` passed.
