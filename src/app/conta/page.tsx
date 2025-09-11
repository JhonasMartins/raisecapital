import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ContaDashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Saldo e posição */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>Saldo disponível, posição consolidada e próximos passos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        </CardContent>
      </Card>

      {/* Próximos passos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos passos</CardTitle>
          <CardDescription>Itens que pedem sua atenção</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded border p-2">
              <span>Finalize seu KYC</span>
              <a href="/conta/documentos" className="text-blue-600 hover:underline">Enviar documentos</a>
            </li>
            <li className="flex items-center justify-between rounded border p-2">
              <span>Responda o suitability</span>
              <a href="/conta/suitability" className="text-blue-600 hover:underline">Responder</a>
            </li>
            <li className="flex items-center justify-between rounded border p-2">
              <span>Deposite via PIX para investir</span>
              <a href="/conta/pagamentos" className="text-blue-600 hover:underline">Ver instruções</a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Investimentos em andamento */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Investimentos em andamento</CardTitle>
          <CardDescription>Acompanhe o status de cada etapa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            Tabela de investimentos (em construção)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}