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
  Building2,
  Users,
  DollarSign,
  MoreHorizontal,
  Settings,
  TriangleAlert,
  Pin,
  Share2,
  Trash,
  ArrowUp,
  ArrowDown,
  Target,
  Calendar,
  FileText,
} from "lucide-react"
import { formatBRL } from "@/lib/utils"
import PortfolioDistributionChart from "@/components/portfolio-distribution-chart"
import StatisticCard13 from "@/components/statistic-card-13"
import { GradientBarMultipleChart } from "@/components/ui/gradient-bar-multiple-chart"

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

export default function EmpresaDashboardPage() {
  // Mock data removida: substituir por estrutura vazia para manter o layout sem conteúdo fictício
  const mockData = {
    totalCaptado: 0,
    metaCaptacao: 0,
    numeroInvestidores: 0,
    ofertasAtivas: 0,
    ticketMedio: 0,
    conversaoLeads: 0,
    
    captacaoMensal: [] as Array<{ mes: string; valor: number }>,
    
    ofertas: [] as Array<any>,
    
    proximasAcoes: [] as Array<any>,
  }

  const percentualCaptado = mockData.metaCaptacao > 0 ? (mockData.totalCaptado / mockData.metaCaptacao) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard da Empresa</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho das suas captações e gerencie suas ofertas de investimento.
        </p>
      </div>

      {/* KPIs principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiStatCard
          title="Total Captado"
          value={formatBRL(mockData.totalCaptado)}
          delta={12.5}
          positive={true}
          lastLabel="Meta"
          lastValue={formatBRL(mockData.metaCaptacao)}
        />
        <KpiStatCard
          title="Investidores"
          value={mockData.numeroInvestidores}
          delta={8.2}
          positive={true}
          lastLabel="Novos este mês"
          lastValue="23"
        />
        <KpiStatCard
          title="Ticket Médio"
          value={formatBRL(mockData.ticketMedio)}
          delta={-2.1}
          positive={false}
          lastLabel="Mês anterior"
          lastValue={formatBRL(22920)}
        />
        <KpiStatCard
          title="Conversão de Leads"
          value={`${mockData.conversaoLeads}%`}
          delta={1.8}
          positive={true}
          lastLabel="Meta"
          lastValue="10%"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progresso da Captação */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Progresso da Captação
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso em relação à meta de captação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Captado: {formatBRL(mockData.totalCaptado)}</span>
                  <span>Meta: {formatBRL(mockData.metaCaptacao)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(percentualCaptado, 100)}%` }}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {percentualCaptado.toFixed(1)}% da meta atingida
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Captação Mensal</h4>
                <div className="grid grid-cols-6 gap-2">
                  {mockData.captacaoMensal.map((item, index) => (
                    <div key={index} className="text-center space-y-1">
                      <div className="text-xs text-muted-foreground">{item.mes}</div>
                      <div className="h-16 bg-muted rounded flex items-end">
                        <div 
                          className="w-full bg-primary/80 rounded transition-all duration-300"
                          style={{ height: `${(item.valor / 500000) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium">{formatBRL(item.valor / 1000)}k</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Ações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Ações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockData.proximasAcoes.map((acao) => (
              <div key={acao.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0 mt-0.5">
                  {acao.tipo === 'reuniao' && <Users className="h-4 w-4 text-blue-500" />}
                  {acao.tipo === 'relatorio' && <FileText className="h-4 w-4 text-green-500" />}
                  {acao.tipo === 'documento' && <ClipboardList className="h-4 w-4 text-orange-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{acao.titulo}</p>
                  <p className="text-xs text-muted-foreground">{acao.data}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Ver todas as ações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ofertas Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Ofertas Ativas
          </CardTitle>
          <CardDescription>
            Gerencie suas ofertas de investimento em andamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.ofertas.map((oferta) => {
              const percentual = (oferta.captado / oferta.meta) * 100
              return (
                <div key={oferta.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{oferta.nome}</h4>
                    <Badge variant="outline">{oferta.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Captado:</span>
                      <div className="font-medium">{formatBRL(oferta.captado)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Meta:</span>
                      <div className="font-medium">{formatBRL(oferta.meta)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Investidores:</span>
                      <div className="font-medium">{oferta.investidores}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Prazo:</span>
                      <div className="font-medium">{oferta.prazo}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{percentual.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(percentual, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver detalhes
                    </Button>
                    <Button size="sm">
                      Gerenciar
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-center">
            <Button>
              <Building2 className="h-4 w-4 mr-2" />
              Criar Nova Oferta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}