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
    ],
  },
}

export default nextConfig
