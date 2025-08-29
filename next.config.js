/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de ESLint
  eslint: {
    // Solo ignorar durante builds si hay errores menores
    // ignoreDuringBuilds: true,
    dirs: ['src'] // Especificar directorio para mejor rendimiento
  },
  
  // Configuración de TypeScript
  typescript: {
    // Solo ignorar si hay errores de tipos menores
    // ignoreBuildErrors: true,
  },

  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },

  // Configuración experimental (actualizada)
  experimental: {
    // esmExternals ya no es necesario en Next.js 14+
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // Configuración de CSS
  sassOptions: {
    includePaths: ['./src/styles'],
  },

  // Configuración de webpack para mejor manejo de CSS
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Configuración adicional para CSS
    config.module.rules.push({
      test: /\.css$/,
      use: [
        defaultLoaders.babel,
        {
          loader: require('styled-jsx/webpack').loader,
          options: {
            type: 'scoped'
          }
        }
      ]
    });

    return config;
  },

  // Variables de entorno públicas
  env: {
    CUSTOM_KEY: 'value',
  },

  // Configuración para desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    // Configuración específica para desarrollo
    reactStrictMode: true,
  }),
};

module.exports = nextConfig;
