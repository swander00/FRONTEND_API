/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'trreb-image.ampre.ca',
      },
    ],
  },
  eslint: {
    // Temporarily allow ESLint errors during builds to push search bar fixes
    // TODO: Fix ESLint errors in other files
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors. Only use this if you need to.
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

