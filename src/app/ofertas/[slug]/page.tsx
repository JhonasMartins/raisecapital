import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { slugify } from '@/lib/utils'
import { TrendingUp, DollarSign, Wallet, Clock, Layers, Package, CheckCircle2, FileDown, HandCoins } from 'lucide-react'

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

            {/* Sobre a operação */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre a operação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{offer.aboutOperation}</p>
              </CardContent>
            </Card>

            {/* Sobre a empresa */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre a empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{offer.aboutCompany}</p>
              </CardContent>
            </Card>

            {/* Empreendedor / Time */}
            <Card>
              <CardHeader>
                <CardTitle>Empreendedor(es)</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {offer.entrepreneurs?.map((p) => (
                  <div key={p.name} className="rounded-md border p-3">
                    <div className="font-medium">{p.name}</div>
                    {p.role && (
                      <div className="text-xs text-muted-foreground mt-0.5">{p.role}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Financials */}
            <Card>
              <CardHeader>
                <CardTitle>Financials</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {offer.financials?.map((f) => (
                  <div key={f.label} className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">{f.label}</div>
                    <div className="mt-1 font-medium">{f.value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {offer.documents?.map((d) => (
                  <a key={d.label} href={d.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-md border p-3 hover:bg-accent transition">
                    <span className="text-sm">{d.label}</span>
                    <span className="text-xs text-primary group-hover:underline">Baixar</span>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Informações essenciais */}
            <Card>
              <CardHeader>
                <CardTitle>Informações essenciais</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {offer.essentialInfo?.map((i) => (
                  <div key={i.label} className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">{i.label}</div>
                    <div className="mt-1 font-medium">{i.value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Investidores */}
            <Card>
              <CardHeader>
                <CardTitle>Investidores</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {offer.investors?.map((inv) => (
                  <div key={inv.name} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <span>{inv.name}</span>
                  </div>
                ))}
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

                {/* Estatísticas com ícones */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center"><TrendingUp className="size-4" /></div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">TIR (alvo)</div>
                      <div className="mt-0.5 text-sm font-semibold">{offer.tir != null ? `${offer.tir}% a.a.` : '—'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center"><DollarSign className="size-4" /></div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Valor captado</div>
                      <div className="mt-0.5 text-sm font-semibold">R$ {offer.raised.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center"><Wallet className="size-4" /></div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Investimento mínimo</div>
                      <div className="mt-0.5 text-sm font-semibold">R$ {offer.min.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center"><HandCoins className="size-4" /></div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Pagamento</div>
                      <div className="mt-0.5 text-sm font-semibold">{offer.payment ?? '—'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center"><Clock className="size-4" /></div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Prazo</div>
                      <div className="mt-0.5 text-sm font-semibold">{offer.deadline}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center"><Layers className="size-4" /></div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Modalidade</div>
                      <div className="mt-0.5 text-sm font-semibold">{offer.modality}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center"><Package className="size-4" /></div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Produto</div>
                      <div className="mt-0.5 text-sm font-semibold">{offer.product ?? '—'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 sm:col-span-2 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center"><CheckCircle2 className="size-4" /></div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusClass}`}>{offer.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apresentação resumo (PDF) */}
                {offer.summaryPdf && (
                  <Button size="lg" variant="outline" asChild className="w-full">
                    <a href={offer.summaryPdf} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                      <FileDown className="size-4" />
                      Baixar apresentação (PDF)
                    </a>
                  </Button>
                )}

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