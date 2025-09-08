'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Layers, BarChart3, ArrowRight, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Helper para montar URL de embed do TradingView com opções JSON
  const tvUrl = (name: string, options: Record<string, unknown>) =>
    `https://s.tradingview.com/embed-widget/${name}/?locale=br#${encodeURIComponent(
      JSON.stringify(options)
    )}`;

  return (
    <div className="min-h-screen font-sans">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Image src="/logo.avif" alt="Raise Capital" width={180} height={44} sizes="180px" quality={100} className="block" priority />
            </Link>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
            <a href="#projetos" className="hover:text-foreground transition-colors">Projetos</a>
            <a href="#sobre" className="hover:text-foreground transition-colors">Sobre</a>
          </nav>
        </div>
      </header>

      <main className="pt-28">
        {/* Hero */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4" variant="secondary">Equity Crowdfunding</Badge>
              <h1 className="text-4xl/tight sm:text-5xl/tight font-semibold">
                Invista em startups e projetos de alto potencial
              </h1>
              <p className="mt-4 text-muted-foreground">
                A Raise Capital conecta você a oportunidades selecionadas de investimento
                com transparência, curadoria e segurança.
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <a href="#projetos" className="inline-flex items-center gap-2">
                    Explorar oportunidades <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#como-funciona">Como funciona</a>
                </Button>
              </div>
              <div className="mt-6 text-xs text-muted-foreground">
                Risco de perda total do capital investido. Invista com responsabilidade.
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
              <div className="aspect-video rounded-xl border bg-muted" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-primary/10" />
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-primary/10" />
            </motion.div>
          </div>
        </section>

        {/* Ofertas / Projetos */}
        <section id="projetos" className="py-16 border-t">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold">Ofertas em destaque</h2>
              <Button variant="outline" asChild>
                <a href="#">Ver todas as ofertas</a>
              </Button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Fintech XYZ", category: "Fintech", modality: "Equity", min: 1000, raised: 350000, goal: 500000, deadline: "25 dias", cover: "/offers/fintech.svg" },
                { name: "Agrotech Verde", category: "Agrotech", modality: "Dívida", min: 500, raised: 120000, goal: 300000, deadline: "18 dias", cover: "/offers/agrotech.svg" },
                { name: "HealthTech Vida", category: "HealthTech", modality: "Revenue Share", min: 2000, raised: 450000, goal: 450000, deadline: "Encerrando", cover: "/offers/health.svg" },
              ].map((o) => {
                const pct = Math.min(100, Math.round((o.raised / o.goal) * 100));
                return (
                  <Card key={o.name} className="flex flex-col overflow-hidden">
                    <div className="relative h-40 w-full">
                      <Image
                        src={o.cover}
                        alt={`Capa da oferta ${o.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">{o.name}</CardTitle>
                        <Badge variant="secondary">{o.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progresso</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span>R$ {o.raised.toLocaleString("pt-BR")}</span>
                          <span>Meta R$ {o.goal.toLocaleString("pt-BR")}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Modalidade</div>
                          <div className="text-sm font-medium">{o.modality}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Investimento mínimo</div>
                          <div className="text-sm font-medium">R$ {o.min.toLocaleString("pt-BR")}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Prazo</div>
                          <div className="text-sm font-medium">{o.deadline}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Total captado</div>
                          <div className="text-sm font-medium">R$ {o.raised.toLocaleString("pt-BR")}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><TrendingUp className="size-4" /> Potencial de crescimento</div>
                        <div className="flex items-center gap-1"><Users className="size-4" /> Equipe experiente</div>
                      </div>

                      <div className="pt-2">
                        <Button className="w-full" asChild>
                          <a href="#">
                            <DollarSign className="mr-2 size-4" /> Investir agora
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="sobre" className="py-16 border-t">
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

        {/* Steps */}
        <section id="como-funciona" className="py-16 border-t">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-semibold">Como funciona</h2>
            <div className="mt-8 grid sm:grid-cols-3 gap-6">
              {[{n:1,t:"Crie sua conta",d:"Verificação simples e segura"},{n:2,t:"Escolha projetos",d:"Analise tese, equipe e indicadores"},{n:3,t:"Invista e acompanhe",d:"Relatórios e atualizações periódicas"}].map((s) => (
                <Card key={s.n}>
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
        </section>

        {/* Mercado em tempo real (TradingView) */}
        <section id="mercado" className="py-16 border-t">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold">Mercado em tempo real</h2>
              <p className="mt-2 text-muted-foreground">Cotações em tempo real via TradingView</p>
            </div>

            {/* Ticker Tape */}
            <div className="rounded-lg border bg-card p-2 relative">
              <iframe
                title="Ticker Tape"
                className="w-full h-[64px]"
                src={tvUrl("ticker-tape", {
                  symbols: [
                    { proName: "ECONOMICS:BRINTR", description: "CDI (proxy)" },
                    { proName: "ECONOMICS:BRSELIC", description: "SELIC" },
                    { proName: "CRYPTO:BTCUSD", description: "Bitcoin" },
                    { proName: "CRYPTO:ETHUSD", description: "Ethereum" },
                    { proName: "CRYPTO:SOLUSD", description: "Solana" },
                    { proName: "CRYPTO:BNBUSD", description: "BNB" },
                  ],
                  showSymbolLogo: true,
                  colorTheme: "light",
                  isTransparent: true,
                  displayMode: "adaptive",
                })}
                style={{ border: 0 }}
                loading="lazy"
              />
              <a
                href="https://raisecapital.com.br"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir raisecapital.com.br"
                className="absolute inset-0 z-10 block"
              />
            </div>

          </div>
        </section>

        {/* Para Investidores */}
        <section id="investidores" className="py-16 border-t bg-[#f2f2f2]">
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
                    src="/globe.svg"
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
        <section id="empreendedores" className="py-16 border-t">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold">Para Empreendedores</h2>
              <p className="mt-2 text-muted-foreground">
                Capte Investimentos — Transforme sua ideia em realidade com o apoio de investidores estratégicos.
              </p>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-medium">Processo de Captação</h3>
              <div className="mt-6 grid sm:grid-cols-3 gap-6">
                {[{n:1,t:"Submeta seu projeto",d:"Envie sua proposta e nossa equipe fará uma análise detalhada."},{n:2,t:"Estruturação",d:"Conte com nossa expertise para preparar seu projeto para captação."},{n:3,t:"Campanha de captação",d:"Divulgue sua campanha e conecte-se com investidores interessados."}].map((s) => (
                  <Card key={s.n}>
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

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
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

              <Card>
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

              <Card>
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

              <Card>
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
        </section>

        {/* CTA */}
        <section className="py-16 border-t">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-2xl font-semibold">Pronto para investir com a Raise Capital?</h2>
            <p className="mt-2 text-muted-foreground">
              Cadastre-se para receber acesso antecipado às primeiras oportunidades.
            </p>
            <div className="mt-6 inline-flex">
              <Button asChild>
                <a href="#">Criar conta</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} Raise Capital</div>
          <div className="flex gap-4">
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
