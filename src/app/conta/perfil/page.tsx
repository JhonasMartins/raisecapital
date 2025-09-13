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
    <div className="container py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold">Perfil do investidor</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus dados pessoais, documentos e preferências</p>
      </div>

      {/* Summary + Avatar */}
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Seu perfil</CardTitle>
          <CardDescription>Informações básicas e foto</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-20">
                  {avatarSrc ? <AvatarImage src={avatarSrc} alt="Foto do usuário" /> : <AvatarFallback>US</AvatarFallback>}
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full shadow-sm"
                  onClick={handlePickAvatar}
                  aria-label="Alterar foto"
                >
                  <Pencil className="size-4" />
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Foto do perfil</div>
                <div className="text-xs text-muted-foreground">PNG ou JPG. Tamanho recomendado 240x240px.</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" type="button" onClick={() => window.location.reload()}>Descartar</Button>
              <Button form="perfil-form" type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form principal com seções em abas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Dados cadastrais</CardTitle>
          <CardDescription>Organizados por seções para facilitar a edição</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <form id="perfil-form" onSubmit={onSubmit} className="space-y-6">
            <Tabs defaultValue="pessoais" className="w-full">
              <TabsList>
                <TabsTrigger value="pessoais">Pessoais</TabsTrigger>
                <TabsTrigger value="contato">Contato</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="profissionais">Profissionais</TabsTrigger>
                <TabsTrigger value="bancarios">Bancários</TabsTrigger>
                <TabsTrigger value="pix">Pix</TabsTrigger>
              </TabsList>

              {/* Pessoais */}
              <TabsContent value="pessoais" className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input id="nome" name="nome" placeholder="Seu nome" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sobrenome">Sobrenome *</Label>
                    <Input id="sobrenome" name="sobrenome" placeholder="Seu sobrenome" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nascimento">Data de nascimento *</Label>
                    <Input id="nascimento" name="nascimento" type="date" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Nacionalidade *</Label>
                    <Select defaultValue="brasileiro">
                      <SelectTrigger className="w-full">
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
                    <Label>Gênero *</Label>
                    <Select>
                      <SelectTrigger className="w-full">
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
                    <Label>Estado civil *</Label>
                    <Select>
                      <SelectTrigger className="w-full">
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
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" name="cpf" placeholder="000.000.000-00" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rg">RG *</Label>
                    <Input id="rg" name="rg" placeholder="Seu RG" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orgao">Órgão Exp *</Label>
                    <Input id="orgao" name="orgao" placeholder="Ex.: SSP" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orgao_uf">UF *</Label>
                    <Select>
                      <SelectTrigger className="w-full">
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
                    <Label>Como você conheceu a Bloxs? *</Label>
                    <Select>
                      <SelectTrigger className="w-full">
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
                    <Label htmlFor="ppe" className="!m-0">Sou uma pessoa politicamente exposta</Label>
                  </div>
                </div>
              </TabsContent>

              {/* Contato */}
              <TabsContent value="contato" className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                  </div>
                </div>
              </TabsContent>

              {/* Endereço */}
              <TabsContent value="endereco" className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="pais">País *</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brasil">Brasil</SelectItem>
                        <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                        <SelectItem value="Portugal">Portugal</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input id="cep" name="cep" placeholder="00000-000" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endereco">Endereço *</Label>
                    <Input id="endereco" name="endereco" placeholder="Rua Exemplo" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numero">Número *</Label>
                    <Input id="numero" name="numero" placeholder="123" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input id="complemento" name="complemento" placeholder="Apto, bloco, etc." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input id="bairro" name="bairro" placeholder="Centro" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input id="cidade" name="cidade" placeholder="Sua cidade" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estado_prov">Estado/Província *</Label>
                    <Input id="estado_prov" name="estado_prov" placeholder="Ex.: SC ou California" required />
                  </div>
                </div>
              </TabsContent>

              {/* Profissionais */}
              <TabsContent value="profissionais" className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input id="empresa" name="empresa" placeholder="Onde você trabalha" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profissao">Profissão</Label>
                    <Input id="profissao" name="profissao" placeholder="Sua profissão" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input id="cargo" name="cargo" placeholder="Seu cargo" />
                  </div>
                </div>
              </TabsContent>

              {/* Bancários */}
              <TabsContent value="bancarios" className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="grid gap-2 sm:col-span-1">
                    <Label htmlFor="banco">Banco *</Label>
                    <Input id="banco" name="banco" placeholder="Nome do banco" required />
                  </div>
                  <div className="grid gap-2 sm:col-span-1">
                    <Label htmlFor="agencia">Agência *</Label>
                    <Input id="agencia" name="agencia" placeholder="0000" required />
                  </div>
                  <div className="grid gap-2 sm:col-span-1">
                    <Label htmlFor="conta">Conta (sem dígito) *</Label>
                    <Input id="conta" name="conta" placeholder="000000" required />
                  </div>
                  <div className="grid gap-2 sm:col-span-1">
                    <Label htmlFor="digito">Dígito conta *</Label>
                    <Input id="digito" name="digito" placeholder="0" required />
                  </div>
                </div>
              </TabsContent>

              {/* Pix */}
              <TabsContent value="pix" className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="pix_tipo">Tipo *</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF/CNPJ</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="aleatoria">Chave aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pix_chave">Chave *</Label>
                    <Input id="pix_chave" name="pix_chave" placeholder="Informe sua chave" required />
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
      <div className="fixed bottom-4 left-4 right-4 z-40 md:left-8 md:right-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-sm px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between">
            <div className="text-xs text-muted-foreground hidden sm:block">
              {saved ? "Tudo salvo." : saving ? "Salvando alterações..." : "Você tem alterações não salvas"}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => window.location.reload()}>Descartar</Button>
              <Button size="sm" form="perfil-form" type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}