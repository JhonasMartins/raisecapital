import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, PieChart, TrendingUp, IdCard, ClipboardList, Banknote, Building2, Wheat, Factory } from "lucide-react"
import { formatBRL } from "@/lib/utils"

export default function ContaDashboardPage() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-3">
      {/* Saldo e posição */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Resumo</CardTitle>
          <CardDescription>Saldo disponível, posição consolidada e próximos passos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* KPI: Saldo disponível */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Saldo disponível</div>
                  <div className="mt-1 text-3xl font-semibold text-foreground tabular-nums">{formatBRL(12450)}</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-md border bg-muted/30 text-muted-foreground">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
            </div>
            {/* KPI: Posição investida */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Posição investida</div>
                  <div className="mt-1 text-3xl font-semibold text-foreground tabular-nums">{formatBRL(38000)}</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-md border bg-muted/30 text-muted-foreground">
                  <PieChart className="h-5 w-5" />
                </div>
              </div>
            </div>
            {/* KPI: Rentabilidade */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Rentabilidade acumulada</div>
                  <div className="mt-1 text-3xl font-semibold text-foreground tabular-nums">+8,2%</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-md border bg-muted/30 text-muted-foreground">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>
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
                  <span className="font-medium">Deposite via PIX para investir</span>
                </div>
                <Link href="/conta/pagamentos" className="text-primary hover:underline">Ver instruções</Link>
              </div>
              <Progress value={0} className="mt-2 h-1" aria-label="Progresso do depósito" />
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
                      <Badge variant="outline" className="gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />Liquidado</Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">{formatBRL(23000)}</TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">+9,1%</TableCell>
                    <TableCell className="py-2 text-right text-sm">há 1 semana</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="movs">
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">Histórico de movimentações (em breve).</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
<div className="mt-4 border-t pt-3 text-xs text-muted-foreground">Custódia/Compliance: sob instituição parceira regulada</div>