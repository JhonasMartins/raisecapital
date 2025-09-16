'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Filter,
  Download,
  PiggyBank
} from 'lucide-react';

interface RendimentosData {
  kpis: {
    mesAtual: number;
    anoAtual: number;
    yieldMedio: number;
  };
  ativos: Array<{
    id: number;
    nome: string;
    categoria: string;
    modalidade: string;
    valorInvestido: number;
    valorAtual: number;
    rendimentoBruto: number;
    rentabilidadePercentual: number;
    yieldAnual: number;
    dataInvestimento: string;
    status: string;
  }>;
  distribuicaoPorCategoria: Array<{
    categoria: string;
    valorInvestido: number;
    rendimento: number;
    quantidade: number;
  }>;
  totalInvestimentos: number;
  totalInvestido: number;
}

export default function ContaRendimentosPage() {
  const [rendimentosData, setRendimentosData] = useState<RendimentosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  useEffect(() => {
    const fetchRendimentos = async () => {
      try {
        const response = await fetch('/api/rendimentos');
        if (response.ok) {
          const data = await response.json();
          setRendimentosData(data);
        } else {
          console.error('Erro ao buscar rendimentos');
        }
      } catch (error) {
        console.error('Erro ao buscar rendimentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRendimentos();
  }, []);

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!rendimentosData) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Rendimentos</h1>
        <p>Erro ao carregar dados de rendimentos.</p>
      </div>
    );
  }

  const { kpis, ativos, distribuicaoPorCategoria } = rendimentosData;

  // Filtrar ativos por categoria
  const ativosFiltrados = filtroCategoria === 'todos' 
    ? ativos 
    : ativos.filter(ativo => ativo.categoria === filtroCategoria);

  // Obter categorias únicas
  const categorias = Array.from(new Set(ativos.map(ativo => ativo.categoria)));

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rendimentos</h1>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendimento do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBRL(kpis.mesAtual)}
            </div>
            <p className="text-xs text-muted-foreground">
              Proventos recebidos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendimento do Ano</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBRL(kpis.anoAtual)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de proventos em {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yield Médio</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.yieldMedio.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Yield médio ponderado da carteira
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as categorias</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Ativos */}
      <Card>
        <CardHeader>
          <CardTitle>Proventos por Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor Investido</TableHead>
                <TableHead>Rendimento Bruto</TableHead>
                <TableHead>Rentabilidade</TableHead>
                <TableHead>Yield Anual</TableHead>
                <TableHead>Data Investimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ativosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Nenhum investimento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                ativosFiltrados.map((ativo) => (
                  <TableRow key={ativo.id}>
                    <TableCell className="font-medium">{ativo.nome}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ativo.categoria}</Badge>
                    </TableCell>
                    <TableCell>{formatBRL(ativo.valorInvestido)}</TableCell>
                    <TableCell className={ativo.rendimentoBruto >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatBRL(ativo.rendimentoBruto)}
                    </TableCell>
                    <TableCell className={ativo.rentabilidadePercentual >= 0 ? 'text-green-600' : 'text-red-600'}>
                      <div className="flex items-center">
                        {ativo.rentabilidadePercentual >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {formatPercentage(ativo.rentabilidadePercentual)}
                      </div>
                    </TableCell>
                    <TableCell>{ativo.yieldAnual.toFixed(2)}%</TableCell>
                    <TableCell>{formatDate(ativo.dataInvestimento)}</TableCell>
                    <TableCell>
                      <Badge variant={ativo.status === 'ativo' ? 'primary' : 'secondary'}>
                        {ativo.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Distribuição por Categoria */}
      {distribuicaoPorCategoria.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {distribuicaoPorCategoria.map((categoria) => (
                <div key={categoria.categoria} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{categoria.categoria}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Investido:</span>
                      <span>{formatBRL(categoria.valorInvestido)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rendimento:</span>
                      <span className={categoria.rendimento >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatBRL(categoria.rendimento)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ativos:</span>
                      <span>{categoria.quantidade}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}