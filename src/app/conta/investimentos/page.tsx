"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatBRL } from "@/lib/utils"
import { Building2, Wheat, Factory, QrCode, TrendingUp, CheckCircle2, Hourglass } from "lucide-react"

export default function MeusInvestimentosPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handlePagar(ofertaId: string, valor: number) {
    try {
      setIsLoading(true)
      setQrCode(null)
      // Chama API interna para criar pagamento PIX via Asaas e obter QRCode
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Meus investimentos</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seus aportes e invista pagando via PIX</p>
        </div>
      </div>

      {/* KPIs 2x2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Aportado" value={formatBRL(17000)} icon={<CheckCircle2 className="size-5 text-primary" />} />
        <Kpi title="Em análise" value={formatBRL(5000)} icon={<Hourglass className="size-5 text-primary" />} />
        <Kpi title="Rentabilidade" value={"+7,3%"} icon={<TrendingUp className="size-5 text-primary" />} />
        <Kpi title="Pendentes" value={formatBRL(2500)} icon={<QrCode className="size-5 text-primary" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Ofertas</CardTitle>
          <CardDescription>Selecione uma oferta, informe o valor e pague via PIX</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pendentes">
            <TabsList>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
            </TabsList>
            <TabsContent value="pendentes">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-0 py-2 text-[11px] uppercase tracking-wide text-foreground">Oferta</TableHead>
                    <TableHead className="py-2 text-[11px] uppercase tracking-wide text-foreground">Aporte</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <RowPendente icon={<Building2 className="h-5 w-5 text-muted-foreground" />} nome="Imobiliário Alpha" ofertaId="offer-alpha" valor={1000} onPagar={handlePagar} isLoading={isLoading} />
                  <RowPendente icon={<Wheat className="h-5 w-5 text-muted-foreground" />} nome="Crédito Agro Beta" ofertaId="offer-beta" valor={1500} onPagar={handlePagar} isLoading={isLoading} />
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="ativos">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-0 py-2 text-[11px] uppercase tracking-wide text-foreground">Oferta</TableHead>
                    <TableHead className="py-2 text-[11px] uppercase tracking-wide text-foreground">Aportado</TableHead>
                    <TableHead className="py-2 text-right text-[11px] uppercase tracking-wide text-foreground">Rentab.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="odd:bg-muted/20">
                    <TableCell className="pl-0 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Factory className="h-5 w-5 text-muted-foreground" />
                        <span>Infra Gamma</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm tabular-nums">{formatBRL(7000)}</TableCell>
                    <TableCell className="py-2 text-right text-sm tabular-nums">+2,1%</TableCell>
                  </TableRow>
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

function RowPendente({ icon, nome, ofertaId, valor, onPagar, isLoading }: { icon: React.ReactNode; nome: string; ofertaId: string; valor: number; onPagar: (ofertaId: string, valor: number) => void; isLoading: boolean }) {
  return (
    <TableRow className="odd:bg-muted/20">
      <TableCell className="pl-0 py-2 text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span>{nome}</span>
        </div>
      </TableCell>
      <TableCell className="py-2 text-sm tabular-nums">{formatBRL(valor)}</TableCell>
      <TableCell className="py-2 text-right text-sm">
        <Button size="sm" onClick={() => onPagar(ofertaId, valor)} disabled={isLoading}>
          <QrCode className="mr-2 h-4 w-4" /> {isLoading ? "Gerando..." : "Gerar QRCode"}
        </Button>
      </TableCell>
    </TableRow>
  )
}