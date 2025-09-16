"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";


type EntryType = "aporte" | "retirada" | "provento" | "taxa";

type Entry = {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  type: EntryType;
  amount: number; // positivo para créditos, negativo para débitos
};

function typeToLabel(t: EntryType) {
  switch (t) {
    case "aporte":
      return "Aporte";
    case "retirada":
      return "Retirada";
    case "provento":
      return "Provento";
    case "taxa":
      return "Taxa";
  }
}

function typeToBadgeClasses(t: EntryType) {
  switch (t) {
    case "aporte":
      return "border-green-500/30 text-green-700 dark:text-green-400";
    case "retirada":
      return "border-red-500/30 text-red-700 dark:text-red-400";
    case "provento":
      return "border-blue-500/30 text-blue-700 dark:text-blue-400";
    case "taxa":
      return "border-amber-500/30 text-amber-700 dark:text-amber-400";
  }
}

function formatDatePT(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ContaExtratosPage() {
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const sorted = useMemo(() => {
    return [...ENTRIES].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, []);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentSlice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [page, sorted]);

  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of currentSlice) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [currentSlice]);

  function handleExportCSV() {
    const rows = [
      ["Data", "Tipo", "Descrição", "Valor"],
      ...sorted.map((e) => [
        e.date,
        typeToLabel(e.type),
        e.description,
        e.amount.toFixed(2),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extrato_raisecapital.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Extratos</h1>
          <p className="text-sm text-muted-foreground">Lançamentos por data com exportação CSV</p>
        </div>
        <Button onClick={handleExportCSV} aria-label="Exportar extrato em CSV">Exportar CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline de lançamentos</CardTitle>
          <CardDescription>Organizado por data mais recente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {grouped.map(([date, items]) => (
              <div key={date}>
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{formatDatePT(date)}</div>
                <div className="space-y-2">
                  {items.map((e, idx) => (
                    <div key={e.id} className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/60" aria-hidden />
                        <div>
                          <div className="font-medium text-foreground">{e.description}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{typeToLabel(e.type)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={typeToBadgeClasses(e.type)}>{typeToLabel(e.type)}</Badge>
                        <div className={`${e.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} tabular-nums`}>
                          {e.amount >= 0 ? "+" : ""}{formatBRL(e.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>

          {/* Paginação inferior */}
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <div className="text-muted-foreground">
              Mostrando {Math.min((page - 1) * pageSize + 1, sorted.length)}–{Math.min(page * pageSize, sorted.length)} de {sorted.length}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Página anterior">
                Anterior
              </Button>
              <div className="text-xs text-muted-foreground">
                Página {page} de {totalPages}
              </div>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Próxima página">
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}