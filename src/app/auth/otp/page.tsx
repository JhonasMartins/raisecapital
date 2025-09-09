"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const OTP_LENGTH = 6

export default function OtpPage() {
  const [values, setValues] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  // Foca no primeiro input ao carregar
  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  function handleChange(index: number, nextVal: string) {
    // Mantém apenas dígitos e no máximo 1 caractere
    const digit = nextVal.replace(/\D/g, "").slice(-1)
    const newValues = [...values]
    newValues[index] = digit
    setValues(newValues)

    // Avança automaticamente para o próximo campo se houver dígito
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      // Volta para o anterior quando apaga em campo vazio
      const prev = index - 1
      const newValues = [...values]
      newValues[prev] = ""
      setValues(newValues)
      inputsRef.current[prev]?.focus()
      e.preventDefault()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus()
      e.preventDefault()
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
      e.preventDefault()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "")
    if (!pasted) return
    e.preventDefault()
    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, i) => pasted[i] || "")
    setValues(next)

    // Foca no último campo preenchido
    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1
    if (lastIndex >= 0) inputsRef.current[lastIndex]?.focus()
  }

  const code = values.join("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== OTP_LENGTH) {
      alert(`Insira os ${OTP_LENGTH} dígitos do código`)
      return
    }
    alert(`Código enviado: ${code}`)
  }

  return (
    <div className="w-full max-w-[400px] mx-auto self-center">
      <h1 className="text-2xl font-semibold">Verificação de código</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enviamos um código de {OTP_LENGTH} dígitos para seu e-mail. Insira-o abaixo para continuar.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="flex items-center justify-between gap-2">
          {values.map((v, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el }}
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              className="h-12 w-12 rounded-md border bg-background text-center text-lg outline-none focus:border-foreground/30"
              aria-label={`Dígito ${i + 1}`}
            />
          ))}
        </div>

        <Button type="submit" className="w-full">Verificar</Button>

        <div className="text-center text-sm text-muted-foreground">
          Não recebeu o código? <button type="button" className="underline underline-offset-4">Reenviar</button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Inseriu o e-mail errado? <Link href="/auth/recuperar-senha" className="hover:underline">Voltar</Link>
        </p>
      </form>
    </div>
  )
}