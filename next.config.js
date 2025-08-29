/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  trailingSlash: true,
  output: 'export'
};

module.exports = nextConfig;
