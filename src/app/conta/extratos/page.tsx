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
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Carregar dados da API
  useEffect(() => {
    const fetchExtratos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/extratos');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar extratos');
        }
        
        if (data.success && data.data) {
          setEntries(data.data);
        } else {
          setEntries([]);
        }
      } catch (err) {
        console.error('Erro ao buscar extratos:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExtratos();
  }, []);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [entries]);

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

  const handleExportCSV = () => {
    if (entries.length === 0) {
      alert('Nenhum dado para exportar');
      return;
    }

    const csvContent = [
      ['Data', 'Descrição', 'Tipo', 'Valor'].join(','),
      ...entries.map(entry => [
        entry.date,
        `"${entry.description}"`,
        typeToLabel(entry.type),
        entry.amount.toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `extratos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Extratos</h1>
          <p className="text-muted-foreground">
            Histórico completo de movimentações da sua conta
          </p>
        </div>
        <Button 
          onClick={handleExportCSV} 
          variant="outline"
          disabled={loading || entries.length === 0}
        >
          Exportar CSV
        </Button>
      </div>

      {/* Estados de loading e error */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando extratos...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-2">Erro ao carregar extratos</p>
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de extratos */}
      {!loading && !error && entries.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground">Nenhum extrato encontrado</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
            <CardDescription>
              {sorted.length} {sorted.length === 1 ? 'lançamento' : 'lançamentos'} encontrados
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {currentSlice.map((entry, index) => (
                <div key={entry.id} className="border-b last:border-b-0">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.type === 'aporte' ? 'bg-green-500' :
                        entry.type === 'provento' ? 'bg-blue-500' :
                        entry.type === 'taxa' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`} />
                      <div>
                        <p className="font-medium">{entry.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatDatePT(entry.date)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {typeToLabel(entry.type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className={`text-right font-medium ${
                      entry.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.amount >= 0 ? '+' : ''}{formatBRL(entry.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paginação */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}