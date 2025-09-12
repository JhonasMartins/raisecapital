"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatBRL } from "@/lib/utils";

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
    <aside className="sticky top-20 h-fit rounded-md border bg-card p-2 text-sm">
      <div className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Mês de referência
      </div>
      <div className="grid grid-cols-3 gap-1">
        {meses.map((m, i) => (
          <button
            key={m}
            onClick={() => setMonth(i)}
            className={
              "rounded-md px-2 py-1 outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 " +
              (month === i ? "bg-primary/10 text-foreground ring-1 ring-primary/20" : "hover:bg-muted/60")
            }
            aria-pressed={month === i}
          >
            {m}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default function ContaRendimentosPage() {
  const [month, setMonth] = useState(new Date().getMonth());

  // Para o mock, variamos um pouco o total do mês conforme o mês escolhido
  const kpis = useMemo(() => {
    const fator = 0.9 + (month % 3) * 0.05;
    return {
      mesAtual: KPIS.mesAtual * fator,
      anoAtual: KPIS.anoAtual,
      yieldMedio: KPIS.yieldMedio * fator,
    };
  }, [month]);

  const totalMes = ativos.reduce((acc, a) => acc + a.totalMes, 0);

  return (
    <div className="grid w-full gap-6 md:grid-cols-[220px_1fr]">
      {/* Lateral: calendário de meses */}
      <MesesSidebar month={month} setMonth={setMonth} />

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Rendimentos</h1>
          <p className="text-sm text-muted-foreground">KPIs e histórico de proventos por ativo</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total no mês</CardTitle>
              <CardDescription>Baseado no mês selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold tabular-nums">{formatBRL(kpis.mesAtual)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total no ano</CardTitle>
              <CardDescription>Acumulado YTD</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold tabular-nums">{formatBRL(kpis.anoAtual)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Yield médio</CardTitle>
              <CardDescription>No mês selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold tabular-nums">{(kpis.yieldMedio).toFixed(2)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela por ativo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proventos por ativo</CardTitle>
            <CardDescription>Totais por mês e acumulado no ano</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-[1fr_auto_auto_auto]">
              <div className="hidden text-xs uppercase tracking-wide text-muted-foreground sm:block">Ativo</div>
              <div className="hidden text-right text-xs uppercase tracking-wide text-muted-foreground sm:block">Setor</div>
              <div className="hidden text-right text-xs uppercase tracking-wide text-muted-foreground sm:block">Total mês</div>
              <div className="hidden text-right text-xs uppercase tracking-wide text-muted-foreground sm:block">Total YTD</div>

              {ativos.map((a) => (
                <div key={a.ticker} className="contents">
                  <div className="rounded-md border bg-card p-3 sm:col-start-1 sm:col-end-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-foreground">{a.nome}</div>
                      <Badge variant="outline">{a.ticker}</Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{a.setor}</div>
                  </div>
                  <div className="rounded-md border bg-card p-3 text-right tabular-nums sm:col-start-2 sm:col-end-3">
                    {a.setor}
                  </div>
                  <div className="rounded-md border bg-card p-3 text-right tabular-nums sm:col-start-3 sm:col-end-4">
                    {formatBRL(a.totalMes)}
                  </div>
                  <div className="rounded-md border bg-card p-3 text-right tabular-nums sm:col-start-4 sm:col-end-5">
                    {formatBRL(a.totalYTD)}
                  </div>
                </div>
              ))}

              <Separator className="my-2 sm:col-span-4" />
              <div className="sm:col-start-1 sm:col-end-5 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{ativos.length} ativos</div>
                <div className="text-sm font-medium">Total no mês: {formatBRL(totalMes)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}