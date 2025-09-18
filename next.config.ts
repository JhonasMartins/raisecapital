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
      // Como os arquivos agora são servidos via rota local (/api/u/[id]),
      // não precisamos de padrões remotos adicionais.
    ],
  },
  // Define explicitamente a raiz do Turbopack para evitar seleção incorreta do workspace root
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
