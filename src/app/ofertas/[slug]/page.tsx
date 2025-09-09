import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { slugify } from '@/lib/utils'
import { TrendingUp, Clock, FileDown, HandCoins } from 'lucide-react'

type Entrepreneur = { name: string; role?: string }
type KeyVal = { label: string; value: string }
type DocumentLink = { label: string; url: string }
type Investor = { name: string }

interface Offer {
  name: string
  subtitle?: string
  category: string
  modality: string
  product?: string
  min: number
  raised: number
  goal: number
  deadline: string
  payment?: string
  tir?: number
  cover: string
  status: string
  summaryPdf?: string
  aboutOperation?: string
  aboutCompany?: string
  entrepreneurs?: Entrepreneur[]
  financials?: KeyVal[]
  documents?: DocumentLink[]
  essentialInfo?: KeyVal[]
  investors?: Investor[]
}

const offers: Offer[] = [
  {
    name: 'Fintech XYZ',
    subtitle: 'Plataforma de pagamentos B2B com foco em PMEs',
    category: 'Fintech',
    modality: 'Equity',
    product: 'Ações Preferenciais',
    min: 1000,
    raised: 350000,
    goal: 500000,
    deadline: '25 dias',
    payment: 'Lucros/Exit (Equity)',
    tir: 28, // rentabilidade alvo em % a.a. (exemplo)
    cover: '/offers/fintech.svg',
    status: 'Em captação',
    summaryPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    aboutOperation:
      'Rodada para expansão comercial e melhorias no core bancário. Alocação de recursos em marketing, time e tecnologia.',
    aboutCompany:
      'A Fintech XYZ é uma empresa focada em soluções de pagamentos para PMEs, com operação desde 2020 e crescimento de 120% a/a.',
    entrepreneurs: [
      { name: 'Ana Souza', role: 'CEO' },
      { name: 'Carlos Lima', role: 'CTO' },
    ],
    financials: [
      { label: 'Receita (12m)', value: 'R$ 2,4 mi' },
      { label: 'EBITDA (12m)', value: 'R$ 350 mil' },
      { label: 'Crescimento (a/a)', value: '120%' },
    ],
    documents: [
      { label: 'Pitch Deck (PDF)', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { label: 'Contrato da Oferta (PDF)', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ],
    essentialInfo: [
      { label: 'Setor', value: 'Serviços Financeiros' },
      { label: 'Sede', value: 'São Paulo - SP' },
      { label: 'Estágio', value: 'Série A' },
    ],
    investors: [
      { name: 'João P.' },
      { name: 'Marina S.' },
      { name: 'R. Andrade' },
    ],
  },
  {
    name: 'Agrotech Verde',
    subtitle: 'Tecnologia para aumento de produtividade sustentável',
    category: 'Agrotech',
    modality: 'Dívida',
    product: 'Cédula de Crédito',
    min: 500,
    raised: 120000,
    goal: 300000,
    deadline: '18 dias',
    payment: 'Juros mensais + amortização',
    tir: 20,
    cover: '/offers/agrotech.svg',
    status: 'Em captação',
    summaryPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    aboutOperation:
      'Captação para financiar linhas de crédito a produtores parceiros com lastro em recebíveis sazonais.',
    aboutCompany:
      'A Agrotech Verde fornece soluções de IoT e crédito para o agronegócio, com presença em 7 estados.',
    entrepreneurs: [
      { name: 'Paula M.', role: 'Founder & COO' },
      { name: 'Eduardo N.', role: 'CFO' },
    ],
    financials: [
      { label: 'Carteira de crédito', value: 'R$ 5,1 mi' },
      { label: 'NPL 90+', value: '1,2%' },
      { label: 'Yield bruto', value: '26% a.a.' },
    ],
    documents: [
      { label: 'Termo de Emissão', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ],
    essentialInfo: [
      { label: 'Rating interno', value: 'BBB-' },
      { label: 'Garantias', value: 'Cessão de recebíveis' },
    ],
    investors: [
      { name: 'Investidor A' },
      { name: 'Investidor B' },
    ],
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
  const statusClass =
    offer.status === 'Em captação'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : offer.status === 'Encerrada'
      ? 'bg-gray-100 text-gray-700 border border-gray-200'
      : 'bg-amber-50 text-amber-700 border border-amber-200'

  const categoryAccent = offer.category?.toLowerCase().includes('fintech')
    ? { bg: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-200', icon: 'text-sky-600' }
    : offer.category?.toLowerCase().includes('agro')
    ? { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', icon: 'text-emerald-600' }
    : offer.category?.toLowerCase().includes('health')
    ? { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200', icon: 'text-rose-600' }
    : { bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/20', icon: 'text-primary' }

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
          {offer.subtitle && (
            <p className="mt-1 text-muted-foreground">{offer.subtitle}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${categoryAccent.bg} ${categoryAccent.text} ${categoryAccent.ring}`}>{offer.category}</span>
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-muted text-foreground/80 ring-1 ring-border">{offer.modality}</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}>{offer.status}</span>
          </div>

          {/* Barra de métricas principal (rolável no mobile) */}
          <div className="mt-4 -mb-1 overflow-x-auto">
            <div className="grid grid-flow-col auto-cols-[minmax(180px,1fr)] gap-3 pb-1">
              {offer.tir != null && (
                <div className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${categoryAccent.ring} ${categoryAccent.bg}`}>
                  <div className={`h-8 w-8 rounded-md bg-white/70 ring-1 ring-white/60 flex items-center justify-center ${categoryAccent.icon}`}>
                    <TrendingUp className="size-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">TIR (alvo)</div>
                    <div className="mt-0.5 text-sm font-semibold">{offer.tir}% a.a.</div>
                  </div>
                </div>
              )}
              <div className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${categoryAccent.ring} ${categoryAccent.bg}`}>
                <div className={`h-8 w-8 rounded-md bg-white/70 ring-1 ring-white/60 flex items-center justify-center ${categoryAccent.icon}`}>
                  <Clock className="size-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Prazo</div>
                  <div className="mt-0.5 text-sm font-semibold">{offer.deadline}</div>
                </div>
              </div>
              {offer.payment && (
                <div className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${categoryAccent.ring} ${categoryAccent.bg}`}>
                  <div className={`h-8 w-8 rounded-md bg-white/70 ring-1 ring-white/60 flex items-center justify-center ${categoryAccent.icon}`}>
                    <HandCoins className="size-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Pagamento</div>
                    <div className="mt-0.5 text-sm font-semibold">{offer.payment}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Subnav sticky por seções */}
      <nav className="sticky top-16 z-40 bg-background/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-6 py-2 flex gap-2 sm:gap-4 text-sm">
          <a href="#operacao" className="px-3 py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">Operação</a>
          <a href="#empresa" className="px-3 py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">Empresa</a>
          <a href="#documentos" className="px-3 py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">Documentos</a>
          <a href="#dados" className="px-3 py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">Dados</a>
          <a href="#investidores" className="px-3 py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">Investidores</a>
        </div>
      </nav>

      <main className="py-8 bg-[#fcfcfc]">
        <div className="mx-auto max-w-6xl px-6 grid gap-8 lg:grid-cols-3">
          {/* Conteúdo principal */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden p-0">
              <div className="relative w-full aspect-[16/9]">
                 <Image
                   src={offer.cover}
                   alt={`Capa da oferta ${offer.name}`}
                   fill
                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
                   className="object-cover object-center"
                 />
               </div>
            </Card>

            {/* Sobre a operação */}
            <Card id="operacao" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Sobre a operação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{offer.aboutOperation}</p>
              </CardContent>
            </Card>

            {/* Sobre a empresa */}
            <Card id="empresa" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Sobre a empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{offer.aboutCompany}</p>
              </CardContent>
            </Card>

            {/* Empreendedor / Time */}
            <Card className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Empreendedor(es)</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... lista de empreendedores ... */}
              </CardContent>
            </Card>

            {/* Financials */}
            <Card id="dados" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Financials</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... financials ... */}
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card id="documentos" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... documentos ... */}
              </CardContent>
            </Card>

            {/* Informações essenciais */}
            <Card className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Informações essenciais</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... essenciais ... */}
              </CardContent>
            </Card>

            {/* Investidores */}
            <Card id="investidores" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Investidores</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... investidores ... */}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="lg:sticky lg:top-28">
              <CardHeader>
                <CardTitle>Condições da oferta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* CTA principal */}
                <Button size="lg" className="w-full">Investir agora</Button>

                {/* Progresso */}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progresso</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-secondary">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-primary to-blue-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>R$ {offer.raised.toLocaleString('pt-BR')}</span>
                    <span>Meta R$ {offer.goal.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                {/* Estatísticas com ícones (removidas redundâncias) */}
                <div className="grid gap-3">
                  <div className="rounded-xl border p-3 bg-muted/30">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Investimento mínimo</div>
                    <div className="mt-0.5 text-sm font-semibold">R$ {offer.min.toLocaleString('pt-BR')}</div>
                  </div>
                  {offer.product && (
                    <div className="rounded-xl border p-3 bg-muted/30">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Produto</div>
                      <div className="mt-0.5 text-sm font-semibold">{offer.product}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}