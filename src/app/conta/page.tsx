import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ContaDashboardPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
      {/* Saldo e posição */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>Saldo disponível, posição consolidada e próximos passos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Saldo disponível</div>
              <div className="mt-1 text-2xl font-semibold">R$ 12.450,00</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Posição investida</div>
              <div className="mt-1 text-2xl font-semibold">R$ 38.000,00</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Rentabilidade acumulada</div>
              <div className="mt-1 text-2xl font-semibold">+8,2%</div>
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
          <CardTitle>Próximos passos</CardTitle>
          <CardDescription>Itens que pedem sua atenção</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="rounded border p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">Finalize seu KYC</span>
                <Link href="/conta/documentos" className="text-primary hover:underline">Enviar documentos</Link>
              </div>
              <Progress value={60} className="mt-2" aria-label="Progresso do KYC" />
            </li>
            <li className="rounded border p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">Responda o suitability</span>
                <Link href="/conta/suitability" className="text-primary hover:underline">Responder</Link>
              </div>
              <Progress value={0} className="mt-2" aria-label="Progresso do suitability" />
            </li>
            <li className="rounded border p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">Deposite via PIX para investir</span>
                <Link href="/conta/pagamentos" className="text-primary hover:underline">Ver instruções</Link>
              </div>
              <Progress value={0} className="mt-2" aria-label="Progresso do depósito" />
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Investimentos em andamento */}
      <Card className="md:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Investimentos em andamento</CardTitle>
              <CardDescription>Acompanhe o status de cada etapa</CardDescription>
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
                  <TableRow>
                    <TableHead>Oferta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aporte</TableHead>
                    <TableHead className="text-right">Rentab.</TableHead>
                    <TableHead className="text-right">Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Imobiliário Alpha</TableCell>
                    <TableCell><Badge variant="secondary">Aportado</Badge></TableCell>
                    <TableCell className="text-right">R$ 10.000,00</TableCell>
                    <TableCell className="text-right">+7,3%</TableCell>
                    <TableCell className="text-right">há 2 dias</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Crédito Agro Beta</TableCell>
                    <TableCell><Badge>Em análise</Badge></TableCell>
                    <TableCell className="text-right">R$ 5.000,00</TableCell>
                    <TableCell className="text-right">—</TableCell>
                    <TableCell className="text-right">há 1 dia</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Infra Gamma</TableCell>
                    <TableCell><Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">Liquidado</Badge></TableCell>
                    <TableCell className="text-right">R$ 23.000,00</TableCell>
                    <TableCell className="text-right">+9,1%</TableCell>
                    <TableCell className="text-right">há 1 semana</TableCell>
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