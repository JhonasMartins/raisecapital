import { redirect } from 'next/navigation'
import { getCurrentUser, clearSessionCookie } from '@/lib/auth'
import { query } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
// Removido: import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { ArrowUpRight, PieChart as PieIcon, TrendingUp, Wallet, LineChart, LogOut, Receipt, Briefcase } from 'lucide-react'
// Substituir gráficos por componentes cliente
import InvestorMonthlyPerformanceChart from '@/components/investor-monthly-performance-chart'
import PortfolioDistributionChart from '@/components/portfolio-distribution-chart'
// Removido: import InvestorPortfolioPieChart from '@/components/investor-portfolio-pie-chart'
// Removido: imports de 'recharts' do server component

// Tipos de dados retornados do banco
interface Kpis {
  saldo_total: number
  valor_investido: number
  rendimento_total: number
  rentabilidade_percentual: number
}

interface DistribuicaoRow { categoria: string; valor_investido: number }
interface RendimentoRow { mes: string; total_rendimento: number }
interface TransacaoRow { id: string; tipo: string; valor: number; descricao: string | null; data_transacao: string; status: string }
interface InvestimentoRow {
  id: string
  nome: string
  valor_investido: number
  valor_atual: number
  status: string
  taxa_retorno: number | null
  prazo_meses: number | null
  data_investimento: string
}

// Helper para queries tolerantes a erro (tabelas ausentes, etc.)
async function safeQuery<T>(sql: string, params: readonly unknown[], fallback: T[] = []): Promise<T[]> {
  try {
    const res = await query<T>(sql, params)
    return res.rows
  } catch (e: any) {
    console.error('Dashboard data fetch error (handled):', {
      sql: sql?.slice(0, 100),
      message: e?.message,
      code: e?.code,
    })
    return fallback
  }
}

