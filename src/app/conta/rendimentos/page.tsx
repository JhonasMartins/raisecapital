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
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-sm">
        <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="text-xs text-muted-foreground">Mês de referência</span>
      </div>
      <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {meses.map((m, i) => (
            <SelectItem key={m} value={String(i)}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="ml-1">
        <Download className="mr-2 h-4 w-4" /> Exportar CSV
      </Button>
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Proventos</h1>
          <p className="text-sm text-muted-foreground">Acompanhe KPIs e histórico de rendimentos</p>
        </div>
        <MesesSidebar month={month} setMonth={setMonth} />
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total no mês</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold tabular-nums">{formatBRL(kpis.mesAtual)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total no ano</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold tabular-nums">{formatBRL(kpis.anoAtual)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yield médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold tabular-nums">{(kpis.yieldMedio).toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro por setor */}
      <Tabs value={filter === "todos" ? "todos" : filter} onValueChange={(v) => setFilter(v as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="Imobiliário">Imobiliário</TabsTrigger>
            <TabsTrigger value="Agro">Agro</TabsTrigger>
            <TabsTrigger value="Infra">Infra</TabsTrigger>
            <TabsTrigger value="Crédito">Crédito</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">Total no mês: <span className="font-medium text-foreground">{formatBRL(totalMes)}</span></div>
        </div>
        <TabsContent value={filter === "todos" ? "todos" : filter}>
          <Card className="mt-3">
            <CardHeader>
              <CardTitle className="text-base">Proventos por ativo</CardTitle>
              <CardDescription>Totais por mês e acumulado no ano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ativo</TableHead>
                      <TableHead className="text-right">Setor</TableHead>
                      <TableHead className="text-right">Total mês</TableHead>
                      <TableHead className="text-right">Total YTD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ativosFiltrados.map((a) => (
                      <TableRow key={a.ticker}>
                        <TableCell>
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="font-medium text-foreground">{a.nome}</div>
                              <div className="mt-0.5 text-xs text-muted-foreground">{a.ticker}</div>
                            </div>
                            <Badge variant="outline">{a.ticker}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{a.setor}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatBRL(a.totalMes)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatBRL(a.totalYTD)}</TableCell>
                      </TableRow>
                    ))}
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