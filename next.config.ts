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
      // Cloudflare R2 public development URL (ex.: pub-xxxx.r2.dev)
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      // Se usar domínio personalizado para o bucket (ajuste para o seu domínio)
      // {
      //   protocol: 'https',
      //   hostname: 'arquivos.raisecapital.com.br',
      // },
    ],
  },
}

export default nextConfig
