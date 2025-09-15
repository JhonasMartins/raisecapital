'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Layers, BarChart3, ArrowRight, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { slugify } from "@/lib/utils";

export default function Home() {
  // Helper para montar URL de embed do TradingView com opções JSON
  const tvUrl = (name: string, options: Record<string, unknown>) =>
    `https://s.tradingview.com/embed-widget/${name}/?locale=br#${encodeURIComponent(
      JSON.stringify(options)
    )}`;

  // Estado para os posts mais recentes do blog
  type BlogItem = { title: string; slug: string; excerpt: string; cover: string; date: string }
  const [latestPosts, setLatestPosts] = useState<BlogItem[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/blog?limit=3', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error('failed')))
      .then((d) => { if (!cancelled) setLatestPosts(Array.isArray(d?.items) ? d.items : []) })
      .catch(() => { /* noop */ })
    return () => { cancelled = true }
  }, [])

  // Ofertas em destaque (últimas 3 da plataforma)
  type OfferItem = { name: string; slug?: string; category: string; modality: string; min: number; raised: number; goal: number; deadline: string; cover: string; status: string }
  const [featuredOffers, setFeaturedOffers] = useState<OfferItem[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(false)
  const [nlEmail, setNlEmail] = useState('')
  const [nlStatus, setNlStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [nlMsg, setNlMsg] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoadingFeatured(true)
        const res = await fetch('/api/ofertas?limit=3', { cache: 'no-store' })
        if (!res.ok) throw new Error('failed')
        const d = await res.json()
        const items: OfferItem[] = Array.isArray(d?.items) ? d.items : []
        if (!cancelled) setFeaturedOffers(items.slice(0, 3))
      } catch (e) {
        if (!cancelled) setFeaturedOffers([
          { name: 'Fintech XYZ', category: 'Fintech', modality: 'Equity', min: 1000, raised: 350000, goal: 500000, deadline: '25 dias', cover: '/offers/fintech.svg', status: 'Em captação' },
          { name: 'Agrotech Verde', category: 'Agrotech', modality: 'Dívida', min: 500, raised: 120000, goal: 300000, deadline: '18 dias', cover: '/offers/agrotech.svg', status: 'Em captação' },
          { name: 'HealthTech Vida', category: 'HealthTech', modality: 'Revenue Share', min: 2000, raised: 450000, goal: 450000, deadline: 'Encerrando', cover: '/offers/health.svg', status: 'Encerrada' },
        ])
      } finally {
        if (!cancelled) setLoadingFeatured(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen font-sans">
      {/* navbar local removido — usamos o global no layout */}
      <main className="pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 -mt-28 pt-28">
          {/* Background image + overlay */}
          <div className="absolute inset-0 -z-10">
            <Image src="/background-hero.png" alt="Fundo do hero" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-950/70 to-[#0b1020]/85" />
          </div>

          <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-10 items-center min-h-[60vh] md:min-h-[68vh]">
            {/* Conteúdo à esquerda */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 bg-white/10 text-white border border-white/20" variant="secondary">Equity Crowdfunding</Badge>
              <h1 className="text-4xl/tight sm:text-5xl/tight font-semibold text-white">
                Invista em startups e projetos de alto potencial
              </h1>
              <p className="mt-4 text-white/80">
                A Raise Capital conecta você a oportunidades selecionadas de investimento
                com transparência, curadoria e segurança.
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild className="bg-white text-blue-950 hover:bg-white/90">
                  <Link href="/ofertas" className="inline-flex items-center gap-2">
                    Explorar oportunidades <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="bg-transparent border-white/40 text-white hover:bg-white/10">
                  <a href="#investidores">Como funciona</a>
                </Button>
              </div>
              <div className="mt-6 text-xs text-white/70">
                Risco de perda total do capital investido. Invista com responsabilidade.
              </div>
            </motion.div>

            {/* Card translúcido com efeito de vídeo e gráfico de renda fixa (mais completo) */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
              <div className="relative rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-2xl">
                <div className="relative h-72 w-full overflow-hidden rounded-lg bg-white/5">
                  {/* camadas para efeito "vídeo" translúcido */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-30" />
                  <div className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(transparent_0px,transparent_2px,rgba(255,255,255,0.04)_2px,rgba(255,255,255,0.04)_3px)] opacity-30" />
                  <div className="pointer-events-none absolute -inset-x-10 -inset-y-10 animate-[spin_16s_linear_infinite] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_45%)]" />

                  {/* gráfico detalhado */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 320 200" className="h-full w-full" aria-label="Comparativo Renda Fixa">
                      <defs>
                        <linearGradient id="areaCDI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* grid */}
                      <g stroke="white" strokeOpacity="0.08" strokeWidth="1">
                        <path d="M40 170 H300" />
                        <path d="M40 130 H300" />
                        <path d="M40 90 H300" />
                        <path d="M40 50 H300" />
                        <path d="M40 10 H300" />
                      </g>

                      {/* eixos */}
                      <g stroke="white" strokeOpacity="0.3" strokeWidth="1.5">
                        <path d="M40 170 H300" />
                        <path d="M40 170 V20" />
                      </g>

                      {/* rótulos eixo Y */}
                      <g fill="white" fillOpacity="0.65" fontSize="10">
                        <text x="10" y="174">0%</text>
                        <text x="2" y="134">5%</text>
                        <text x="2" y="94">10%</text>
                        <text x="2" y="54">15%</text>
                        <text x="2" y="14">20%</text>
                      </g>

                      {/* rótulos eixo X */}
                      <g fill="white" fillOpacity="0.65" fontSize="10">
                        <text x="45" y="188">Jan</text>
                        <text x="95" y="188">Mar</text>
                        <text x="145" y="188">Mai</text>
                        <text x="195" y="188">Jul</text>
                        <text x="245" y="188">Set</text>
                        <text x="285" y="188">Nov</text>
                      </g>

                      {/* Série CDI (linha + área) */}
                      <path d="M40 150 L90 142 L140 132 L190 120 L240 110 L290 104" fill="url(#areaCDI)" stroke="none" />
                      <path d="M40 150 L90 142 L140 132 L190 120 L240 110 L290 104" stroke="white" strokeWidth="2" fill="none" />

                      {/* Série CDB Médio */}
                      <path d="M40 158 L90 150 L140 138 L190 126 L240 114 L290 107" stroke="#A5B4FC" strokeWidth="2" fill="none" strokeDasharray="4 4" />

                      {/* pontos e valores finais */}
                      <g>
                        <circle cx="290" cy="104" r="3.5" fill="white" />
                        <text x="296" y="108" fontSize="10" fill="white" fillOpacity="0.9">12,3%</text>
                        <circle cx="290" cy="107" r="3.5" fill="#A5B4FC" />
                        <text x="296" y="112" fontSize="10" fill="#A5B4FC">12,0%</text>
                      </g>

                      {/* legenda */}
                      <g>
                        <rect x="48" y="28" width="10" height="2" fill="white" />
                        <text x="64" y="31" fontSize="11" fill="white" fillOpacity="0.9">CDI</text>
                        <rect x="98" y="28" width="10" height="2" fill="#A5B4FC" />
                        <text x="114" y="31" fontSize="11" fill="#A5B4FC">CDB Médio</text>
                      </g>
                    </svg>
                  </div>

                  <div className="absolute bottom-3 left-3 text-white/80 text-xs">Renda Fixa</div>
                </div>

                {/* KPIs abaixo do gráfico */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-white/80 text-xs">
                  <div className="rounded-md border border-white/15 bg-white/5 p-2">
                    <div className="text-[11px]">CDI</div>
                    <div className="text-white text-sm font-medium">12,30% a.a.</div>
                  </div>
                  <div className="rounded-md border border-white/15 bg-white/5 p-2">
                    <div className="text-[11px]">Tesouro Selic</div>
                    <div className="text-white text-sm font-medium">12,15% a.a.</div>
                  </div>
                  <div className="rounded-md border border-white/15 bg-white/5 p-2">
                    <div className="text-[11px]">CDB Médio</div>
                    <div className="text-white text-sm font-medium">12,00% a.a.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mercado em tempo real */}
        <section id="mercado" className="py-16 border-t scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold">Mercado em tempo real</h2>
              <Badge variant="secondary" className="hidden sm:inline">Dados dinâmicos</Badge>
            </div>

            {/* Ticker de cotações */}
            <div className="mt-6">
              <div className="rounded-lg border bg-background overflow-hidden relative">
                <iframe
                  src={tvUrl('ticker-tape', {
                    symbols: [
                      { proName: 'BMFBOVESPA:IBOV', title: 'IBOV' },
                      { proName: 'FX_IDC:USDBRL', title: 'USD/BRL' },
                      { proName: 'BMFBOVESPA:PETR4', title: 'PETR4' },
                      { proName: 'BMFBOVESPA:VALE3', title: 'VALE3' },
                      { proName: 'BINANCE:BTCUSDT', title: 'BTC/USDT' },
                      { proName: 'NASDAQ:TSLA', title: 'TSLA' },
                    ],
                    showSymbolLogo: true,
                    isTransparent: true,
                    displayMode: 'adaptive',
                    colorTheme: 'light',
                  })}
                  className="w-full h-14"
                  style={{ boxSizing: 'border-box' }}
                  frameBorder="0"
                  scrolling="no"
                  title="Ticker em tempo real"
                />
                <a
                  href="https://raisecapital.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Acessar raisecapital.com.br"
                  className="absolute inset-0"
                >
                  <span className="sr-only">Acessar raisecapital.com.br</span>
                </a>
              </div>
            </div>


          </div>
        </section>

        {/* Ofertas / Projetos */}
        <section id="projetos" className="py-16 border-t scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold">Ofertas em destaque</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="text-foreground" asChild>
                  <Link href="/ofertas">Ver todas as ofertas</Link>
                </Button>
                {/* Removido: botão Adicionar projeto */}
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loadingFeatured && featuredOffers.length === 0 && (
                <div className="col-span-full text-sm text-muted-foreground">Carregando ofertas...</div>
              )}
              {!loadingFeatured && featuredOffers.length === 0 && (
                <div className="col-span-full text-sm text-muted-foreground">Nenhuma oferta disponível.</div>
              )}
              {featuredOffers.map((o) => (
                <Card key={o.name} className="relative overflow-hidden pt-0">
                  <div className="relative h-36 w-full">
                    <Image src={o.cover} alt="" fill className="object-cover" />
                  </div>
                  <Link
                    href={`/ofertas/${o.slug ?? slugify(o.name)}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Ver detalhes da oferta ${o.name}`}
                  />
                  <CardHeader className="pt-3 pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{o.modality}</Badge>
                      <Badge className={`${o.status === 'Em captação'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : o.status === 'Encerrada'
                        ? 'bg-gray-100 text-gray-700 border border-gray-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{o.status}</Badge>
                    </div>
                    <CardTitle className="mt-2 text-base font-semibold leading-snug">{o.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Arrecadado</span>
                        <span className="text-foreground font-medium">
                          R$ {o.raised.toLocaleString('pt-BR')} de R$ {o.goal.toLocaleString('pt-BR')} ({Math.min(100, Math.round((o.raised / o.goal) * 100))}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, Math.round((o.raised / o.goal) * 100))}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Investimento mínimo</span>
                      <span className="text-foreground font-medium">R$ {o.min.toLocaleString('pt-BR')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="sobre" className="py-16 border-t scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-semibold">Por que a Raise Capital?</h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="size-5" />
                  </div>
                  <CardTitle className="text-base">Due diligence</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Processo rigoroso de seleção e análise de projetos.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <Layers className="size-5" />
                  </div>
                  <CardTitle className="text-base">Diversificação</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Monte um portfólio equilibrado para reduzir riscos.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <BarChart3 className="size-5" />
                  </div>
                  <CardTitle className="text-base">Transparência</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Acompanhe métricas, documentos e atualizações em um só lugar.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Para Investidores */}
        <section id="investidores" className="py-16 border-t bg-[#f2f2f2] scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold">Para Investidores</h2>
              <p className="mt-2 text-muted-foreground">
                Invista de forma inteligente, segura e eficiente. Junte-se a nós e aproveite as melhores oportunidades do mercado financeiro!
              </p>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-medium">Benefícios da Raise Capital</h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2 items-stretch">
                {/* Coluna Esquerda: Imagem 2:3 */}
                <div className="relative aspect-[2/3] md:aspect-auto md:h-full rounded-xl border bg-muted overflow-hidden">
                  <Image
                    src="/beneficios.png"
                    alt="Benefícios para investidores na Raise Capital"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Coluna Direita: Conteúdo */}
                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Shield className="size-5" />
                    </div>
                    <div>
                      <p className="text-base font-medium">Acesso Exclusivo</p>
                      <p className="text-sm text-muted-foreground">
                        Descubra projetos com alto potencial de retorno, selecionados por especialistas com critérios rigorosos. Tenha acesso a oportunidades normalmente disponíveis apenas para grandes investidores.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <DollarSign className="size-5" />
                    </div>
                    <div>
                      <p className="text-base font-medium">Baixo Custo</p>
                      <p className="text-sm text-muted-foreground">
                        Permite investir em oportunidades que, em geral, estão disponíveis apenas para grandes investidores institucionais.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Layers className="size-5" />
                    </div>
                    <div>
                      <p className="text-base font-medium">Diversificação de Portfólio</p>
                      <p className="text-sm text-muted-foreground">
                        Amplie suas possibilidades investindo em diferentes setores da economia. Reduza riscos ao alocar recursos em projetos variados e inovadores.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <BarChart3 className="size-5" />
                    </div>
                    <div>
                      <p className="text-base font-medium">Transparência e Confiança</p>
                      <p className="text-sm text-muted-foreground">
                        Acompanhe seus investimentos com relatórios regulares e dashboards interativos, com atualizações em tempo real.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <TrendingUp className="size-5" />
                    </div>
                    <div>
                      <p className="text-base font-medium">Retornos Competitivos</p>
                      <p className="text-sm text-muted-foreground">
                        Invista com condições diferenciadas e potencialize seus ganhos com projetos inovadores e alinhados às tendências do mercado.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-medium">Como Investir</h3>
              <div className="mt-6 grid sm:grid-cols-3 gap-6">
                {[{n:1,t:"Cadastre-se",d:"Crie sua conta em minutos",img:"/cadastre-se.webp"},{n:2,t:"Explore",d:"Analise os projetos disponíveis",img:"/Explore.webp"},{n:3,t:"Invista",d:"Invista com total segurança",img:"/Invista.webp"}].map((s) => (
                  <Card key={s.n} className="overflow-hidden border-none shadow-none bg-transparent">
                    <div className="relative aspect-[3/2]">
                      <Image src={s.img} alt={s.t} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-3">
                        <span className="text-3xl font-bold text-primary">{s.n}</span> {s.t}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{s.d}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Para Empreendedores */}
        <section id="empreendedores" className="py-16 border-t scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold">Para Empreendedores</h2>
              <p className="mt-2 text-muted-foreground">
                Capte Investimentos — Transforme sua ideia em realidade com o apoio de investidores estratégicos.
              </p>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-medium">Processo de Captação</h3>
              <div className="mt-6 grid sm:grid-cols-3 gap-6 items-stretch">
                {[{n:1,t:"Submeta seu projeto",d:"Envie sua proposta e nossa equipe fará uma análise detalhada."},{n:2,t:"Estruturação",d:"Conte com nossa expertise para preparar seu projeto para captação."},{n:3,t:"Campanha de captação",d:"Divulgue sua campanha e conecte-se com investidores interessados."}].map((s) => (
                  <Card key={s.n} className="h-full border-none shadow-none bg-transparent">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">{s.n}</span>
                        {s.t}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{s.d}</CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link href="/auth/criar-conta?tipo=pj">Submeter projeto</Link>
                </Button>
                <Button variant="outline" asChild className="text-foreground">
                  <a href="https://wa.me/5511976511371" target="_blank" rel="noopener noreferrer">Falar com especialista</a>
                </Button>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-medium">Diferenciais</h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <TrendingUp className="size-5" />
                    </div>
                    <CardTitle className="text-base">Captação Eficiente</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Levante recursos de maneira rápida e sem burocracia.
                  </CardContent>
                </Card>

                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="size-5" />
                    </div>
                    <CardTitle className="text-base">Rede de Investidores</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Conecte-se com investidores interessados em apoiar sua ideia.
                  </CardContent>
                </Card>

                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <BarChart3 className="size-5" />
                    </div>
                    <CardTitle className="text-base">Visibilidade Estratégica</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Apresente seu projeto para uma ampla base de potenciais parceiros.
                  </CardContent>
                </Card>

                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Shield className="size-5" />
                    </div>
                    <CardTitle className="text-base">Apoio Especializado</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Conte com uma equipe experiente para auxiliar na estruturação do seu plano de captação.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Blog: Aprenda sobre o mercado */}
        <section id="blog" className="py-16 border-t scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Aprenda sobre o mercado</h2>
                <p className="mt-2 text-muted-foreground">Conteúdos e insights para investir melhor</p>
              </div>
              <Button variant="outline" className="text-foreground" asChild>
                <Link href="/blog">Ver todos os artigos</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="block group" aria-label={`Abrir artigo: ${a.title}`}>
                  <Card className="flex flex-col overflow-hidden p-0 gap-0 transition-shadow group-hover:shadow-md">
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={a.cover}
                        alt={`Capa do artigo ${a.title}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover border"
                        unoptimized
                      />
                    </div>
                    <CardHeader className="space-y-2 px-6 pt-4 pb-2">
                      <CardTitle className="text-base font-semibold">{a.title}</CardTitle>
                      <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString('pt-BR')}</div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground px-6 pt-2 pb-6">
                      {a.excerpt}
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {latestPosts.length === 0 && (
                <div className="col-span-full text-sm text-muted-foreground">Nenhum artigo publicado ainda.</div>
              )}
            </div>
          </div>
        </section>
        
          {/* Nossa Equipe */}
          <section id="equipe" className="py-16 border-t scroll-mt-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold">Nossa Equipe</h2>
                <p className="mt-2 text-muted-foreground">Conheça os Profissionais</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Uma equipe experiente e multidisciplinar pronta para te ajudar
                </p>
              </div>
        
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
                {[
                  {
                    name: "Ricardo C. Leite",
                    role: "CEO",
                    img: "/nossaequipe/RicardoC.webp",
                    bio:
                      "Sócio-fundador da Cerqueira Leite Advogados Associados; Mestre em Direito Comercial Internacional (LL.M.) pela UC-Davis (Califórnia); Especialista em Direito Tributário e Empresarial.",
                  },
                  {
                    name: "Paulo C. Souza",
                    role: "CFO",
                    img: "/nossaequipe/PauloC.webp",
                    bio:
                      "Especialista em finanças corporativas com mais de 15 anos de experiência em gestão de investimentos e planejamento financeiro estratégico.",
                  },
                  {
                    name: "Nathalia Carlet",
                    role: "Diretora Jurídica",
                    img: "/nossaequipe/NathaliaCarlet.webp",
                    bio:
                      "Advogada especializada em direito empresarial e regulatório, com expertise em estruturação de operações de investimento.",
                  },
                ].map((m, i) => (
                  <Card
                    key={m.name}
                    className="overflow-hidden border-none shadow-none bg-transparent"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                      <Image
                        src={m.img}
                        alt={`Foto de ${m.name}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{m.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {m.bio}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        
          {/* Conselho Consultivo */}
           <section id="conselho" className="py-16 border-t bg-[#0f172a] text-white scroll-mt-24">
             <div className="mx-auto max-w-6xl px-6">
               <div className="max-w-3xl">
                 <h2 className="text-2xl font-semibold">Conselho Consultivo</h2>
                 <p className="mt-2 text-white/70">Experiência executiva e estratégica para orientar nosso crescimento</p>
               </div>
         
             <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
               {[
                 {
                   name: "Ricardo C. Leite",
                   role: "Conselheiro",
                   img: "/conselho/RicardoC.webp",
                   bio:
                     "Sócio-fundador da Cerqueira Leite Advogados Associados. Mestre em Direito Comercial Internacional (LL.M.) pela UC-Davis (Califórnia). Especialista em Direito Tributário pelo Centro de Extensão Universitário. Especialista em Direito Empresarial pela PUC/SP.",
                 },
                 {
                   name: "Leonardo Chamsim",
                   role: "Conselheiro",
                   img: "/conselho/LeonardoChamsim.webp",
                   bio:
                     "Diretor Financeiro com mais de 21 anos de experiência em gestão empresarial e finanças corporativas. Especialista em planejamento estratégico, reestruturação de empresas e negociações globais. Participou de um IPO na NASDAQ e liderou operações em mercados internacionais. Engenheiro Mecânico, com MBA nos EUA. Inglês fluente e proficiente em espanhol. Bacharel em Direito pela Universidade São Francisco e mais. Idiomas: Português | Inglês | Espanhol",
                 },
                 {
                   name: "Oswaldo G. Schimdt",
                   role: "Conselheiro",
                   img: "/conselho/oswaldo.webp",
                   bio:
                     "Carreira consolidada em gestão de investimentos, com passagens pelo Unibanco, onde estruturou a primeira gestora de recursos independente de um grande banco varejista brasileiro, e pelo Citibank, como diretor de operações estruturadas. Engenheiro pela PUC-RJ, com MBA pela Universidade da Califórnia em Berkeley, é atualmente Diretor de Gestão na Versal Finance.",
                 },
                 {
                   name: "Álvaro Marangoni",
                   role: "Conselheiro",
                   img: "/conselho/lvaroMarangoni.webp",
                   bio:
                     "US Country Manager na Warren Financial Services, com ampla experiência no setor financeiro em posições de liderança no Morgan Stanley e Goldman Sachs. Fundador e parceiro da Quadrante Investimentos, é formado em Economia pela Universidade de San Francisco e possui cidadania americana, italiana e brasileira.",
                 },
                 {
                   name: "Paulo Amorim",
                   role: "Conselheiro",
                   img: "/conselho/paulo-amorim.webp",
                   bio:
                     "Conselheiro certificado pelo IBGC, com mais de 20 anos de experiência em liderança em empresas multinacionais e brasileiras dos setores automotivo, consumo, defesa, segurança e consultoria. Atuou como Conselheiro na Condor Química, Vigzul e na Marriott Graduate School of Business. Sócio responsável pela área de Board Services da Korn-Ferry Brasil.",
                 },
               ].map((m, i) => (
                 <Card
                   key={m.name}
                   className="overflow-hidden border-none shadow-none bg-transparent"
                 >
                   <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                     <Image
                       src={m.img}
                       alt={`Foto de ${m.name}`}
                       fill
                       sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                       className="object-cover"
                       priority={i === 0}
                     />
                   </div>
                   <CardHeader className="pb-2 border-b-0">
                    <CardTitle className="text-base text-white">{m.name}</CardTitle>
                    <p className="text-xs text-white/80">{m.role}</p>
                  </CardHeader>
                   <CardContent className="text-sm text-white/70">
                     {m.bio}
                   </CardContent>
                 </Card>
               ))}
             </div>
           </div>
         </section>
        
          {/* FAQ */}
          <section id="faq" className="py-16 border-t scroll-mt-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold">Perguntas frequentes</h2>
                <p className="mt-2 text-muted-foreground">Tire suas dúvidas sobre como investir na Raise Capital</p>
              </div>
        
              <div className="mt-8 grid gap-4">
                {[
                  {
                    q: "O que é a Raise Capital?",
                    a: "É uma plataforma digital que conecta negócios com alto potencial de retorno, como startups, empreendimentos imobiliários e projetos estruturados, a diversos tipos de investidores. Atuamos por meio de rodadas de investimento com segurança jurídica, 100% online, oferecendo acesso a ativos inovadores e com potencial de valorização.",
                  },
                  {
                    q: "O investimento é legal e regulado no Brasil?",
                    a: "Sim. O crowdfunding de investimento é regulamentado pela Comissão de Valores Mobiliários (CVM) através da Resolução CVM nº 88, que modernizou o processo no Brasil, ampliando limites de captação para R$ 15 milhões e flexibilizando a divulgação de ofertas. Todas as nossas operações são realizadas em conformidade com as regulamentações vigentes.",
                  },
                  {
                    q: "Como funciona o investimento?",
                    a: "O investidor se cadastra na plataforma Raise Capital, explora os projetos disponíveis, analisa as informações detalhadas e a documentação de cada oportunidade, e decide quanto deseja investir. Todo o processo é realizado digitalmente, de forma segura e transparente. Após o investimento, o investidor recebe atualizações regulares sobre o desempenho do projeto e os resultados.",
                  },
                  {
                    q: "Quais os modelos jurídicos usados nas rodadas?",
                    a: "Utilizamos estruturas jurídicas sólidas e reconhecidas pelo mercado, como Sociedades Anônimas (S.A.), Sociedades de Propósito Específico (SPE), e contratos de investimento coletivo. Cada projeto é estruturado com o modelo mais adequado às suas características e objetivos, sempre priorizando a segurança jurídica tanto para investidores quanto para empreendedores.",
                  },
                  {
                    q: "Quais os riscos de investir?",
                    a: "Como em qualquer investimento, existem riscos associados ao crowdfunding. Entre os principais estão: risco de mercado (flutuações nas condições econômicas), risco operacional (relacionado à gestão e execução do projeto), risco de liquidez (dificuldade em vender a participação antes do prazo previsto) e risco de perda do capital investido. Recomendamos que os investidores diversifiquem seus portfólios e invistam apenas valores que estão dispostos a comprometer por médio e longo prazo.",
                  },
                  {
                    q: "Como é feita a seleção dos projetos?",
                    a: "Aplicamos um rigoroso processo de seleção de projetos, que inclui análise de viabilidade econômica, due diligence jurídica e financeira, avaliação do modelo de negócios, análise do mercado e do potencial de crescimento, verificação da equipe de gestão e sua experiência prévia. Apenas projetos que passam por todos esses filtros são disponibilizados na plataforma.",
                  },
                  {
                    q: "Qual o valor mínimo para investir?",
                    a: "O valor mínimo de investimento varia de acordo com cada projeto, mas trabalhamos para tornar as oportunidades acessíveis a diferentes perfis de investidores. Na maioria dos projetos, o ticket mínimo é significativamente menor do que seria exigido em investimentos tradicionais similares.",
                  },
                  {
                    q: "Como acompanho meus investimentos?",
                    a: "Todos os investidores têm acesso a um dashboard personalizado onde podem acompanhar o desempenho de seus investimentos. Além disso, enviamos relatórios periódicos com atualizações sobre os projetos, e organizamos reuniões virtuais com os gestores para esclarecimento de dúvidas e apresentação de resultados.",
                  },
                  {
                    q: "Posso vender minha participação antes do prazo final do projeto?",
                    a: "A liquidez no mercado de crowdfunding ainda é limitada, e os investimentos são geralmente de médio a longo prazo. No entanto, trabalhamos para criar mecanismos que possibilitem a negociação de participações entre investidores, embora isso dependa de encontrar interessados na compra e de condições específicas previstas em cada contrato de investimento.",
                  },
                  {
                    q: "Quais são as taxas cobradas pela Raise Capital?",
                    a: "Nossa estrutura de taxas é transparente e inclui: taxa de sucesso sobre o valor captado (cobrada apenas se o projeto atingir sua meta), taxa de administração anual (para cobrir os custos de gestão e acompanhamento do investimento) e eventuais taxas de performance (caso o projeto supere determinados indicadores de desempenho pré-estabelecidos). Os valores específicos são detalhados em cada oportunidade de investimento.",
                  },
                ].map((item) => (
                  <details key={item.q} className="rounded-lg border bg-card p-4">
                    <summary className="cursor-pointer font-medium">{item.q}</summary>
                    <div className="pt-2 text-muted-foreground text-sm whitespace-pre-line">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        
          {/* CTA */}
          <section className="relative py-20 border-t overflow-hidden">
            <Image src="/backcta.webp" alt="" fill sizes="100vw" className="object-cover" priority />
            <div className="relative mx-auto max-w-6xl px-6 text-center">
              <h2 className="text-2xl font-semibold text-white">Pronto para investir com a Raise Capital?</h2>
              <p className="mt-2 text-white/80">
                Cadastre-se para receber acesso antecipado às primeiras oportunidades.
              </p>
              <div className="mt-6 inline-flex">
                <Button asChild variant="secondary">
                  <Link href="/auth/criar-conta">Criar conta</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        {/* Newsletter */}
        <section className="border-t py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-xl font-semibold">Inscreva-se na newsletter</h3>
                <p className="mt-1 text-muted-foreground text-sm">
                  Receba novidades sobre ofertas, atualizações e conteúdos da Raise Capital.
                </p>
              </div>
              <form
                className="flex w-full items-center gap-3"
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!nlEmail) return
                  try {
                    setNlStatus('loading')
                    setNlMsg('')
                    const res = await fetch('/api/newsletter', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: nlEmail, source: 'home' })
                    })
                    const data = await res.json().catch(() => ({}))
                    if (!res.ok || !data?.ok) throw new Error(data?.error || 'Falha ao inscrever')
                    setNlStatus('success')
                    setNlMsg('Inscrição realizada com sucesso!')
                    setNlEmail('')
                  } catch (err: unknown) {
                    setNlStatus('error')
                    const message = err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string'
                      ? (err as { message?: unknown }).message as string
                      : 'Erro ao inscrever, tente novamente.'
                    setNlMsg(message)
                  } finally {
                    setTimeout(() => { setNlStatus('idle'); setNlMsg('') }, 4000)
                  }
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Seu e-mail"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  className="h-11 w-full max-w-md rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
                  aria-label="Seu e-mail"
                />
                <Button type="submit" disabled={nlStatus==='loading'}>
                  {nlStatus==='loading' ? 'Enviando...' : 'Inscrever'}
                </Button>
              </form>
              {nlMsg && (
                <p role="status" className={`text-sm mt-2 ${nlStatus==='error' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {nlMsg}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    );
}
