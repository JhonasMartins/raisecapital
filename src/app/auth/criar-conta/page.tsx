"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, UploadCloud } from "lucide-react"

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
    return d.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2")
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
  const [invDocumento, setInvDocumento] = useState("")
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
  // KYC uploads
  const [docIdentidade, setDocIdentidade] = useState<File | null>(null)
  const [docResidencia, setDocResidencia] = useState<File | null>(null)
  const [docSelfie, setDocSelfie] = useState<File | null>(null)
  // Financeiro (Investidor)
  const [rendaMensal, setRendaMensal] = useState("")
  const [patrimonio, setPatrimonio] = useState("")
  const [investidorQualificado, setInvestidorQualificado] = useState(false)
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("corrente")
  // Preferências e indicação
  const [codigoConvite, setCodigoConvite] = useState("")
  const [prefSetores, setPrefSetores] = useState<string[]>([])
  // Erros de documento
  const [invDocumentoError, setInvDocumentoError] = useState<string | null>(null)
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

  // Compliance
  const [aceiteTermos, setAceiteTermos] = useState(false)
  const [aceitePrivacidade, setAceitePrivacidade] = useState(false)
  const [aceiteRisco, setAceiteRisco] = useState(false)
  const [optinComunicacoes, setOptinComunicacoes] = useState(true)

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
      const data: any = await res.json()
      set.setEndereco(data.street || "")
      set.setBairro(data.neighborhood || "")
      set.setCidade(data.city || "")
      set.setUf(data.state || "")
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
      const data: any = await res.json()
      setters.setRazao(data.razao_social || "")
      setters.setFantasia(data.nome_fantasia || "")
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
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="documento">CPF/CNPJ</label>
              <input
                id="documento"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                value={invDocumento}
                onChange={(e) => { const v = e.target.value; setInvDocumento(isCnpj(v) ? formatCNPJ(v) : formatCPF(v)); if (invDocumentoError) setInvDocumentoError(null) }}
                onBlur={(e) => {
                  const d = onlyDigits(e.target.value)
                  if (d.length === 11) {
                    if (!isValidCPF(d)) return setInvDocumentoError("CPF inválido")
                    setInvDocumentoError(null)
                  } else if (d.length === 14) {
                    if (!isValidCNPJ(d)) return setInvDocumentoError("CNPJ inválido")
                    setInvDocumentoError(null)
                    lookupCnpj(e.target.value, { setRazao: setInvRazao, setFantasia: setInvFantasia })
                  } else if (d.length > 0) {
                    setInvDocumentoError("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos)")
                  }
                }}
                className={`h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30 ${invDocumentoError ? 'border-red-500 focus:border-red-500' : ''}`}
                required />
              {invDocumentoError && <p className="text-xs text-red-600 mt-1">{invDocumentoError}</p>}
            </div>
            {/* Exibe dados de empresa quando o investidor informa CNPJ */}
            {isCnpj(invDocumento) && (
              <>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium" htmlFor="inv_razao">Razão social</label>
                  <input id="inv_razao" placeholder="Razão social (quando CNPJ)" value={invRazao} onChange={(e)=>setInvRazao(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium" htmlFor="inv_fantasia">Nome fantasia</label>
                  <input id="inv_fantasia" placeholder="Nome fantasia (quando CNPJ)" value={invFantasia} onChange={(e)=>setInvFantasia(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                </div>
              </>
            )}

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="email">E-mail</label>
              <input type="email" id="email" placeholder="seu@email.com" value={invEmail} onChange={(e)=>setInvEmail(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_tel">Telefone celular</label>
              <input id="inv_tel" value={invTelefone} onChange={(e)=>setInvTelefone(formatPhone(e.target.value))} placeholder="(11) 90000-0000" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_nasc">Data de nascimento</label>
              <input type="date" id="inv_nasc" value={invNascimento} onChange={(e)=>setInvNascimento(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="inv_genero">Gênero (opcional)</label>
              <select id="inv_genero" value={invGenero} onChange={(e)=>setInvGenero(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30">
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="nao-binario">Não-binário</option>
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
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
              <input id="fantasia2" placeholder="Nome fantasia da empresa" value={empFantasia} onChange={(e)=>setEmpFantasia(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
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

        {/* Compliance e KYC */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">Conformidade e KYC</h2>
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={aceiteTermos} onChange={(e)=>setAceiteTermos(e.target.checked)} /> Aceito os Termos de Uso</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={aceitePrivacidade} onChange={(e)=>setAceitePrivacidade(e.target.checked)} /> Aceito a Política de Privacidade</label>
            {tab === "investidor" && (
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={aceiteRisco} onChange={(e)=>setAceiteRisco(e.target.checked)} /> Declaro estar ciente dos riscos de investimento</label>
            )}
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={optinComunicacoes} onChange={(e)=>setOptinComunicacoes(e.target.checked)} /> Quero receber novidades por e-mail</label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-sm font-medium" htmlFor="up_identidade">Documento de identidade (RG/CNH/RNE)</label>
              <label htmlFor="up_identidade" className="mt-1 flex cursor-pointer items-center gap-3 rounded-md border border-dashed bg-background/50 p-4 hover:bg-muted/60">
                <UploadCloud className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Selecionar arquivo</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG ou PNG, até 10MB</p>
                </div>
              </label>
              <input id="up_identidade" type="file" accept="image/*,application/pdf" onChange={(e)=>setDocIdentidade(e.target.files?.[0] ?? null)} className="sr-only" />
              {docIdentidade && <p className="mt-1 text-xs text-muted-foreground truncate">Selecionado: {docIdentidade.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="up_residencia">Comprovante de residência</label>
              <label htmlFor="up_residencia" className="mt-1 flex cursor-pointer items-center gap-3 rounded-md border border-dashed bg-background/50 p-4 hover:bg-muted/60">
                <UploadCloud className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Selecionar arquivo</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG ou PNG, até 10MB</p>
                </div>
              </label>
              <input id="up_residencia" type="file" accept="image/*,application/pdf" onChange={(e)=>setDocResidencia(e.target.files?.[0] ?? null)} className="sr-only" />
              {docResidencia && <p className="mt-1 text-xs text-muted-foreground truncate">Selecionado: {docResidencia.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="up_selfie">Selfie para validação facial</label>
              <label htmlFor="up_selfie" className="mt-1 flex cursor-pointer items-center gap-3 rounded-md border border-dashed bg-background/50 p-4 hover:bg-muted/60">
                <UploadCloud className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Tirar/Selecionar foto</p>
                  <p className="text-xs text-muted-foreground">JPG ou PNG, boa iluminação</p>
                </div>
              </label>
              <input id="up_selfie" type="file" accept="image/*" capture="user" onChange={(e)=>setDocSelfie(e.target.files?.[0] ?? null)} className="sr-only" />
              {docSelfie && <p className="mt-1 text-xs text-muted-foreground truncate">Selecionada: {docSelfie.name}</p>}
            </div>
          </div>

          {tab === "investidor" && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Dados financeiros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Renda mensal aproximada</label>
                  <input placeholder="Ex.: R$ 10.000" value={rendaMensal} onChange={(e)=>setRendaMensal(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Patrimônio declarado</label>
                  <input placeholder="Ex.: R$ 1.200.000" value={patrimonio} onChange={(e)=>setPatrimonio(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={investidorQualificado} onChange={(e)=>setInvestidorQualificado(e.target.checked)} /> Declaro ser investidor qualificado (R$ 1MM+)</label>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">Banco de preferência / Conta para resgates</label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input placeholder="Banco" value={banco} onChange={(e)=>setBanco(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                    <input placeholder="Agência" value={agencia} onChange={(e)=>setAgencia(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                    <input placeholder="Conta" value={conta} onChange={(e)=>setConta(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                    <select value={tipoConta} onChange={(e)=>setTipoConta(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30">
                      <option value="corrente">Corrente</option>
                      <option value="poupanca">Poupança</option>
                      <option value="pagamento">Pagamento</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">Preferências de investimento (opcional)</label>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {['Agro','Fintech','Health','Imobiliário','Tecnologia'].map((s)=>{
                      const active = prefSetores.includes(s)
                      return (
                        <button key={s} type="button" onClick={()=>setPrefSetores(active?prefSetores.filter(x=>x!==s):[...prefSetores,s])} className={`px-3 py-1 rounded-md border ${active?'bg-primary text-primary-foreground':'bg-background'}`}>{s}</button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">Código de convite (opcional)</label>
                  <input placeholder="Se você recebeu, informe aqui" value={codigoConvite} onChange={(e)=>setCodigoConvite(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                </div>
              </div>
            </div>
          )}

          {tab === "empresa" && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Informações adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">Setor de atuação</label>
                  <input placeholder="Ex.: Fintech" value={empSetor} onChange={(e)=>setEmpSetor(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">Descrição do projeto/captação</label>
                  <textarea placeholder="Explique brevemente seu negócio e a tese da captação" value={empDescricao} onChange={(e)=>setEmpDescricao(e.target.value)} rows={4} className="w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30 py-2" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Valor pretendido para captação</label>
                  <input placeholder="Ex.: R$ 500.000" value={empValorPretendido} onChange={(e)=>setEmpValorPretendido(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Site ou redes sociais (opcional)</label>
                  <input placeholder="https://exemplo.com" value={empSite} onChange={(e)=>setEmpSite(e.target.value)} className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/30" />
                </div>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">Criar conta</Button>

        <p className="text-center text-sm text-muted-foreground">
          Já possui conta? <Link href="/auth/login" className="hover:underline">Fazer login</Link>
        </p>
      </form>
    </div>
  )
}