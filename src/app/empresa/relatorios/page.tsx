'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Eye,
  Share,
  MoreHorizontal,
  Target,
  Clock,
} from "lucide-react"
import { formatBRL } from "@/lib/utils"

export default function RelatoriosPage() {
  // Mock data removida: substituir por estrutura vazia/zeros para manter o layout sem conteúdo fictício
  const mockData = {
    captacaoMensal: [] as Array<{ mes: string; valor: number; meta: number }>,
    investidoresPorTipo: [] as Array<{ tipo: string; valor: number; count: number; color: string }>,
    performanceOfertas: [] as Array<any>,
    relatoriosDisponiveis: [] as Array<any>,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <Badge variant="success">Disponível</Badge>
      case 'processando':
        return <Badge variant="warning">Processando</Badge>
      case 'erro':
        return <Badge variant="destructive">Erro</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    const variants: { [key: string]: any } = {
      'Mensal': 'default',
      'Trimestral': 'secondary',
      'Performance': 'outline',
      'Anual': 'destructive'
    }
    return <Badge variant={variants[tipo] || 'outline'}>{tipo}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Acompanhe métricas detalhadas e gere relatórios personalizados sobre suas captações.
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="ultimo-mes">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimo-mes">Último mês</SelectItem>
              <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
              <SelectItem value="ultimo-ano">Último ano</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{formatBRL(0)}</div>
                <div className="text-sm text-muted-foreground">Total Captado</div>
                <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  0% vs mês anterior
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Total Investidores</div>
                <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  0% vs mês anterior
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">0%</div>
                <div className="text-sm text-muted-foreground">Taxa Conversão</div>
                <div className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  0% vs mês anterior
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{formatBRL(0)}</div>
                <div className="text-sm text-muted-foreground">Ticket Médio</div>
                <div className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  0% vs mês anterior
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com diferentes relatórios */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="captacao">Captação</TabsTrigger>
          <TabsTrigger value="investidores">Investidores</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Gráfico de captação mensal */}
            <Card>
              <CardHeader>
                <CardTitle>Captação vs Meta Mensal</CardTitle>
                <CardDescription>Comparativo entre valores captados e metas estabelecidas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData.captacaoMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => formatBRL(value)} />
                    <Tooltip formatter={(value) => formatBRL(Number(value))} />
                    <Bar dataKey="valor" fill="#8884d8" name="Captado" />
                    <Bar dataKey="meta" fill="#82ca9d" name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance por oferta */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Oferta</CardTitle>
                <CardDescription>Métricas detalhadas de cada oferta ativa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.performanceOfertas.map((oferta) => {
                    const percentual = oferta.meta > 0 ? (oferta.captado / oferta.meta) * 100 : 0
                    return (
                      <div key={oferta.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{oferta.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatBRL(oferta.captado)} de {formatBRL(oferta.meta)}
                            </div>
                          </div>
                          <div className="text-sm font-medium">{percentual.toFixed(1)}%</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(percentual, 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="captacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Captação</CardTitle>
              <CardDescription>Histórico de captação de recursos ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockData.captacaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => formatBRL(value)} />
                  <Tooltip formatter={(value) => formatBRL(Number(value))} />
                  <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} name="Captado" />
                  <Line type="monotone" dataKey="meta" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="investidores" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Distribuição por tipo */}
            <Card>
              <CardHeader>
                <CardTitle>Investidores por Tipo</CardTitle>
                <CardDescription>Distribuição dos investimentos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockData.investidoresPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {mockData.investidoresPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatBRL(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela detalhada */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Tipo</CardTitle>
                <CardDescription>Métricas detalhadas por categoria de investidor</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Ticket Médio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.investidoresPorTipo.map((tipo) => (
                      <TableRow key={tipo.tipo}>
                        <TableCell className="font-medium">{tipo.tipo}</TableCell>
                        <TableCell>{tipo.count}</TableCell>
                        <TableCell>{formatBRL(tipo.valor)}</TableCell>
                        <TableCell>{formatBRL(tipo.valor / tipo.count)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>Baixe relatórios detalhados ou gere novos relatórios personalizados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Relatório</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Data de Geração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.relatoriosDisponiveis.map((relatorio) => (
                    <TableRow key={relatorio.id}>
                      <TableCell className="font-medium">{relatorio.nome}</TableCell>
                      <TableCell>{getTipoBadge(relatorio.tipo)}</TableCell>
                      <TableCell>{relatorio.periodo}</TableCell>
                      <TableCell>{formatDate(relatorio.dataGeracao)}</TableCell>
                      <TableCell>{getStatusBadge(relatorio.status)}</TableCell>
                      <TableCell>{relatorio.tamanho}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled={relatorio.status !== 'disponivel'}>
                              <Download className="h-4 w-4 mr-2" />
                              Baixar
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={relatorio.status !== 'disponivel'}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={relatorio.status !== 'disponivel'}>
                              <Share className="h-4 w-4 mr-2" />
                              Compartilhar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}