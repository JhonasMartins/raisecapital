"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

 type Doc = {
  id: string;
  name: string;
  type: "Contrato" | "Termo";
  status: "Assinado" | "Pendente" | "Cancelado";
  signedAt?: string;
  url?: string;
};

const DOCS: Doc[] = [
  { id: "1", name: "Contrato de Investimento", type: "Contrato", status: "Assinado", signedAt: "2024-07-12T14:30:00Z", url: "/uploads/1757514079071_Contrato-de-Investimento-e-Termo-de-Adesao-e-Cienc.pdf" },
  { id: "2", name: "Termo de Adesão", type: "Termo", status: "Assinado", signedAt: "2024-07-12T14:32:00Z", url: "/uploads/1757513439605_Lamina-Tecnica__1_.pdf" },
  { id: "3", name: "Termo de riscos", type: "Termo", status: "Pendente" },
];

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR");
}

export default function ContaAssinaturasPage() {
  const resumo = useMemo(() => {
    const total = DOCS.length;
    const assinados = DOCS.filter((d) => d.status === "Assinado").length;
    const pendentes = DOCS.filter((d) => d.status === "Pendente").length;
    return { total, assinados, pendentes };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Assinaturas</h1>
          <p className="text-sm text-muted-foreground">Repositório de contratos/termos</p>
        </div>
        <Badge variant="outline" className="mt-1">{resumo.assinados}/{resumo.total} assinados</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documentos</CardTitle>
          <CardDescription>Baixe seus contratos e termos assinados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assinado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOCS.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={d.status === "Assinado" ? "border-emerald-300 text-emerald-700" : d.status === "Pendente" ? "border-amber-300 text-amber-700" : "border-rose-300 text-rose-700"}>
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(d.signedAt)}</TableCell>
                  <TableCell>
                    {d.url ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={d.url} target="_blank" rel="noopener noreferrer">Baixar</a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Indisponível
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}