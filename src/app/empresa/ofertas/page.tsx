import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Users,
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  Clock,
} from "lucide-react"
import { formatBRL } from "@/lib/utils"

export default function OfertasPage() {
  // Mock data removida: substituir por estrutura vazia para manter o layout sem conteúdo fictício
  const mockOfertas = {
    ativas: [] as Array<any>,
    encerradas: [] as Array<any>,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge variant="success">Ativa</Badge>
      case 'encerrada':
        return <Badge variant="secondary">Encerrada</Badge>
      case 'pausada':
        return <Badge variant="warning">Pausada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'equity':
        return <Badge variant="outline">Equity</Badge>
      case 'debt':
        return <Badge variant="outline">Dívida</Badge>
      case 'convertible':
        return <Badge variant="outline">Conversível</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  const OfertaCard = ({ oferta }: { oferta: any }) => {
    const percentual = oferta.meta > 0 ? (oferta.captado / oferta.meta) * 100 : 0
    const diasRestantes = Math.max(0, Math.ceil((new Date(oferta.dataFim).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{oferta.nome}</CardTitle>
              <CardDescription>{oferta.descricao}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(oferta.status)}
              {getTipoBadge(oferta.tipo)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                Captado
              </div>
              <div className="font-semibold">{formatBRL(oferta.captado)}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Target className="h-3 w-3" />
                Meta
              </div>
              <div className="font-semibold">{formatBRL(oferta.meta)}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                Investidores
              </div>
              <div className="font-semibold">{oferta.investidores}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {oferta.status === 'ativa' ? 'Dias restantes' : 'Duração'}
              </div>
              <div className="font-semibold">
                {oferta.status === 'ativa' ? `${diasRestantes} dias` : `${Math.ceil((new Date(oferta.dataFim).getTime() - new Date(oferta.dataInicio).getTime()) / (1000 * 60 * 60 * 24))} dias`}
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da captação</span>
              <span className="font-medium">{percentual.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(percentual, 100)}%` }}
              />
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
            <div>
              <span className="text-muted-foreground">Ticket mínimo:</span>
              <div className="font-medium">{formatBRL(oferta.ticketMinimo)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Período:</span>
              <div className="font-medium">{formatDate(oferta.dataInicio)} - {formatDate(oferta.dataFim)}</div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Ver detalhes
            </Button>
            <Button size="sm" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Gerenciar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Ofertas</h1>
          <p className="text-muted-foreground">
            Gerencie suas ofertas de investimento e acompanhe o progresso das captações.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Oferta
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{mockOfertas.ativas.length}</div>
                <div className="text-sm text-muted-foreground">Ofertas Ativas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {formatBRL(mockOfertas.ativas.reduce((acc, oferta) => acc + oferta.captado, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Captado</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {mockOfertas.ativas.reduce((acc, oferta) => acc + oferta.investidores, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Investidores</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com ofertas */}
      <Tabs defaultValue="ativas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ativas">Ofertas Ativas ({mockOfertas.ativas.length})</TabsTrigger>
          <TabsTrigger value="encerradas">Encerradas ({mockOfertas.encerradas.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ativas" className="space-y-4">
          {mockOfertas.ativas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {mockOfertas.ativas.map((oferta) => (
                <OfertaCard key={oferta.id} oferta={oferta} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma oferta ativa</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Você ainda não possui ofertas ativas. Crie sua primeira oferta para começar a captar recursos.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Oferta
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="encerradas" className="space-y-4">
          {mockOfertas.encerradas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {mockOfertas.encerradas.map((oferta) => (
                <OfertaCard key={oferta.id} oferta={oferta} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma oferta encerrada</h3>
                <p className="text-muted-foreground text-center">
                  Suas ofertas encerradas aparecerão aqui.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}