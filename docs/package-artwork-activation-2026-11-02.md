# Active package artwork — 2026-11-02

The user explicitly requested immediate activation of the best existing candidates, accepting the previously recorded preservation, alpha cleanup and padding limitations. These overrides are active package presentation choices; they do not certify final collection quality or add state slots.

| Package | Active public asset | Selection |
| --- | --- | --- |
| Mysore/Srirangapatna | `/images/package-artwork/overrides/mysore-palace-cutout.png` | Package override; exact copy of `mysore-cutout-candidate-v1.png` |
| Coorg | `/images/package-artwork/karnataka/nature.webp` | Existing approved Karnataka Nature slot; unchanged |
| Chikmagalur | `/images/destinations/chikmagalur-avatar-3d.webp` | Package override reusing the existing hills/coffee/trekking illustration |
| Kerala/Munnar | `/images/package-artwork/overrides/kerala-cultural.png` | Package override; exact copy of `kerala-cultural-candidate-v2.png` |

`src/lib/data/packages.ts` contains the three overrides. The existing resolver already prioritizes valid package overrides, so no resolver or registry refactor is required. `PackageExperience.tsx` now restricts the legacy layered Mysore presentation to its legacy traveler asset; standalone palace overrides no longer add the old palace backdrop or legacy positioning. All hover motion and CSS remain unchanged.

The original approved Mysore WebP remains intact at its original public path. Goa, Kerala Backwaters and Coastal, all 36 registry slots and booking logic remain unchanged. Kerala Hills still awaits its separate Munnar tea-estate replacement; the cultural override does not complete that slot.

The active Mysore PNG has genuine alpha and no visible cream rectangle in the desktop hover/mobile screenshots. Its previously documented rendering differences remain accepted for this immediate implementation. Kerala also has genuine alpha, with cleanup and bottom spacing still deferred. Both native PNGs are 1254 × 1254. No artwork was regenerated or edited during activation; the retained PNG masters are used directly.

Validation: 34 regression tests passed, TypeScript passed, production build passed. Browser QA and screenshots are in `artwork/package-artwork/activation-2026-11-02/`. The harness checks actual active URLs without substituting DOM images, desktop hover, mobile hover suppression, reduced motion, no horizontal overflow and required-date booking validation. Desktop is 1440 × 1000; mobile is 390 × 844 viewport emulation, not physical-device certification. No booking/payment was submitted.

Local production preview: `http://localhost:3101`. This task does not deploy to external hosting.
