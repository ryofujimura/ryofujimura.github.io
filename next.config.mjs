/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  /** GitHub Pages and similar hosts need `photos/index.html`, not only `photos.html`, for `/photos`. */
  trailingSlash: true,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
}

export default nextConfig
