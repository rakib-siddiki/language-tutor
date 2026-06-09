/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@language-tutor/ui', '@language-tutor/shared-types'],
  experimental: {
    // Enable React Server Components optimizations
  },
};

module.exports = nextConfig;
