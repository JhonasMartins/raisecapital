"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

 type Answers = {
  risk: "baixa" | "media" | "alta" | "";
  horizon: "curto" | "medio" | "longo" | "";
  experience: "nenhuma" | "alguma" | "muita" | "";
};

export default function ContaSuitabilityPage() {
  const [answers, setAnswers] = useState<Answers>({ risk: "", horizon: "", experience: "" });
  const [result, setResult] = useState<"Conservador" | "Moderado" | "Arrojado" | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const validUntil = useMemo(() => {
    if (!submittedAt) return null;
    const d = new Date(submittedAt);
    d.setMonth(d.getMonth() + 12);
    return d.toLocaleDateString("pt-BR");
  }, [submittedAt]);

  function score() {
    let s = 0;
    if (answers.risk === "media") s += 1;
    if (answers.risk === "alta") s += 2;
    if (answers.horizon === "medio") s += 1;
    if (answers.horizon === "longo") s += 2;
    if (answers.experience === "alguma") s += 1;
    if (answers.experience === "muita") s += 2;
    if (s <= 2) return "Conservador" as const;
    if (s <= 4) return "Moderado" as const;
    return "Arrojado" as const;
  }

  function calcular() {
    const r = score();
    setResult(r);
  }

  function salvar() {
    setSubmittedAt(new Date().toISOString());
  }

  function renovar() {
    setAnswers({ risk: "", horizon: "", experience: "" });
    setResult(null);
    setSubmittedAt(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Suitability</h1>
          <p className="text-sm text-muted-foreground">Questionário, resultado e renovação</p>
        </div>
        {result ? (
          <Badge variant="outline" className="mt-1">Perfil: {result}</Badge>
        ) : (
          <Badge variant="outline" className="mt-1">Sem resultado</Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status atual</CardTitle>
          <CardDescription>
            {submittedAt ? (
              <span>Válido até {validUntil}</span>
            ) : (
              <span>Nenhum questionário salvo</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={renovar}>Renovar questionário</Button>
            {submittedAt && (
              <span className="text-xs text-muted-foreground">Última atualização: {new Date(submittedAt).toLocaleString("pt-BR")}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Questionário</CardTitle>
            <CardDescription>Responda para calcular o seu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <div className="mb-2 font-medium">Apetite a risco</div>
                <div className="flex flex-wrap gap-2">
                  {["baixa","media","alta"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="risk"
                        value={opt}
                        checked={answers.risk === opt}
                        onChange={(e) => setAnswers((a) => ({ ...a, risk: e.target.value as Answers["risk"] }))}
                      />
                      <span className="capitalize">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-2 font-medium">Horizonte de investimento</div>
                <select
                  className="w-full rounded-md border bg-background p-2"
                  value={answers.horizon}
                  onChange={(e) => setAnswers((a) => ({ ...a, horizon: e.target.value as Answers["horizon"] }))}
                >
                  <option value="">Selecione...</option>
                  <option value="curto">Curto (até 1 ano)</option>
                  <option value="medio">Médio (1 a 3 anos)</option>
                  <option value="longo">Longo (3+ anos)</option>
                </select>
              </div>

              <Separator />

              <div>
                <div className="mb-2 font-medium">Experiência prévia</div>
                <select
                  className="w-full rounded-md border bg-background p-2"
                  value={answers.experience}
                  onChange={(e) => setAnswers((a) => ({ ...a, experience: e.target.value as Answers["experience"] }))}
                >
                  <option value="">Selecione...</option>
                  <option value="nenhuma">Nenhuma</option>
                  <option value="alguma">Alguma</option>
                  <option value="muita">Muita</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={calcular}>Calcular resultado</Button>
                <Button size="sm" onClick={salvar} disabled={!result}>Salvar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultado</CardTitle>
            <CardDescription>Classificação simulada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Perfil:</span>
                <Badge variant="outline">{result ?? "—"}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Validade:</span>
                <span>{validUntil ?? "—"}</span>
              </div>
              <div className="rounded-md border bg-card p-3 text-xs text-muted-foreground">
                Este resultado é apenas ilustrativo e não constitui recomendação de investimento.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}