/**
 * Routes a local static asset through Next's built-in image optimizer even
 * though it's consumed somewhere `next/image` can't be used directly — a
 * `<video poster>` attribute only accepts a plain URL string, never the
 * `<Image>` component itself. Without this, poster files (each 100-350KB of
 * un-resized, un-recompressed JPEG) ship to the browser completely raw.
 *
 * `width`/`quality` must be values already permitted by `next.config.ts`'s
 * `images.imageSizes`/`deviceSizes` and `images.qualities` — the optimizer
 * rejects any other value.
 */
export function optimizedPoster(src: string, width: number, quality: 75 | 85 | 90 = 75) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
