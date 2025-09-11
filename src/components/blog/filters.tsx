"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ChevronDown, XCircle } from "lucide-react"

export type BlogFiltersProps = {
  q: string
  cat: string
  categories: string[]
  isDefaultFilters: boolean
}

export default function BlogFilters({ q, cat, categories, isDefaultFilters }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(q || "")
  const [category, setCategory] = useState(cat || "Todas")

  // Mantém outros parâmetros, se existirem. Reconstrói a cada navegação
  const baseParams = useMemo(() => {
    const sp = new URLSearchParams(searchParams?.toString() || "")
    // Vamos controlar apenas q e cat aqui
    sp.delete("q")
    sp.delete("cat")
    return sp
  }, [searchParams])

  function navigate(nextQ: string, nextCat: string, replace = true) {
    const params = new URLSearchParams(baseParams)
    const qTrim = (nextQ || "").trim()
    const catVal = nextCat || "Todas"
    if (qTrim.length > 0) params.set("q", qTrim)
    if (catVal && catVal !== "") params.set("cat", catVal)
    const qs = params.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    if (replace) router.replace(url)
    else router.push(url)
  }

  // Debounce para a busca
  useEffect(() => {
    const id = setTimeout(() => {
      navigate(search, category, true)
    }, 400)
    return () => clearTimeout(id)
  }, [search, category])

  // Mudança imediata ao trocar categoria
  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    setCategory(value)
    // Navegação imediata (o useEffect também irá rodar; mas já atualizamos aqui)
    navigate(search, value, true)
  }

  return (
    <div className="mt-6">
      <Card className="border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
        <CardContent className="p-4">
          <form method="GET" action="/blog" className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
            {/* Mobile */}
            <div className="sm:hidden grid gap-3">
              {/* Busca */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  name="q"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por título do artigo"
                  className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
                  aria-label="Buscar no blog"
                />
              </div>

              {/* Categoria */}
              <div className="grid gap-1">
                <label className="text-xs text-white/80">Categoria</label>
                <div className="relative">
                  <select
                    name="cat"
                    value={category || "Todas"}
                    onChange={handleCategoryChange}
                    className="h-9 w-full rounded-md border bg-background pl-3 pr-8 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </div>

              {/* Limpar filtros */}
              {!isDefaultFilters && (
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 self-start rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                  aria-label="Limpar filtros"
                >
                  <XCircle className="size-4" /> Limpar filtros
                </Link>
              )}
            </div>

            {/* Desktop */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-end gap-4">
              {/* Busca */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  name="q"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por título do artigo"
                  className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
                  aria-label="Buscar no blog"
                />
              </div>

              {/* Categoria */}
              <div className="grid gap-1">
                <label className="text-xs text-white/80">Categoria</label>
                <div className="relative">
                  <select
                    name="cat"
                    value={category || "Todas"}
                    onChange={handleCategoryChange}
                    className="h-9 w-44 rounded-md border bg-background pl-3 pr-8 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </div>

              {/* Reset */}
              {!isDefaultFilters && (
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                  aria-label="Limpar filtros"
                >
                  <XCircle className="size-4" /> Limpar filtros
                </Link>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}