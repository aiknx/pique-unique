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
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performance Optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    // Enable modern JavaScript features
    modern: true,
    // Enable HTTP Keep-Alive
    keepAlive: true,
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

    // Optimize images using next-optimized-images
    config.module.rules.push({
      test: /\.(jpe?g|png|svg|gif|ico|webp|jp2)$/,
      use: [
        {
          loader: 'responsive-loader',
          options: {
            adapter: require('responsive-loader/sharp'),
            quality: 80,
            placeholder: true,
            placeholderSize: 20,
          },
        },
      ],
    });

    return config;
  }
};

module.exports = withBundleAnalyzer(nextConfig);
 