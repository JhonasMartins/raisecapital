"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(`Enviamos instruções para: ${email}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Recuperar senha</h1>
      <p className="mt-2 text-sm text-muted-foreground">Informe seu e-mail para receber o link de redefinição.</p>

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

        <Button type="submit" className="w-full">Enviar</Button>

        <p className="text-center text-sm text-muted-foreground">
          Lembrou a senha? <Link href="/auth/login" className="hover:underline">Fazer login</Link>
        </p>
      </form>
    </div>
  )
}