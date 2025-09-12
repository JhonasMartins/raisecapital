import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardToolbar } from "@/components/ui/card"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
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
  Banknote,
  Building2,
  Wheat,
  Factory,
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
    <CardHeader className="border-0">
      <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
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
    <CardContent className="space-y-2.5">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl font-medium text-foreground tracking-tight">{value}</span>
        {typeof delta === "number" && (
          <Badge variant={positive ? "success" : "destructive"} appearance="light">
            {delta >= 0 ? <ArrowUp /> : <ArrowDown />}
            {Math.abs(delta)}%
          </Badge>
        )}
      </div>
      {lastValue !== undefined && (
        <div className="text-xs text-muted-foreground mt-2 border-t pt-2.5">
          {lastLabel ?? "Comparativo"}: <span className="font-medium text-foreground">{lastValue}</span>
        </div>
      )}
    </CardContent>
  </Card>
)

export default function ContaDashboardPage() {
  const distribuicao = [
    { key: "imobiliario", label: "Imobiliário", value: 23000, color: "var(--chart-1)" },
    { key: "agro", label: "Agro", value: 12000, color: "var(--chart-2)" },
    { key: "infra", label: "Infra", value: 7000, color: "var(--chart-3)" },
    { key: "credito", label: "Crédito", value: 6000, color: "var(--chart-4)" },
    { key: "outros", label: "Outros", value: 2000, color: "var(--chart-5)" },
  ] as const
  const totalDistribuicao = distribuicao.reduce((acc, i) => acc + i.value, 0)

  // Mock para KPI de aportes pendentes (fluxo via Asaas)
  const aportesPendentesValor = 2500

  return (
    <div className="grid w-full gap-6 md:grid-cols-3">
      {/* Saldo e posição */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Minha carteira</CardTitle>
          <CardDescription>Saldo disponível, posição consolidada e próximos passos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <KpiStatCard title="Saldo disponível" value={formatBRL(12450)} />
            <KpiStatCard title="Posição investida" value={formatBRL(38000)} />
            <KpiStatCard title="Rentabilidade acumulada" value={"+8,2%"} delta={8.2} positive />
            <KpiStatCard title="Aportes pendentes" value={formatBRL(aportesPendentesValor)} />
          </div>
          <Separator className="my-6" />
          <Tabs defaultValue="consolidado" className="w-full">
            <TabsList>
              <TabsTrigger value="consolidado">Consolidado</TabsTrigger>
              <TabsTrigger value="30d">Últimos 30 dias</TabsTrigger>
            </TabsList>
            <TabsContent value="consolidado">
              <p className="text-sm text-muted-foreground">Resumo consolidado dos seus ativos e saldo.</p>
            </TabsContent>
            <TabsContent value="30d">
              <p className="text-sm text-muted-foreground">Variação e movimentações dos últimos 30 dias.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Distribuição da carteira */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Distribuição da carteira</CardTitle>
          <CardDescription>Percentual por segmento com valores em BRL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <PortfolioDistributionChart data={distribuicao} />
            </div>
            <div className="space-y-3">
              {distribuicao.map((s) => {
                const pct = Math.round((s.value / totalDistribuicao) * 1000) / 10
                return (
                  <div key={s.key} className="flex items-center justify-between gap-3 text-sm">
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
              <Separator />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total</span>
                <span className="tabular-nums">{formatBRL(totalDistribuicao)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximos passos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Próximos passos</CardTitle>
          <CardDescription>Itens que pedem sua atenção</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="rounded-md border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Finalize seu KYC</span>
                </div>
                <Link href="/conta/documentos" className="text-primary hover:underline">Enviar documentos</Link>
              </div>
              <Progress value={60} className="mt-2 h-1" aria-label="Progresso do KYC" />
            </li>
            <li className="rounded-md border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Responda o suitability</span>
                </div>
                <Link href="/conta/suitability" className="text-primary hover:underline">Responder</Link>
              </div>
              <Progress value={0} className="mt-2 h-1" aria-label="Progresso do suitability" />
            </li>
            <li className="rounded-md border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Escolha uma oferta e pague via PIX</span>
                </div>
                <Link href="/conta/investimentos" className="text-primary hover:underline">Ir para Meus investimentos</Link>
              </div>
              <Progress value={0} className="mt-2 h-1" aria-label="Progresso do pagamento" />
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Investimentos em andamento */}
      <Card className="md:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Investimentos em andamento
              </CardTitle>
              <CardDescription>Acompanhe o status de cada etapa</CardDescription>
              <div className="text-xs text-muted-foreground">Última atualização há 2 dias</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="investimentos">
            <TabsList>
              <TabsTrigger value="investimentos">Investimentos</TabsTrigger>
              <TabsTrigger value="movs">Movimentações</TabsTrigger>
            </TabsList>
            <TabsContent value="investimentos">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-0 py-2 text-[11px] uppercase tracking-wide text-foreground">Oferta</TableHead>
                    <TableHead className="py-2 text-[11px] uppercase tracking-wide text-foreground">Status</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Aporte</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Rentab.</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="odd:bg-muted/20 hover:bg-muted/40 transition-colors">
                    <TableCell className="pl-0 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span>Imobiliário Alpha</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm">
                      <Badge variant="outline" className="gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />Aportado</Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">{formatBRL(10000)}</TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">+7,3%</TableCell>
                    <TableCell className="py-2 text-right text-sm">há 2 dias</TableCell>
                  </TableRow>
                  <TableRow className="odd:bg-muted/20 hover:bg-muted/40 transition-colors">
                    <TableCell className="pl-0 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Wheat className="h-5 w-5 text-muted-foreground" />
                        <span>Crédito Agro Beta</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm">
                      <Badge variant="outline" className="gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Em análise</Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">{formatBRL(5000)}</TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">—</TableCell>
                    <TableCell className="py-2 text-right text-sm">há 1 dia</TableCell>
                  </TableRow>
                  <TableRow className="odd:bg-muted/20 hover:bg-muted/40 transition-colors">
                    <TableCell className="pl-0 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Factory className="h-5 w-5 text-muted-foreground" />
                        <span>Infra Gamma</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm">
                      <Badge variant="outline" className="gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-600" />Liquidado</Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">{formatBRL(7000)}</TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">+2,1%</TableCell>
                    <TableCell className="py-2 text-right text-sm">há 3 dias</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="movs">
              <div className="text-sm text-muted-foreground">Sem movimentações recentes.</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}