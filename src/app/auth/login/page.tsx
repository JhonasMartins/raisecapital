"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(`Login enviado para: ${email}`)
  }

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <h1 className="text-2xl font-semibold">Bem-vindo de volta</h1>
      <p className="mt-2 text-sm text-muted-foreground">Acesse sua conta para continuar.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder="Sua senha"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link href="/auth/recuperar-senha" className="hover:underline">Esqueci minha senha</Link>
        </div>

        <Button type="submit" className="w-full">Entrar</Button>

        <p className="text-center text-sm text-muted-foreground">
          Não tem conta? <Link href="/auth/criar-conta" className="hover:underline">Criar conta</Link>
        </p>
      </form>
    </div>
  )
}