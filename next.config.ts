import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    qualities: [75, 85, 90],
    // Default Next image buckets jump straight from 128 to 256, and the
    // smallest `deviceSizes` bucket after that is 640 — so anything rendered
    // between ~130px and 640px (the ~150px header/footer logo, the Hero's
    // ~400px destination cards, package/destination grid tiles) gets rounded
    // all the way up to the next available bucket and pays for far more
    // pixels than it renders. 150 and 480 close those two gaps.
    imageSizes: [16, 32, 48, 64, 96, 128, 150, 256, 384, 480],
  },

  // Static video/image/font assets are content-hashed by filename only when we
  // change them ourselves, so it's safe to let browsers and CDNs cache them
  // aggressively — this is what makes a repeat visit (and every hero-category
  // swap after the first) feel instant instead of re-fetching video each time.
  async headers() {
    return [
      {
        // Baseline security headers on every response. This site doesn't embed
        // third-party frames or need cross-origin isolation, so the policy is
        // deliberately conservative rather than exhaustive (e.g. no CSP, which
        // would need real auditing of the video/image/WhatsApp/Google Fonts
        // origins already in use before it could be turned on without breakage).
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/video/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
      {
        source: "/logo/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:file(mayura|bus|logo)\\.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
