import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus, FileText, Brain, Layers, CheckCircle2, Shield, Building2 } from 'lucide-react'

export const dynamic = 'force-static'

export default function CapteRecursosPage() {
  return (
    <div className="min-h-dvh font-sans pt-28">
      {/* Navbar local (mesmo padrão das demais páginas) */}
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

      {/* Hero */}
      <section className="relative -mt-28 pt-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900" />
        <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(800px_400px_at_10%_10%,white,transparent_50%),radial-gradient(600px_300px_at_90%_20%,white,transparent_50%)]" />

        <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge className="mb-4 bg-white/10 text-white border border-white/20" variant="secondary">Captação Estruturada</Badge>
            <h1 className="text-4xl/tight sm:text-5xl/tight font-semibold text-white">Capte recursos para acelerar o seu crescimento</h1>
            <p className="mt-4 text-white/80 max-w-2xl">
              Estruturamos operações sob medida para empresas em expansão. Capte de <span className="font-semibold text-white">R$ 1M a R$ 150M</span> com transparência, segurança e agilidade.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-white text-blue-950 hover:bg-white/90">
                <Link href="/auth/criar-conta">Cadastre-se agora</Link>
              </Button>
              <Button variant="outline" asChild className="bg-transparent border-white/40 text-white hover:bg-white/10">
                <Link href="/#sobre">Falar com um especialista</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-white/70">
              <div className="flex items-center gap-2"><Shield className="size-4" /> Compliance</div>
              <div className="flex items-center gap-2"><Building2 className="size-4" /> Mercado de Capitais</div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-2xl">
              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 360 220" className="h-full w-full" aria-label="Exemplo de estruturação">
                    <defs>
                      <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <g stroke="white" strokeOpacity="0.08" strokeWidth="1">
                      <path d="M40 180 H320" />
                      <path d="M40 140 H320" />
                      <path d="M40 100 H320" />
                      <path d="M40 60 H320" />
                    </g>
                    <g stroke="white" strokeOpacity="0.3" strokeWidth="1.5">
                      <path d="M40 180 H320" />
                      <path d="M40 180 V30" />
                    </g>
                    <path d="M40 165 L90 150 L140 135 L190 120 L240 105 L290 90 L320 85" fill="url(#gradArea)" stroke="none" />
                    <path d="M40 165 L90 150 L140 135 L190 120 L240 105 L290 90 L320 85" stroke="white" strokeWidth="2" fill="none" />
                    <g>
                      <circle cx="320" cy="85" r="3.5" fill="white" />
                      <text x="260" y="72" fontSize="11" fill="white" fillOpacity="0.85">Crescimento projetado</text>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-white/80 text-xs">
                <div className="rounded-md border border-white/15 bg-white/5 p-2">
                  <div className="text-[11px]">Ticket</div>
                  <div className="text-white text-sm font-medium">R$ 1M — R$ 150M</div>
                </div>
                <div className="rounded-md border border-white/15 bg-white/5 p-2">
                  <div className="text-[11px]">Prazo típico</div>
                  <div className="text-white text-sm font-medium">90—180 dias</div>
                </div>
                <div className="rounded-md border border-white/15 bg-white/5 p-2">
                  <div className="text-[11px]">Soluções</div>
                  <div className="text-white text-sm font-medium">Dívida, Equity e Híbridos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <main className="py-14 bg-[#fcfcfc]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">Como funciona</h2>
            <Button asChild variant="secondary"><Link href="/auth/criar-conta">Começar agora</Link></Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[{
              title: 'Cadastre-se',
              desc: 'Crie sua conta gratuitamente e conte sobre sua empresa e objetivos.',
              Icon: UserPlus
            }, {
              title: 'Proposta da operação',
              desc: 'Informe o montante desejado e os principais dados do negócio.',
              Icon: FileText
            }, {
              title: 'Análise inteligente',
              desc: 'Utilizamos modelos e dados para recomendar a melhor estrutura.',
              Icon: Brain
            }, {
              title: 'Estruturação',
              desc: 'Formalizamos a operação e coordenamos as etapas com os agentes.',
              Icon: Layers
            }, {
              title: 'Fechamento',
              desc: 'Acompanhamos você até a liquidação e o sucesso da captação.',
              Icon: CheckCircle2
            }].map(({ title, desc, Icon }) => (
              <Card key={title} className="h-full">
                <CardHeader className="space-y-2 pb-2">
                  <div className="flex items-center gap-2"><Icon className="size-4 text-blue-600" /><CardTitle className="text-base">{title}</CardTitle></div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground pt-0">{desc}</CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Segmentos */}
        <section className="mt-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-semibold">Segmentos que atendemos</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Atuamos com times dedicados na análise e estruturação em diferentes setores da economia.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[{
                title: 'Ativos Judiciais',
                desc: 'Aquisição e estruturação de recebíveis judiciais em diferentes esferas e perfis de risco.'
              }, {
                title: 'Energia',
                desc: 'Geração e ativos com fluxo previsível, proteção contra inflação e potencial de valorização.'
              }, {
                title: 'Agronegócio',
                desc: 'Cadeia com demanda constante e várias modalidades de financiamento e securitização.'
              }, {
                title: 'Real Estate',
                desc: 'Operações com lastro imobiliário em diferentes estratégias e estruturas.'
              }, {
                title: 'Private Equity',
                desc: 'Capital para consolidação, crescimento e aquisições em empresas operacionais.'
              }, {
                title: 'Crédito Empresarial',
                desc: 'Estruturas de dívida sob medida para expansão de empresas e projetos.'
              }].map(({ title, desc }) => (
                <Card key={title} className="h-full">
                  <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground pt-0">{desc}</CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Button asChild size="lg"><Link href="/auth/criar-conta">Cadastre-se gratuitamente</Link></Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}