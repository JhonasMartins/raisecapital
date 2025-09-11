import { getDb } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ChevronDown, XCircle } from 'lucide-react'
import Image from 'next/image'
import BlogFilters from '@/components/blog/filters'

export const dynamic = 'force-dynamic'

type BlogRow = {
  titulo: string
  slug: string
  resumo: string
  capa: string | null
  data_publicacao: string | Date | null
  categorias: string[] | null
}

type SearchParams = { q?: string; cat?: string }

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const db = getDb()

  const sp = await searchParams
  const q = typeof sp?.q === 'string' ? sp.q.trim() : ''
  const cat = typeof sp?.cat === 'string' ? sp.cat.trim() : ''

  // Lista de categorias distintas para o filtro
  const { rows: catRows } = await db.query<{ categoria: string }>(
    `SELECT DISTINCT unnest(coalesce(categorias, ARRAY[]::text[])) AS categoria
     FROM blog
     WHERE array_length(coalesce(categorias, ARRAY[]::text[]), 1) IS NOT NULL
     ORDER BY categoria ASC`
  )
  const categories = ['Todas', ...Array.from(new Set(catRows.map((r) => r.categoria).filter(Boolean)))]

  // Itens filtrados conforme a busca e a categoria
  const { rows } = await db.query<BlogRow>(
    `SELECT titulo, slug, resumo, capa, data_publicacao, categorias
     FROM blog
     WHERE ($1::text IS NULL OR $1 = '' OR titulo ILIKE '%' || $1 || '%')
       AND ($2::text IS NULL OR $2 = '' OR $2 = 'Todas' OR $2 = 'all' OR $2 = 'All' OR $2 = ANY(coalesce(categorias, ARRAY[]::text[])))
     ORDER BY data_publicacao DESC, created_at DESC`,
    [q, cat]
  )

  const items = rows.map((r) => ({
    title: r.titulo,
    slug: r.slug,
    excerpt: r.resumo,
    cover: r.capa ?? '/file.svg',
    date: typeof r.data_publicacao === 'string' ? r.data_publicacao : (r.data_publicacao?.toISOString?.().slice(0, 10) ?? ''),
    categories: r.categorias ?? [],
  }))

  const isDefaultFilters = (!q || q.length === 0) && (!cat || cat === '' || cat === 'Todas')

  return (
    <div className="min-h-dvh font-sans pt-28">
      {/* Hero com gradiente azul (mesmo padrão de /capte-recursos e /ofertas) */}
      <section className="relative -mt-28 pt-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900" />
        <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(800px_400px_at_10%_10%,white,transparent_50%),radial-gradient(600px_300px_at_90%_20%,white,transparent_50%)]" />

        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">Blog</h1>
          <p className="mt-2 text-white/80">Últimos artigos e novidades</p>

          {/* Filtros (dentro do hero) */}
          <div className="mt-6">
            <BlogFilters q={q} cat={cat || 'Todas'} categories={categories} isDefaultFilters={isDefaultFilters} />
          </div>
        </div>
      </section>

      <main className="py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="group rounded-lg border p-3 hover:shadow-sm transition">
              <div className="relative h-40 w-full overflow-hidden rounded">
                <Image
                  src={a.cover}
                  alt={`Capa do artigo ${a.title}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover border"
                  unoptimized
                />
              </div>
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