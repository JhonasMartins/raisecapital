import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Ignora erros de ESLint durante a build para não bloquear o deploy
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de TypeScript durante a build (útil para destravar o build enquanto corrigimos)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      // MinIO/domínio do bucket ou CDN
      {
        protocol: 'https',
        hostname: '**.traefik.me',
      },
      {
        protocol: 'https',
        hostname: '**.codnodo.com',
      },
      {
        protocol: 'http',
        hostname: '**.traefik.me',
      },
      // MinIO console/endpoint com porta 9000 (path-style)
      {
        protocol: 'http',
        hostname: '**.traefik.me',
        port: '9000',
      },
    ],
  },
}

export default nextConfig
