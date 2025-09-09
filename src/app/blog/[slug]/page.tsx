import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import ShareBar from '@/components/blog/share-bar'
import CommentsSection from '@/components/blog/comments-section'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const db = getDb()
  const { rows } = await db.query(`SELECT slug FROM blog ORDER BY created_at DESC LIMIT 1000`)
  return rows.map((r: any) => ({ slug: r.slug as string }))
}

async function fetchArticle(slug: string) {
  const db = getDb()
  const { rows } = await db.query(
    `SELECT id, titulo, slug, resumo, data_publicacao, autor, capa, categorias, corpo, corpo_html
     FROM blog
     WHERE slug = $1
     LIMIT 1`,
    [slug]
  )
  if (!rows[0]) return null
  const r = rows[0]
  return {
    id: r.id as number,
    title: r.titulo as string,
    slug: r.slug as string,
    excerpt: r.resumo as string,
    date: typeof r.data_publicacao === 'string' ? r.data_publicacao : (r.data_publicacao?.toISOString?.().slice(0, 10) ?? ''),
    author: (r.autor ?? '') as string,
    cover: (r.capa ?? '/file.svg') as string,
    categories: (r.categorias ?? []) as string[],
    body: (r.corpo ?? []) as string[],
    bodyHtml: (r.corpo_html ?? null) as string | null,
  }
}

async function fetchRelated(slug: string, categories: string[]) {
  const db = getDb()
  const { rows } = await db.query(
    `SELECT titulo, slug, resumo, capa, data_publicacao
     FROM blog
     WHERE slug <> $1
       AND ($2::text[] IS NULL OR categorias && $2::text[])
     ORDER BY data_publicacao DESC, created_at DESC
     LIMIT 3`,
    [slug, categories?.length ? categories : null]
  )
  return rows.map((r: any) => ({
    title: r.titulo as string,
    slug: r.slug as string,
    excerpt: r.resumo as string,
    cover: (r.capa ?? '/file.svg') as string,
    date: typeof r.data_publicacao === 'string' ? r.data_publicacao : (r.data_publicacao?.toISOString?.().slice(0, 10) ?? ''),
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await fetchArticle(params.slug)
  return {
    title: article ? `${article.title} — Blog` : 'Artigo não encontrado',
    description: article ? article.excerpt : 'O artigo solicitado não foi encontrado.',
  }
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = await fetchArticle(params.slug)
  if (!article) return notFound()
  const related = await fetchRelated(article.slug, article.categories)

  return (
    <div className="min-h-dvh font-sans pt-24">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <nav className="text-xs text-muted-foreground">
            <Link href="/blog" className="hover:underline">Blog</Link>
            <span className="mx-2">/</span>
            <span>{article.title}</span>
          </nav>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{article.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
            <span>•</span>
            <span>{article.author}</span>
            <span>•</span>
            <div className="flex flex-wrap gap-2">
              {article.categories.map((c) => (
                <Badge key={c} variant="secondary">{c}</Badge>
              ))}
            </div>
          </div>
        </div>
        {article.cover && (
          <div className="w-full border-t bg-muted/30">
            <div className="mx-auto max-w-6xl px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.cover} alt="Capa do artigo" className="h-64 w-full object-cover rounded-md my-6" />
            </div>
          </div>
        )}
      </header>

      <main className="py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
          <article className="prose prose-neutral dark:prose-invert md:col-span-2">
            {article.bodyHtml ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
            ) : (
              article.body.map((p, i) => <p key={i} className="mb-4 leading-7">{p}</p>)
            )}
            <div className="mt-8">
              <ShareBar title={article.title} />
            </div>
          </article>

          <aside className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Artigos relacionados</h3>
                <div className="mt-3 space-y-3">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                      <div className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.cover} alt="" className="h-16 w-24 rounded object-cover border" />
                        <div>
                          <div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString('pt-BR')}</div>
                          <div className="text-sm font-medium leading-snug group-hover:underline line-clamp-2">{r.title}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {related.length === 0 && (
                    <div className="text-sm text-muted-foreground">Sem relacionados.</div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-12 max-w-3xl px-6">
          <CommentsSection slug={article.slug} />
        </div>
      </main>
    </div>
  )
}