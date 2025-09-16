"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatBRL } from "@/lib/utils"
import { Building2, Wheat, Factory, QrCode, TrendingUp, CheckCircle2, Hourglass, Download } from "lucide-react"
import PortfolioDistributionChart from "@/components/portfolio-distribution-chart"

// Função para obter ícone baseado na categoria
function getCategoryIcon(categoria: string) {
  switch (categoria?.toLowerCase()) {
    case 'imobiliário':
    case 'imobiliario':
      return <Building2 className="h-5 w-5 text-muted-foreground" />
    case 'agro':
    case 'agronegócio':
      return <Wheat className="h-5 w-5 text-muted-foreground" />
    case 'infra':
    case 'infraestrutura':
      return <Factory className="h-5 w-5 text-muted-foreground" />
    default:
      return <Building2 className="h-5 w-5 text-muted-foreground" />
  }
}

export default function MeusInvestimentosPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [categoria, setCategoria] = useState<string>("todas")
  const [tab, setTab] = useState<"pendentes" | "ativos">("pendentes")
  
  // Estados para dados reais
  const [investments, setInvestments] = useState<any[]>([])
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)

  // Buscar dados reais das APIs
  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingData(true)
        
        // Buscar investimentos
        const investmentsRes = await fetch('/api/investments')
        if (investmentsRes.ok) {
          const investmentsData = await investmentsRes.json()
          setInvestments(investmentsData.investments || [])
        }
        
        // Buscar dados do portfólio
        const portfolioRes = await fetch('/api/portfolio')
        if (portfolioRes.ok) {
          const portfolioDataRes = await portfolioRes.json()
          setPortfolioData(portfolioDataRes)
        }
        
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoadingData(false)
      }
    }
    
    fetchData()
  }, [])

  // Separar investimentos em pendentes e ativos baseado no status
  const pendentesItems = useMemo(() => {
    return investments
      .filter(inv => inv.status === 'pendente' || inv.status === 'aguardando_pagamento')
      .map(inv => ({
        icon: getCategoryIcon(inv.categoria),
        nome: inv.titulo,
        ofertaId: inv.oferta_id,
        valor: inv.valor_investido,
        categoria: inv.categoria || 'Outros'
      }))
  }, [investments])

  const ativosItems = useMemo(() => {
    return investments
      .filter(inv => inv.status === 'ativo' || inv.status === 'confirmado')
      .map(inv => ({
        icon: getCategoryIcon(inv.categoria),
        nome: inv.titulo,
        aportado: inv.valor_investido,
        rentab: inv.rentabilidade || 0,
        categoria: inv.categoria || 'Outros'
      }))
  }, [investments])

  // Obter categorias únicas dos dados reais
  const categorias = useMemo(() => {
    const uniqueCategories = [...new Set(investments.map(inv => inv.categoria).filter(Boolean))]
    return ["todas", ...uniqueCategories]
  }, [investments])

  const pendentesFiltrados = useMemo(() => {
    return pendentesItems.filter((i) =>
      (categoria === "todas" || i.categoria === categoria) && i.nome.toLowerCase().includes(query.toLowerCase())
    )
  }, [pendentesItems, categoria, query])

  const ativosFiltrados = useMemo(() => {
    return ativosItems.filter((i) =>
      (categoria === "todas" || i.categoria === categoria) && i.nome.toLowerCase().includes(query.toLowerCase())
    )
  }, [ativosItems, categoria, query])

  // Usar dados reais do portfólio ou calcular dos investimentos
  const totalAportado = useMemo(() => {
    return portfolioData?.totalInvestido || ativosItems.reduce((acc, i) => acc + i.aportado, 0)
  }, [portfolioData, ativosItems])
  
  const totalPendentes = useMemo(() => {
    return pendentesItems.reduce((acc, i) => acc + i.valor, 0)
  }, [pendentesItems])

  const distData = useMemo(() => {
    // Usar dados de distribuição da API se disponível
    if (portfolioData?.distribuicaoPorCategoria) {
      const palette: Record<string, string> = {
        "Imobiliário": "var(--chart-1)",
        "Agro": "var(--chart-2)", 
        "Infra": "var(--chart-3)",
        "Outros": "var(--chart-4)",
      }
      
      return portfolioData.distribuicaoPorCategoria.map((item: any, idx: number) => ({
        key: item.categoria.toLowerCase(),
        label: item.categoria,
        value: item.valor,
        color: palette[item.categoria] || ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"][idx % 4],
      }))
    }
    
    // Fallback: calcular dos investimentos ativos
    const byCat: Record<string, number> = {}
    for (const i of ativosItems) byCat[i.categoria] = (byCat[i.categoria] || 0) + i.aportado
    const palette: Record<string, string> = {
      "Imobiliário": "var(--chart-1)",
      "Agro": "var(--chart-2)",
      "Infra": "var(--chart-3)",
      "Outros": "var(--chart-4)",
    }
    return Object.entries(byCat).map(([label, value], idx) => ({
      key: label.toLowerCase(),
      label,
      value,
      color: palette[label] || ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"][idx % 4],
    }))
  }, [portfolioData, ativosItems])

  async function handlePagar(ofertaId: string, valor: number) {
    try {
      setIsLoading(true)
      setQrCode(null)
      const res = await fetch("/api/asaas/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ofertaId, valor })
      })
      if (!res.ok) throw new Error("Falha ao criar pagamento")
      const data = await res.json()
      setQrCode(data?.encodedImage || null)
    } catch (e) {
      console.error(e)
      alert("Não foi possível gerar o QRCode no momento.")
    } finally {
      setIsLoading(false)
    }
  }

  function exportCSV() {
    const rows: string[] = []
    if (tab === "pendentes") {
      rows.push(["Oferta", "Categoria", "Valor"].join(","))
      pendentesFiltrados.forEach((i) => rows.push([i.nome, i.categoria, String(i.valor)].join(",")))
    } else {
      rows.push(["Oferta", "Categoria", "Aportado", "Rentab.%"].join(","))
      ativosFiltrados.forEach((i) => rows.push([i.nome, i.categoria, String(i.aportado), String(i.rentab)].join(",")))
    }
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = tab === "pendentes" ? "pendencias.csv" : "posicoes.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {loadingData ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Carregando seus investimentos...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold">Meus investimentos</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Acompanhe seus aportes, gere PIX e visualize sua distribuição</p>
            </div>
          </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-1 sm:items-center sm:gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ofertas"
            className="w-full sm:max-w-xs"
            aria-label="Buscar ofertas"
          />
          <Select value={categoria} onValueChange={(v) => setCategoria(v)}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c} value={c}>{c === "todas" ? "Todas categorias" : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} className="w-full sm:w-auto shrink-0">
          <Download className="mr-2 h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      {/* KPIs 2x2 */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi title="Aportado" value={formatBRL(totalAportado)} icon={<CheckCircle2 className="size-4 sm:size-5 text-primary" />} />
        <Kpi title="Em análise" value={formatBRL(portfolioData?.emAnalise || 5000)} icon={<Hourglass className="size-4 sm:size-5 text-primary" />} />
        <Kpi title="Rentabilidade" value={portfolioData?.rentabilidadeTotal ? `+${portfolioData.rentabilidadeTotal}%` : "+7,3%"} icon={<TrendingUp className="size-4 sm:size-5 text-primary" />} />
        <Kpi title="Pendentes" value={formatBRL(totalPendentes)} icon={<QrCode className="size-4 sm:size-5 text-primary" />} />
      </div>

      {/* Distribuição por categoria */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base font-semibold">Distribuição por categoria</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Composição da sua carteira atual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="rounded-md border p-2 sm:p-3">
            <PortfolioDistributionChart data={distData} height={200} />
          </div>
          <div className="grid gap-2 text-xs sm:text-sm sm:grid-cols-2 lg:grid-cols-3">
            {distData.map((d: any) => (
              <div key={d.key} className="flex items-center justify-between rounded-md border bg-card px-2 py-2 sm:px-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-sm" style={{ backgroundColor: d.color }} aria-hidden />
                  <span className="truncate">{d.label}</span>
                </div>
                <span className="tabular-nums text-xs sm:text-sm">{formatBRL(d.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ofertas / Posições */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base font-semibold">Ofertas</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Selecione uma oferta, informe o valor e pague via PIX</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-2">
              <TabsTrigger value="pendentes" className="text-xs sm:text-sm">Pendentes</TabsTrigger>
              <TabsTrigger value="ativos" className="text-xs sm:text-sm">Ativos</TabsTrigger>
            </TabsList>
            <TabsContent value="pendentes">
              <div className="-mx-3 sm:mx-0 overflow-x-auto">
                <Table className="min-w-[500px] sm:min-w-0">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="pl-3 sm:pl-0 py-2 text-[10px] sm:text-[11px] uppercase tracking-wide text-foreground">Oferta</TableHead>
                      <TableHead className="py-2 text-[10px] sm:text-[11px] uppercase tracking-wide text-foreground hidden sm:table-cell">Categoria</TableHead>
                      <TableHead className="py-2 text-right text-[10px] sm:text-[11px] uppercase tracking-wide text-foreground">Aporte</TableHead>
                      <TableHead className="py-2 text-right text-[10px] sm:text-[11px] uppercase tracking-wide text-foreground pr-3 sm:pr-0">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendentesFiltrados.length ? (
                      pendentesFiltrados.map((p) => (
                        <RowPendente
                          key={p.ofertaId}
                          icon={p.icon}
                          nome={p.nome}
                          ofertaId={p.ofertaId}
                          valor={p.valor}
                          categoria={p.categoria}
                          onPagar={handlePagar}
                          isLoading={isLoading}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-40 sm:h-56 text-center">
                          <div className="flex h-full flex-col items-center justify-center gap-2 sm:gap-3 py-4 sm:py-6">
                            <img
                              src="/assets/62d95badcd68f3228ea7ba5d_no-records-found-illustration-dashboardly-webflow-ecommerce-template.png"
                              alt="Sem registros"
                              className="h-16 sm:h-24 w-auto opacity-80"
                            />
                            <div className="text-xs sm:text-sm text-muted-foreground">Nenhuma oferta pendente encontrada</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground">Ajuste os filtros ou tente outra busca.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="ativos">
              <div className="-mx-3 sm:mx-0 overflow-x-auto">
                <Table className="min-w-[500px] sm:min-w-0">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="pl-3 sm:pl-0 py-2 text-[10px] sm:text-[11px] uppercase tracking-wide text-foreground">Oferta</TableHead>
                      <TableHead className="py-2 text-[10px] sm:text-[11px] uppercase tracking-wide text-foreground hidden sm:table-cell">Categoria</TableHead>
                      <TableHead className="py-2 text-right text-[10px] sm:text-[11px] uppercase tracking-wide text-foreground">Aportado</TableHead>
                      <TableHead className="py-2 text-right text-[10px] sm:text-[11px] uppercase tracking-wide text-foreground pr-3 sm:pr-0">Rentab.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ativosFiltrados.length ? (
                      ativosFiltrados.map((a, idx) => (
                        <TableRow key={`${a.nome}-${idx}`} className="odd:bg-muted/20">
                          <TableCell className="pl-3 sm:pl-0 py-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <div className="shrink-0">{a.icon}</div>
                              <span className="truncate">{a.nome}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-xs sm:text-sm hidden sm:table-cell">{a.categoria}</TableCell>
                          <TableCell className="py-2 text-right text-xs sm:text-sm tabular-nums">{formatBRL(a.aportado)}</TableCell>
                          <TableCell className="py-2 text-right text-xs sm:text-sm tabular-nums pr-3 sm:pr-0">+{a.rentab}%</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-40 sm:h-56 text-center">
                          <div className="flex h-full flex-col items-center justify-center gap-2 sm:gap-3 py-4 sm:py-6">
                            <img
                              src="/assets/62d95badcd68f3a013a7ba5c_no-records-available-illustration-dashboardly-webflow-ecommerce-template.png"
                              alt="Sem registros"
                              className="h-16 sm:h-24 w-auto opacity-80"
                            />
                            <div className="text-xs sm:text-sm text-muted-foreground">Nenhum ativo encontrado</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground">Experimente alterar a categoria ou termo de busca.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
          <Separator className="my-3 sm:my-4" />
          {/* QRCode gerado */}
          {qrCode ? (
            <div className="rounded-md border p-3 sm:p-4">
              <div className="mb-2 text-xs sm:text-sm font-medium">Escaneie o QRCode para pagar</div>
              <div className="flex justify-center">
                <img alt="QRCode PIX" src={qrCode} className="h-32 w-32 sm:h-48 sm:w-48" />
              </div>
              <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground text-center">Após o pagamento, seu status será atualizado automaticamente.</div>
            </div>
          ) : (
            <div className="text-[10px] sm:text-xs text-muted-foreground text-center">Selecione uma oferta para prosseguir com o pagamento.</div>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}

function Kpi({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground">{title}</div>
          <div className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-foreground tabular-nums truncate">{value}</div>
        </div>
        <div className="grid size-8 sm:size-10 place-items-center rounded-md border bg-muted/30 text-muted-foreground shrink-0 ml-2">
          {icon}
        </div>
      </div>
    </div>
  )
}

function RowPendente({ icon, nome, ofertaId, valor, categoria, onPagar, isLoading }: { icon: React.ReactNode; nome: string; ofertaId: string; valor: number; categoria: string; onPagar: (ofertaId: string, valor: number) => void; isLoading: boolean }) {
  return (
    <TableRow className="odd:bg-muted/20">
      <TableCell className="pl-3 sm:pl-0 py-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="shrink-0">{icon}</div>
          <span className="truncate">{nome}</span>
        </div>
      </TableCell>
      <TableCell className="py-2 text-xs sm:text-sm hidden sm:table-cell">{categoria}</TableCell>
      <TableCell className="py-2 text-right text-xs sm:text-sm tabular-nums">{formatBRL(valor)}</TableCell>
      <TableCell className="py-2 text-right text-xs sm:text-sm pr-3 sm:pr-0">
        <Button 
          size="sm" 
          onClick={() => onPagar(ofertaId, valor)} 
          disabled={isLoading} 
          aria-label={`Gerar QRCode para ${nome}`}
          className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 sm:py-2 sm:text-sm"
        >
          <QrCode className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
          <span className="hidden xs:inline">{isLoading ? "Gerando..." : "Gerar QRCode"}</span>
          <span className="xs:hidden">{isLoading ? "..." : "QR"}</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}