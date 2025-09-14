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
import { Pencil } from "lucide-react"

export default function PerfilPage() {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 gap-1 h-auto p-1">
                <TabsTrigger value="pessoais" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Pessoais</TabsTrigger>
                <TabsTrigger value="contato" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Contato</TabsTrigger>
                <TabsTrigger value="endereco" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Endereço</TabsTrigger>
                <TabsTrigger value="profissionais" className="text-xs sm:text-sm px-1 sm:px-3 py-2">Profissionais</TabsTrigger>
                <TabsTrigger value="bancarios" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Bancários</TabsTrigger>
                <TabsTrigger value="pix" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Pix</TabsTrigger>
              </TabsList>

              {/* Pessoais */}
              <TabsContent value="pessoais" className="mt-4 sm:mt-6">
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
                    <Select defaultValue="brasileiro">
                      <SelectTrigger className="w-full h-10 sm:h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brasileiro">Brasileiro Nato</SelectItem>
                        <SelectItem value="naturalizado">Brasileiro Naturalizado</SelectItem>
                        <SelectItem value="estrangeiro">Estrangeiro</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Label className="text-sm">Como você conheceu a Bloxs? *</Label>
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