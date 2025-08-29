/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración mínima sin interferir con CSS
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  // REMOVER toda la configuración de webpack personalizada
  // Esto permite que Next.js maneje CSS correctamente
};

module.exports = nextConfig;
