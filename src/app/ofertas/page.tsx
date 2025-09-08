'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, Search, ChevronDown } from 'lucide-react'


export default function OfertasPage() {
  const categories = ['Todos', 'Fintech', 'Agrotech', 'HealthTech'] as const
  const modalities = ['Todas', 'Equity', 'Dívida', 'Revenue Share'] as const

  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('Todos')
  const [selectedModality, setSelectedModality] = useState<(typeof modalities)[number]>('Todas')
  const [query, setQuery] = useState('')

  // Removido: pills desktop (redundância)
  // const categoriesNoAll = categories.filter((c) => c !== 'Todos')
  // const modalitiesNoAll = modalities.filter((m) => m !== 'Todas')

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

  const filteredOffers = useMemo(
    () =>
      offers
        .filter(
          (o) =>
            (selectedCategory === 'Todos' || o.category === selectedCategory) &&
            (selectedModality === 'Todas' || o.modality === selectedModality)
        )
        .filter((o) => query.trim() === '' || o.name.toLowerCase().includes(query.trim().toLowerCase())),
    [offers, selectedCategory, selectedModality, query]
  )

  const isDefaultFilters = selectedCategory === 'Todos' && selectedModality === 'Todas'

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
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl font-semibold">Ofertas</h1>
          <p className="mt-2 text-muted-foreground">
            Explore oportunidades em diferentes setores e modelos de captação.
          </p>
        </div>
      </header>

      <main className="py-10">
        <div className="mx-auto max-w-6xl px-6">
          {/* Filtros */}
          <Card className="border bg-background/60 backdrop-blur">
            <CardContent className="p-4">
              {/* Mobile: busca + selects nativos */}
              <div className="sm:hidden grid gap-3">
                {/* Busca */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por nome da oferta"
                    className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
                    aria-label="Buscar ofertas"
                  />
                </div>

                {/* Categoria */}
                <div className="grid gap-1">
                  <label className="text-xs text-muted-foreground">Categoria</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as typeof categories[number])}
                      className="h-9 w-full rounded-md border bg-background pl-3 pr-8 text-sm"
                      aria-label="Filtrar por categoria"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Modalidade */}
                <div className="grid gap-1">
                  <label className="text-xs text-muted-foreground">Modalidade</label>
                  <div className="relative">
                    <select
                      value={selectedModality}
                      onChange={(e) => setSelectedModality(e.target.value as typeof modalities[number])}
                      className="h-9 w-full rounded-md border bg-background pl-3 pr-8 text-sm"
                      aria-label="Filtrar por modalidade"
                    >
                      {modalities.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>

                {(!isDefaultFilters || query.trim() !== '') && (
                  <div className="pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedCategory('Todos'); setSelectedModality('Todas'); setQuery('') }}
                      className="w-full justify-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <XCircle className="size-4" /> Limpar filtros
                    </Button>
                  </div>
                )}
              </div>

              {/* Desktop: barra profissional com busca + dropdowns */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center gap-4">
                {/* Busca */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por nome da oferta"
                    className="h-9 w-full min-w-[320px] rounded-md border bg-background pl-9 pr-3 text-sm"
                    aria-label="Buscar ofertas"
                  />
                </div>

                {/* Categoria */}
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">Categoria</span>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as typeof categories[number])}
                      className="h-9 w-[200px] rounded-md border bg-background pl-3 pr-8 text-sm"
                      aria-label="Filtrar por categoria"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Modalidade */}
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground">Modalidade</span>
                  <div className="relative">
                    <select
                      value={selectedModality}
                      onChange={(e) => setSelectedModality(e.target.value as typeof modalities[number])}
                      className="h-9 w-[200px] rounded-md border bg-background pl-3 pr-8 text-sm"
                      aria-label="Filtrar por modalidade"
                    >
                      {modalities.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>

                {(!isDefaultFilters || query.trim() !== '') && (
                  <div className="sm:ml-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedCategory('Todos'); setSelectedModality('Todas'); setQuery('') }}
                      className="gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <XCircle className="size-4" /> Limpar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grid de ofertas */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((o) => {
              const pct = Math.min(100, Math.round((o.raised / o.goal) * 100))
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

                  <CardHeader className="space-y-2 px-6 pt-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">{o.name}</CardTitle>
                      <Badge variant="secondary">{o.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{o.modality}</span>
                      <span>•</span>
                      <span>Ticket mín. R$ {o.min.toLocaleString('pt-BR')}</span>
                      <span className="ml-auto font-medium text-foreground/80">{o.status}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 px-6 pt-2 pb-6">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progresso</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>R$ {o.raised.toLocaleString('pt-BR')}</span>
                        <span>Meta R$ {o.goal.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Prazo: {o.deadline}</span>
                      <Button asChild size="sm">
                        <Link href="#">Ver oferta</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Estado vazio */}
          {filteredOffers.length === 0 && (
            <div className="mt-16 text-center text-sm text-muted-foreground">
              Nenhuma oferta encontrada com os filtros selecionados.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}