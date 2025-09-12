"use client"

import { useMemo, useState } from "react"
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

export default function MeusInvestimentosPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [categoria, setCategoria] = useState<string>("todas")
  const [tab, setTab] = useState<"pendentes" | "ativos">("pendentes")

  // Dados mockados
  const pendentesItems = useMemo(
    () => [
      { icon: <Building2 className="h-5 w-5 text-muted-foreground" />, nome: "Imobiliário Alpha", ofertaId: "offer-alpha", valor: 1000, categoria: "Imobiliário" },
      { icon: <Wheat className="h-5 w-5 text-muted-foreground" />, nome: "Crédito Agro Beta", ofertaId: "offer-beta", valor: 1500, categoria: "Agro" },
    ],
    []
  )

  const ativosItems = useMemo(
    () => [
      { icon: <Factory className="h-5 w-5 text-muted-foreground" />, nome: "Infra Gamma", aportado: 7000, rentab: 2.1, categoria: "Infra" },
      { icon: <Building2 className="h-5 w-5 text-muted-foreground" />, nome: "Real Estate Delta", aportado: 10000, rentab: 4.3, categoria: "Imobiliário" },
      { icon: <Wheat className="h-5 w-5 text-muted-foreground" />, nome: "Agro Omega", aportado: 3000, rentab: 1.2, categoria: "Agro" },
    ],
    []
  )

  const categorias = ["todas", "Imobiliário", "Agro", "Infra"] as const

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

  const totalAportado = useMemo(() => ativosItems.reduce((acc, i) => acc + i.aportado, 0), [ativosItems])
  const totalPendentes = useMemo(() => pendentesItems.reduce((acc, i) => acc + i.valor, 0), [pendentesItems])

  const distData = useMemo(() => {
    const byCat: Record<string, number> = {}
    for (const i of ativosItems) byCat[i.categoria] = (byCat[i.categoria] || 0) + i.aportado
    const palette: Record<string, string> = {
      "Imobiliário": "#60a5fa",
      "Agro": "#34d399",
      "Infra": "#f59e0b",
    }
    return Object.entries(byCat).map(([label, value], idx) => ({
      key: label.toLowerCase(),
      label,
      value,
      color: palette[label] || ["#60a5fa", "#34d399", "#f59e0b", "#a78bfa"][idx % 4],
    }))
  }, [ativosItems])

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Meus investimentos</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seus aportes, gere PIX e visualize sua distribuição</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ofertas"
            className="w-full sm:max-w-xs"
            aria-label="Buscar ofertas"
          />
          <Select value={categoria} onValueChange={(v) => setCategoria(v)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c} value={c}>{c === "todas" ? "Todas categorias" : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} className="shrink-0">
          <Download className="mr-2 h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      {/* KPIs 2x2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Aportado" value={formatBRL(totalAportado)} icon={<CheckCircle2 className="size-5 text-primary" />} />
        <Kpi title="Em análise" value={formatBRL(5000)} icon={<Hourglass className="size-5 text-primary" />} />
        <Kpi title="Rentabilidade" value={"+7,3%"} icon={<TrendingUp className="size-5 text-primary" />} />
        <Kpi title="Pendentes" value={formatBRL(totalPendentes)} icon={<QrCode className="size-5 text-primary" />} />
      </div>

      {/* Distribuição por categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Distribuição por categoria</CardTitle>
          <CardDescription>Composição da sua carteira atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="rounded-md border p-2">
              <PortfolioDistributionChart data={distData} height={240} />
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              {distData.map((d) => (
                <div key={d.key} className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} aria-hidden />
                    <span>{d.label}</span>
                  </div>
                  <span className="tabular-nums">{formatBRL(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ofertas / Posições */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Ofertas</CardTitle>
          <CardDescription>Selecione uma oferta, informe o valor e pague via PIX</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
            </TabsList>
            <TabsContent value="pendentes">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-0 py-2 text-[11px] uppercase tracking-wide text-foreground">Oferta</TableHead>
                    <TableHead className="py-2 text-[11px] uppercase tracking-wide text-foreground">Categoria</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Aporte</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Ação</TableHead>
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
                      <TableCell colSpan={4} className="h-56 text-center">
                        <div className="flex h-full flex-col items-center justify-center gap-3 py-6">
                          <img
                            src="/assets/62d95badcd68f3228ea7ba5d_no-records-found-illustration-dashboardly-webflow-ecommerce-template.png"
                            alt="Sem registros"
                            className="h-24 w-auto opacity-80"
                          />
                          <div className="text-sm text-muted-foreground">Nenhuma oferta pendente encontrada</div>
                          <div className="text-xs text-muted-foreground">Ajuste os filtros ou tente outra busca.</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="ativos">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-0 py-2 text-[11px] uppercase tracking-wide text-foreground">Oferta</TableHead>
                    <TableHead className="py-2 text-[11px] uppercase tracking-wide text-foreground">Categoria</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Aportado</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Rentab.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ativosFiltrados.length ? (
                    ativosFiltrados.map((a, idx) => (
                      <TableRow key={`${a.nome}-${idx}`} className="odd:bg-muted/20">
                        <TableCell className="pl-0 py-2 text-sm">
                          <div className="flex items-center gap-2">
                            {a.icon}
                            <span>{a.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-sm">{a.categoria}</TableCell>
                        <TableCell className="py-2 text-right text-sm tabular-nums">{formatBRL(a.aportado)}</TableCell>
                        <TableCell className="py-2 text-right text-sm tabular-nums">+{a.rentab}%</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-56 text-center">
                        <div className="flex h-full flex-col items-center justify-center gap-3 py-6">
                          <img
                            src="/assets/62d95badcd68f3a013a7ba5c_no-records-available-illustration-dashboardly-webflow-ecommerce-template.png"
                            alt="Sem registros"
                            className="h-24 w-auto opacity-80"
                          />
                          <div className="text-sm text-muted-foreground">Nenhum ativo encontrado</div>
                          <div className="text-xs text-muted-foreground">Experimente alterar a categoria ou termo de busca.</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
          <Separator className="my-4" />
          {/* QRCode gerado */}
          {qrCode ? (
            <div className="rounded-md border p-4">
              <div className="mb-2 text-sm font-medium">Escaneie o QRCode para pagar</div>
              <img alt="QRCode PIX" src={qrCode} className="h-48 w-48" />
              <div className="mt-2 text-xs text-muted-foreground">Após o pagamento, seu status será atualizado automaticamente.</div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">Selecione uma oferta e gere o QRCode para investir via PIX.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Kpi({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{title}</div>
          <div className="mt-1 text-2xl sm:text-3xl font-semibold text-foreground tabular-nums">{value}</div>
        </div>
        <div className="grid size-10 place-items-center rounded-md border bg-muted/30 text-muted-foreground">
          {icon}
        </div>
      </div>
    </div>
  )
}

function RowPendente({ icon, nome, ofertaId, valor, categoria, onPagar, isLoading }: { icon: React.ReactNode; nome: string; ofertaId: string; valor: number; categoria: string; onPagar: (ofertaId: string, valor: number) => void; isLoading: boolean }) {
  return (
    <TableRow className="odd:bg-muted/20">
      <TableCell className="pl-0 py-2 text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span>{nome}</span>
        </div>
      </TableCell>
      <TableCell className="py-2 text-sm">{categoria}</TableCell>
      <TableCell className="py-2 text-right text-sm tabular-nums">{formatBRL(valor)}</TableCell>
      <TableCell className="py-2 text-right text-sm">
        <Button size="sm" onClick={() => onPagar(ofertaId, valor)} disabled={isLoading} aria-label={`Gerar QRCode para ${nome}`}>
          <QrCode className="mr-2 h-4 w-4" /> {isLoading ? "Gerando..." : "Gerar QRCode"}
        </Button>
      </TableCell>
    </TableRow>
  )
}