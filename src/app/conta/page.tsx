import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardToolbar } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  IdCard,
  ClipboardList,
  MoreHorizontal,
  Settings,
  TriangleAlert,
  Pin,
  Share2,
  Trash,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { formatBRL } from "@/lib/utils"
import PortfolioDistributionChart from "@/components/portfolio-distribution-chart"
import StatisticCard13 from "@/components/statistic-card-13"
import { GradientBarMultipleChart } from "@/components/ui/gradient-bar-multiple-chart"
import { headers } from "next/headers"

async function fetchJSON<T>(url: string) {
  const isRelative = url.startsWith("/")
  let finalUrl = url
  if (isRelative) {
    const hdrs = await headers()
    const protocol = hdrs.get("x-forwarded-proto") ?? "http"
    const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000"
    finalUrl = `${protocol}://${host}${url}`
  }
  const res = await fetch(finalUrl, { cache: "no-store" })
  if (!res.ok) return null as unknown as T
  return (await res.json()) as T
}

// Card inspirado no ReUI StatisticCard1, com delta e comparativo opcionais
const KpiStatCard = ({
  title,
  value,
  delta,
  positive,
  lastLabel,
  lastValue,
}: {
  title: string
  value: ReactNode
  delta?: number
  positive?: boolean
  lastLabel?: string
  lastValue?: ReactNode
}) => (
  <Card>
    <CardHeader className="border-0 px-3 sm:px-4 min-h-10 sm:min-h-12">
      <CardTitle className="text-muted-foreground text-xs sm:text-sm font-medium">{title}</CardTitle>
      <CardToolbar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom">
            <DropdownMenuItem>
              <Settings /> Configurações
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TriangleAlert /> Adicionar alerta
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pin /> Fixar no dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 /> Compartilhar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash /> Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardToolbar>
    </CardHeader>
    <CardContent className="space-y-2 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
        <span className="text-lg sm:text-xl font-medium text-foreground tracking-tight">{value}</span>
        {typeof delta === "number" && (
          <Badge variant={positive ? "success" : "destructive"} appearance="light" className="self-start sm:self-auto">
            {delta >= 0 ? <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />}
            {Math.abs(delta)}%
          </Badge>
        )}
      </div>
      {lastValue !== undefined && (
        <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
          {lastLabel ?? "Comparativo"}: <span className="font-medium text-foreground">{lastValue}</span>
        </div>
      )}
    </CardContent>
  </Card>
)

