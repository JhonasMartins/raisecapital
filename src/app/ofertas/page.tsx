'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, Search, ChevronDown } from 'lucide-react'
import { slugify } from '@/lib/utils'


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
      {/* navbar local removido — usamos o global no layout */}

      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl font-semibold">Ofertas</h1>
          <p className="mt-2 text-muted-foreground">
            Explore oportunidades em diferentes setores e modelos de captação.
          </p>
        </div>
      </header>

      <main className="py-10 bg-[#fcfcfc]">
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
                      onChange={(e) => setSelectedCategory(e.target.value as (typeof categories)[number])}
                      className="h-9 w-full rounded-md border bg-background pl-3 pr-8 text-sm"
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
                      onChange={(e) => setSelectedModality(e.target.value as (typeof modalities)[number])}
                      className="h-9 w-full rounded-md border bg-background pl-3 pr-8 text-sm"
                    >
                      {modalities.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Limpar filtros */}
                {!isDefaultFilters && (
                  <button
                    onClick={() => { setSelectedCategory('Todos'); setSelectedModality('Todas'); setQuery('') }}
                    className="inline-flex items-center gap-2 self-start rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    <XCircle className="size-4" /> Limpar filtros
                  </button>
                )}
              </div>

              {/* Desktop: busca + selects alinhados */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center gap-4">
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
                      onChange={(e) => setSelectedCategory(e.target.value as (typeof categories)[number])}
                      className="h-9 w-44 rounded-md border bg-background pl-3 pr-8 text-sm"
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
                      onChange={(e) => setSelectedModality(e.target.value as (typeof modalities)[number])}
                      className="h-9 w-44 rounded-md border bg-background pl-3 pr-8 text-sm"
                    >
                      {modalities.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Reset */}
                {!isDefaultFilters && (
                  <button
                    onClick={() => { setSelectedCategory('Todos'); setSelectedModality('Todas'); setQuery('') }}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    <XCircle className="size-4" /> Limpar filtros
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((o) => (
              <Card key={o.name} className="overflow-hidden">
                <div className="relative h-36 w-full">
                  <Image src={o.cover} alt="" fill className="object-cover" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{o.name}</CardTitle>
                    <Badge variant="secondary">{o.modality}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Meta</span>
                    <span className="text-foreground font-medium">R$ {o.goal.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Arrecadado</span>
                    <span className="text-foreground font-medium">R$ {o.raised.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Investimento mínimo</span>
                    <span className="text-foreground font-medium">R$ {o.min.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className="text-foreground font-medium">{o.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}