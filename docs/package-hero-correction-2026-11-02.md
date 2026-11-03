# Kerala/Munnar and Chikmagalur top hero correction

The earlier report verified the lower PackageExperience artwork stage, not the top cinematic hero. That hero was still using visuals.hero (the original Unsplash photograph). The state resolver was correctly honoring artworkOverride for the overview; caching was not the cause, as before screenshots reproduced the photographs with cache disabled and hard refresh.

The Package Details page now selects artworkOverride only for Kerala/Munnar and Chikmagalur in its top hero DestinationImage. Scoped CSS uses contain sizing, keeps the image clear of text on desktop/mobile, and places the cutouts above the photo-darkening overlay. Existing animations, booking panel images/flow, registry, Mysore, Coorg and Goa are unchanged.

Kerala visually shows a woman in a cream/gold saree, coconut palms, brass lamp and houseboat. Chikmagalur visually shows an adventure traveler, coffee plants, misty hills and trekking terrain. It is distinct and destination-appropriate, but not a landmark-only state artwork; that alternative would require replacing /images/destinations/chikmagalur-avatar-3d.webp.

Changed application files: src/app/packages/[slug]/page.tsx and src/components/packages/package-experience.module.css. Added verify-hero-followup.mjs and before/after evidence. No assets changed.

34 tests passed; TypeScript no-emit passed; final production build passed. Actual Edge desktop 1440x1000 and mobile emulation 390x844 verified after cache-disabled hard refresh. All four final screenshots visually inspected: complete, clear cutouts without image cropping or text overlap. Images loaded with nonzero natural dimensions and object-fit contain.

## kerala-munnar / desktop

Previous displayed URL: `http://localhost:3100/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1593693411515-c20261bcad6e%3Fq%3D80%26w%3D1169%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&w=1920&q=75`

Final rendered currentSrc: `http://localhost:3100/_next/image?url=%2Fimages%2Fpackage-artwork%2Foverrides%2Fkerala-cultural.png&w=750&q=75`

Screenshot: `artwork\package-artwork\review-2026-11-02\hero-followup/after-desktop-kerala-munnar-hero.png`

## chikmagalur / desktop

Previous displayed URL: `http://localhost:3100/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1578496034584-2d95250334b5%3Fq%3D80%26w%3D1332%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&w=1920&q=75`

Final rendered currentSrc: `http://localhost:3100/_next/image?url=%2Fimages%2Fdestinations%2Fchikmagalur-avatar-3d.webp&w=750&q=75`

Screenshot: `artwork\package-artwork\review-2026-11-02\hero-followup/after-desktop-chikmagalur-hero.png`

## kerala-munnar / mobile

Previous displayed URL: `http://localhost:3100/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1593693411515-c20261bcad6e%3Fq%3D80%26w%3D1169%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&w=640&q=75`

Final rendered currentSrc: `http://localhost:3100/_next/image?url=%2Fimages%2Fpackage-artwork%2Foverrides%2Fkerala-cultural.png&w=480&q=75`

Screenshot: `artwork\package-artwork\review-2026-11-02\hero-followup/after-mobile-kerala-munnar-hero.png`

## chikmagalur / mobile

Previous displayed URL: `http://localhost:3100/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1578496034584-2d95250334b5%3Fq%3D80%26w%3D1332%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&w=640&q=75`

Final rendered currentSrc: `http://localhost:3100/_next/image?url=%2Fimages%2Fdestinations%2Fchikmagalur-avatar-3d.webp&w=480&q=75`

Screenshot: `artwork\package-artwork\review-2026-11-02\hero-followup/after-mobile-chikmagalur-hero.png`
