'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
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
  const [loading, setLoading] = useState(false)

  type OfferItem = {
    name: string
    slug?: string
    category: string
    modality: string
    min: number
    raised: number
    goal: number
    deadline: string
    cover: string
    status: string
  }
 
   // Removido: pills desktop (redundância)
   // const categoriesNoAll = categories.filter((c) => c !== 'Todos')
   // const modalitiesNoAll = modalities.filter((m) => m !== 'Todas')
 
  const offersMock = [
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

  const [offers, setOffers] = useState<OfferItem[]>([])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function load() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (query.trim()) params.set('q', query.trim())
        if (selectedCategory !== 'Todos') params.set('category', selectedCategory)
        if (selectedModality !== 'Todas') params.set('modality', selectedModality)
        const res = await fetch(`/api/ofertas?${params.toString()}`, { signal: controller.signal })
        if (!res.ok) throw new Error('Falha ao carregar ofertas')
        const data = await res.json()
        const items: OfferItem[] = Array.isArray(data.items) ? data.items : []
        if (isMounted) setOffers(items)
      } catch (e) {
        // Fallback para mocks se API falhar
        if (isMounted) setOffers(offersMock as OfferItem[])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false; controller.abort() }
  }, [query, selectedCategory, selectedModality])
 
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
             {loading && filteredOffers.length === 0 && (
               <div className="col-span-full text-sm text-muted-foreground">Carregando ofertas...</div>
             )}
             {!loading && filteredOffers.length === 0 && (
               <div className="col-span-full text-sm text-muted-foreground">Nenhuma oferta encontrada.</div>
             )}
             {filteredOffers.map((o) => (
               <Card key={o.name} className="relative overflow-hidden pt-0">
                 <div className="relative h-36 w-full">
                   <Image src={o.cover} alt="" fill className="object-cover" />
                 </div>
                 <Link
                   href={`/ofertas/${o.slug ?? slugify(o.name)}`}
                   className="absolute inset-0 z-10"
                   aria-label={`Ver detalhes da oferta ${o.name}`}
                 />
                 <CardHeader className="pb-2">
                   <div className="flex items-center justify-between">
                     <CardTitle className="text-base font-semibold">{o.name}</CardTitle>
                     <div className="flex items-center gap-2">
                       <Badge variant="secondary">{o.modality}</Badge>
                       <Badge className={`${o.status === 'Em captação'
                         ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                         : o.status === 'Encerrada'
                         ? 'bg-gray-100 text-gray-700 border border-gray-200'
                         : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{o.status}</Badge>
                     </div>
                   </div>
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
       </main>
     </div>
   )
 }