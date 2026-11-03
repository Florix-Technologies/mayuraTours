# Package artwork review — 2026-11-02

> Historical pre-activation review below. The user's later implementation-first instruction explicitly authorized using these candidates immediately despite the recorded quality limitations. Mysore and Kerala now use package overrides, and Chikmagalur uses its existing destination artwork. See `package-artwork-activation-2026-11-02.md` for current active selections.

## Result

No application source, package records, registry entries, public artwork, CSS or animations were changed. The approved collection remains 36 slots: 7 integrated including Goa, 2 pending landmark review, 2 rejected and 25 missing. The new cultural proposal is an unapproved package override candidate, not a new state slot.

Review files are under `artwork/package-artwork/review-2026-11-02/`, outside public assets. None is referenced by the application. `asset-validation.json` contains native dimensions, alpha bounds, margins, hashes and preservation checks. `browser-validation.json` contains actual production-browser checks. PNGs with `active` in their names show existing selections; `UNAPPROVED-candidate` screenshots are temporary browser DOM previews only, restored by navigation.

## Mysore Palace — replacement not accepted

The active `public/images/package-artwork/karnataka/heritage.webp` is the original 1254 × 1254 RGB artwork. Its cream canvas and reflective floor are baked into the image. `AvatarStage.tsx` transforms the artwork wrapper, so the complete image rectangle moves. The existing palace-specific border-radius rule remains untouched; no new clipping, blending, masks or concealment styles were introduced.

The image-generation extraction candidate, `mysore-cutout-candidate-v1.png`, is 1254 × 1254 RGBA with 60.68% fully transparent pixels. It removes the rectangle in the browser preview, but fails preservation: 566,478 of 566,502 near-opaque pixels differ from the original RGB values, with mean absolute channel difference 35.80/255. Direct image comparison also shows changes to the rendering and placement. Horizontal clearance is insufficient and faint alpha residue reaches the canvas edges. It is REJECTED for activation. Transparency alone is not a successful repair.

The approved original and existing positioning/hover remain unchanged. A layered original or a carefully verified alpha matte applied to the original RGB is needed to meet the conservation requirement. Any future extraction still needs close architectural comparison and desktop/mobile review before replacement.

## Coorg and Chikmagalur — no suitable alternate approved state asset

The approved Karnataka variations are Heritage/Mysore Palace, Nature/Abbey Falls and Wildlife/Kabini elephant. Coorg explicitly includes Abbey Falls. Chikmagalur is classified as Nature, with trekking, Mullayanagiri and coffee estates as its main focus. A Bhadra sanctuary mention does not make Kabini a suitable primary subject.

Both packages therefore retain the approved Nature artwork. No random selection, duplicate file or unrelated wildlife substitution was added. A new suitable Chikmagalur candidate would need package-specific approval; it must not add a fourth Karnataka registry slot. The retained legacy Chikmagalur traveler image is a destination fallback, not evidence of approval as a new state-artwork variation.

The existing resolver is already deterministic by destination/package defaults and relevant experience. Its precedence stays: preserve Goa, valid manual override, approved exact state/experience, destination fallback, approved state default only if experience is unspecified, universal illustration. `artworkOverride` already supports independent package identities without mutating shared slots; no second override API is needed.

Two regression tests were added to `tests/package-visuals.test.mjs`: stable Karnataka selections with wildlife only when requested, and independent hypothetical package overrides with unchanged heroes/state-slot count. Test upload URLs are illustrative only; no candidate or public file is activated.

## Kerala cultural candidate — pending review and cleanup

`kerala-cultural-candidate-v1.png` depicts an adult woman in a cream-and-gold kasavu saree, subtle jewellery and jasmine, with palms, brass nilavilakku and a subordinate houseboat/backwater base. It is a 1254 × 1254 RGBA generation, but framing is too tight.

`kerala-cultural-candidate-v2.png` is the compact revision, also native 1254 × 1254 RGBA. It has 68.53% fully transparent pixels. Above alpha 16/255, margins are approximately 16.91% left, 16.91% top, 14.75% right and 9.57% bottom. Lower-alpha residue extends beyond those bounds, so it does not pass the clean 12–18% margin requirement. It is suitable for composition review only, not production installation. Authentic dress details, face, hands, materials and edges still require user review; cultural authenticity is not certified by generation.

Proposed placement after cleanup and explicit approval: the existing `kerala-munnar` package's `artworkOverride`. This leaves Backwaters/Houseboat and Coastal/Kovalam unchanged and keeps Hills reserved for Munnar tea estates. No `culture` registry slot is added. The working `kerala-munnar-avatar-3d.webp` fallback remains active. No final WebP is exported or installed while candidates fail the review gate.

## Separate Munnar tea-estate requirement

The Kerala Hills slot remains rejected because the previous candidate featured a dominant generic cottage. Its replacement has not been generated or approved. The brief is retained separately at `artwork/package-artwork/review-2026-11-02/munnar-tea-estates-brief.md`. Neither the cultural candidate nor the existing legacy fallback completes that slot.

The existing Telangana Nature-versus-Temples discrepancy remains unchanged and outside this task.

## Validation

- `node --test --test-isolation=none tests/*.test.mjs`: 33 passed, including booking/session/payment regression coverage.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed after a network-enabled retry fetched the existing Google Fonts. The first restricted run failed only on those font downloads. No font/configuration change was made. Existing parent-lockfile warning remains.
- Actual local Edge production-browser checks: Mysore, Coorg, Chikmagalur, Kerala/Munnar and Goa at 1440 × 1000 desktop and 390 × 844 mobile; all 10 active image selections loaded with contain sizing.
- Mouse hover engaged on desktop and stayed disabled for touch/mobile. Desktop reduced-motion reset and transform suppression passed.
- Missing-date booking validation passed on all 10 page/device combinations. No booking was submitted and no payment or external service was called by the QA workflow.
- Mysore and Kerala candidates were separately rendered in the unchanged artwork stage on both devices via temporary DOM substitution. Screenshots were inspected; rendering does not override their failed asset-quality gates.
- No uncaught browser runtime exceptions were recorded. This is viewport emulation, not physical-device testing or a full end-to-end booking/payment certification.

## Approval gates

Mysore: reject this candidate; preserve the original. Chikmagalur: choose/create a relevant package-specific candidate before changing its image. Kerala: review the visual direction, then resolve faint alpha residue and bottom spacing, verify clean edges on light/dark backgrounds, export alpha-preserving WebP from the accepted PNG and review again before installation. An approved visual direction alone must not activate a technically failing file.
