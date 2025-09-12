"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

 type Movement = {
  id: string;
  date: string; // ISO
  type: "Depósito" | "PIX" | "Saque";
  amount: number; // em reais
  status: "Confirmado" | "Pendente" | "Falhou";
  receiptUrl?: string;
};

const PIX_KEY = "contato@raisecapital.com.br";
const BANK_INFO = {
  bank: "Banco 260 - Nu Pagamentos S.A.",
  agency: "0001",
  account: "1234567-8",
  name: "Raise Capital LTDA",
  document: "12.345.678/0001-00",
};

const HISTORY: Movement[] = [
  { id: "m1", date: "2024-08-20T14:20:00Z", type: "Depósito", amount: 5000, status: "Confirmado", receiptUrl: "/uploads/1757513439605_Lamina-Tecnica__1_.pdf" },
  { id: "m2", date: "2024-09-02T10:05:00Z", type: "PIX", amount: 1200, status: "Confirmado" },
  { id: "m3", date: "2024-09-12T09:00:00Z", type: "Saque", amount: 800, status: "Pendente" },
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

export default function ContaPagamentosPage() {
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [requests, setRequests] = useState<Movement[]>([]);

  const resumo = useMemo(() => {
    const totalDepositos = HISTORY.filter((m) => m.type !== "Saque" && m.status === "Confirmado").reduce((acc, m) => acc + m.amount, 0);
    const totalSaques = HISTORY.filter((m) => m.type === "Saque").reduce((acc, m) => acc + m.amount, 0) + requests.filter((m) => m.type === "Saque").reduce((acc, m) => acc + m.amount, 0);
    return { totalDepositos, totalSaques };
  }, [requests]);

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function solicitarSaque() {
    const value = Number((withdrawAmount || "").replace(/[^0-9,\.]/g, "").replace(".", "").replace(",", "."));
    if (!value || value <= 0) return;
    const mov: Movement = {
      id: `req-${Date.now()}`,
      date: new Date().toISOString(),
      type: "Saque",
      amount: Math.round(value * 100) / 100,
      status: "Pendente",
    };
    setRequests((prev) => [mov, ...prev]);
    setWithdrawAmount("");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pagamentos</h1>
          <p className="text-sm text-muted-foreground">Instruções de depósito/PIX, histórico e saques</p>
        </div>
        <Badge variant="outline" className="mt-1">Saldo simulado</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Depósito via PIX</CardTitle>
            <CardDescription>Use a chave abaixo para transferir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="rounded-md border bg-card p-3">
                <div className="text-muted-foreground text-xs mb-1">Chave PIX</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono">{PIX_KEY}</span>
                  <Button size="sm" variant="outline" onClick={copyPix}>{copied ? "Copiado" : "Copiar"}</Button>
                </div>
              </div>

              <div className="rounded-md border bg-card p-3">
                <div className="text-muted-foreground text-xs mb-2">Dados bancários</div>
                <div className="grid gap-1 sm:grid-cols-2">
                  <div><span className="text-muted-foreground">Banco:</span> {BANK_INFO.bank}</div>
                  <div><span className="text-muted-foreground">Agência:</span> {BANK_INFO.agency}</div>
                  <div><span className="text-muted-foreground">Conta:</span> {BANK_INFO.account}</div>
                  <div><span className="text-muted-foreground">Titular:</span> {BANK_INFO.name}</div>
                  <div><span className="text-muted-foreground">CNPJ:</span> {BANK_INFO.document}</div>
                </div>
              </div>

              <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center text-xs text-muted-foreground">
                Pré-visualização do QR Code (geração real não implementada)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Solicitar saque</CardTitle>
            <CardDescription>Informe o valor para retirar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Valor (R$)</div>
                <input
                  className="w-full rounded-md border bg-background p-2"
                  placeholder="0,00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={solicitarSaque}>Solicitar</Button>
                <span className="text-xs text-muted-foreground">Processaremos em até 1 dia útil.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico</CardTitle>
          <CardDescription>Total depositado: {formatCurrency(resumo.totalDepositos)} • Saques: {formatCurrency(resumo.totalSaques)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...requests, ...HISTORY].length ? (
                [...requests, ...HISTORY].map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{formatDate(m.date)}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>{formatCurrency(m.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={m.status === "Confirmado" ? "border-emerald-300 text-emerald-700" : m.status === "Pendente" ? "border-amber-300 text-amber-700" : "border-rose-300 text-rose-700"}>
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {m.receiptUrl ? (
                        <Button asChild size="sm" variant="outline">
                          <a href={m.receiptUrl} target="_blank" rel="noopener noreferrer">Comprovante</a>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          —
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-56 text-center">
                    <div className="flex h-full flex-col items-center justify-center gap-3 py-6">
                      <img
                        src="/assets/62d95badcd68f3228ea7ba5d_no-records-found-illustration-dashboardly-webflow-ecommerce-template.png"
                        alt="Sem registros"
                        className="h-24 w-auto opacity-80"
                      />
                      <div className="text-sm text-muted-foreground">Nenhuma movimentação encontrada</div>
                      <div className="text-xs text-muted-foreground">As operações realizadas aparecerão aqui.</div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}