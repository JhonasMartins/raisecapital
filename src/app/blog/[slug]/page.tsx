import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleBySlug, listArticles } from '@/lib/blog'
import { Badge } from '@/components/ui/badge'

export async function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  return {
    title: article ? `${article.title} — Blog` : 'Artigo não encontrado',
    description: article ? article.excerpt : 'O artigo solicitado não foi encontrado.',
  }
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return notFound()

  return (
    <div className="min-h-dvh font-sans pt-28">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Image src="/logo.avif" alt="Raise Capital" width={180} height={44} sizes="180px" quality={100} className="block" priority />
            </Link>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/#como-funciona" className="hover:text-foreground transition-colors">Como funciona</Link>
            <Link href="/#projetos" className="hover:text-foreground transition-colors">Projetos</Link>
            <Link href="/#sobre" className="hover:text-foreground transition-colors">Sobre</Link>
          </nav>
        </div>
      </header>

      <header className="border-b">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <nav className="text-xs text-muted-foreground">
            <Link href="/blog" className="hover:underline">Blog</Link>
            <span className="mx-2">/</span>
            <span>{article.title}</span>
          </nav>
          <h1 className="mt-2 text-3xl font-semibold">{article.title}</h1>
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
      </header>

      <main className="py-10">
        <article className="mx-auto max-w-3xl px-6 prose prose-neutral dark:prose-invert">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </main>
    </div>
  )
}