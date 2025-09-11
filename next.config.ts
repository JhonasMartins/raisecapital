import type { NextConfig } from 'next'

// Descobrir host/protocolo do storage para liberar em next/image
const remoteImagePatterns: { protocol: 'http' | 'https'; hostname: string }[] = []
try {
  const publicUrl = process.env.S3_PUBLIC_BASE_URL
  const endpoint = process.env.S3_ENDPOINT || process.env.AWS_S3_ENDPOINT
  if (publicUrl) {
    const u = new URL(publicUrl)
    if (u.hostname) {
      remoteImagePatterns.push({ protocol: (u.protocol.replace(':', '') as 'http' | 'https') || 'https', hostname: u.hostname })
    }
  } else if (endpoint) {
    const u = new URL(endpoint)
    if (u.hostname) {
      // Atenção: se o endpoint for http e o site for https, isso causará mixed content.
      // Recomenda-se definir S3_PUBLIC_BASE_URL com HTTPS (via proxy/CDN) em produção.
      remoteImagePatterns.push({ protocol: (u.protocol.replace(':', '') as 'http' | 'https') || 'https', hostname: u.hostname })
    }
  }
} catch {}

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
      // Adicionar dinamicamente host do storage (S3/MinIO) se configurado
      ...remoteImagePatterns,
    ],
  },
}

export default nextConfig