export default async function ContaDashboardPage() {
  const overview = await fetchJSON<{ balanceAvailable: number; investedTotal: number; cumulativeReturnPct: number; pendingContributions: number }>(
    "/api/conta/overview"
  )

  const portfolio = await fetchJSON<{ allocation: { label: string; value: number }[] }>("/api/conta/portfolio")
  const perf = await fetchJSON<{ items: { label: string; aportes: number; rendimentos: number }[] }>(
    "/api/conta/performance"
  )
  const checks = await fetchJSON<{ checksPassing: number; checksRequired: number; assignedPct: number }>(
    "/api/conta/checks"
  )

  const distribuicao: { key: string; label: string; value: number; color: string }[] = (portfolio?.allocation || []).map((it, idx) => ({
    key: `seg${idx + 1}`,
    label: it.label,
    value: it.value,
    color: ["#2563eb", "#16a34a", "#f59e0b", "#9333ea", "#ef4444", "#06b6d4"][idx % 6],
  }))
  const totalDistribuicao = (distribuicao as ReadonlyArray<{ value: number }>).reduce((acc, i) => acc + i.value, 0)

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Saldo e posição */}
      <Card>
        <CardHeader className="flex flex-col items-start gap-1 px-4 sm:px-6 min-h-12 sm:min-h-14 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">Minha carteira</CardTitle>
          <CardDescription className="text-sm">Saldo disponível, posição consolidada e próximos passos</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            <KpiStatCard title="Saldo disponível" value={typeof overview?.balanceAvailable === "number" ? formatBRL(overview.balanceAvailable) : "—"} />
            <KpiStatCard title="Posição investida" value={typeof overview?.investedTotal === "number" ? formatBRL(overview.investedTotal) : "—"} />
            <KpiStatCard title="Rentabilidade acumulada" value={typeof overview?.cumulativeReturnPct === "number" ? `${overview.cumulativeReturnPct.toFixed(2)}%` : "—"} />
            <KpiStatCard title="Aportes pendentes" value={typeof overview?.pendingContributions === "number" ? formatBRL(overview.pendingContributions) : "—"} />
          </div>
          <Separator className="my-4 sm:my-6" />
          <Tabs defaultValue="consolidado" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <TabsTrigger value="consolidado" className="flex-shrink-0">Consolidado</TabsTrigger>
              <TabsTrigger value="30d" className="flex-shrink-0">Últimos 30 dias</TabsTrigger>
            </TabsList>
            <TabsContent value="consolidado" className="mt-4">
              <p className="text-sm text-muted-foreground">Resumo consolidado dos seus ativos e saldo.</p>
            </TabsContent>
            <TabsContent value="30d" className="mt-4">
              <p className="text-sm text-muted-foreground">Variação e movimentações dos últimos 30 dias.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Distribuição da carteira */}
      <Card>
        <CardHeader className="flex flex-col items-start gap-1 px-4 sm:px-6 min-h-12 sm:min-h-14 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">Distribuição da carteira</CardTitle>
          <CardDescription className="text-sm">Percentual por segmento com valores em BRL</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4">
            {/* Gráfico mais baixo no mobile para reduzir scroll */}
            <div className="rounded-md border p-2 sm:hidden">
              <PortfolioDistributionChart data={distribuicao} height={200} />
            </div>
            <div className="hidden rounded-md border p-2 sm:block">
              <PortfolioDistributionChart data={distribuicao} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {/* Lista vazia quando não há distribuição */}
              {(distribuicao as ReadonlyArray<any>).map((s) => {
                const pct = Math.round((s.value / totalDistribuicao) * 1000) / 10
                return (
                  <div key={s.key} className="flex items-center justify-between gap-3 text-sm rounded-md border bg-card px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span>{s.label}</span>
                    </div>
                    <div className="tabular-nums text-muted-foreground">
                      <span className="mr-2">{pct}%</span>
                      <span>{formatBRL(s.value)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total</span>
              <span className="tabular-nums">{formatBRL(totalDistribuicao)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance mensal */}
      <GradientBarMultipleChart showData={true} data={perf?.items?.map(i => ({ month: i.label, aportes: i.aportes, rendimentos: i.rendimentos })) ?? []} title="Performance Mensal" description={new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).formatRange?.(new Date(new Date().getFullYear(), new Date().getMonth()-5, 1), new Date()) ?? "Últimos meses"} />

      {/* Próximos passos */}
      <Card>
        <CardHeader className="flex flex-col items-start gap-1 px-4 sm:px-5 min-h-12 sm:min-h-14 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">Próximos passos</CardTitle>
          <CardDescription>Itens que pedem sua atenção</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="space-y-3">
            <StatisticCard13
              title="Finalize seu KYC"
              icon={<IdCard className="w-5 h-5 text-primary" />}
              total={10}
              passing={0}
              leftTotal={10}
              leftSuffix="documentos"
              rightSuffix="concluído"
            />
            <StatisticCard13
              title="Suitability"
              icon={<ClipboardList className="w-5 h-5 text-primary" />}
              total={10}
              passing={0}
              leftTotal={10}
              leftSuffix="perguntas respondidas"
              rightSuffix="concluído"
            />
            <StatisticCard13
              title="Compliance Checks"
              total={checks?.checksRequired ?? 0}
              passing={checks?.checksPassing ?? 0}
              leftTotal={checks?.checksRequired ?? 0}
              leftSuffix="checks"
              rightSuffix="assigned"
            />
          </div>
        </CardContent>
      </Card>

      {/* Investimentos em andamento */}
      <Card>
        <CardHeader className="items-start px-4 sm:px-6 min-h-12 sm:min-h-14">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Investimentos em andamento
              </CardTitle>
              <CardDescription className="text-sm">Acompanhe o status de cada etapa</CardDescription>
              <div className="text-xs text-muted-foreground">—</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="investimentos">
            <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <TabsTrigger value="investimentos" className="flex-shrink-0">Investimentos</TabsTrigger>
              <TabsTrigger value="movs" className="flex-shrink-0">Movimentações</TabsTrigger>
            </TabsList>
            <TabsContent value="investimentos" className="mt-4">
              <div className="-mx-4 sm:-mx-6 overflow-x-auto">
                <div className="inline-block min-w-full px-4 sm:px-6">
                  <Table className="min-w-[640px] sm:min-w-0">
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="pl-0 py-2 text-[11px] uppercase tracking-wide text-foreground whitespace-nowrap">Oferta</TableHead>
                        <TableHead className="py-2 text-[11px] uppercase tracking-wide text-foreground whitespace-nowrap">Status</TableHead>
                        <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground whitespace-nowrap">Aporte</TableHead>
                        <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground hidden sm:table-cell whitespace-nowrap">Rentab.</TableHead>
                        <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground hidden sm:table-cell whitespace-nowrap">Atualização</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} className="h-56 text-center">
                          <div className="flex h-full flex-col items-center justify-center gap-3 py-6">
                            <img
                              src="/assets/62d95badcd68f3228ea7ba5d_no-records-found-illustration-dashboardly-webflow-ecommerce-template.png"
                              alt="Sem registros"
                              className="h-24 w-auto opacity-80"
                            />
                            <div className="text-sm text-muted-foreground">Sem investimentos em andamento</div>
                            <div className="text-xs text-muted-foreground">Quando você iniciar um investimento, ele aparecerá aqui.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="movs" className="mt-4">
              <div className="rounded-md border bg-card overflow-x-auto -mx-4 sm:-mx-6">
                <div className="inline-block min-w-full px-4 sm:px-6">
                  <Table className="min-w-[560px] sm:min-w-0">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Data</TableHead>
                        <TableHead className="whitespace-nowrap">Operação</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Valor</TableHead>
                        <TableHead className="text-right hidden sm:table-cell whitespace-nowrap">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={4} className="h-56 text-center">
                          <div className="flex h-full flex-col items-center justify-center gap-3 py-6">
                            <img
                              src="/assets/62d95badcd68f3228ea7ba5d_no-records-found-illustration-dashboardly-webflow-ecommerce-template.png"
                              alt="Sem registros"
                              className="h-24 w-auto opacity-80"
                            />
                            <div className="text-sm text-muted-foreground">Sem movimentações recentes</div>
                            <div className="text-xs text-muted-foreground">As movimentações aparecerão aqui quando houver.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}