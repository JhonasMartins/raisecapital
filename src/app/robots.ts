import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/auth/', '/api/'],
    },
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  }
}