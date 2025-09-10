"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

// Mantém lógica existente de abas/validações/consultas; aqui focamos no contêiner e cabeçalhos
export default function CreateAccountPage() {
  const [tab, setTab] = useState<"investidor" | "empresa">("investidor")
  const [showPwd1, setShowPwd1] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [showPwd3, setShowPwd3] = useState(false)
  const [showPwd4, setShowPwd4] = useState(false)

  // Helpers
  const onlyDigits = (v: string) => v.replace(/\D/g, "")
  const isCnpj = (v: string) => onlyDigits(v).length === 14
  const formatCPF = (v: string) => {
    const d = onlyDigits(v).slice(0,11)
    return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }
  const formatCNPJ = (v: string) => {
    const d = onlyDigits(v).slice(0,14)
    if (d.length <= 2) return d
    if (d.length <= 5) return d.replace(/^(\d{2})(\d{1,3})$/, "$1.$2")
    if (d.length <= 8) return d.replace(/^(\d{2})(\d{3})(\d{1,3})$/, "$1.$2.$3")
    if (d.length <= 12) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, "$1.$2.$3/$4")
    return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, "$1.$2.$3/$4-$5")
  }
  const formatCEP = (v: string) => {
    const d = onlyDigits(v).slice(0,8)
    return d.replace(/(\d{5})(\d)/, "$1-$2")
  }
  const formatPhone = (v: string) => {
    const d = onlyDigits(v).slice(0,11)
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim()
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim()
  }
  const isAdult = (dateStr: string) => {
    if (!dateStr) return false
    const dob = new Date(dateStr)
    const today = new Date()
    const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0)
    return age >= 18
  }
  const passwordStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score // 0..5
  }

  // Validação de CPF/CNPJ
  const isValidCPF = (value: string) => {
    const cpf = onlyDigits(value)
    if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
    let sum = 0
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i)
    let rev = 11 - (sum % 11)
    if (rev === 10 || rev === 11) rev = 0
    if (rev !== parseInt(cpf.charAt(9))) return false
    sum = 0
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i)
    rev = 11 - (sum % 11)
    if (rev === 10 || rev === 11) rev = 0
    return rev === parseInt(cpf.charAt(10))
  }
  const isValidCNPJ = (value: string) => {
    const cnpj = onlyDigits(value)
    if (!cnpj || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false
    const calcDV = (base: string, pos: number) => {
      let sum = 0
      let factor = pos
      for (let i = 0; i < base.length; i++) {
        sum += parseInt(base[i]) * factor
        factor = factor === 2 ? 9 : factor - 1
      }
      const res = sum % 11
      return res < 2 ? 0 : 11 - res
    }
    const dv1 = calcDV(cnpj.substring(0, 12), 5)
    const dv2 = calcDV(cnpj.substring(0, 12) + dv1, 6)
    return cnpj.endsWith(`${dv1}${dv2}`)
  }
  // --- Estados (Investidor) ---
  const [invPessoa, setInvPessoa] = useState<"" | "pf" | "pj">("")
  const [invCpf, setInvCpf] = useState("")
  const [invRg, setInvRg] = useState("")
  const [invCnpj, setInvCnpj] = useState("")
  const [invRepCpf, setInvRepCpf] = useState("")
  const [invRepRg, setInvRepRg] = useState("")
  const [invNascimento, setInvNascimento] = useState("")
  const [invGenero, setInvGenero] = useState("")
  const [invTelefone, setInvTelefone] = useState("")
  const [invEmail, setInvEmail] = useState("")
  const [invPwd, setInvPwd] = useState("")
  const [invPwdConf, setInvPwdConf] = useState("")
  const [invCep, setInvCep] = useState("")
  const [invEndereco, setInvEndereco] = useState("")
  const [invNumero, setInvNumero] = useState("")
  const [invComplemento, setInvComplemento] = useState("")
  const [invBairro, setInvBairro] = useState("")
  const [invCidade, setInvCidade] = useState("")
  const [invUf, setInvUf] = useState("")
  const [invRazao, setInvRazao] = useState("")
  const [invFantasia, setInvFantasia] = useState("")
  // Erros de documento
  const [invCpfError, setInvCpfError] = useState<string | null>(null)
  const [invCnpjError, setInvCnpjError] = useState<string | null>(null)
  const [empCnpjError, setEmpCnpjError] = useState<string | null>(null)

  // Empresa (captar): somente CNPJ
  const [empCnpj, setEmpCnpj] = useState("")
  const [empRazao, setEmpRazao] = useState("")
  const [empFantasia, setEmpFantasia] = useState("")
  const [empSetor, setEmpSetor] = useState("")
  const [empDescricao, setEmpDescricao] = useState("")
  const [empValorPretendido, setEmpValorPretendido] = useState("")
  const [empSite, setEmpSite] = useState("")
  const [empEmail, setEmpEmail] = useState("")
  const [empTelefone, setEmpTelefone] = useState("")
  const [empPwd, setEmpPwd] = useState("")
  const [empPwdConf, setEmpPwdConf] = useState("")
  const [empCep, setEmpCep] = useState("")
  const [empEndereco, setEmpEndereco] = useState("")
  const [empNumero, setEmpNumero] = useState("")
  const [empComplemento, setEmpComplemento] = useState("")
  const [empBairro, setEmpBairro] = useState("")
  const [empCidade, setEmpCidade] = useState("")
  const [empUf, setEmpUf] = useState("")

  async function lookupCep(cepRaw: string, set: {
    setEndereco: (v: string) => void
    setBairro: (v: string) => void
    setCidade: (v: string) => void
    setUf: (v: string) => void
  }) {
    const cep = onlyDigits(cepRaw)
    if (cep.length !== 8) return
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
      if (!res.ok) throw new Error("CEP não encontrado")
      const data = (await res.json()) as unknown
      if (data && typeof data === 'object') {
        const d = data as Record<string, unknown>
        set.setEndereco(typeof d.street === 'string' ? d.street : "")
        set.setBairro(typeof d.neighborhood === 'string' ? d.neighborhood : "")
        set.setCidade(typeof d.city === 'string' ? d.city : "")
        set.setUf(typeof d.state === 'string' ? d.state : "")
      }
    } catch (e) {
      console.error(e)
      alert("Não foi possível buscar o CEP. Verifique o número e tente novamente.")
    }
  }

  async function lookupCnpj(cnpjRaw: string, setters: { setRazao: (v: string) => void; setFantasia: (v: string) => void }) {
    const cnpj = onlyDigits(cnpjRaw)
    if (cnpj.length !== 14) return
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
      if (!res.ok) throw new Error("CNPJ não encontrado")
      const data = (await res.json()) as unknown
      if (data && typeof data === 'object') {
        const d = data as Record<string, unknown>
        const razao = typeof d.razao_social === 'string' ? d.razao_social : ""
        const fantasia = typeof d.nome_fantasia === 'string' ? d.nome_fantasia : ""
        setters.setRazao(razao)
        setters.setFantasia(fantasia)
      }
    } catch (e) {
      console.error(e)
      alert("Não foi possível buscar o CNPJ. Verifique o número e tente novamente.")
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Aqui você pode consolidar o payload para sua API interna
    alert(`Cadastro (${tab}) enviado!`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <p className="mt-2 text-sm text-muted-foreground">Comece escolhendo o tipo de conta e preencha seus dados.</p>

      {/* Abas simples, mantendo o estilo */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-muted p-1 text-sm">
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

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {tab === "investidor" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nome">Nome completo</label>
              <input id="nome" placeholder="Ex.: João da Silva" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>

            {/* Passo 1: seleção PF ou PJ */}
            <div className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Tipo de pessoa</span>
              <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-1 text-sm">
                <button
                  type="button"
                  onClick={() => { setInvPessoa("pf"); }}
                  className={`h-9 rounded-md transition ${invPessoa === "pf" ? "bg-background shadow" : "text-muted-foreground"}`}
                >
                  Pessoa Física (CPF)
                </button>
                <button
                  type="button"
                  onClick={() => { setInvPessoa("pj"); }}
                  className={`h-9 rounded-md transition ${invPessoa === "pj" ? "bg-background shadow" : "text-muted-foreground"}`}
                >
                  Pessoa Jurídica (CNPJ)
                </button>
              </div>
            </div>

            {/* Passo 2: campos conforme seleção */}
            {invPessoa === "pf" && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inv_cpf">CPF</label>
                  <input
                    id="inv_cpf"
                    placeholder="000.000.000-00"
                    value={invCpf}
                    onChange={(e) => { setInvCpf(formatCPF(e.target.value)); if (invCpfError) setInvCpfError(null) }}
                    onBlur={(e) => {
                      const d = onlyDigits(e.target.value)
                      if (d.length > 0 && !isValidCPF(d)) return setInvCpfError("CPF inválido")
                      setInvCpfError(null)
                    }}
                    className={`h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30 ${invCpfError ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {invCpfError && <p className="text-xs text-red-600 mt-1">{invCpfError}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inv_rg">RG</label>
                  <input id="inv_rg" placeholder="Número do RG" value={invRg} onChange={(e)=>setInvRg(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
                </div>
              </>
            )}

            {invPessoa === "pj" && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inv_cnpj">CNPJ</label>
                  <input
                    id="inv_cnpj"
                    placeholder="00.000.000/0000-00"
                    value={invCnpj}
                    onChange={(e) => { setInvCnpj(formatCNPJ(e.target.value)); if (invCnpjError) setInvCnpjError(null) }}
                    onBlur={(e) => {
                      const d = onlyDigits(e.target.value)
                      if (d.length > 0 && !isValidCNPJ(d)) return setInvCnpjError("CNPJ inválido")
                      setInvCnpjError(null)
                      if (d.length === 14) lookupCnpj(e.target.value, { setRazao: setInvRazao, setFantasia: setInvFantasia })
                    }}
                    className={`h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30 ${invCnpjError ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {invCnpjError && <p className="text-xs text-red-600 mt-1">{invCnpjError}</p>}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium" htmlFor="inv_razao">Razão social</label>
                  <input id="inv_razao" placeholder="Razão social" value={invRazao} onChange={(e)=>setInvRazao(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium" htmlFor="inv_fantasia">Nome fantasia</label>
                  <input id="inv_fantasia" placeholder="Nome fantasia" value={invFantasia} onChange={(e)=>setInvFantasia(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inv_rep_cpf">CPF do representante legal</label>
                  <input id="inv_rep_cpf" placeholder="000.000.000-00" value={invRepCpf} onChange={(e)=>setInvRepCpf(formatCPF(e.target.value))} onBlur={(e)=>{ const d = onlyDigits(e.target.value); if (d.length>0 && !isValidCPF(d)) alert("CPF do representante inválido") }} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inv_rep_rg">RG do representante legal</label>
                  <input id="inv_rep_rg" placeholder="Número do RG" value={invRepRg} onChange={(e)=>setInvRepRg(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
                </div>
              </>
            )}

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="email">E-mail</label>
              <input type="email" id="email" placeholder="seu@email.com" value={invEmail} onChange={(e)=>setInvEmail(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_tel">Telefone celular</label>
              <input id="inv_tel" value={invTelefone} onChange={(e)=>setInvTelefone(formatPhone(e.target.value))} placeholder="(11) 90000-0000" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_nasc">Data de nascimento</label>
              <input type="date" id="inv_nasc" value={invNascimento} onChange={(e)=>setInvNascimento(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_genero">Gênero</label>
              <select id="inv_genero" value={invGenero} onChange={(e)=>setInvGenero(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required>
                <option value="">Selecione</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
                <option value="prefiro-nao-dizer">Prefiro não dizer</option>
              </select>
            </div>

            {/* Endereço - CEP e auto-preenchimento */}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_cep">CEP</label>
              <input
                id="inv_cep"
                value={invCep}
                onChange={(e)=>setInvCep(formatCEP(e.target.value))}
                onBlur={(e)=>lookupCep(e.target.value,{ setEndereco:setInvEndereco, setBairro:setInvBairro, setCidade:setInvCidade, setUf:setInvUf })}
                placeholder="Somente números"
                className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_endereco">Logradouro</label>
              <input id="inv_endereco" value={invEndereco} onChange={(e)=>setInvEndereco(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_numero">Número</label>
              <input id="inv_numero" value={invNumero} onChange={(e)=>setInvNumero(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_complemento">Complemento</label>
              <input id="inv_complemento" value={invComplemento} onChange={(e)=>setInvComplemento(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_bairro">Bairro</label>
              <input id="inv_bairro" value={invBairro} onChange={(e)=>setInvBairro(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_cidade">Cidade</label>
              <input id="inv_cidade" value={invCidade} onChange={(e)=>setInvCidade(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_uf">UF</label>
              <input id="inv_uf" value={invUf} onChange={(e)=>setInvUf(e.target.value)} maxLength={2} className="h-11 w-full rounded-md border bg-background px-3 text-sm uppercase outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="senha">Senha</label>
              <div className="relative">
                <input type={showPwd1 ? "text" : "password"} id="senha" value={invPwd} onChange={(e)=>setInvPwd(e.target.value)} className="h-11 w-full rounded-md border bg-background pr-10 px-3 text-sm outline-none focus:border-foreground/30" required />
                <button type="button" aria-label={showPwd1 ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPwd1(v=>!v)} className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                  {showPwd1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-xs text-muted-foreground">Força da senha: {passwordStrength(invPwd)}/5</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="confirmar">Confirmar senha</label>
              <div className="relative">
                <input type={showPwd2 ? "text" : "password"} id="confirmar" value={invPwdConf} onChange={(e)=>setInvPwdConf(e.target.value)} className="h-11 w-full rounded-md border bg-background pr-10 px-3 text-sm outline-none focus:border-foreground/30" required />
                <button type="button" aria-label={showPwd2 ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPwd2(v=>!v)} className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                  {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* fim investidor */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="razao">Razão social</label>
              <input id="razao" placeholder="Razão social da empresa" value={empRazao} onChange={(e)=>setEmpRazao(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="cnpj">CNPJ</label>
              <input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={empCnpj}
                onChange={(e)=>{ const v=e.target.value; setEmpCnpj(formatCNPJ(v)); if (empCnpjError) setEmpCnpjError(null) }}
                onBlur={(e)=>{ const d=onlyDigits(e.target.value); if(d.length!==14 || !isValidCNPJ(d)){ setEmpCnpjError("CNPJ inválido"); return } setEmpCnpjError(null); lookupCnpj(e.target.value,{ setRazao:setEmpRazao, setFantasia:setEmpFantasia }) }}
                className={`h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30 ${empCnpjError ? 'border-red-500 focus:border-red-500' : ''}`}
                required />
              {empCnpjError && <p className="text-xs text-red-600 mt-1">{empCnpjError}</p>}
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="email2">E-mail</label>
              <input type="email" id="email2" placeholder="contato@empresa.com" value={empEmail} onChange={(e)=>setEmpEmail(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="fantasia2">Nome fantasia</label>
              <input id="fantasia2" placeholder="Nome fantasia da empresa" value={empFantasia} onChange={(e)=>setEmpFantasia(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="emp_cep">CEP</label>
               <input id="emp_cep" value={empCep} onChange={(e)=>setEmpCep(formatCEP(e.target.value))} onBlur={(e)=>lookupCep(e.target.value,{ setEndereco:setEmpEndereco, setBairro:setEmpBairro, setCidade:setEmpCidade, setUf:setEmpUf })} placeholder="Somente números" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="emp_endereco">Logradouro</label>
               <input id="emp_endereco" value={empEndereco} onChange={(e)=>setEmpEndereco(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="emp_numero">Número</label>
               <input id="emp_numero" value={empNumero} onChange={(e)=>setEmpNumero(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="emp_complemento">Complemento</label>
               <input id="emp_complemento" value={empComplemento} onChange={(e)=>setEmpComplemento(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="emp_bairro">Bairro</label>
               <input id="emp_bairro" value={empBairro} onChange={(e)=>setEmpBairro(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="emp_cidade">Cidade</label>
               <input id="emp_cidade" value={empCidade} onChange={(e)=>setEmpCidade(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="emp_uf">UF</label>
               <input id="emp_uf" value={empUf} onChange={(e)=>setEmpUf(e.target.value)} maxLength={2} className="h-11 w-full rounded-md border bg-background px-3 text-sm uppercase outline-none focus:border-foreground/30" />
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="senha2">Senha</label>
               <div className="relative">
                <input type={showPwd3 ? "text" : "password"} id="senha2" value={empPwd} onChange={(e)=>setEmpPwd(e.target.value)} className="h-11 w-full rounded-md border bg-background pr-10 px-3 text-sm outline-none focus:border-foreground/30" required />
                <button type="button" aria-label={showPwd3 ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPwd3(v=>!v)} className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                  {showPwd3 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
               </div>
             </div>
             <div className="space-y-1">
               <label className="text-sm font-medium" htmlFor="confirmar2">Confirmar senha</label>
               <div className="relative">
                <input type={showPwd4 ? "text" : "password"} id="confirmar2" value={empPwdConf} onChange={(e)=>setEmpPwdConf(e.target.value)} className="h-11 w-full rounded-md border bg-background pr-10 px-3 text-sm outline-none focus:border-foreground/30" required />
                <button type="button" aria-label={showPwd4 ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPwd4(v=>!v)} className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                  {showPwd4 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
               </div>
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