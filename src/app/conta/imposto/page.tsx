"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Calculator, Download, FileText } from "lucide-react";

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

export default function ContaImpostoPage() {
  const [data, setData] = useState<RendimentosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/rendimentos");
        if (!res.ok) throw new Error("Falha ao carregar dados");
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e?.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const years = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => currentYear - i);
  }, [currentYear]);

  const numeroBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(v || 0);
  const numeroPct = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 2 }).format((v || 0) / 100);
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(iso));

  const ativosConsiderados = useMemo(() => {
    if (!data) return [] as RendimentosData["ativos"];
    // Considera ativos investidos até o ano selecionado (aproximação para IR)
    return data.ativos.filter((a) => {
      const y = new Date(a.dataInvestimento).getFullYear();
      return y <= year;
    });
  }, [data, year]);

  const resumo = useMemo(() => {
    const totalInvestido = ativosConsiderados.reduce((acc, a) => acc + (a.valorInvestido || 0), 0);
    // Estimativa de rendimento do ano com base no yieldAnual informado por ativo
    const rendimentoEstimadoAno = ativosConsiderados.reduce(
      (acc, a) => acc + (a.valorInvestido || 0) * ((a.yieldAnual || 0) / 100),
      0
    );
    const baseCalculoEstimada = rendimentoEstimadoAno; // simplificação: todo rendimento estimado é tributável

    // Distribuição por categoria (estimada)
    const porCategoria: Record<string, { quantidade: number; investido: number; estimado: number }> = {};
    for (const a of ativosConsiderados) {
      const cat = a.categoria || "Outros";
      porCategoria[cat] = porCategoria[cat] || { quantidade: 0, investido: 0, estimado: 0 };
      porCategoria[cat].quantidade += 1;
      porCategoria[cat].investido += a.valorInvestido || 0;
      porCategoria[cat].estimado += (a.valorInvestido || 0) * ((a.yieldAnual || 0) / 100);
    }

    return { totalInvestido, rendimentoEstimadoAno, baseCalculoEstimada, porCategoria };
  }, [ativosConsiderados]);

  function exportarCSV() {
    const headers = [
      "Ativo",
      "Categoria",
      "Modalidade",
      "Data do investimento",
      "Valor investido (R$)",
      "Yield anual (%)",
      "Rendimento estimado no ano (R$)",
    ];

    const rows = ativosConsiderados.map((a) => [
      a.nome,
      a.categoria,
      a.modalidade,
      formatDate(a.dataInvestimento),
      (a.valorInvestido || 0).toFixed(2).replace(".", ","),
      (a.yieldAnual || 0).toFixed(2).replace(".", ","),
      ((a.valorInvestido || 0) * ((a.yieldAnual || 0) / 100)).toFixed(2).replace(".", ","),
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `informe-rendimentos-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Imposto de Renda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Carregando dados...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Imposto de Renda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Cabeçalho e seletor de ano */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Imposto de Renda</h1>
          <p className="text-sm text-muted-foreground">Resumo estimado dos seus rendimentos para declaração do ano-calendário.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /> Ano-calendário
          </div>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Rendimento estimado no ano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{numeroBRL(resumo.rendimentoEstimadoAno)}</div>
            <p className="mt-1 text-xs text-muted-foreground">Cálculo baseado em yield anual informado por ativo.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Base de cálculo estimada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{numeroBRL(resumo.baseCalculoEstimada)}</div>
            <p className="mt-1 text-xs text-muted-foreground">Simplificação: considera 100% tributável.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total investido (ativos considerados)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{numeroBRL(resumo.totalInvestido)}</div>
            <p className="mt-1 text-xs text-muted-foreground">Ativos com data de investimento até {year}.</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Informe */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" /> Informe de rendimentos (estimado)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportarCSV} className="gap-2">
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="hidden md:table-cell">Modalidade</TableHead>
                <TableHead>Data investimento</TableHead>
                <TableHead className="text-right">Valor investido</TableHead>
                <TableHead className="text-right">Yield anual</TableHead>
                <TableHead className="text-right">Rend. estimado ano</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ativosConsiderados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhum ativo considerado para {year}.
                  </TableCell>
                </TableRow>
              ) : (
                ativosConsiderados.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.nome}</TableCell>
                    <TableCell>{a.categoria}</TableCell>
                    <TableCell className="hidden md:table-cell">{a.modalidade}</TableCell>
                    <TableCell>{formatDate(a.dataInvestimento)}</TableCell>
                    <TableCell className="text-right">{numeroBRL(a.valorInvestido)}</TableCell>
                    <TableCell className="text-right">{numeroPct(a.yieldAnual)}</TableCell>
                    <TableCell className="text-right">{numeroBRL((a.valorInvestido || 0) * ((a.yieldAnual || 0) / 100))}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-3 text-xs text-muted-foreground">
            Observação: Esta é uma estimativa baseada nas informações disponíveis e não substitui o Informe de Rendimentos oficial emitido pelas instituições financeiras.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}