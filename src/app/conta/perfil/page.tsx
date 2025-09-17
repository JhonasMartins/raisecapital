"use client"

import { useState, useRef, FormEvent, ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Shield, Key, Smartphone, Copy, Check } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"

export default function PerfilPage() {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tipoPessoa, setTipoPessoa] = useState<"pf" | "pj">("pf")
  
  // Estados para 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [totpCode, setTotpCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [qrCodeSecret, setQrCodeSecret] = useState("")
  const [copied, setCopied] = useState(false)
  
  // Estados para troca de senha
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordChanging, setPasswordChanging] = useState(false)

  function handlePickAvatar() {
    fileInputRef.current?.click()
  }

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarSrc(url)
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    // Simulação de persistência (substituir por chamada ao backend quando disponível)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // Funções para 2FA
  async function handleEnable2FA() {
    try {
      // Simulação da chamada para /two-factor/enable
      const response = await fetch('/api/two-factor/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      
      if (data.success) {
        setQrCodeSecret(data.secret)
        setShowQRCode(true)
      }
    } catch (error) {
      console.error('Erro ao habilitar 2FA:', error)
    }
  }

  async function handleVerify2FA() {
    try {
      // Simulação da chamada para /two-factor/verify-totp
      const response = await fetch('/api/two-factor/verify-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: totpCode })
      })
      const data = await response.json()
      
      if (data.success) {
        setTwoFactorEnabled(true)
        setShowQRCode(false)
        setBackupCodes(data.backupCodes || [])
        setShowBackupCodes(true)
        setTotpCode('')
      }
    } catch (error) {
      console.error('Erro ao verificar 2FA:', error)
    }
  }

  async function handleDisable2FA() {
    try {
      // Simulação da chamada para /two-factor/disable
      const response = await fetch('/api/two-factor/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      
      if (data.success) {
        setTwoFactorEnabled(false)
        setShowQRCode(false)
        setBackupCodes([])
        setShowBackupCodes(false)
      }
    } catch (error) {
      console.error('Erro ao desabilitar 2FA:', error)
    }
  }

  // Função para troca de senha
  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }
    
    setPasswordChanging(true)
    
    try {
      // Simulação da chamada para mudança de senha
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })
      const data = await response.json()
      
      if (data.success) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        alert('Senha alterada com sucesso!')
      } else {
        alert(data.message || 'Erro ao alterar senha')
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      alert('Erro ao alterar senha')
    } finally {
      setPasswordChanging(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold">Perfil do investidor</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus dados pessoais, documentos e preferências</p>
      </div>

      {/* Summary + Avatar */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-0 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Seu perfil</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Informações básicas e foto</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 p-4 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="relative mx-auto sm:mx-0">
                <Avatar className="size-16 sm:size-20">
                  {avatarSrc ? <AvatarImage src={avatarSrc} alt="Foto do usuário" /> : <AvatarFallback>US</AvatarFallback>}
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 rounded-full shadow-sm size-8 sm:size-10"
                  onClick={handlePickAvatar}
                  aria-label="Alterar foto"
                >
                  <Pencil className="size-3 sm:size-4" />
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-sm text-muted-foreground">Foto do perfil</div>
                <div className="text-xs text-muted-foreground">PNG ou JPG. Tamanho recomendado 240x240px.</div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <Button variant="outline" type="button" onClick={() => window.location.reload()} className="flex-1 sm:flex-none text-sm">Descartar</Button>
              <Button form="perfil-form" type="submit" disabled={saving} className="flex-1 sm:flex-none text-sm">{saving ? "Salvando..." : "Salvar"}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form principal com seções em abas */}
      <Card>
        <CardHeader className="pb-2 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Dados cadastrais</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Organizados por seções para facilitar a edição</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <form id="perfil-form" onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
            <Tabs defaultValue="pessoais" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-7 gap-1 h-auto p-1">
                <TabsTrigger value="pessoais" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Pessoais</TabsTrigger>
                <TabsTrigger value="contato" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Contato</TabsTrigger>
                <TabsTrigger value="endereco" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Endereço</TabsTrigger>
                <TabsTrigger value="profissionais" className="text-xs sm:text-sm px-1 sm:px-3 py-2">Profissionais</TabsTrigger>
                <TabsTrigger value="bancarios" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Bancários</TabsTrigger>
                <TabsTrigger value="pix" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Pix</TabsTrigger>
                <TabsTrigger value="seguranca" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Segurança</TabsTrigger>
              </TabsList>

              {/* Pessoais */}
              <TabsContent value="pessoais" className="mt-4 sm:mt-6">
                <div className="grid gap-3 sm:gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm">Tipo de cadastro</Label>
                    <ToggleGroup
                      type="single"
                      value={tipoPessoa}
                      onValueChange={(v) => v && setTipoPessoa(v as "pf" | "pj")}
                      className="w-full sm:w-auto"
                      variant="outline"
                    >
                      <ToggleGroupItem value="pf" className="px-3 py-2 text-sm">Pessoa Física</ToggleGroupItem>
                      <ToggleGroupItem value="pj" className="px-3 py-2 text-sm">Pessoa Jurídica</ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {tipoPessoa === "pf" ? (
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="nome" className="text-sm">Nome *</Label>
                        <Input id="nome" name="nome" placeholder="Seu nome" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sobrenome" className="text-sm">Sobrenome *</Label>
                        <Input id="sobrenome" name="sobrenome" placeholder="Seu sobrenome" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nascimento" className="text-sm">Data de nascimento *</Label>
                        <Input id="nascimento" name="nascimento" type="date" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm">Nacionalidade *</Label>
                        <Input id="nacionalidade" value="Brasileira" disabled className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm">Gênero *</Label>
                        <Select>
                          <SelectTrigger className="w-full h-10 sm:h-11">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                            <SelectItem value="prefiro_nao_dizer">Prefiro não dizer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm">Estado civil *</Label>
                        <Select>
                          <SelectTrigger className="w-full h-10 sm:h-11">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                            <SelectItem value="casado">Casado(a)</SelectItem>
                            <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                            <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                            <SelectItem value="uniao">União estável</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cpf" className="text-sm">CPF *</Label>
                        <Input id="cpf" name="cpf" placeholder="000.000.000-00" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="rg" className="text-sm">RG *</Label>
                        <Input id="rg" name="rg" placeholder="Seu RG" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="orgao" className="text-sm">Órgão Exp *</Label>
                        <Input id="orgao" name="orgao" placeholder="Ex.: SSP" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="orgao_uf" className="text-sm">UF *</Label>
                        <Select>
                          <SelectTrigger className="w-full h-10 sm:h-11">
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                              <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2 sm:col-span-2">
                        <Label className="text-sm">Como você conheceu a Raise Capital? *</Label>
                        <Select>
                          <SelectTrigger className="w-full h-10 sm:h-11">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indicacao">Indicação</SelectItem>
                            <SelectItem value="redes">Redes sociais</SelectItem>
                            <SelectItem value="pesquisa">Pesquisa no Google</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2 pt-2">
                        <Checkbox id="ppe" />
                        <Label htmlFor="ppe" className="!m-0 text-sm">Sou uma pessoa politicamente exposta</Label>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="razao" className="text-sm">Razão Social *</Label>
                        <Input id="razao" name="razao" placeholder="Nome da empresa (Razão Social)" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="fantasia" className="text-sm">Nome Fantasia</Label>
                        <Input id="fantasia" name="fantasia" placeholder="Como a empresa é conhecida" className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cnpj" className="text-sm">CNPJ *</Label>
                        <Input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="abertura" className="text-sm">Data de abertura *</Label>
                        <Input id="abertura" name="abertura" type="date" required className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="inscricao_est" className="text-sm">Inscrição Estadual</Label>
                        <Input id="inscricao_est" name="inscricao_est" placeholder="Opcional" className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="inscricao_mun" className="text-sm">Inscrição Municipal</Label>
                        <Input id="inscricao_mun" name="inscricao_mun" placeholder="Opcional" className="h-10 sm:h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm">Natureza jurídica *</Label>
                        <Select>
                          <SelectTrigger className="w-full h-10 sm:h-11">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ltda">LTDA</SelectItem>
                            <SelectItem value="sa">S.A.</SelectItem>
                            <SelectItem value="mei">MEI</SelectItem>
                            <SelectItem value="eireli">EIRELI</SelectItem>
                            <SelectItem value="ong">Associação / ONG</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cnae" className="text-sm">CNAE principal</Label>
                        <Input id="cnae" name="cnae" placeholder="00.00-0/00" className="h-10 sm:h-11" />
                      </div>

                      <div className="sm:col-span-2 pt-1">
                        <Separator className="my-2" />
                        <div className="text-sm font-medium mb-2">Representante legal</div>
                        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="rep_nome" className="text-sm">Nome *</Label>
                            <Input id="rep_nome" name="rep_nome" placeholder="Nome completo" required className="h-10 sm:h-11" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="rep_cpf" className="text-sm">CPF *</Label>
                            <Input id="rep_cpf" name="rep_cpf" placeholder="000.000.000-00" required className="h-10 sm:h-11" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="rep_cargo" className="text-sm">Cargo *</Label>
                            <Input id="rep_cargo" name="rep_cargo" placeholder="Ex.: Sócio-administrador" required className="h-10 sm:h-11" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              {/* Contato */}
              <TabsContent value="contato" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="telefone" className="text-sm">Telefone *</Label>
                    <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" required className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm">E-mail *</Label>
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="h-10 sm:h-11" />
                  </div>
                </div>
              </TabsContent>

              {/* Endereço */}
              <TabsContent value="endereco" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="cep" className="text-sm">CEP *</Label>
                    <Input id="cep" name="cep" placeholder="00000-000" required className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="logradouro" className="text-sm">Logradouro *</Label>
                    <Input id="logradouro" name="logradouro" placeholder="Rua, Avenida..." required className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numero" className="text-sm">Número *</Label>
                    <Input id="numero" name="numero" placeholder="123" required className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="complemento" className="text-sm">Complemento</Label>
                    <Input id="complemento" name="complemento" placeholder="Apto, Bloco..." className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bairro" className="text-sm">Bairro *</Label>
                    <Input id="bairro" name="bairro" placeholder="Seu bairro" required className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cidade" className="text-sm">Cidade *</Label>
                    <Input id="cidade" name="cidade" placeholder="Sua cidade" required className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm">Estado *</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10 sm:h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pais" className="text-sm">País *</Label>
                    <Input id="pais" name="pais" placeholder="Brasil" defaultValue="Brasil" required className="h-10 sm:h-11" />
                  </div>
                </div>
              </TabsContent>

              {/* Profissionais */}
              <TabsContent value="profissionais" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label className="text-sm">Profissão *</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10 sm:h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empresario">Empresário</SelectItem>
                        <SelectItem value="autonomo">Autônomo</SelectItem>
                        <SelectItem value="funcionario">Funcionário CLT</SelectItem>
                        <SelectItem value="aposentado">Aposentado</SelectItem>
                        <SelectItem value="estudante">Estudante</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="empresa" className="text-sm">Empresa</Label>
                    <Input id="empresa" name="empresa" placeholder="Nome da empresa" className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm">Renda mensal *</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10 sm:h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ate_2">Até R$ 2.000</SelectItem>
                        <SelectItem value="2_5">R$ 2.001 - R$ 5.000</SelectItem>
                        <SelectItem value="5_10">R$ 5.001 - R$ 10.000</SelectItem>
                        <SelectItem value="10_20">R$ 10.001 - R$ 20.000</SelectItem>
                        <SelectItem value="acima_20">Acima de R$ 20.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm">Patrimônio *</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10 sm:h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ate_50">Até R$ 50.000</SelectItem>
                        <SelectItem value="50_100">R$ 50.001 - R$ 100.000</SelectItem>
                        <SelectItem value="100_500">R$ 100.001 - R$ 500.000</SelectItem>
                        <SelectItem value="500_1000">R$ 500.001 - R$ 1.000.000</SelectItem>
                        <SelectItem value="acima_1000">Acima de R$ 1.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Bancários */}
              <TabsContent value="bancarios" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label className="text-sm">Banco *</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10 sm:h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="001">Banco do Brasil</SelectItem>
                        <SelectItem value="237">Bradesco</SelectItem>
                        <SelectItem value="104">Caixa Econômica</SelectItem>
                        <SelectItem value="341">Itaú</SelectItem>
                        <SelectItem value="033">Santander</SelectItem>
                        <SelectItem value="260">Nu Pagamentos</SelectItem>
                        <SelectItem value="077">Inter</SelectItem>
                        <SelectItem value="212">Original</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="agencia" className="text-sm">Agência *</Label>
                    <Input id="agencia" name="agencia" placeholder="0000" required className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="conta" className="text-sm">Conta *</Label>
                    <Input id="conta" name="conta" placeholder="00000-0" required className="h-10 sm:h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm">Tipo de conta *</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10 sm:h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Conta Corrente</SelectItem>
                        <SelectItem value="poupanca">Conta Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Pix */}
              <TabsContent value="pix" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm">Tipo de chave PIX *</Label>
                    <Select>
                      <SelectTrigger className="w-full h-10 sm:h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="aleatoria">Chave aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="chave_pix" className="text-sm">Chave PIX *</Label>
                    <Input id="chave_pix" name="chave_pix" placeholder="Sua chave PIX" required className="h-10 sm:h-11" />
                  </div>
                </div>
              </TabsContent>

              {/* Segurança */}
              <TabsContent value="seguranca" className="mt-4 sm:mt-6">
                <div className="space-y-6">
                  {/* Seção 2FA */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="size-5 text-primary" />
                      <h3 className="text-base font-medium">Autenticação de dois fatores (2FA)</h3>
                      {twoFactorEnabled && <Badge variant="secondary" className="text-xs">Ativo</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta usando um aplicativo autenticador.
                    </p>

                    {!twoFactorEnabled ? (
                      <div className="space-y-4">
                        {!showQRCode ? (
                          <Button onClick={handleEnable2FA} className="w-full sm:w-auto">
                            <Smartphone className="size-4 mr-2" />
                            Habilitar 2FA
                          </Button>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg bg-muted/50">
                              <h4 className="font-medium mb-2">Configure seu aplicativo autenticador</h4>
                              <p className="text-sm text-muted-foreground mb-4">
                                Escaneie o QR Code abaixo com seu aplicativo autenticador (Google Authenticator, Authy, etc.)
                              </p>
                              
                              {/* Simulação do QR Code */}
                              <div className="w-48 h-48 bg-white border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <div className="text-center text-muted-foreground">
                                  <Smartphone className="size-8 mx-auto mb-2" />
                                  <p className="text-xs">QR Code</p>
                                  <p className="text-xs">para 2FA</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Ou digite manualmente:</Label>
                                <div className="flex items-center gap-2">
                                  <Input 
                                    value={qrCodeSecret || "JBSWY3DPEHPK3PXP"} 
                                    readOnly 
                                    className="font-mono text-xs" 
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => copyToClipboard(qrCodeSecret || "JBSWY3DPEHPK3PXP")}
                                  >
                                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="totp-code" className="text-sm">Código de verificação</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="totp-code"
                                  value={totpCode}
                                  onChange={(e) => setTotpCode(e.target.value)}
                                  placeholder="000000"
                                  maxLength={6}
                                  className="font-mono"
                                />
                                <Button onClick={handleVerify2FA} disabled={totpCode.length !== 6}>
                                  Verificar
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <Shield className="size-4" />
                            <span className="text-sm font-medium">2FA está ativo</span>
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                            Sua conta está protegida com autenticação de dois fatores.
                          </p>
                        </div>
                        
                        {showBackupCodes && backupCodes.length > 0 && (
                          <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
                            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Códigos de backup</h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                              Guarde estes códigos em local seguro. Você pode usá-los para acessar sua conta se perder o dispositivo.
                            </p>
                            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                              {backupCodes.map((code, index) => (
                                <div key={index} className="p-2 bg-white dark:bg-gray-800 rounded border">
                                  {code}
                                </div>
                              ))}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-3"
                              onClick={() => setShowBackupCodes(false)}
                            >
                              Já salvei os códigos
                            </Button>
                          </div>
                        )}
                        
                        <Button 
                          variant="destructive" 
                          onClick={handleDisable2FA}
                          className="w-full sm:w-auto"
                        >
                          Desabilitar 2FA
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Seção Troca de Senha */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Key className="size-5 text-primary" />
                      <h3 className="text-base font-medium">Alterar senha</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mantenha sua conta segura alterando sua senha regularmente.
                    </p>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current-password" className="text-sm">Senha atual *</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Digite sua senha atual"
                          required
                          className="h-10 sm:h-11"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="new-password" className="text-sm">Nova senha *</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Digite sua nova senha"
                          required
                          className="h-10 sm:h-11"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password" className="text-sm">Confirmar nova senha *</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirme sua nova senha"
                          required
                          className="h-10 sm:h-11"
                        />
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Dicas para uma senha segura:</strong><br />
                          • Use pelo menos 8 caracteres<br />
                          • Combine letras maiúsculas e minúsculas<br />
                          • Inclua números e símbolos<br />
                          • Evite informações pessoais
                        </p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={passwordChanging || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full sm:w-auto"
                      >
                        {passwordChanging ? "Alterando..." : "Alterar senha"}
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Ações do formulário (fallback para quem não vê a barra fixa) */}
            <div className="flex items-center justify-end gap-2 pt-2">
              {saved && <span className="text-xs text-emerald-600">Alterações salvas com sucesso.</span>}
              <Button variant="outline" type="button" onClick={() => window.location.reload()}>Descartar</Button>
              <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Barra de ações fixa (UX para páginas longas) */}
      {/* Barra de ações fixa */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 sm:p-4 lg:relative lg:border-t-0 lg:bg-transparent lg:p-0 lg:mt-6">
        <div className="flex gap-2 sm:gap-3 lg:justify-end">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 lg:flex-none lg:w-auto px-4 sm:px-6 h-10 sm:h-11"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="perfil-form"
            className="flex-1 lg:flex-none lg:w-auto px-4 sm:px-6 h-10 sm:h-11"
          >
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  )
}