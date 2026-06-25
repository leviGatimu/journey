/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: process.cwd(),
  transpilePackages: ["three"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 480, 640, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
