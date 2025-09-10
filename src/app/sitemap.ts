import type { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
  const urls: MetadataRoute.Sitemap = []

  // estáticas principais
  const statics = ['/', '/ofertas', '/blog', '/capte-recursos']
  statics.forEach((p) => urls.push({ url: `${base}${p}`, changeFrequency: 'weekly', priority: 0.8 }))

  // ofertas dinâmicas
  try {
    const db = getDb()
    const { rows } = await db.query<{ slug: string; updated_at?: Date }>(`SELECT slug, updated_at FROM ofertas ORDER BY updated_at DESC NULLS LAST LIMIT 2000`)
    for (const r of rows) {
      urls.push({
        url: `${base}/ofertas/${r.slug}`,
        changeFrequency: 'daily',
        priority: 0.9,
        lastModified: r.updated_at ?? undefined,
      })
    }
  } catch (e) {
    // ignore
  }

  // blog dinâmico
  try {
    const db = getDb()
    const { rows } = await db.query<{ slug: string; data_publicacao: Date | string | null }>(`SELECT slug, data_publicacao FROM blog ORDER BY data_publicacao DESC NULLS LAST, created_at DESC LIMIT 3000`)
    for (const r of rows) {
      urls.push({
        url: `${base}/blog/${r.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
        lastModified: r.data_publicacao
          ? (typeof r.data_publicacao === 'string' ? new Date(r.data_publicacao) : r.data_publicacao)
          : undefined,
      })
    }
  } catch (e) {
    // ignore
  }

  return urls
}