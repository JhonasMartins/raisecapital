"use client"

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

// Helpers para validação
function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  if (cleanCNPJ.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false
  
  // Validação dos dígitos verificadores
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i]
  }
  let remainder = sum % 11
  const digit1 = remainder < 2 ? 0 : 11 - remainder
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false
  
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i]
  }
  remainder = sum % 11
  const digit2 = remainder < 2 ? 0 : 11 - remainder
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false
  
  return true
}

function formatCPF(value: string): string {
  const cleanValue = value.replace(/\D/g, '')
  return cleanValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

function formatCNPJ(value: string): string {
  const cleanValue = value.replace(/\D/g, '')
  return cleanValue
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

function isValidPassword(password: string): boolean {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /\d/.test(password) &&
         /[!@#$%^&*(),.?":{}|<>]/.test(password)
}

function CriarContaInner() {
  const [activeTab, setActiveTab] = useState<"pf" | "pj">("pf")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    document: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Selecionar automaticamente a aba PJ quando a URL indicar '?tipo=pj' ou '/empresa'
  useEffect(() => {
    try {
      const tipo = (searchParams.get('tipo') || '').toLowerCase()
      if (tipo === 'pj' || tipo === 'empresa' || pathname.endsWith('/empresa')) {
        setActiveTab('pj')
      }
    } catch {
      // noop
    }
  }, [pathname, searchParams])

  const handleDocumentChange = (value: string) => {
    const formatted = activeTab === "pf" ? formatCPF(value) : formatCNPJ(value)
    setFormData(prev => ({ ...prev, document: formatted }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "Nome é obrigatório"
    if (!formData.email.trim()) return "E-mail é obrigatório"
    if (!formData.document.trim()) return `${activeTab === "pf" ? "CPF" : "CNPJ"} é obrigatório`
    if (!formData.password) return "Senha é obrigatória"
    if (formData.password !== formData.confirmPassword) return "Senhas não coincidem"
    
    // Validar documento
    if (activeTab === "pf" && !isValidCPF(formData.document)) {
      return "CPF inválido"
    }
    if (activeTab === "pj" && !isValidCNPJ(formData.document)) {
      return "CNPJ inválido"
    }
    
    // Validar senha
    if (!isValidPassword(formData.password)) {
      return "Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo"
    }
    
    return null
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
          name: formData.name,
          email: formData.email,
          password: formData.password,
          document: formData.document.replace(/\D/g, ''), // Remove formatação
          userType: activeTab
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      // Redirecionar para /conta após registro bem-sucedido
      router.push('/conta')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto self-center">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <p className="mt-2 text-sm text-muted-foreground">Preencha os dados para começar.</p>

      {/* Tabs */}
      <div className="mt-6 flex rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => setActiveTab("pf")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === "pf"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pessoa Física
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pj")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === "pj"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pessoa Jurídica
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="name">
            {activeTab === "pf" ? "Nome completo" : "Razão social"}
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder={activeTab === "pf" ? "Seu nome completo" : "Nome da empresa"}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder="seu@email.com"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="document">
            {activeTab === "pf" ? "CPF" : "CNPJ"}
          </label>
          <input
            id="document"
            type="text"
            required
            value={formData.document}
            onChange={(e) => handleDocumentChange(e.target.value)}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0 focus:border-foreground/30"
            placeholder={activeTab === "pf" ? "000.000.000-00" : "00.000.000/0000-00"}
            maxLength={activeTab === "pf" ? 14 : 18}
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
              placeholder="Sua senha"
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
          <p className="text-xs text-muted-foreground">
            Mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo
          </p>
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
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta? <Link href="/auth/login" className="hover:underline">Fazer login</Link>
        </p>
      </form>
    </div>
  )
}

export default function CriarContaPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[400px] mx-auto self-center">
          <p className="text-sm text-muted-foreground">Carregando…</p>
        </div>
      }
    >
      <CriarContaInner />
    </Suspense>
  )
}