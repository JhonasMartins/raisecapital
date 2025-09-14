"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, TrendingUp, PiggyBank, Download } from "lucide-react";

// KPIs mockados: total de proventos no mês, total YTD, yield médio
const KPIS = {
  mesAtual: 702.84,
  anoAtual: 5432.1,
  yieldMedio: 0.86, // % mês
};

// Histórico por ativo (mock)
const ativos: { ticker: string; nome: string; setor: string; totalMes: number; totalYTD: number }[] = [
  { ticker: "IMOB11", nome: "Imobiliário Alpha", setor: "Imobiliário", totalMes: 230.5, totalYTD: 1890.2 },
  { ticker: "AGRO3", nome: "Agro Delta", setor: "Agro", totalMes: 142.22, totalYTD: 1065.1 },
  { ticker: "INFR4", nome: "Infra Beta", setor: "Infra", totalMes: 88.4, totalYTD: 743.2 },
  { ticker: "CRDT2", nome: "Crédito Gamma", setor: "Crédito", totalMes: 241.72, totalYTD: 1733.6 },
];

function MesesSidebar({ month, setMonth }: { month: number; setMonth: (m: number) => void }) {
  const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
      <div className="hidden lg:flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
        <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="text-xs text-muted-foreground">Mês de referência</span>
      </div>
      <div className="flex items-center gap-2">
        <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {meses.map((m, i) => (
              <SelectItem key={m} value={String(i)}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="shrink-0">
          <Download className="mr-1 sm:mr-2 h-4 w-4" /> 
          <span className="hidden xs:inline">Exportar CSV</span>
          <span className="xs:hidden">CSV</span>
        </Button>
      </div>
    </div>
  );
}

export default function ContaRendimentosPage() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [filter, setFilter] = useState<"todos" | "Imobiliário" | "Agro" | "Infra" | "Crédito">("todos");

  // Para o mock, variamos um pouco o total do mês conforme o mês escolhido
  const kpis = useMemo(() => {
    const fator = 0.9 + (month % 3) * 0.05;
    return {
      mesAtual: KPIS.mesAtual * fator,
      anoAtual: KPIS.anoAtual,
      yieldMedio: KPIS.yieldMedio * fator,
    };
  }, [month]);

  const ativosFiltrados = useMemo(() => {
    if (filter === "todos") return ativos;
    return ativos.filter((a) => a.setor === filter);
  }, [filter]);

  const totalMes = ativosFiltrados.reduce((acc, a) => acc + a.totalMes, 0);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold">Proventos</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Acompanhe KPIs e histórico de rendimentos</p>
          </div>
          <MesesSidebar month={month} setMonth={setMonth} />
        </div>

        {/* KPIs */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total no mês</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-lg sm:text-xl font-semibold tabular-nums">{formatBRL(kpis.mesAtual)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total no ano</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-lg sm:text-xl font-semibold tabular-nums">{formatBRL(kpis.anoAtual)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Yield médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-lg sm:text-xl font-semibold tabular-nums">{(kpis.yieldMedio).toFixed(2)}%</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtro por setor */}
      <Tabs value={filter === "todos" ? "todos" : filter} onValueChange={(v) => setFilter(v as any)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 sm:w-auto">
              <TabsTrigger value="todos" className="text-xs sm:text-sm">Todos</TabsTrigger>
              <TabsTrigger value="Imobiliário" className="text-xs sm:text-sm">Imob.</TabsTrigger>
              <TabsTrigger value="Agro" className="text-xs sm:text-sm">Agro</TabsTrigger>
              <TabsTrigger value="Infra" className="text-xs sm:text-sm">Infra</TabsTrigger>
              <TabsTrigger value="Crédito" className="text-xs sm:text-sm">Créd.</TabsTrigger>
            </TabsList>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Total no mês: <span className="font-medium text-foreground">{formatBRL(totalMes)}</span>
          </div>
        </div>
        <TabsContent value={filter === "todos" ? "todos" : filter}>
          <Card className="mt-3">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Proventos por ativo</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Totais por mês e acumulado no ano</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm pl-3 sm:pl-4">Ativo</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden sm:table-cell">Setor</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Total mês</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm pr-3 sm:pr-4">Total YTD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ativosFiltrados.length ? (
                      ativosFiltrados.map((a) => (
                        <TableRow key={a.ticker}>
                          <TableCell className="pl-3 sm:pl-4 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-foreground text-xs sm:text-sm truncate">{a.nome}</div>
                                <div className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground">{a.ticker}</div>
                              </div>
                              <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0 ml-2">{a.ticker}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs sm:text-sm hidden sm:table-cell py-2">{a.setor}</TableCell>
                          <TableCell className="text-right tabular-nums text-xs sm:text-sm py-2">{formatBRL(a.totalMes)}</TableCell>
                          <TableCell className="text-right tabular-nums text-xs sm:text-sm py-2 pr-3 sm:pr-4">{formatBRL(a.totalYTD)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-40 sm:h-56 text-center">
                          <div className="flex h-full flex-col items-center justify-center gap-2 sm:gap-3 py-4 sm:py-6">
                            <img
                              src="/assets/62d95badcd68f3a013a7ba5c_no-records-available-illustration-dashboardly-webflow-ecommerce-template.png"
                              alt="Sem registros"
                              className="h-16 sm:h-24 w-auto opacity-80"
                            />
                            <div className="text-xs sm:text-sm text-muted-foreground">Nenhum provento para os filtros selecionados</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground">Altere o mês ou o setor para ver resultados.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}