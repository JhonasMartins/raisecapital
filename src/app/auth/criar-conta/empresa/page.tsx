"use client"

import Link from "next/link"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

function CriarContaEmpresaInner() {
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    cnpj: "",
    email: "",
    password: "",
    confirmPassword: "",
    nomeResponsavel: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()

  function validateForm() {
    if (!formData.nomeEmpresa.trim()) {
      return "Nome da empresa é obrigatório"
    }
    
    if (!formData.cnpj.trim()) {
      return "CNPJ é obrigatório"
    }
    
    // Validação básica de CNPJ (apenas números e tamanho)
    const cnpjNumbers = formData.cnpj.replace(/\D/g, '')
    if (cnpjNumbers.length !== 14) {
      return "CNPJ deve ter 14 dígitos"
    }
    
    if (!formData.nomeResponsavel.trim()) {
      return "Nome do responsável é obrigatório"
    }
    
    if (!formData.email.trim()) {
      return "E-mail é obrigatório"
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "E-mail inválido"
    }
    
    if (formData.password.length < 6) {
      return "Senha deve ter pelo menos 6 caracteres"
    }
    
    if (formData.password !== formData.confirmPassword) {
      return "Senhas não coincidem"
    }
    
    return null
  }

  function formatCNPJ(value: string) {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nomeResponsavel,
          email: formData.email,
          password: formData.password,
          document: formData.cnpj.replace(/\D/g, ''), // Remove formatação
          userType: 'empresa',
          nomeEmpresa: formData.nomeEmpresa
        }),
      })

      // Ler como texto e tentar parse JSON; evita erro quando resposta não é JSON puro
      const raw = await response.text()
      let data: any = null
      try { data = raw ? JSON.parse(raw) : null } catch { /* keep raw */ }

      if (!response.ok) {
        const msg = (data && (data.error || data.message)) || (raw?.slice(0,200) || 'Erro ao criar conta da empresa')
        throw new Error(typeof msg === 'string' ? msg : 'Erro ao criar conta da empresa')
      }

      router.push('/empresa')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta da empresa')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto self-center">
      <h1 className="text-2xl font-semibold">Cadastro de Empresa</h1>
      <p className="mt-2 text-sm text-muted-foreground">Registre sua empresa para captar recursos.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="nomeEmpresa">Nome da empresa</label>
          <input
            id="nomeEmpresa"
            type="text"
            required
            value={formData.nomeEmpresa}
            onChange={(e) => setFormData(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder="Razão social da empresa"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="cnpj">CNPJ</label>
          <input
            id="cnpj"
            type="text"
            required
            value={formData.cnpj}
            onChange={(e) => setFormData(prev => ({ ...prev, cnpj: formatCNPJ(e.target.value) }))}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder="00.000.000/0000-00"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="nomeResponsavel">Nome do responsável</label>
          <input
            id="nomeResponsavel"
            type="text"
            required
            value={formData.nomeResponsavel}
            onChange={(e) => setFormData(prev => ({ ...prev, nomeResponsavel: e.target.value }))}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder="Nome completo do responsável"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">E-mail corporativo</label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder="contato@empresa.com"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">Senha</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="h-11 w-full rounded-md border bg-background pr-10 px-3 text-sm outline-none ring-0 focus:border-foreground/30"
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="confirmPassword">Confirmar senha</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="h-11 w-full rounded-md border bg-background pr-10 px-3 text-sm outline-none ring-0 focus:border-foreground/30"
              placeholder="Confirme sua senha"
              disabled={isLoading}
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Criando conta..." : "Cadastrar empresa"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta? <Link href="/auth/login" className="hover:underline">Fazer login</Link>
        </p>
        
        <p className="text-center text-sm text-muted-foreground">
          É investidor? <Link href="/auth/criar-conta" className="hover:underline">Cadastro de investidor</Link>
        </p>
      </form>
    </div>
  )
}

export default function CriarContaEmpresaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CriarContaEmpresaInner />
    </Suspense>
  )
}