export default async function InvestidorDashboard() {
  // Autenticação no servidor
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/login?redirect=/dashboard/investidor')
  }

  const handleLogout = async () => {
    'use server'
    await clearSessionCookie()
    redirect('/')
  }

  // Carregar dados reais do banco em paralelo (com fallbacks seguros)
  const [kpisRows, distRows, rendRows, txRows, invRows] = await Promise.all([
    safeQuery<Kpis>(
      `SELECT saldo_total, valor_investido, rendimento_total, rentabilidade_percentual
       FROM kpis_usuario WHERE user_id = $1`,
      [user.id]
    ),
    safeQuery<DistribuicaoRow>(
      `SELECT categoria, SUM(valor_investido) AS valor_investido
       FROM distribuicao_carteira WHERE user_id = $1
       GROUP BY categoria ORDER BY SUM(valor_investido) DESC`,
      [user.id]
    ),
    safeQuery<RendimentoRow>(
      `SELECT to_char(mes_referencia, 'YYYY-MM') AS mes,
              SUM(valor_rendimento) AS total_rendimento
       FROM rendimentos r
       JOIN investimentos i ON i.id = r.investimento_id
       WHERE i.user_id = $1
       GROUP BY 1
       ORDER BY 1
       LIMIT 24`,
      [user.id]
    ),
    safeQuery<TransacaoRow>(
      `SELECT id::text, tipo, valor::float8 AS valor, descricao, data_transacao::text, status
       FROM transacoes WHERE user_id = $1
       ORDER BY data_transacao DESC LIMIT 10`,
      [user.id]
    ),
    safeQuery<InvestimentoRow>(
      `SELECT i.id::text, o.nome,
              i.valor_investido::float8 AS valor_investido,
              COALESCE(i.valor_atual, i.valor_investido)::float8 AS valor_atual,
              i.status, i.taxa_retorno::float8 AS taxa_retorno,
              i.prazo_meses, i.data_investimento::text
       FROM investimentos i
       JOIN ofertas o ON o.id = i.oferta_id
       WHERE i.user_id = $1
       ORDER BY i.data_investimento DESC
       LIMIT 10`,
      [user.id]
    ),
  ])

  const kpis = kpisRows[0] || { saldo_total: 0, valor_investido: 0, rendimento_total: 0, rentabilidade_percentual: 0 }
  const distribuicao = distRows
  const rendimentosMensais = rendRows.map(r => ({ mes: r.mes, valor: Number(r.total_rendimento || 0) }))
  const transacoes = txRows
  const investimentos = invRows

  const cores = ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6']
  const distItems = distribuicao.map((d, idx) => ({
    key: slugifyCategory(d.categoria, idx),
    label: d.categoria,
    value: Number(d.valor_investido || 0),
    color: cores[idx % cores.length],
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard do Investidor</h1>
            <p className="text-muted-foreground">Bem-vindo de volta, {user.name}!</p>
          </div>
          <form action={handleLogout}>
            <Button type="submit" variant="outline">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </form>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.saldo_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <p className="text-xs text-muted-foreground">Saldo consolidado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.valor_investido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <p className="text-xs text-muted-foreground">Capital alocado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rendimento Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.rendimento_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <p className="text-xs text-muted-foreground">Acumulado no período</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(kpis.rentabilidade_percentual || 0).toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Percentual de retorno</p>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="investments">Investimentos</TabsTrigger>
            <TabsTrigger value="transactions">Movimentações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Performance mensal */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Performance Mensal</CardTitle>
                  <CardDescription>Rendimentos por mês</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[220px]">
                    <InvestorMonthlyPerformanceChart data={rendimentosMensais} height={220} />
                  </div>
                </CardContent>
              </Card>

              {/* Distribuição da carteira */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Distribuição da Carteira</CardTitle>
                  <CardDescription>Por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  {distItems.length === 0 ? (
                    <div className="h-[220px] flex items-center justify-center text-muted-foreground">Sem dados de distribuição</div>
                  ) : (
                    <div className="h-[220px]">
                      <PortfolioDistributionChart data={distItems} height={220} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seus Investimentos</CardTitle>
                <CardDescription>Últimos investimentos</CardDescription>
              </CardHeader>
              <CardContent>
                {investimentos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Você ainda não possui investimentos ativos.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-muted-foreground border-b">
                        <tr>
                          <th className="py-2 pr-4">Oferta</th>
                          <th className="py-2 pr-4">Investido</th>
                          <th className="py-2 pr-4">Valor Atual</th>
                          <th className="py-2 pr-4">Status</th>
                          <th className="py-2 pr-4">Investido em</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investimentos.map((inv) => (
                          <tr key={inv.id} className="border-b last:border-0">
                            <td className="py-2 pr-4 font-medium">{inv.nome}</td>
                            <td className="py-2 pr-4">{inv.valor_investido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="py-2 pr-4">{inv.valor_atual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="py-2 pr-4">
                              <Badge variant={inv.status === 'ativo' ? 'success' : inv.status === 'resgatado' ? 'secondary' : 'outline'}>
                                {inv.status}
                              </Badge>
                            </td>
                            <td className="py-2 pr-4">{new Date(inv.data_investimento).toLocaleDateString('pt-BR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Movimentações Recentes</CardTitle>
                <CardDescription>Últimas transações</CardDescription>
              </CardHeader>
              <CardContent>
                {transacoes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Você ainda não possui movimentações.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-muted-foreground border-b">
                        <tr>
                          <th className="py-2 pr-4">Data</th>
                          <th className="py-2 pr-4">Tipo</th>
                          <th className="py-2 pr-4">Valor</th>
                          <th className="py-2 pr-4">Descrição</th>
                          <th className="py-2 pr-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transacoes.map((t) => (
                          <tr key={t.id} className="border-b last:border-0">
                            <td className="py-2 pr-4">{new Date(t.data_transacao).toLocaleDateString('pt-BR')}</td>
                            <td className="py-2 pr-4">{t.tipo}</td>
                            <td className="py-2 pr-4">{t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="py-2 pr-4">{t.descricao || '-'}</td>
                            <td className="py-2 pr-4">
                              <Badge variant={t.status === 'concluida' ? 'success' : t.status === 'pendente' ? 'warning' : 'outline'}>
                                {t.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function slugifyCategory(name: string, idx: number) {
  return (
    (name || 'categoria-' + idx)
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `categoria-${idx}`
  )
}