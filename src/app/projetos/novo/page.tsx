'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const categories = ['Fintech', 'Agronegócio', 'Ativos Judiciais', 'Comercial', 'Energia', 'Imobiliário', 'Startups', 'HealthTech'] as const
const modalities = ['Equity', 'Dívida', 'Revenue Share'] as const
const statuses = ['Em captação', 'Encerrada', 'Em breve'] as const

// Tipos auxiliares
type Entrepreneur = { name: string; role?: string }
type KeyVal = { label: string; value: string }
type DocumentLink = { label: string; url: string }
// investors removidos — serão calculados dinamicamente na página de oferta

// Rich text editor reutilizável (TipTap)
function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none dark:prose-invert min-h-[180px] rounded-md border bg-background px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className="grid gap-2">
      <div className="mb-1 flex flex-wrap items-center gap-1">
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`border rounded px-2 py-1 text-xs ${editor.isActive('paragraph') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>P</button>
        <button type="button" onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()} className={`border rounded px-2 py-1 text-xs ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()} className={`border rounded px-2 py-1 text-xs ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>H3</button>
        <span className="mx-1 h-4 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`border rounded px-2 py-1 text-xs ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`border rounded px-2 py-1 text-xs ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`border rounded px-2 py-1 text-xs ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>S</button>
        <span className="mx-1 h-4 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`border rounded px-2 py-1 text-xs ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>• Lista</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`border rounded px-2 py-1 text-xs ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>1. Lista</button>
        <span className="mx-1 h-4 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="border rounded px-2 py-1 text-xs">↶ Undo</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="border rounded px-2 py-1 text-xs">↷ Redo</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

// Modelo completo para criação
type NewOffer = {
  name: string
  subtitle?: string
  category: (typeof categories)[number]
  modality: (typeof modalities)[number]
  product?: string
  min: number
  goal: number
  raised: number
  deadline: string // prazo_texto (ex.: "30 dias")
  deadlineDate?: string // data_limite (YYYY-MM-DD)
  cover: string
  status: (typeof statuses)[number]
  payment?: string
  tir?: number
  summaryPdf?: string
  aboutOperation?: string
  aboutCompany?: string
  entrepreneurs: Entrepreneur[]
  financials: KeyVal[]
  documents: DocumentLink[]
  essentialInfo: KeyVal[]
}

 export default function NovoProjetoPage() {
  const [form, setForm] = useState<NewOffer>({
     name: '',
     subtitle: '',
     category: 'Fintech',
     // removed: categoryType: '',
     modality: 'Equity',
     product: '',
     min: 1000,
     goal: 100000,
     raised: 0,
     deadline: '30 dias',
     deadlineDate: '',
     cover: '',
     status: 'Em captação',
     payment: '',
     tir: undefined,
     summaryPdf: '',
     aboutOperation: '',
     aboutCompany: '',
     entrepreneurs: [{ name: '', role: '' }],
     financials: [{ label: '', value: '' }],
     documents: [{ label: '', url: '' }],
     essentialInfo: [{ label: '', value: '' }],
   })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tirNA, setTirNA] = useState<boolean>(form.tir == null)
  const router = useRouter()

  async function handleUpload(file: File) {
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Falha no upload')
      const data = (await res.json()) as { url: string }
      setForm((f: NewOffer) => ({ ...f, cover: data.url }))
      setMessage('Imagem enviada com sucesso!')
    } catch (e) {
      console.error(e)
      setError('Não foi possível enviar a imagem. Tente novamente.')
    }
  }

  function handleChange<K extends keyof NewOffer>(key: K, value: NewOffer[K]) {
    setForm((f: NewOffer) => ({ ...f, [key]: value }))
  }

  type ArrayItemMap = {
    entrepreneurs: Entrepreneur
    financials: KeyVal
    documents: DocumentLink
    essentialInfo: KeyVal
  }
  type ArrayKeys = keyof ArrayItemMap

  function updateArrayItem<K extends ArrayKeys, F extends keyof ArrayItemMap[K]>(key: K, index: number, field: F, value: ArrayItemMap[K][F]) {
    setForm((f) => {
      const current = f[key] as unknown as ArrayItemMap[K][]
      const arr = [...current]
      const item = { ...(arr[index] as ArrayItemMap[K]), [field]: value } as ArrayItemMap[K]
      arr[index] = item
      return { ...f, [key]: arr } as typeof f
    })
  }

  function addArrayItem<K extends ArrayKeys>(key: K, emptyItem: ArrayItemMap[K]) {
    setForm((f) => {
      const current = f[key] as unknown as ArrayItemMap[K][]
      return { ...f, [key]: [...current, emptyItem] } as typeof f
    })
  }

  function removeArrayItem<K extends ArrayKeys>(key: K, index: number) {
    setForm((f) => {
      const current = f[key] as unknown as ArrayItemMap[K][]
      const arr = [...current]
      arr.splice(index, 1)
      return { ...f, [key]: arr } as typeof f
    })
  }

  // Uploads auxiliares
  async function handleUploadSummary(file: File) {
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Falha no upload do resumo')
      const data = (await res.json()) as { url: string }
      setForm((f: NewOffer) => ({ ...f, summaryPdf: data.url }))
      setMessage('Resumo enviado com sucesso!')
    } catch (e) {
      console.error(e)
      setError('Não foi possível enviar o resumo. Tente novamente.')
    }
  }

  async function handleUploadDocument(index: number, file: File) {
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Falha no upload do documento')
      const data = (await res.json()) as { url: string }
      updateArrayItem('documents', index, 'url', data.url)
      setMessage('Documento enviado com sucesso!')
    } catch (e) {
      console.error(e)
      setError('Não foi possível enviar o documento. Tente novamente.')
    }
  }

  async function handleUploadCover(file: File) {
    // alias para compatibilidade com handleUpload antigo
    await handleUpload(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      if (!form.name.trim()) throw new Error('Informe o nome do projeto')
      if (!form.cover) throw new Error('Envie uma imagem de capa')

      const payload = {
        name: form.name,
        category: form.category,
        // removed: categoryType: form.categoryType || undefined,
        modality: form.modality,
        min: form.min,
        goal: form.goal,
        raised: form.raised,
        deadline: form.deadline || undefined,
        deadlineDate: form.deadlineDate || undefined,
        cover: form.cover,
        status: form.status,
        // extras
        subtitle: form.subtitle || undefined,
        product: form.product || undefined,
        payment: form.payment || undefined,
        tir: form.tir ?? undefined,
        summaryPdf: form.summaryPdf || undefined,
        aboutOperation: form.aboutOperation || undefined,
        aboutCompany: form.aboutCompany || undefined,
        entrepreneurs: form.entrepreneurs?.filter((e) => e.name || e.role) || [],
        financials: form.financials?.filter((kv) => kv.label || kv.value) || [],
        documents: form.documents?.filter((d) => d.label || d.url) || [],
        essentialInfo: form.essentialInfo?.filter((kv) => kv.label || kv.value) || [],
      }

      const res = await fetch('/api/ofertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        let serverErr = 'Falha ao salvar no banco'
        try {
          const data = await res.json()
          if (data?.error) serverErr = data.error
        } catch {}
        throw new Error(serverErr)
      }
      const data = (await res.json()) as { ok: boolean; id: number; slug: string }
      setMessage('Projeto salvo com sucesso no banco! Redirecionando…')
      setTimeout(() => router.push(`/ofertas/${data.slug}`), 400)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const slug = slugify(form.name || 'novo-projeto')

  return (
    <div className="min-h-dvh font-sans pt-28">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <nav className="text-xs text-muted-foreground">
            <Link href="/ofertas" className="hover:underline">Ofertas</Link>
            <span className="mx-2">/</span>
            <span>Novo projeto</span>
          </nav>
          <h1 className="mt-2 text-2xl font-semibold">Adicionar projeto</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Os dados serão salvos no banco de dados.
          </p>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <Card className="border bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Informações do projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-6">
                {/* Básico */}
                <div className="grid gap-1">
                  <Label htmlFor="name">Nome</Label>
                  <input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm" placeholder="Ex.: Fintech XYZ" />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <input id="subtitle" value={form.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm" placeholder="Breve descrição" />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="grid gap-1">
                    <Label htmlFor="category">Categoria</Label>
                    <select id="category" value={form.category}
                      onChange={(e) => handleChange('category', e.target.value as NewOffer['category'])}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm">
                      {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                  {/* removed Tipo de categoria field */}
                  <div className="grid gap-1">
                    <Label htmlFor="modality">Modalidade</Label>
                    <select id="modality" value={form.modality}
                      onChange={(e) => handleChange('modality', e.target.value as NewOffer['modality'])}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm">
                      {modalities.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" value={form.status}
                      onChange={(e) => handleChange('status', e.target.value as NewOffer['status'])}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm">
                      {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="grid gap-1">
                    <Label htmlFor="product">Produto</Label>
                    <input id="product" value={form.product}
                      onChange={(e) => handleChange('product', e.target.value)}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm" placeholder="Ex.: Ações" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="payment">Pagamento</Label>
                    <input id="payment" value={form.payment}
                      onChange={(e) => handleChange('payment', e.target.value)}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm" placeholder="Ex.: Lucros/Exit" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="tir">TIR (% a.a.)</Label>
                    <input id="tir" type="number" min={0} step="0.01"
                      value={form.tir ?? ''}
                      onChange={(e) => {
                        const v = e.target.value
                        if (v === '') {
                          handleChange('tir', undefined)
                        } else {
                          handleChange('tir', Number(v))
                        }
                        if (tirNA) setTirNA(false)
                      }}
                      disabled={tirNA}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm" placeholder="Ex.: 18" />
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={tirNA}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setTirNA(checked)
                          if (checked) {
                            handleChange('tir', undefined)
                          }
                        }}
                      />
                      Não aplicável
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="grid gap-1">
                    <Label htmlFor="min">Investimento mínimo (R$)</Label>
                    <input id="min" type="number" min={0} value={form.min}
                      onChange={(e) => handleChange('min', Number(e.target.value))}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="goal">Meta (R$)</Label>
                    <input id="goal" type="number" min={0} value={form.goal}
                      onChange={(e) => handleChange('goal', Number(e.target.value))}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="raised">Arrecadado (R$)</Label>
                    <input id="raised" type="number" min={0} value={form.raised}
                      onChange={(e) => handleChange('raised', Number(e.target.value))}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <Label htmlFor="deadline">Prazo (texto)</Label>
                    <input id="deadline" value={form.deadline}
                      onChange={(e) => handleChange('deadline', e.target.value)}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm" placeholder="Ex.: 30 dias" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="deadlineDate">Data limite</Label>
                    <input id="deadlineDate" type="date" value={form.deadlineDate || ''}
                      onChange={(e) => handleChange('deadlineDate', e.target.value)}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Imagem de capa</Label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void handleUpload(file)
                  }} />
                  {form.cover && (
                    <div className="relative mt-2 h-32 w-56 overflow-hidden rounded-md border">
                      <Image src={form.cover} alt="Pré-visualização" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="summaryPdf">Resumo (PDF)</Label>
                  <input
                    id="summaryPdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void handleUploadSummary(file)
                    }}
                  />
                  {form.summaryPdf && (
                    <div className="mt-1">
                      <a href={form.summaryPdf} target="_blank" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                        Ver arquivo enviado
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="aboutOperation">Sobre a operação</Label>
                  <RichTextEditor value={form.aboutOperation || ''} onChange={(html) => handleChange('aboutOperation', html)} />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="aboutCompany">Sobre a empresa</Label>
                  <RichTextEditor value={form.aboutCompany || ''} onChange={(html) => handleChange('aboutCompany', html)} />
                </div>

                {/* Listas dinâmicas */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label>Empreendedores</Label>
                    <Button type="button" variant="outline" onClick={() => addArrayItem('entrepreneurs', { name: '', role: '' })}>Adicionar</Button>
                  </div>
                  {form.entrepreneurs.map((p, idx) => (
                    <div key={idx} className="grid sm:grid-cols-2 gap-2">
                      <input placeholder="Nome" value={p.name}
                        onChange={(e) => updateArrayItem('entrepreneurs', idx, 'name', e.target.value)}
                        className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                      <div className="flex gap-2">
                        <input placeholder="Cargo" value={p.role || ''}
                          onChange={(e) => updateArrayItem('entrepreneurs', idx, 'role', e.target.value)}
                          className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                        <Button type="button" variant="ghost" onClick={() => removeArrayItem('entrepreneurs', idx)}>Remover</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label>Financeiros (label/valor)</Label>
                    <Button type="button" variant="outline" onClick={() => addArrayItem('financials', { label: '', value: '' })}>Adicionar</Button>
                  </div>
                  {form.financials.map((kv, idx) => (
                    <div key={idx} className="grid sm:grid-cols-2 gap-2">
                      <input placeholder="Label" value={kv.label}
                        onChange={(e) => updateArrayItem('financials', idx, 'label', e.target.value)}
                        className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                      <div className="flex gap-2">
                        <input placeholder="Valor" value={kv.value}
                          onChange={(e) => updateArrayItem('financials', idx, 'value', e.target.value)}
                          className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                        <Button type="button" variant="ghost" onClick={() => removeArrayItem('financials', idx)}>Remover</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label>Documentos (rótulo/URL)</Label>
                    <Button type="button" variant="outline" onClick={() => addArrayItem('documents', { label: '', url: '' })}>Adicionar</Button>
                  </div>
                  {form.documents.map((doc, idx) => (
                    <div key={idx} className="grid sm:grid-cols-[1fr_auto] gap-2">
                      <input placeholder="Rótulo" value={doc.label}
                        onChange={(e) => updateArrayItem('documents', idx, 'label', e.target.value)}
                        className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) void handleUploadDocument(idx, file)
                          }}
                        />
                        <Button type="button" variant="ghost" onClick={() => removeArrayItem('documents', idx)}>Remover</Button>
                      </div>
                      {doc.url ? (
                        <div className="sm:col-span-2 text-xs text-muted-foreground">
                          <a href={doc.url} target="_blank" className="hover:underline">Arquivo enviado</a>
                        </div>
                      ) : (
                        <div className="sm:col-span-2 text-xs text-muted-foreground">Nenhum arquivo enviado</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label>Informações essenciais (label/valor)</Label>
                    <Button type="button" variant="outline" onClick={() => addArrayItem('essentialInfo', { label: '', value: '' })}>Adicionar</Button>
                  </div>
                  {form.essentialInfo.map((kv, idx) => (
                    <div key={idx} className="grid sm:grid-cols-2 gap-2">
                      <input placeholder="Título" value={kv.label}
                        onChange={(e) => updateArrayItem('essentialInfo', idx, 'label', e.target.value)}
                        className="h-9 w-full rounded-md border bg-background px-3 text-sm" />
                      <div className="flex flex-col gap-2">
                        <RichTextEditor value={kv.value} onChange={(html) => updateArrayItem('essentialInfo', idx, 'value', html)} />
                        <div className="flex">
                          <Button type="button" variant="ghost" onClick={() => removeArrayItem('essentialInfo', idx)}>Remover</Button>
                        </div>
                      </div>
                    </div>
                   ))}
                 </div>


                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar no banco'}</Button>
                  <Button variant="outline" asChild>
                    <Link href="/ofertas">Ver ofertas</Link>
                  </Button>
                </div>

                {message && <p className="text-sm text-emerald-600">{message}</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            </CardContent>
          </Card>

          <Card className="border bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Pré-visualização rápida</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="text-xs text-muted-foreground">Slug previsto</div>
              <div className="text-sm font-mono">/ofertas/{slug}</div>
              <div className="relative h-40 w-full overflow-hidden rounded-md border">
                {form.cover ? (
                  <Image src={form.cover} alt="Capa" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">Sem imagem</div>
                )}
              </div>
              <div className="text-sm font-semibold">{form.name || 'Nome do projeto'}</div>
              <div className="text-xs text-muted-foreground">{form.category} • {form.modality} • {form.status}</div>
              <div className="text-xs text-muted-foreground">Meta: R$ {form.goal.toLocaleString('pt-BR')} • Mín: R$ {form.min.toLocaleString('pt-BR')}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}