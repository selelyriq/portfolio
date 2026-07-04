/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lyriqsele.com",
      },
      {
        protocol: "https",
        hostname: "*.lyriqsele.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  productionBrowserSourceMaps: false,
  // Dev only: LAN devices (phone testing) must never reuse cached dev chunks.
  // no-store disables conditional GETs (If-None-Match/If-Modified-Since) so
  // every reload fetches fresh CSS/JS bytes. Not applied in production builds.
  async headers() {
    if (process.env.NODE_ENV === "production") return [];
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

module.exports = nextConfig;
