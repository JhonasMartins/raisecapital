import { getDb } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const db = getDb()
  const { rows } = await db.query(
    `SELECT titulo, slug, resumo, capa, data_publicacao FROM blog ORDER BY data_publicacao DESC, created_at DESC`
  )

  const items = rows.map((r: any) => ({
    title: r.titulo as string,
    slug: r.slug as string,
    excerpt: r.resumo as string,
    cover: (r.capa ?? '/file.svg') as string,
    date: typeof r.data_publicacao === 'string' ? r.data_publicacao : (r.data_publicacao?.toISOString?.().slice(0, 10) ?? ''),
  }))

  return (
    <div className="min-h-dvh font-sans pt-28">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-2xl font-semibold">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">Últimos artigos e novidades</p>
        </div>
      </header>

      <main className="py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="group rounded-lg border p-3 hover:shadow-sm transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.cover} alt="" className="h-40 w-full rounded object-cover border" />
              <div className="mt-3 text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString('pt-BR')}</div>
              <div className="mt-1 line-clamp-2 font-medium group-hover:underline">{a.title}</div>
              <div className="mt-1 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</div>
            </Link>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-sm text-muted-foreground">Nenhum artigo publicado ainda.</div>
          )}
        </div>
      </main>
    </div>
  )
}