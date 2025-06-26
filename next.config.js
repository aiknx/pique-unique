const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
    ],
  },
  transpilePackages: ['undici', '@firebase/auth'],
  // Optimizacijos
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@firebase/auth', '@firebase/firestore'],
  },
  // Puslapio generavimo strategija
  output: 'standalone',
}

module.exports = withBundleAnalyzer(nextConfig);
 