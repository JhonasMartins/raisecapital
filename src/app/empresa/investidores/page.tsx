import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Plus,
  MoreHorizontal,
  Eye,
  MessageCircle,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Calendar,
  TrendingUp,
  Star,
  Filter,
  Search,
} from "lucide-react"
import { formatBRL } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export default function InvestidoresPage() {
  // Mock data removida: substituir por estrutura vazia para manter o layout sem conteúdo fictício
  const mockInvestidores = {
    ativos: [] as Array<any>,
    potenciais: [] as Array<any>,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="success">Investidor Ativo</Badge>
      case 'interessado':
        return <Badge variant="warning">Interessado</Badge>
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'pessoa_fisica':
        return <Badge variant="outline">Pessoa Física</Badge>
      case 'pessoa_juridica':
        return <Badge variant="outline">Pessoa Jurídica</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
      />
    ))
  }

  const InvestidorCard = ({ investidor, isAtivo = true }: { investidor: any, isAtivo?: boolean }) => {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={investidor.avatar} alt={investidor.nome} />
                <AvatarFallback>{investidor.nome.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-lg">{investidor.nome}</CardTitle>
                <CardDescription>{investidor.cargo} • {investidor.empresa}</CardDescription>
                <div className="flex items-center gap-1">
                  {getRatingStars(investidor.rating)}
                  <span className="text-xs text-muted-foreground ml-1">({investidor.rating}/5)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(investidor.status)}
              {getTipoBadge(investidor.tipo)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar mensagem
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isAtivo && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Investido
                  </div>
                  <div className="font-semibold">{formatBRL(investidor.valorInvestido)}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Data
                  </div>
                  <div className="font-semibold">{formatDate(investidor.dataInvestimento)}</div>
                </div>
              </>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Investimentos
              </div>
              <div className="font-semibold">{investidor.investimentosAnteriores}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                Ticket Médio
              </div>
              <div className="font-semibold">{formatBRL(investidor.ticketMedio)}</div>
            </div>
          </div>

          {/* Informações de contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t text-sm">
            <div>
              <span className="text-muted-foreground">Email:</span>
              <div className="font-medium">{investidor.email}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Telefone:</span>
              <div className="font-medium">{investidor.telefone}</div>
            </div>
            {isAtivo && investidor.oferta && (
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Oferta:</span>
                <div className="font-medium">{investidor.oferta}</div>
              </div>
            )}
            {!isAtivo && investidor.ultimoContato && (
              <>
                <div>
                  <span className="text-muted-foreground">Último contato:</span>
                  <div className="font-medium">{formatDate(investidor.ultimoContato)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Fonte:</span>
                  <div className="font-medium">{investidor.fonte}</div>
                </div>
              </>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Ver perfil
            </Button>
            <Button size="sm" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contatar
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
          <h1 className="text-3xl font-bold tracking-tight">Investidores</h1>
          <p className="text-muted-foreground">
            Gerencie o relacionamento com seus investidores e potenciais parceiros.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Novo
        </Button>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar investidores por nome, empresa ou email..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{mockInvestidores.ativos.length}</div>
                <div className="text-sm text-muted-foreground">Investidores Ativos</div>
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
                  {formatBRL(mockInvestidores.ativos.reduce((acc, inv) => acc + inv.valorInvestido, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Investido</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {formatBRL(mockInvestidores.ativos.reduce((acc, inv) => acc + inv.valorInvestido, 0) / mockInvestidores.ativos.length)}
                </div>
                <div className="text-sm text-muted-foreground">Ticket Médio</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{mockInvestidores.potenciais.length}</div>
                <div className="text-sm text-muted-foreground">Leads Potenciais</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com investidores */}
      <Tabs defaultValue="ativos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ativos">Investidores Ativos ({mockInvestidores.ativos.length})</TabsTrigger>
          <TabsTrigger value="potenciais">Leads Potenciais ({mockInvestidores.potenciais.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ativos" className="space-y-4">
          {mockInvestidores.ativos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {mockInvestidores.ativos.map((investidor) => (
                <InvestidorCard key={investidor.id} investidor={investidor} isAtivo={true} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum investidor ativo</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Você ainda não possui investidores ativos. Comece a captar recursos para atrair investidores.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Investidor
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="potenciais" className="space-y-4">
          {mockInvestidores.potenciais.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {mockInvestidores.potenciais.map((investidor) => (
                <InvestidorCard key={investidor.id} investidor={investidor} isAtivo={false} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum lead potencial</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Seus leads potenciais aparecerão aqui. Adicione contatos interessados em investir.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Lead
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}