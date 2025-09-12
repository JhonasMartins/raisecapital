"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Simulação de status
type DocKey = "rg" | "comprovante" | "selfie";

const labels: Record<DocKey, string> = {
  rg: "RG ou CNH",
  comprovante: "Comprovante de endereço",
  selfie: "Selfie com documento",
};

type DocState = {
  file?: File;
  status: "pendente" | "enviado" | "aprovado" | "reprovado";
  updatedAt?: string;
  notes?: string;
};

export default function ContaDocumentosPage() {
  const [docs, setDocs] = useState<Record<DocKey, DocState>>({
    rg: { status: "pendente" },
    comprovante: { status: "pendente" },
    selfie: { status: "pendente" },
  });

  function handleSelect(key: DocKey, file?: File) {
    setDocs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        file,
        status: file ? "enviado" : "pendente",
        updatedAt: new Date().toISOString(),
        notes: undefined,
      },
    }));
  }

  function simulateReview(key: DocKey, ok: boolean) {
    setDocs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: ok ? "aprovado" : "reprovado",
        updatedAt: new Date().toISOString(),
        notes: ok ? undefined : "Documento inelegível, por favor envie novamente.",
      },
    }));
  }

  const overall = useMemo(() => {
    const values = Object.values(docs);
    const aprovados = values.filter((d) => d.status === "aprovado").length;
    const enviados = values.filter((d) => d.status === "enviado").length;
    const reprovados = values.filter((d) => d.status === "reprovado").length;
    const pendentes = values.filter((d) => d.status === "pendente").length;
    return { aprovados, enviados, reprovados, pendentes, total: values.length };
  }, [docs]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Documentos (KYC)</h1>
          <p className="text-sm text-muted-foreground">Upload e status de verificação (simulado)</p>
        </div>
        <Badge variant="outline" className="mt-1">{overall.aprovados}/{overall.total} aprovados</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(labels) as DocKey[]).map((key) => {
          const d = docs[key];
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-base">{labels[key]}</CardTitle>
                <CardDescription>Status: {d.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleSelect(key, e.target.files?.[0])}
                    aria-label={`Selecionar arquivo para ${labels[key]}`}
                  />
                  <div className="text-muted-foreground">
                    {d.file ? `Selecionado: ${d.file.name}` : "Nenhum arquivo selecionado"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!d.file}
                      onClick={() => simulateReview(key, true)}
                    >
                      Simular aprovação
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!d.file}
                      onClick={() => simulateReview(key, false)}
                    >
                      Simular reprovação
                    </Button>
                  </div>
                  {d.updatedAt && (
                    <div className="text-xs text-muted-foreground">Atualizado: {new Date(d.updatedAt).toLocaleString("pt-BR")}</div>
                  )}
                  {d.notes && (
                    <div className="rounded-md border border-amber-300/40 bg-amber-50 p-2 text-xs text-amber-800">
                      {d.notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo</CardTitle>
          <CardDescription>Progresso do KYC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-md border bg-card p-3">Pendentes: {overall.pendentes}</div>
            <div className="rounded-md border bg-card p-3">Enviados: {overall.enviados}</div>
            <div className="rounded-md border bg-card p-3">Aprovados: {overall.aprovados}</div>
            <div className="rounded-md border bg-card p-3">Reprovados: {overall.reprovados}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}