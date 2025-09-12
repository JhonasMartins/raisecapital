"use client"

import { useState, useRef, FormEvent, ChangeEvent } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
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
    // Simulação de persistência
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold">Dados cadastrais</h1>
        <p className="text-sm text-muted-foreground">Mantenha seus dados sempre atualizados</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Perfil do usuário</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[220px,1fr]">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="size-28">
                  {avatarSrc ? (
                    <AvatarImage src={avatarSrc} alt="Foto do usuário" />
                  ) : (
                    <AvatarFallback>US</AvatarFallback>
                  )}
                </Avatar>
                <Button type="button" size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full shadow-sm" onClick={handlePickAvatar}>
                  <Pencil className="size-4" />
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <p className="text-xs text-muted-foreground text-center">Foto</p>
            </div>

            {/* Formulário */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input id="nome" name="nome" placeholder="Seu nome" defaultValue="Jhonas" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sobrenome">Sobrenome *</Label>
                <Input id="sobrenome" name="sobrenome" placeholder="Seu sobrenome" defaultValue="Leismann" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nascimento">Data de nascimento *</Label>
                <Input id="nascimento" name="nascimento" type="date" defaultValue="1993-11-10" required />
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
                <Select defaultValue="masculino">
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
                <Label htmlFor="cpf">CPF *</Label>
                <Input id="cpf" name="cpf" defaultValue="096.083.139-79" disabled aria-invalid={false} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rg">RG *</Label>
                <Input id="rg" name="rg" defaultValue="0048481879" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="orgao">Órgão Expeditor *</Label>
                <Input id="orgao" name="orgao" placeholder="Ex.: SSP" defaultValue="SSP" />
              </div>

              <div className="grid gap-2">
                <Label>Estado civil *</Label>
                <Select defaultValue="casado">
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

              <div className="grid gap-2 sm:col-span-2">
                <Label>Como você conheceu?</Label>
                <Select defaultValue="indicacao">
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

            <div className="lg:col-span-2 flex items-center justify-end gap-3 pt-2">
              {saved && (
                <span className="text-xs text-emerald-600">Alterações salvas com sucesso.</span>
              )}
              <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}