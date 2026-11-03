# Active package artwork ? 2026-11-02

Implemented the requested immediate activation, superseding the earlier review document's activation gates for these packages.

| Package | Active asset | Implementation |
| --- | --- | --- |
| Mysore/Srirangapatna | `/images/package-artwork/overrides/mysore-palace-cutout.png` | Exact copy of `mysore-cutout-candidate-v1.png`; package override. Legacy companion palace is suppressed when a package override exists. |
| Coorg | `/images/package-artwork/karnataka/nature.webp` | Abbey Falls retained unchanged. |
| Chikmagalur | `/images/destinations/chikmagalur-avatar-3d.webp` | Existing destination-specific traveler, mountains and coffee plants; package override. |
| Kerala/Munnar | `/images/package-artwork/overrides/kerala-cultural.png` | Exact copy of `kerala-cultural-candidate-v2.png`; package override. |

No regeneration or alpha modification. Existing originals retained. Candidate edge/padding imperfections remain for later refinement. The 36 registry slots, Kerala Backwaters/Coastal definitions, Goa, animation code and booking flow are unchanged.

Validation: 34 tests passed; TypeScript no-emit passed; production build passed. Build required an outside-sandbox retry because the sandbox blocked worker spawning (EPERM). Existing parent-lockfile warning remains.

Actual headless Edge checks passed at 1440?1000 and 390?844 for all four packages plus unchanged Goa (10 page/device combinations). Active URLs, image loading, contain sizing, desktop hover engagement, mobile hover suppression, reduced motion and missing-date booking validation passed. No uncaught browser exceptions. Screenshots were visually inspected; Mysore's opaque rectangle is absent and only the palace cutout projects on hover. Mobile checks use viewport emulation.

Evidence: `artwork/package-artwork/review-2026-11-02/implementation/browser-validation.json` and adjacent screenshots. Re-run `verify-implementation.mjs` with the app on port 3100 and a dedicated Edge CDP browser on port 9225.
