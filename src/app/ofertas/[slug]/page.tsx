import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { slugify } from '@/lib/utils'

const offers = [
  {
    name: 'Fintech XYZ',
    category: 'Fintech',
    modality: 'Equity',
    min: 1000,
    raised: 350000,
    goal: 500000,
    deadline: '25 dias',
    cover: '/offers/fintech.svg',
    status: 'Em captação',
  },
  {
    name: 'Agrotech Verde',
    category: 'Agrotech',
    modality: 'Dívida',
    min: 500,
    raised: 120000,
    goal: 300000,
    deadline: '18 dias',
    cover: '/offers/agrotech.svg',
    status: 'Em captação',
  },
  {
    name: 'HealthTech Vida',
    category: 'HealthTech',
    modality: 'Revenue Share',
    min: 2000,
    raised: 450000,
    goal: 450000,
    deadline: 'Encerrando',
    cover: '/offers/health.svg',
    status: 'Encerrada',
  },
  {
    name: 'PagBank Next',
    category: 'Fintech',
    modality: 'Dívida',
    min: 1000,
    raised: 180000,
    goal: 400000,
    deadline: '32 dias',
    cover: '/offers/fintech.svg',
    status: 'Em captação',
  },
  {
    name: 'Agro Sustentável',
    category: 'Agrotech',
    modality: 'Equity',
    min: 800,
    raised: 90000,
    goal: 250000,
    deadline: '40 dias',
    cover: '/offers/agrotech.svg',
    status: 'Em captação',
  },
  {
    name: 'Health Data AI',
    category: 'HealthTech',
    modality: 'Equity',
    min: 1500,
    raised: 60000,
    goal: 300000,
    deadline: '47 dias',
    cover: '/offers/health.svg',
    status: 'Em captação',
  },
] as const

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const offer = offers.find((o) => slugify(o.name) === params.slug)
  return {
    title: offer ? `${offer.name} — Oferta` : 'Oferta não encontrada',
    description: offer
      ? `Detalhes da oferta ${offer.name}: ${offer.category}, ${offer.modality}.`
      : 'A oferta solicitada não foi encontrada.',
  }
}

export default function OfferDetailPage({ params }: { params: { slug: string } }) {
  const offer = offers.find((o) => slugify(o.name) === params.slug)
  if (!offer) return notFound()

  const pct = Math.min(100, Math.round((offer.raised / offer.goal) * 100))

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

      {/* Header de página */}
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <nav className="text-xs text-muted-foreground">
            <Link href="/ofertas" className="hover:underline">Ofertas</Link>
            <span className="mx-2">/</span>
            <span>{offer.name}</span>
          </nav>
          <h1 className="mt-2 text-3xl font-semibold">{offer.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{offer.category}</Badge>
            <span>•</span>
            <span>{offer.modality}</span>
            <span>•</span>
            <span>Status: {offer.status}</span>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-6xl px-6 grid gap-8 lg:grid-cols-3">
          {/* Conteúdo principal */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative h-56 w-full sm:h-72 md:h-80">
                <Image
                  src={offer.cover}
                  alt={`Capa da oferta ${offer.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
                  className="object-cover"
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sobre a oferta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  {offer.name} é uma oportunidade no segmento {offer.category} na modalidade {offer.modality}. Esta é uma
                  página de demonstração de detalhes; personalize com informações do pitch, mercado, time e documentação.
                </p>
                <p>
                  Você pode incluir seções como: tese de investimento, métricas, documentos (PDF), perguntas e respostas,
                  time da empresa, e cronograma de captação.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Condições da oferta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progresso</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>R$ {offer.raised.toLocaleString('pt-BR')}</span>
                    <span>Meta R$ {offer.goal.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Ticket mínimo</div>
                    <div className="mt-1 font-medium">R$ {offer.min.toLocaleString('pt-BR')}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Prazo</div>
                    <div className="mt-1 font-medium">{offer.deadline}</div>
                  </div>
                </div>

                <Button size="lg" className="w-full">Investir agora</Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/ofertas">Voltar para ofertas</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}