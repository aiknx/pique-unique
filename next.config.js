const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Performance Optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
  // Output optimization
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  // Cache optimization
  generateEtags: true,
  // Build optimization
  productionBrowserSourceMaps: false,
  // Build analysis
  webpack: (config, { isServer }) => {
    // Enable detailed stats output
    config.stats = {
      assets: true,
      chunks: true,
      modules: true,
      reasons: true,
      errorDetails: true
    };
    return config;
  }
};

module.exports = withBundleAnalyzer(nextConfig);
 