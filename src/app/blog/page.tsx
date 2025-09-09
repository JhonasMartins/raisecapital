import Image from 'next/image'
import Link from 'next/link'
import { listArticles } from '@/lib/blog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-static'

export default function BlogPage() {
  const items = listArticles()
  return (
    <div className="min-h-dvh font-sans pt-28">
      {/* navbar local removido — usamos o global do layout */}

      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl font-semibold">Artigos</h1>
          <p className="mt-2 text-muted-foreground">Conteúdo para ajudar você a investir melhor.</p>
        </div>
      </header>

      <main className="py-10 bg-[#fcfcfc]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="group block">
                <Card className="flex flex-col overflow-hidden p-0 gap-0">
                  <div className="relative h-40 w-full">
                    <Image src={a.cover} alt={a.title} fill className="object-cover" />
                  </div>
                  <CardHeader className="space-y-2 px-6 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold">{a.title}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {new Date(a.date).toLocaleDateString('pt-BR')}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground px-6 pt-2 pb-6">
                    {a.excerpt}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}