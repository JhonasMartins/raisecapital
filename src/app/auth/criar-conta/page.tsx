"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mantém lógica existente de abas/validações/consultas; aqui focamos no contêiner e cabeçalhos
export default function CreateAccountPage() {
  const [tab, setTab] = useState<"investidor" | "empresa">("investidor")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(`Cadastro (${tab}) enviado!`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <p className="mt-2 text-sm text-muted-foreground">Comece escolhendo o tipo de conta e preencha seus dados.</p>

      {/* Abas simples, mantendo o estilo */}
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-md bg-muted p-1 text-sm">
        <button
          onClick={() => setTab("investidor")}
          className={`h-9 rounded-md transition ${tab === "investidor" ? "bg-background shadow" : "text-muted-foreground"}`}
        >
          Investidor (CPF ou CNPJ)
        </button>
        <button
          onClick={() => setTab("empresa")}
          className={`h-9 rounded-md transition ${tab === "empresa" ? "bg-background shadow" : "text-muted-foreground"}`}
        >
          Empresa (apenas CNPJ)
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {tab === "investidor" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nome">Nome completo</label>
              <input id="nome" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="documento">CPF/CNPJ</label>
              <input id="documento" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="email">E-mail</label>
              <input type="email" id="email" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="senha">Senha</label>
              <input type="password" id="senha" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="confirmar">Confirmar senha</label>
              <input type="password" id="confirmar" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="razao">Razão social</label>
              <input id="razao" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="cnpj">CNPJ</label>
              <input id="cnpj" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="email2">E-mail</label>
              <input type="email" id="email2" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="senha2">Senha</label>
              <input type="password" id="senha2" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="confirmar2">Confirmar senha</label>
              <input type="password" id="confirmar2" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full">Criar conta</Button>

        <p className="text-center text-sm text-muted-foreground">
          Já possui conta? <Link href="/auth/login" className="hover:underline">Fazer login</Link>
        </p>
      </form>
    </div>
  )
}