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
              <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted">
                <Image
                  src="/background-hero.png"
                  alt="Imagem destaque do hero"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
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
                  <Card key={o.name} className="flex flex-col overflow-hidden p-0 gap-0">
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
                  <a href="#">Submeter projeto</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#">Falar com especialista</a>
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
        <section id="blog" className="py-16 border-t">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Aprenda sobre o mercado</h2>
                <p className="mt-2 text-muted-foreground">Conteúdos e insights para investir melhor</p>
              </div>
              <Button variant="outline" asChild>
                <a href="#">Ver todos os artigos</a>
              </Button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "O que é equity crowdfunding?",
                  excerpt: "Como funciona o modelo e para quem ele é indicado.",
                  cover: "/offers/fintech.svg",
                  date: "05 Set 2025",
                  read: "5 min"
                },
                {
                  title: "Como avaliar um projeto para investir",
                  excerpt: "Principais métricas e sinais para sua análise.",
                  cover: "/offers/agrotech.svg",
                  date: "28 Ago 2025",
                  read: "7 min"
                },
                {
                  title: "Diversificação: por que importa",
                  excerpt: "Estratégias para reduzir risco e melhorar retorno.",
                  cover: "/offers/health.svg",
                  date: "14 Ago 2025",
                  read: "4 min"
                }
              ].map((p, i) => (
                <Card key={i} className="flex flex-col overflow-hidden p-0 gap-0">
                  <div className="relative h-40 w-full">
                    <Image
                      src={p.cover}
                      alt={`Capa do artigo ${p.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-base font-semibold">{p.title}</CardTitle>
                    <div className="text-xs text-muted-foreground">{p.date} • {p.read} de leitura</div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {p.excerpt}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Nossa Equipe */}
        <section id="equipe" className="py-16 border-t">
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
         <section id="conselho" className="py-16 border-t bg-[#0f172a] text-white">
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
                   <CardHeader className="pb-2">
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
